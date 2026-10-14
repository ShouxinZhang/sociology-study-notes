/**
 * @file player.js
 * @description 玩家第一人称角色实体：负责 3D 移动、冲刺、二段跳、武器槽、护盾与受击结算。
 */

import * as THREE from 'three';
import { GAME_STATE, events } from '../core/state.js';
import { GRAVITY, ABYSS_Y, resolvePlayerPhysics } from '../core/physics.js';
import { sound } from '../audio/sound.js';

export const WEAPON_ORDER = ['RIFLE', 'M', 'S', 'L', 'F'];

export class Player {
  /**
   * @param {THREE.Camera} camera 第一人称相机
   * @param {object} weaponsConfig 武器配置表
   */
  constructor(camera, weaponsConfig) {
    this.camera = camera;
    this.weaponsConfig = weaponsConfig;

    this.pos = new THREE.Vector3(0, 2.5, 0);
    this.vel = new THREE.Vector3(0, 0, 0);
    this.spawnPoint = new THREE.Vector3(0, 2.5, 0);

    this.radius = 0.55;
    this.height = 2.1;
    this.eyeHeight = 1.75;

    this.maxHp = 100;
    this.hp = 100;
    this.lives = 3;
    this.shieldTimer = 0;
    this.invulnTimer = 0;

    this.onGround = false;
    this.jumpsLeft = 2;

    // 武器库存与弹药
    this.unlocked = new Set(['RIFLE']);
    this.ammo = { RIFLE: 999, M: 0, S: 0, L: 0, F: 0 };
    this.currentWeaponId = 'RIFLE';
    this.fireCooldown = 0;
    this.dynamicSpread = 0;
  }

  /**
   * 关卡开始时重置位置与基础状态
   * @param {Array<number>} coords [x, y, z]
   */
  resetForStage(coords = [0, 2.5, 0]) {
    this.pos.set(coords[0], coords[1], coords[2]);
    this.spawnPoint.copy(this.pos);
    this.vel.set(0, 0, 0);
    this.hp = this.maxHp;
    this.invulnTimer = 1.5;
  }

  /**
   * 获取当前激活武器的配置对象
   */
  getCurrentWeapon() {
    return this.weaponsConfig[this.currentWeaponId];
  }

  /**
   * 切换指定槽位的武器
   * @param {number} slotIdx 0..4
   */
  selectSlot(slotIdx) {
    const id = WEAPON_ORDER[slotIdx];
    if (!id) return;
    if (GAME_STATE.cheatMode || this.unlocked.has(id)) {
      this.currentWeaponId = id;
      events.emit('weapon_changed', this.getCurrentWeapon());
    }
  }

  /**
   * 滚轮循环切换已解锁武器
   * @param {number} dir 1 或 -1
   */
  cycleWeapon(dir) {
    const list = GAME_STATE.cheatMode
      ? WEAPON_ORDER
      : WEAPON_ORDER.filter((w) => this.unlocked.has(w));
    const idx = list.indexOf(this.currentWeaponId);
    const next = (idx + dir + list.length) % list.length;
    this.currentWeaponId = list[next];
    events.emit('weapon_changed', this.getCurrentWeapon());
  }

  /**
   * 拾取飞行胶囊掉落的武器或护盾
   * @param {string} reward 'M' | 'S' | 'L' | 'F' | 'SHIELD'
   */
  grantReward(reward) {
    sound.play('powerup');
    if (reward === 'SHIELD') {
      this.shieldTimer = 14.0;
      this.hp = Math.min(this.maxHp, this.hp + 35);
      events.emit('toast', '🛡️ 获得 B-能量护盾 (14秒无敌 + 恢复生命)');
      return;
    }
    const spec = this.weaponsConfig[reward];
    if (!spec) return;
    this.unlocked.add(reward);
    this.ammo[reward] = (this.ammo[reward] || 0) + spec.ammo;
    this.currentWeaponId = reward;
    events.emit('weapon_changed', spec);
    events.emit('toast', `🔥 装备 ${spec.name} (+${spec.ammo} 发)`);
  }

  /**
   * 每帧更新玩家运动、二段跳、碰撞与相机同步
   * @param {number} dt
   * @param {import('../core/input.js').InputController} input
   * @param {Array<object>} colliders
   */
  update(dt, input, colliders) {
    if (this.shieldTimer > 0) this.shieldTimer = Math.max(0, this.shieldTimer - dt);
    if (this.invulnTimer > 0) this.invulnTimer = Math.max(0, this.invulnTimer - dt);
    if (this.fireCooldown > 0) this.fireCooldown = Math.max(0, this.fireCooldown - dt);

    // 1. 计算基于当前水平视角 yaw 的前后左右方向向量
    const forward = new THREE.Vector3(-Math.sin(input.yaw), 0, -Math.cos(input.yaw));
    const right = new THREE.Vector3(Math.cos(input.yaw), 0, -Math.sin(input.yaw));

    const moveDir = new THREE.Vector3();
    if (input.keys.has('KeyW') || input.keys.has('ArrowUp')) moveDir.add(forward);
    if (input.keys.has('KeyS') || input.keys.has('ArrowDown')) moveDir.sub(forward);
    if (input.keys.has('KeyD') || input.keys.has('ArrowRight')) moveDir.add(right);
    if (input.keys.has('KeyA') || input.keys.has('ArrowLeft')) moveDir.sub(right);
    if (moveDir.lengthSq() > 0) moveDir.normalize();

    const isSprinting = input.keys.has('ShiftLeft') || input.keys.has('ShiftRight');
    const baseSpeed = GAME_STATE.cheatMode ? 17.5 : (isSprinting ? 14.2 : 10.5);
    this.vel.x = moveDir.x * baseSpeed;
    this.vel.z = moveDir.z * baseSpeed;

    // 2. 魂斗罗标志性二段跳
    if (input.consumePress('Space')) {
      if (this.onGround || this.jumpsLeft > 0 || GAME_STATE.cheatMode) {
        const isFirstJump = this.onGround || this.jumpsLeft === 2;
        const jumpBoost = GAME_STATE.cheatMode ? 15.5 : (isFirstJump ? 12.2 : 10.6);
        this.vel.y = jumpBoost;
        this.onGround = false;
        this.jumpsLeft = Math.max(0, this.jumpsLeft - 1);
        sound.play(isFirstJump ? 'jump' : 'jump2');
      }
    }

    // 3. 重力与 3D 平台碰撞
    this.vel.y -= GRAVITY * dt;
    resolvePlayerPhysics(this, colliders, dt);

    // 更新检查点（站在安全平台时记录最近重生点）
    if (this.onGround && this.pos.z < this.spawnPoint.z - 8) {
      this.spawnPoint.set(0, this.pos.y + 1.5, this.pos.z + 2);
    }

    // 4. 坠入深渊判定
    if (this.pos.y < ABYSS_Y) {
      this.takeDamage(35, true);
      this.pos.copy(this.spawnPoint);
      this.vel.set(0, 0, 0);
      events.emit('toast', '⚠️ 坠入深渊！已在最近安全点重部署');
    }

    // 5. 动态准星散布计算（移动、跳跃与连续开火增加散布）
    const horizSpeed = Math.hypot(this.vel.x, this.vel.z);
    const targetSpread =
      (horizSpeed > 1 ? 0.015 : 0.002) +
      (!this.onGround ? 0.025 : 0);
    this.dynamicSpread = THREE.MathUtils.lerp(this.dynamicSpread, targetSpread, Math.min(1, dt * 10));

    // 6. 同步第一人称相机位姿
    this.camera.position.set(this.pos.x, this.pos.y + this.eyeHeight, this.pos.z);
    this.camera.rotation.y = input.yaw;
    this.camera.rotation.x = input.pitch;
  }

  /**
   * 玩家受击处理
   * @param {number} amount 伤害值
   * @param {boolean} bypassShield 是否穿透普通无敌帧（如坠崖）
   */
  takeDamage(amount, bypassShield = false) {
    if (GAME_STATE.cheatMode) return;
    if (!bypassShield && (this.shieldTimer > 0 || this.invulnTimer > 0)) return;

    this.hp -= amount;
    this.invulnTimer = 0.45;
    sound.play('hurt');
    events.emit('player_damaged');

    if (this.hp <= 0) {
      this.lives -= 1;
      if (this.lives > 0) {
        this.hp = this.maxHp;
        this.shieldTimer = 4.0;
        events.emit('toast', `⚡ 消耗 1 残机！获得 4 秒重生护盾 (剩余残机: ${this.lives})`);
      } else {
        this.hp = 0;
        events.emit('game_over');
      }
    }
  }
}

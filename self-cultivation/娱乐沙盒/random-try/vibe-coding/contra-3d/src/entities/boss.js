/**
 * @file boss.js
 * @description 3 大关底多部件巨型 3D Boss 状态机：要塞巨门、双联轨道主炮、异形母体之心。
 */

import * as THREE from 'three';
import { GAME_STATE, events } from '../core/state.js';
import { sound } from '../audio/sound.js';

export class BossController {
  /**
   * @param {THREE.Scene} scene
   * @param {import('./enemy.js').EnemyManager} enemyManager
   * @param {import('../render/particles.js').ParticleSystem} particles
   */
  constructor(scene, enemyManager, particles) {
    this.scene = scene;
    this.enemyManager = enemyManager;
    this.particles = particles;

    this.root = null;
    this.parts = [];
    this.bossData = null;
    this.engaged = false;
    this.defeated = false;
    this.timer = 0;
  }

  /**
   * 载入当前关卡的巨型多部件 Boss
   * @param {object} bossDef
   * @param {number} triggerZ
   */
  load(bossDef, triggerZ) {
    this.clear();
    if (!bossDef) return;

    this.bossData = bossDef;
    this.triggerZ = triggerZ;
    this.engaged = false;
    this.defeated = false;
    this.timer = 0;

    this.root = new THREE.Group();
    this.root.position.set(bossDef.x, bossDef.y, bossDef.z);

    // 巨型背景装甲墙基座
    const wallColor =
      bossDef.id === 'fortress_wall' ? 0x1e293b :
      bossDef.id === 'twin_mech'     ? 0x0f172a : 0x3b0764;
    const wallGeo = new THREE.BoxGeometry(26, 15, 4);
    const wallMat = new THREE.MeshLambertMaterial({ color: wallColor });
    const wallMesh = new THREE.Mesh(wallGeo, wallMat);
    wallMesh.position.set(0, 6.5, 0);
    this.root.add(wallMesh);

    // 构建各个可独立击毁的武器/核心部件
    for (const p of bossDef.parts) {
      const [sx, sy, sz] = p.size;
      const geo = new THREE.BoxGeometry(sx, sy, sz);
      const mat = new THREE.MeshLambertMaterial({ color: p.color });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(p.offset[0], p.offset[1], p.offset[2]);

      const partObj = {
        id: p.id,
        name: p.name,
        hp: p.hp,
        maxHp: p.hp,
        isCore: Boolean(p.isCore),
        fireRate: p.fireRate || 1.6,
        fireTimer: 0.8 + Math.random(),
        baseOffset: [...p.offset],
        movePhase: p.movePhase || 0,
        mesh,
        mat,
        alive: true,
        flashTimer: 0
      };

      mesh.userData = {
        type: 'boss_part',
        owner: partObj,
        isHead: Boolean(p.isCore)
      };

      this.root.add(mesh);
      this.parts.push(partObj);
    }

    this.scene.add(this.root);
  }

  /**
   * 获取所有存活 Boss 部件的网格供射击判定
   */
  getHitMeshes() {
    const res = [];
    for (const p of this.parts) {
      if (p.alive) res.push(p.mesh);
    }
    return res;
  }

  /**
   * 对指定 Boss 部件造成伤害
   * @param {object} partObj
   * @param {number} damage
   */
  damagePart(partObj, damage) {
    if (!partObj.alive || this.defeated) return;
    partObj.hp = Math.max(0, partObj.hp - damage);
    partObj.flashTimer = 0.07;
    partObj.mat.emissive.setHex(0xffffff);

    if (partObj.hp <= 0) {
      partObj.alive = false;
      const worldPos = new THREE.Vector3();
      partObj.mesh.getWorldPosition(worldPos);
      this.particles.spawnBurst(worldPos, 0xff5400, 32, 12);
      sound.play('explosion');
      partObj.mesh.visible = false;
      GAME_STATE.score += partObj.isCore ? 1500 : 600;
      events.emit('kill_feed', {
        weapon: 'DESTROYED',
        victim: partObj.name,
        headshot: partObj.isCore
      });

      this._checkVictory();
    }
    events.emit('boss_hud_update', this);
  }

  /**
   * 当所有标记为 isCore 的关键部件全部被摧毁时，判定 Boss 击破
   */
  _checkVictory() {
    const remainingCores = this.parts.filter((p) => p.isCore && p.alive);
    if (remainingCores.length === 0) {
      this.defeated = true;
      // 剩余附属炮台一并引爆
      for (const p of this.parts) {
        if (p.alive) {
          p.alive = false;
          p.mesh.visible = false;
        }
      }
      const center = this.root.position.clone().add(new THREE.Vector3(0, 5, 2));
      this.particles.spawnBurst(center, 0xfde047, 55, 15);
      sound.play('explosion');
      events.emit('boss_defeated');
    }
  }

  /**
   * 每帧更新 Boss 战激活、部件位移与弹幕发射
   * @param {number} dt
   * @param {import('./player.js').Player} player
   */
  update(dt, player) {
    if (!this.bossData || this.defeated) return;

    if (!this.engaged && player.pos.z <= this.triggerZ) {
      this.engaged = true;
      events.emit('boss_engaged', this);
      events.emit('toast', `🚨 警报：遭遇关底首领 ${this.bossData.name}！`);
    }

    if (!this.engaged) return;

    this.timer += dt;
    const playerTarget = player.pos.clone().add(new THREE.Vector3(0, 1.2, 0));

    for (const p of this.parts) {
      if (!p.alive) continue;

      if (p.flashTimer > 0) {
        p.flashTimer -= dt;
        if (p.flashTimer <= 0) p.mat.emissive.setHex(0x000000);
      }

      // 动态位移：第 2 关双联重炮横向滑轨；第 3 关触手与心脏脉动
      if (this.bossData.id === 'twin_mech') {
        p.mesh.position.x = Math.sin(this.timer * 1.6 + p.movePhase) * 8.5;
      } else if (this.bossData.id === 'emperor_heart') {
        if (p.isCore) {
          const pulse = 1 + Math.sin(this.timer * 6) * 0.12;
          p.mesh.scale.setScalar(pulse);
        } else {
          p.mesh.position.y = p.baseOffset[1] + Math.sin(this.timer * 3 + p.baseOffset[0]) * 1.4;
        }
      }

      // 发射首领弹幕
      p.fireTimer -= dt;
      if (p.fireTimer <= 0) {
        p.fireTimer = p.fireRate;
        const origin = new THREE.Vector3();
        p.mesh.getWorldPosition(origin);
        origin.z += 1.8;

        this.enemyManager.spawnEnemyProjectile(
          origin,
          playerTarget,
          p.isCore ? 35 : 29,
          p.isCore ? 18 : 14,
          p.isCore ? 0xf43f5e : 0xf97316
        );
      }
    }
  }

  clear() {
    if (this.root) {
      this.scene.remove(this.root);
      this.root = null;
    }
    this.parts.length = 0;
    this.bossData = null;
    this.engaged = false;
    this.defeated = false;
  }
}

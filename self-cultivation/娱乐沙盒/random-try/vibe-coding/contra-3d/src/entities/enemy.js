/**
 * @file enemy.js
 * @description 3D 体素敌人 AI 与敌方弹幕管理器。每个敌人具有独立的躯干与头部 Hitbox，支持 CSGO 爆头判定。
 */

import * as THREE from 'three';
import { GAME_STATE, events } from '../core/state.js';
import { sound } from '../audio/sound.js';

export class EnemyManager {
  /**
   * @param {THREE.Scene} scene
   * @param {object} enemyTypesConfig enemies.json 配置
   * @param {import('../render/particles.js').ParticleSystem} particles
   */
  constructor(scene, enemyTypesConfig, particles) {
    this.scene = scene;
    this.configs = enemyTypesConfig;
    this.particles = particles;
    this.enemies = [];
    this.projectiles = [];
  }

  /**
   * 根据关卡配置生成全部敌人实体
   * @param {Array<object>} list
   */
  load(list = []) {
    this.clear();
    for (const item of list) {
      const cfg = this.configs[item.type];
      if (!cfg) continue;
      this._createEnemy(item, cfg);
    }
  }

  _createEnemy(spawnDef, cfg) {
    const group = new THREE.Group();
    group.position.set(spawnDef.x, spawnDef.y, spawnDef.z);

    // 1. 躯干体素块
    const [sx, sy, sz] = cfg.scale;
    const bodyH = sy * 0.68;
    const headH = sy * 0.34;

    const bodyGeo = new THREE.BoxGeometry(sx, bodyH, sz);
    const bodyMat = new THREE.MeshLambertMaterial({ color: cfg.bodyColor });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.position.y = bodyH / 2;

    // 2. 头部弱点体素块（独立 Hitbox 标记 isHead: true）
    const headGeo = new THREE.BoxGeometry(sx * 0.72, headH, sz * 0.72);
    const headMat = new THREE.MeshLambertMaterial({ color: cfg.headColor });
    const headMesh = new THREE.Mesh(headGeo, headMat);
    headMesh.position.y = bodyH + headH / 2 + 0.04;

    // 3. 武器/炮管装饰
    const gunGeo = new THREE.BoxGeometry(0.24, 0.24, 0.9);
    const gunMat = new THREE.MeshLambertMaterial({ color: cfg.accentColor });
    const gunMesh = new THREE.Mesh(gunGeo, gunMat);
    gunMesh.position.set(sx * 0.35, bodyH * 0.65, 0.45);

    const enemyObj = {
      type: cfg.type,
      name: cfg.name,
      cfg,
      group,
      bodyMesh,
      headMesh,
      bodyMat,
      headMat,
      hp: cfg.hp,
      maxHp: cfg.hp,
      alive: true,
      fireTimer: 0.6 + Math.random() * 1.2,
      flashTimer: 0,
      leapTimer: 0,
      baseY: spawnDef.y
    };

    bodyMesh.userData = { type: 'enemy', owner: enemyObj, isHead: false };
    headMesh.userData = { type: 'enemy', owner: enemyObj, isHead: true };

    group.add(bodyMesh, headMesh, gunMesh);
    this.scene.add(group);
    this.enemies.push(enemyObj);
  }

  /**
   * 获取所有存活敌人的可射击 Mesh（躯干 + 头部）
   */
  getHitMeshes() {
    const res = [];
    for (const e of this.enemies) {
      if (e.alive) res.push(e.bodyMesh, e.headMesh);
    }
    return res;
  }

  /**
   * 结算敌人受击与爆头击杀
   * @param {object} enemyObj
   * @param {number} damage
   * @param {boolean} isHeadshot
   * @param {string} weaponName
   */
  damageEnemy(enemyObj, damage, isHeadshot, weaponName = 'RIFLE') {
    if (!enemyObj.alive) return;
    enemyObj.hp -= damage;
    enemyObj.flashTimer = 0.08;
    enemyObj.bodyMat.emissive.setHex(0xffffff);
    enemyObj.headMat.emissive.setHex(0xffffff);

    if (enemyObj.hp <= 0) {
      enemyObj.alive = false;
      const pos = enemyObj.group.position.clone().add(new THREE.Vector3(0, 1.0, 0));
      this.particles.spawnBurst(pos, isHeadshot ? 0xef4444 : 0xff9f1c, isHeadshot ? 24 : 14, 9);
      this.scene.remove(enemyObj.group);

      const bonus = isHeadshot ? Math.round(enemyObj.cfg.score * 1.5) : enemyObj.cfg.score;
      GAME_STATE.score += bonus;
      events.emit('kill_feed', {
        weapon: weaponName,
        victim: enemyObj.name,
        headshot: isHeadshot
      });
    }
  }

  /**
   * 发射高可视度 3D 敌方能量弹丸
   */
  spawnEnemyProjectile(origin, targetPos, speed = 30, damage = 14, color = 0xff4d4d) {
    const geo = new THREE.BoxGeometry(0.38, 0.38, 0.38);
    const mat = new THREE.MeshBasicMaterial({ color });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(origin);

    const dir = targetPos.clone().sub(origin).normalize();
    this.scene.add(mesh);
    this.projectiles.push({
      mesh,
      vel: dir.multiplyScalar(speed),
      damage,
      life: 4.5
    });
  }

  /**
   * 每帧更新敌人 AI 朝向、冲锋/跳跃与敌方弹幕飞行
   * @param {number} dt
   * @param {import('./player.js').Player} player
   */
  update(dt, player) {
    const playerCenter = player.pos.clone().add(new THREE.Vector3(0, 1.2, 0));

    for (const e of this.enemies) {
      if (!e.alive) continue;

      if (e.flashTimer > 0) {
        e.flashTimer -= dt;
        if (e.flashTimer <= 0) {
          e.bodyMat.emissive.setHex(0x000000);
          e.headMat.emissive.setHex(0x000000);
        }
      }

      const dist = e.group.position.distanceTo(player.pos);
      if (dist > 68) continue; // 激活视野范围

      // 朝向玩家旋转
      e.group.lookAt(player.pos.x, e.group.position.y, player.pos.z);

      // 行为分支：冲锋步兵与异形猎虫会向玩家逼近
      if (e.cfg.behavior === 'charge' || e.cfg.behavior === 'leap') {
        if (dist > 4.5 && dist < 42) {
          const dir = new THREE.Vector3(
            player.pos.x - e.group.position.x,
            0,
            player.pos.z - e.group.position.z
          ).normalize();
          e.group.position.addScaledVector(dir, e.cfg.speed * 0.45 * dt);
        }
        if (e.cfg.behavior === 'leap') {
          e.leapTimer += dt * 6;
          e.group.position.y = e.baseY + Math.abs(Math.sin(e.leapTimer)) * 1.6;
        }
        if (dist < 2.1) {
          player.takeDamage(e.cfg.damage);
        }
      }

      // 远程开火冷却
      e.fireTimer -= dt;
      if (e.fireTimer <= 0 && dist < 52) {
        e.fireTimer = e.cfg.fireInterval;
        const muzzle = e.group.position.clone().add(new THREE.Vector3(0, 1.3, 0));
        this.spawnEnemyProjectile(muzzle, playerCenter, e.cfg.projectileSpeed, e.cfg.damage);
      }
    }

    // 更新敌方弹丸与玩家受击检测
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.life -= dt;
      p.mesh.position.addScaledVector(p.vel, dt);
      p.mesh.rotation.x += 8 * dt;
      p.mesh.rotation.y += 8 * dt;

      if (p.mesh.position.distanceTo(playerCenter) < 1.05) {
        player.takeDamage(p.damage);
        this.scene.remove(p.mesh);
        this.projectiles.splice(i, 1);
        continue;
      }

      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        this.projectiles.splice(i, 1);
      }
    }
  }

  clear() {
    for (const e of this.enemies) this.scene.remove(e.group);
    for (const p of this.projectiles) this.scene.remove(p.mesh);
    this.enemies.length = 0;
    this.projectiles.length = 0;
  }
}

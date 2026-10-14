/**
 * @file combat.js
 * @description CSGO + 魂斗罗武器射击系统：支持 Hitscan 射线枪械、S 散弹多弹丸、L 穿透激光与 F 高爆等离子球。
 */

import * as THREE from 'three';
import { GAME_STATE, events } from '../core/state.js';
import { sound } from '../audio/sound.js';

export class CombatSystem {
  /**
   * @param {THREE.Scene} scene
   * @param {THREE.Camera} camera
   * @param {import('../render/viewmodel.js').FirstPersonViewmodel} viewmodel
   * @param {import('../render/particles.js').ParticleSystem} particles
   * @param {import('../entities/enemy.js').EnemyManager} enemyManager
   * @param {import('../entities/capsule.js').CapsuleManager} capsuleManager
   * @param {import('../entities/boss.js').BossController} bossController
   */
  constructor(scene, camera, viewmodel, particles, enemyManager, capsuleManager, bossController) {
    this.scene = scene;
    this.camera = camera;
    this.viewmodel = viewmodel;
    this.particles = particles;
    this.enemyManager = enemyManager;
    this.capsuleManager = capsuleManager;
    this.bossController = bossController;

    this.raycaster = new THREE.Raycaster();
    this.playerProjectiles = [];
  }

  /**
   * 处理玩家开火与飞行榴弹更新
   * @param {number} dt
   * @param {import('../entities/player.js').Player} player
   * @param {import('../core/input.js').InputController} input
   * @param {Array<THREE.Mesh>} levelMeshes 关卡地形网格
   */
  update(dt, player, input, levelMeshes) {
    const weapon = player.getCurrentWeapon();

    // 1. 检测左键开火
    if ((input.mouseDown || input.justShot) && player.fireCooldown <= 0) {
      this._fireWeapon(player, weapon, input, levelMeshes);
    }

    // 2. 更新 F-爆裂等离子榴弹飞行与范围爆炸
    for (let i = this.playerProjectiles.length - 1; i >= 0; i--) {
      const proj = this.playerProjectiles[i];
      proj.life -= dt;
      proj.vel.y -= 9.5 * dt; // 轻微抛物线重力
      proj.mesh.position.addScaledVector(proj.vel, dt);

      let exploded = proj.life <= 0;
      // 检测是否贴近任何敌人、Boss 部件或地面
      if (!exploded) {
        for (const e of this.enemyManager.enemies) {
          if (e.alive && e.group.position.distanceTo(proj.mesh.position) < 2.2) {
            exploded = true;
            break;
          }
        }
      }
      if (!exploded && this.bossController.engaged && !this.bossController.defeated) {
        for (const p of this.bossController.parts) {
          if (!p.alive) continue;
          const wp = new THREE.Vector3();
          p.mesh.getWorldPosition(wp);
          if (wp.distanceTo(proj.mesh.position) < 2.8) {
            exploded = true;
            break;
          }
        }
      }

      if (exploded) {
        this._detonateExplosive(proj.mesh.position, proj.spec);
        this.scene.remove(proj.mesh);
        this.playerProjectiles.splice(i, 1);
      }
    }
  }

  _fireWeapon(player, weapon, input, levelMeshes) {
    // 弹药检查与扣减
    if (!weapon.infiniteAmmo && !GAME_STATE.cheatMode) {
      if ((player.ammo[weapon.id] || 0) <= 0) {
        player.currentWeaponId = 'RIFLE';
        events.emit('weapon_changed', player.getCurrentWeapon());
        events.emit('toast', '弹药耗尽，已切回 M4-C 制式步枪');
        return;
      }
      player.ammo[weapon.id] -= 1;
    }

    player.fireCooldown = GAME_STATE.cheatMode ? weapon.fireInterval * 0.45 : weapon.fireInterval;
    player.dynamicSpread = Math.min(0.08, player.dynamicSpread + weapon.spread * 0.65);

    // 视角微上跳与持枪模型后坐力
    input.pitch = Math.min(Math.PI / 2 - 0.1, input.pitch + weapon.recoilPitch * 0.45);
    this.viewmodel.triggerShoot(weapon.recoilKick);
    sound.play(`shoot_${weapon.id}`);

    const muzzlePos = this.viewmodel.getMuzzleWorldPos();

    // F 弹发射实体高爆等离子球
    if (!weapon.hitscan) {
      const geo = new THREE.BoxGeometry(0.45, 0.45, 0.45);
      const mat = new THREE.MeshBasicMaterial({ color: weapon.color });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(muzzlePos);

      const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion).normalize();
      this.scene.add(mesh);
      this.playerProjectiles.push({
        mesh,
        vel: dir.multiplyScalar(weapon.projectileSpeed || 50),
        spec: weapon,
        life: 2.2
      });
      return;
    }

    // Hitscan 射线检测（支持 S 散弹 8 弹丸与 L 激光贯穿）
    const targetMeshes = [
      ...this.enemyManager.getHitMeshes(),
      ...this.capsuleManager.getHitMeshes(),
      ...this.bossController.getHitMeshes(),
      ...levelMeshes
    ];

    const totalSpread = weapon.spread + player.dynamicSpread * 0.5;
    let anyHit = false;
    let anyHeadshot = false;

    for (let i = 0; i < weapon.pellets; i++) {
      const offsetX = (Math.random() - 0.5) * 2 * totalSpread;
      const offsetY = (Math.random() - 0.5) * 2 * totalSpread;
      const rayDir = new THREE.Vector3(offsetX, offsetY, -1)
        .normalize()
        .applyQuaternion(this.camera.quaternion);

      this.raycaster.set(this.camera.position, rayDir);
      this.raycaster.far = 140;

      const hits = this.raycaster.intersectObjects(targetMeshes, false);
      let endPoint = this.camera.position.clone().addScaledVector(rayDir, 95);

      if (hits.length > 0) {
        const maxPen = weapon.piercing ? Math.min(hits.length, 4) : 1;
        const seenOwners = new Set();

        for (let hIdx = 0; hIdx < maxPen; hIdx++) {
          const hit = hits[hIdx];
          endPoint = hit.point;
          const ud = hit.object.userData || {};

          if (!ud.type) {
            // 命中墙壁/地面产生像素火花
            this.particles.spawnBurst(hit.point, weapon.color, 4, 4);
            if (!weapon.piercing) break;
            continue;
          }

          if (seenOwners.has(ud.owner)) continue;
          seenOwners.add(ud.owner);

          const isHead = Boolean(ud.isHead);
          const finalDmg = Math.round(weapon.damage * (isHead ? weapon.headshotMult : 1));
          anyHit = true;
          if (isHead) anyHeadshot = true;

          if (ud.type === 'enemy') {
            this.enemyManager.damageEnemy(ud.owner, finalDmg, isHead, weapon.badge);
          } else if (ud.type === 'capsule') {
            this.capsuleManager.damageCapsule(ud.owner, finalDmg);
          } else if (ud.type === 'boss_part') {
            this.bossController.damagePart(ud.owner, finalDmg);
          }

          this.particles.spawnBurst(hit.point, isHead ? 0xef4444 : weapon.color, 7, 6);
        }
      }

      this.particles.spawnTracer(
        muzzlePos,
        endPoint,
        weapon.color,
        weapon.id === 'L' ? 0.14 : 0.055
      );
    }

    if (anyHeadshot) {
      sound.play('headshot');
      events.emit('hit_marker', { headshot: true });
    } else if (anyHit) {
      sound.play('hit');
      events.emit('hit_marker', { headshot: false });
    }
  }

  _detonateExplosive(pos, spec) {
    sound.play('explosion');
    this.particles.spawnBurst(pos, 0xff5400, 32, 13);
    const radius = spec.explosiveRadius || 5.5;

    for (const e of this.enemyManager.enemies) {
      if (!e.alive) continue;
      const d = e.group.position.distanceTo(pos);
      if (d <= radius) {
        this.enemyManager.damageEnemy(e, spec.damage, false, spec.badge);
      }
    }

    for (const c of this.capsuleManager.activeCapsules) {
      if (c.alive && c.group.position.distanceTo(pos) <= radius) {
        this.capsuleManager.damageCapsule(c, spec.damage);
      }
    }

    for (const p of this.bossController.parts) {
      if (!p.alive) continue;
      const wp = new THREE.Vector3();
      p.mesh.getWorldPosition(wp);
      if (wp.distanceTo(pos) <= radius + 1.5) {
        this.bossController.damagePart(p, spec.damage);
      }
    }
  }

  clear() {
    for (const p of this.playerProjectiles) this.scene.remove(p.mesh);
    this.playerProjectiles.length = 0;
  }
}

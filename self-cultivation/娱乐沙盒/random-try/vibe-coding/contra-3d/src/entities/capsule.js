/**
 * @file capsule.js
 * @description 魂斗罗标志性飞行武器胶囊与可拾取 3D 武器补给箱。
 */

import * as THREE from 'three';

export class CapsuleManager {
  /**
   * @param {THREE.Scene} scene
   * @param {import('../render/particles.js').ParticleSystem} particles
   */
  constructor(scene, particles) {
    this.scene = scene;
    this.particles = particles;
    this.pendingDefs = [];
    this.activeCapsules = [];
    this.drops = [];
  }

  /**
   * 载入当前关卡的飞行胶囊配置
   * @param {Array<object>} defs
   */
  load(defs = []) {
    this.clear();
    this.pendingDefs = defs.map((d) => ({ ...d, spawned: false }));
  }

  /**
   * 生成单个飞行胶囊 3D 体素网格
   */
  _spawnCapsule(def) {
    const group = new THREE.Group();
    group.position.set(def.x, def.y, def.z);

    // 银白椭圆装甲壳 + 中央红核
    const shellGeo = new THREE.BoxGeometry(1.7, 0.95, 1.1);
    const shellMat = new THREE.MeshLambertMaterial({ color: 0xe2e8f0 });
    const shell = new THREE.Mesh(shellGeo, shellMat);

    const coreGeo = new THREE.BoxGeometry(0.9, 1.05, 1.2);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const core = new THREE.Mesh(coreGeo, coreMat);

    const capsuleObj = {
      group,
      meshList: [shell, core],
      baseX: def.x,
      baseY: def.y,
      z: def.z,
      dirX: def.x < 0 ? 1 : -1,
      time: 0,
      hp: 20,
      reward: def.reward,
      alive: true
    };

    shell.userData = { type: 'capsule', owner: capsuleObj };
    core.userData = { type: 'capsule', owner: capsuleObj };
    group.add(shell, core);
    this.scene.add(group);
    this.activeCapsules.push(capsuleObj);
  }

  /**
   * 胶囊被击爆后生成自动向玩家靠拢的发光 3D 武器箱
   */
  damageCapsule(capsuleObj, dmg) {
    if (!capsuleObj.alive) return;
    capsuleObj.hp -= dmg;
    if (capsuleObj.hp <= 0) {
      capsuleObj.alive = false;
      const pos = capsuleObj.group.position.clone();
      this.particles.spawnBurst(pos, 0xfde047, 18, 9);
      this.scene.remove(capsuleObj.group);
      this._spawnDrop(pos, capsuleObj.reward);
    }
  }

  _spawnDrop(pos, reward) {
    const colorMap = {
      M: 0xff4d4d,
      S: 0xff9f1c,
      L: 0x00f5d4,
      F: 0xff5400,
      SHIELD: 0x38bdf8
    };
    const geo = new THREE.BoxGeometry(1.1, 1.1, 1.1);
    const mat = new THREE.MeshBasicMaterial({
      color: colorMap[reward] || 0xfde047
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(pos);
    this.scene.add(mesh);
    this.drops.push({ mesh, reward, vy: 2.0 });
  }

  /**
   * 获取所有可被射线检测命中的胶囊网格
   */
  getHitMeshes() {
    const res = [];
    for (const c of this.activeCapsules) {
      if (c.alive) res.push(...c.meshList);
    }
    return res;
  }

  /**
   * 每帧更新胶囊正弦飞行轨迹与掉落物磁吸拾取
   * @param {number} dt
   * @param {import('./player.js').Player} player
   */
  update(dt, player) {
    // 1. 检查玩家 Z 坐标是否触发新胶囊出现
    for (const def of this.pendingDefs) {
      if (!def.spawned && player.pos.z <= def.zTrigger) {
        def.spawned = true;
        this._spawnCapsule(def);
      }
    }

    // 2. 更新空中飞行胶囊的正弦波轨迹
    for (let i = this.activeCapsules.length - 1; i >= 0; i--) {
      const c = this.activeCapsules[i];
      if (!c.alive) {
        this.activeCapsules.splice(i, 1);
        continue;
      }
      c.time += dt;
      // 在视野前方左右往返盘旋，方便玩家瞄准击落
      c.group.position.x = Math.sin(c.time * 1.4) * 9.5;
      c.group.position.y = c.baseY + Math.sin(c.time * 4.2) * 1.3;
      c.group.rotation.z = Math.sin(c.time * 4.2) * 0.25;
    }

    // 3. 更新掉落武器箱（缓降 + 靠近自动磁吸拾取）
    for (let i = this.drops.length - 1; i >= 0; i--) {
      const d = this.drops[i];
      d.mesh.rotation.y += 3.0 * dt;
      d.mesh.rotation.x += 1.5 * dt;

      const targetPos = player.pos.clone().add(new THREE.Vector3(0, 1.1, 0));
      const dist = d.mesh.position.distanceTo(targetPos);

      // 距离在 18 米内或已落地时，自动飞向玩家手中（改善第一人称拾取体验）
      if (dist < 18) {
        const dir = targetPos.sub(d.mesh.position).normalize();
        d.mesh.position.addScaledVector(dir, 16 * dt);
      } else if (d.mesh.position.y > 1.2) {
        d.mesh.position.y -= 4.5 * dt;
      }

      if (dist < 1.8) {
        player.grantReward(d.reward);
        this.scene.remove(d.mesh);
        this.drops.splice(i, 1);
      }
    }
  }

  clear() {
    for (const c of this.activeCapsules) this.scene.remove(c.group);
    for (const d of this.drops) this.scene.remove(d.mesh);
    this.activeCapsules.length = 0;
    this.drops.length = 0;
    this.pendingDefs.length = 0;
  }
}

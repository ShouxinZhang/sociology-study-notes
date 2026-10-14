/**
 * @file hazard.js
 * @description 3D 关卡机关系统：第 1 关爆炸断桥（分段坍塌+自动重建防卡关）、第 2 关周期激光网与电磁地板、第 3 关腐蚀酸液池。
 */

import * as THREE from 'three';
import { getPixelMaterial } from '../render/pixel-textures.js';
import { sound } from '../audio/sound.js';
import { events } from '../core/state.js';

export class HazardManager {
  /**
   * @param {THREE.Scene} scene
   * @param {import('../render/particles.js').ParticleSystem} particles
   */
  constructor(scene, particles) {
    this.scene = scene;
    this.particles = particles;
    this.bridgeSegments = [];
    this.laserGates = [];
    this.floorZones = [];
  }

  /**
   * 构建关卡内所有 3D 机关，并将断桥碰撞盒注册到物理碰撞列表
   * @param {Array<object>} hazardsDef
   * @param {Array<object>} colliders
   */
  load(hazardsDef = [], colliders = []) {
    this.clear();

    for (const h of hazardsDef) {
      if (h.type === 'exploding_bridge') {
        this._buildExplodingBridge(h, colliders);
      } else if (h.type === 'laser_gate') {
        this._buildLaserGate(h);
      } else if (h.type === 'electric_floor' || h.type === 'acid_pool') {
        this._buildFloorZone(h);
      }
    }
  }

  _buildExplodingBridge(h, colliders) {
    const baseMat = getPixelMaterial('bridge', h.width, h.segDepth);
    for (let i = 0; i < h.segments; i++) {
      const zCenter = h.zStart - i * (h.segDepth + 0.35);
      const geo = new THREE.BoxGeometry(h.width, 1.0, h.segDepth);
      const mat = baseMat.clone();
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(h.x, h.y, zCenter);
      this.scene.add(mesh);

      const segObj = {
        mesh,
        mat,
        state: 'idle', // 'idle' | 'primed' | 'exploded'
        timer: 0,
        collider: null
      };

      const collider = {
        x: h.x,
        y: h.y,
        z: zCenter,
        w: h.width,
        h: 1.0,
        d: h.segDepth,
        active: true,
        onStep: () => {
          if (segObj.state === 'idle') {
            segObj.state = 'primed';
            segObj.timer = 0.65;
            events.emit('toast', '💥 警告：断桥引信已触发！立刻冲刺二段跳！');
          }
        }
      };

      segObj.collider = collider;
      colliders.push(collider);
      this.bridgeSegments.push(segObj);
    }
  }

  _buildLaserGate(h) {
    const group = new THREE.Group();
    group.position.set(h.x, h.y, h.z);

    // 左右发射柱
    const postGeo = new THREE.BoxGeometry(0.8, h.height, 0.8);
    const postMat = new THREE.MeshLambertMaterial({ color: 0x334155 });
    const leftPost = new THREE.Mesh(postGeo, postMat);
    leftPost.position.set(-h.width / 2, h.height / 2, 0);
    const rightPost = new THREE.Mesh(postGeo, postMat);
    rightPost.position.set(h.width / 2, h.height / 2, 0);
    group.add(leftPost, rightPost);

    // 3 道横向高能激光束
    const beams = [];
    const beamGeo = new THREE.BoxGeometry(h.width, 0.16, 0.16);
    const beamMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    for (const by of [1.0, 2.4, 3.8]) {
      const b = new THREE.Mesh(beamGeo, beamMat);
      b.position.set(0, by, 0);
      group.add(b);
      beams.push(b);
    }

    this.scene.add(group);
    this.laserGates.push({
      group,
      beams,
      x: h.x,
      y: h.y,
      z: h.z,
      width: h.width,
      height: h.height,
      period: h.period || 2.8,
      activeRatio: h.activeRatio || 0.5,
      timer: 0,
      isOn: true
    });
  }

  _buildFloorZone(h) {
    const isAcid = h.type === 'acid_pool';
    const geo = new THREE.BoxGeometry(h.width, 0.25, h.depth);
    const mat = new THREE.MeshBasicMaterial({
      color: isAcid ? 0x22c55e : 0x38bdf8,
      transparent: true,
      opacity: 0.78
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(h.x, h.y, h.z);
    this.scene.add(mesh);

    this.floorZones.push({
      mesh,
      mat,
      type: h.type,
      x: h.x,
      y: h.y,
      z: h.z,
      width: h.width,
      depth: h.depth,
      period: h.period || 3.0,
      timer: 0
    });
  }

  /**
   * 每帧更新机关状态机与玩家碰撞伤害
   * @param {number} dt
   * @param {import('./player.js').Player} player
   */
  update(dt, player) {
    // 1. 爆炸断桥分段倒计时与 4 秒后应急重建（防止坠崖后无法过河）
    for (const seg of this.bridgeSegments) {
      if (seg.state === 'primed') {
        seg.timer -= dt;
        seg.mat.emissive.setHex(Math.floor(seg.timer * 20) % 2 === 0 ? 0xff4500 : 0x000000);
        if (seg.timer <= 0) {
          seg.state = 'exploded';
          seg.timer = 4.2;
          seg.mesh.visible = false;
          seg.collider.active = false;
          sound.play('explosion');
          this.particles.spawnBurst(seg.mesh.position, 0xff5400, 22, 10);
        }
      } else if (seg.state === 'exploded') {
        seg.timer -= dt;
        if (seg.timer <= 0) {
          seg.state = 'idle';
          seg.mesh.visible = true;
          seg.collider.active = true;
          seg.mat.emissive.setHex(0x000000);
        }
      }
    }

    // 2. 周期激光网门
    for (const g of this.laserGates) {
      g.timer = (g.timer + dt) % g.period;
      g.isOn = g.timer < g.period * g.activeRatio;
      for (const b of g.beams) b.visible = g.isOn;

      if (g.isOn) {
        const dz = Math.abs(player.pos.z - g.z);
        const dx = Math.abs(player.pos.x - g.x);
        if (dz < 0.75 && dx < g.width / 2 && player.pos.y < g.y + 4.2) {
          player.takeDamage(20);
        }
      }
    }

    // 3. 电磁地板与腐蚀酸液池
    for (const z of this.floorZones) {
      z.timer += dt;
      const active = z.type === 'acid_pool' ? true : (z.timer % z.period) < z.period * 0.55;
      z.mat.opacity = active ? (0.65 + Math.sin(z.timer * 10) * 0.2) : 0.18;

      if (active) {
        const inX = Math.abs(player.pos.x - z.x) < z.width / 2;
        const inZ = Math.abs(player.pos.z - z.z) < z.depth / 2;
        const inY = Math.abs(player.pos.y - z.y) < 0.85;
        if (inX && inZ && inY) {
          player.takeDamage(15);
        }
      }
    }
  }

  clear() {
    for (const s of this.bridgeSegments) this.scene.remove(s.mesh);
    for (const g of this.laserGates) this.scene.remove(g.group);
    for (const z of this.floorZones) this.scene.remove(z.mesh);
    this.bridgeSegments.length = 0;
    this.laserGates.length = 0;
    this.floorZones.length = 0;
  }
}

/**
 * @file particles.js
 * @description 3D 体素粒子爆炸、受击火花与弹道曳光束特效管理器（共享几何体降低 GPU 开销）。
 */

import * as THREE from 'three';

const sharedBoxGeo = new THREE.BoxGeometry(0.22, 0.22, 0.22);

export class ParticleSystem {
  /**
   * @param {THREE.Scene} scene
   */
  constructor(scene) {
    this.scene = scene;
    this.particles = [];
    this.beams = [];
  }

  /**
   * 生成 3D 体素碎片爆炸或受击火花
   * @param {THREE.Vector3} pos 爆炸中心
   * @param {string|number} color 颜色
   * @param {number} count 粒子数量
   * @param {number} speed 扩散速度
   */
  spawnBurst(pos, color = 0xff9f1c, count = 14, speed = 8) {
    const mat = new THREE.MeshBasicMaterial({ color });
    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(sharedBoxGeo, mat);
      mesh.position.copy(pos);
      const scale = 0.6 + Math.random() * 1.1;
      mesh.scale.setScalar(scale);
      this.scene.add(mesh);

      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 2 * speed,
        (Math.random() * 0.8 + 0.2) * speed,
        (Math.random() - 0.5) * 2 * speed
      );
      this.particles.push({
        mesh,
        vel,
        life: 0.35 + Math.random() * 0.35
      });
    }
  }

  /**
   * 绘制从枪口到命中点的 3D 曳光弹束或激光束
   * @param {THREE.Vector3} start 起点
   * @param {THREE.Vector3} end 终点
   * @param {string|number} color 光束颜色
   * @param {number} duration 持续秒数
   */
  spawnTracer(start, end, color = 0xffd166, duration = 0.065) {
    const points = [start.clone(), end.clone()];
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.95
    });
    const line = new THREE.Line(geo, mat);
    this.scene.add(line);
    this.beams.push({ line, geo, mat, life: duration, maxLife: duration });
  }

  /**
   * 每帧更新粒子运动与曳光消散
   * @param {number} dt
   */
  update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        this.particles.splice(i, 1);
        continue;
      }
      p.vel.y -= 18 * dt;
      p.mesh.position.addScaledVector(p.vel, dt);
      p.mesh.rotation.x += 6 * dt;
      p.mesh.rotation.y += 6 * dt;
      p.mesh.scale.multiplyScalar(0.96);
    }

    for (let i = this.beams.length - 1; i >= 0; i--) {
      const b = this.beams[i];
      b.life -= dt;
      if (b.life <= 0) {
        this.scene.remove(b.line);
        b.geo.dispose();
        b.mat.dispose();
        this.beams.splice(i, 1);
      } else {
        b.mat.opacity = b.life / b.maxLife;
      }
    }
  }

  /**
   * 清理全部残留粒子
   */
  clear() {
    for (const p of this.particles) this.scene.remove(p.mesh);
    for (const b of this.beams) {
      this.scene.remove(b.line);
      b.geo.dispose();
      b.mat.dispose();
    }
    this.particles.length = 0;
    this.beams.length = 0;
  }
}

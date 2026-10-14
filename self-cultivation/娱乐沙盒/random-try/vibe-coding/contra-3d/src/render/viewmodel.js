/**
 * @file viewmodel.js
 * @description CSGO 风格第一人称持枪模型（Viewmodel），包含武器外观切换、移动呼吸摆动、后坐力回弹与枪口火光。
 */

import * as THREE from 'three';

export class FirstPersonViewmodel {
  /**
   * @param {THREE.Camera} camera 绑定的第一人称相机
   */
  constructor(camera) {
    this.camera = camera;
    this.root = new THREE.Group();
    // 默认右手持枪位置（参考 CSGO 经典右下角持枪视角）
    this.basePos = new THREE.Vector3(0.34, -0.28, -0.52);
    this.root.position.copy(this.basePos);
    this.camera.add(this.root);

    this.recoilOffset = 0;
    this.recoilPitch = 0;
    this.bobTimer = 0;
    this.flashTimer = 0;

    this._buildGunMeshes();
  }

  /**
   * 构建像素体素块组合的枪械模型与枪口火焰
   */
  _buildGunMeshes() {
    // 机匣主体
    const bodyGeo = new THREE.BoxGeometry(0.11, 0.14, 0.48);
    this.bodyMat = new THREE.MeshLambertMaterial({ color: 0x334155 });
    this.bodyMesh = new THREE.Mesh(bodyGeo, this.bodyMat);
    this.root.add(this.bodyMesh);

    // 能量/武器涂装侧条（随 R/M/S/L/F 变色）
    const stripeGeo = new THREE.BoxGeometry(0.12, 0.045, 0.36);
    this.stripeMat = new THREE.MeshBasicMaterial({ color: 0xffd166 });
    this.stripeMesh = new THREE.Mesh(stripeGeo, this.stripeMat);
    this.stripeMesh.position.set(0, 0.03, -0.02);
    this.root.add(this.stripeMesh);

    // 枪管
    const barrelGeo = new THREE.BoxGeometry(0.055, 0.055, 0.35);
    this.barrelMat = new THREE.MeshLambertMaterial({ color: 0x94a3b8 });
    this.barrelMesh = new THREE.Mesh(barrelGeo, this.barrelMat);
    this.barrelMesh.position.set(0, 0.03, -0.34);
    this.root.add(this.barrelMesh);

    // 瞄具准镜
    const scopeGeo = new THREE.BoxGeometry(0.06, 0.05, 0.14);
    this.scopeMesh = new THREE.Mesh(scopeGeo, this.barrelMat);
    this.scopeMesh.position.set(0, 0.095, -0.06);
    this.root.add(this.scopeMesh);

    // 枪口像素火光
    const flashGeo = new THREE.BoxGeometry(0.18, 0.18, 0.12);
    this.flashMat = new THREE.MeshBasicMaterial({
      color: 0xfde047,
      transparent: true,
      opacity: 0.9
    });
    this.muzzleFlash = new THREE.Mesh(flashGeo, this.flashMat);
    this.muzzleFlash.position.set(0, 0.03, -0.56);
    this.muzzleFlash.visible = false;
    this.root.add(this.muzzleFlash);
  }

  /**
   * 切换武器时更新枪械颜色与枪管粗细特征
   * @param {object} weaponSpec 武器配置对象
   */
  applyWeaponStyle(weaponSpec) {
    this.stripeMat.color.set(weaponSpec.color);
    this.flashMat.color.set(weaponSpec.color);
    if (weaponSpec.id === 'S') {
      this.barrelMesh.scale.set(1.6, 1.3, 0.85);
    } else if (weaponSpec.id === 'L') {
      this.barrelMesh.scale.set(0.9, 0.9, 1.35);
    } else if (weaponSpec.id === 'F') {
      this.barrelMesh.scale.set(2.0, 2.0, 0.9);
    } else {
      this.barrelMesh.scale.set(1, 1, 1);
    }
  }

  /**
   * 触发开火后坐力与枪口闪光
   * @param {number} kick 后坐力强度
   */
  triggerShoot(kick = 0.09) {
    this.recoilOffset = Math.min(0.22, this.recoilOffset + kick);
    this.recoilPitch = Math.min(0.18, this.recoilPitch + kick * 0.85);
    this.flashTimer = 0.045;
    this.muzzleFlash.visible = true;
    this.muzzleFlash.rotation.z = Math.random() * Math.PI;
  }

  /**
   * 每帧更新持枪呼吸摆动、跑动晃动与后坐力平滑恢复
   * @param {number} dt 帧时间
   * @param {number} moveSpeed 当前水平移动速度
   * @param {boolean} onGround 是否在地面
   */
  update(dt, moveSpeed, onGround) {
    // 1. 枪口闪光计时
    if (this.flashTimer > 0) {
      this.flashTimer -= dt;
      if (this.flashTimer <= 0) {
        this.muzzleFlash.visible = false;
      }
    }

    // 2. 后坐力线性插值回正
    this.recoilOffset = THREE.MathUtils.lerp(this.recoilOffset, 0, Math.min(1, dt * 14));
    this.recoilPitch = THREE.MathUtils.lerp(this.recoilPitch, 0, Math.min(1, dt * 12));

    // 3. 移动步频摆动 (Weapon Bobbing)
    const speedFactor = onGround ? Math.min(1, moveSpeed / 11) : 0.15;
    this.bobTimer += dt * (2.5 + speedFactor * 9.5);
    const bobX = Math.cos(this.bobTimer) * 0.016 * speedFactor;
    const bobY = Math.abs(Math.sin(this.bobTimer)) * 0.018 * speedFactor;

    this.root.position.set(
      this.basePos.x + bobX,
      this.basePos.y - bobY + this.recoilPitch * 0.15,
      this.basePos.z + this.recoilOffset
    );
    this.root.rotation.set(this.recoilPitch, 0, -bobX * 1.5);
  }

  /**
   * 获取枪口在世界坐标系中的发射起点
   * @param {THREE.Vector3} target 输出向量
   */
  getMuzzleWorldPos(target = new THREE.Vector3()) {
    this.muzzleFlash.getWorldPosition(target);
    return target;
  }
}

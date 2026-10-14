/**
 * @file level-loader.js
 * @description 关卡构建器：将 levels.json 的 3D 平台转换为 Three.js 像素贴图网格与物理 AABB 碰撞盒。
 */

import * as THREE from 'three';
import { getPixelMaterial } from '../render/pixel-textures.js';

export class LevelLoader {
  /**
   * @param {import('../render/scene-manager.js').SceneManager} sceneManager
   * @param {import('../entities/hazard.js').HazardManager} hazardManager
   * @param {import('../entities/capsule.js').CapsuleManager} capsuleManager
   * @param {import('../entities/enemy.js').EnemyManager} enemyManager
   * @param {import('../entities/boss.js').BossController} bossController
   */
  constructor(sceneManager, hazardManager, capsuleManager, enemyManager, bossController) {
    this.sceneManager = sceneManager;
    this.hazardManager = hazardManager;
    this.capsuleManager = capsuleManager;
    this.enemyManager = enemyManager;
    this.bossController = bossController;

    this.platformMeshes = [];
    this.colliders = [];
    this.currentStage = null;
  }

  /**
   * 加载指定关卡数据并重建 3D 场景
   * @param {object} stageData
   */
  loadStage(stageData) {
    this.clear();
    this.currentStage = stageData;
    this.sceneManager.applyStageAtmosphere(stageData);

    // 1. 生成静态平台与掩体网格 + AABB 碰撞盒
    for (const p of stageData.platforms) {
      const geo = new THREE.BoxGeometry(p.w, p.h, p.d);
      const mat = getPixelMaterial(p.tex || 'jungle_grass', p.w, p.d);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(p.x, p.y, p.z);
      this.sceneManager.scene.add(mesh);
      this.platformMeshes.push(mesh);

      this.colliders.push({
        x: p.x,
        y: p.y,
        z: p.z,
        w: p.w,
        h: p.h,
        d: p.d,
        active: true
      });
    }

    // 2. 加载 3D 机关（含断桥动态碰撞段）
    this.hazardManager.load(stageData.hazards, this.colliders);

    // 3. 加载飞行胶囊、敌人与关底多部件 Boss
    this.capsuleManager.load(stageData.capsules);
    this.enemyManager.load(stageData.enemies);
    this.bossController.load(stageData.boss, stageData.bossTriggerZ);
  }

  clear() {
    for (const m of this.platformMeshes) {
      this.sceneManager.scene.remove(m);
    }
    this.platformMeshes.length = 0;
    this.colliders.length = 0;
  }
}

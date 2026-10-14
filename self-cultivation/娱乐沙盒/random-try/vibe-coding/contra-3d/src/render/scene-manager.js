/**
 * @file scene-manager.js
 * @description Three.js 场景、像素风渲染器、灯光与关卡环境氛围构建器。
 */

import * as THREE from 'three';

export class SceneManager {
  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#0c192c');
    this.scene.fog = new THREE.FogExp2('#0f293a', 0.011);

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      260
    );
    this.camera.rotation.order = 'YXZ';
    this.scene.add(this.camera);

    // 略微降低内部像素倍率以凸显复古 3D 像素质感并提升帧率
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));

    this.levelGroup = new THREE.Group();
    this.scene.add(this.levelGroup);

    this._setupLights();
    window.addEventListener('resize', () => this._onResize());
  }

  /**
   * 配置全局环境光与主平行光
   */
  _setupLights() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.72);
    this.scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xfffbeb, 1.15);
    dirLight.position.set(25, 48, 30);
    this.scene.add(dirLight);
  }

  /**
   * 切换关卡主题时重置场景装饰与天空雾效
   * @param {object} stageData 关卡 JSON 数据
   */
  applyStageAtmosphere(stageData) {
    this.scene.background.set(stageData.skyColor);
    this.scene.fog = new THREE.FogExp2(stageData.fogColor, 0.011);

    // 清理上一关环境模型
    while (this.levelGroup.children.length > 0) {
      this.levelGroup.remove(this.levelGroup.children[0]);
    }

    // 两侧立柱与远景氛围块，增强第一人称推进的速度参照感
    const pillarColor =
      stageData.theme === 'jungle' ? 0x14532d :
      stageData.theme === 'base'   ? 0x1e293b : 0x4c1d95;
    const accentColor =
      stageData.theme === 'jungle' ? 0x38bdf8 :
      stageData.theme === 'base'   ? 0xf59e0b : 0xf43f5e;

    const pillarGeo = new THREE.BoxGeometry(3.5, 28, 3.5);
    const pillarMat = new THREE.MeshLambertMaterial({ color: pillarColor });
    const stripGeo = new THREE.BoxGeometry(0.6, 22, 0.6);
    const stripMat = new THREE.MeshBasicMaterial({ color: accentColor });

    for (let z = -10; z >= -220; z -= 22) {
      for (const side of [-18, 18]) {
        const p = new THREE.Mesh(pillarGeo, pillarMat);
        p.position.set(side, 6, z);
        this.levelGroup.add(p);

        const s = new THREE.Mesh(stripGeo, stripMat);
        s.position.set(side > 0 ? side - 1.6 : side + 1.6, 6, z);
        this.levelGroup.add(s);
      }
    }

    // 深渊底部视觉层（水体/熔岩/能量深渊）
    const abyssColor =
      stageData.theme === 'jungle' ? 0x0369a1 :
      stageData.theme === 'base'   ? 0x090d16 : 0x500724;
    const floorGeo = new THREE.PlaneGeometry(120, 280);
    const floorMat = new THREE.MeshBasicMaterial({ color: abyssColor });
    const abyssMesh = new THREE.Mesh(floorGeo, floorMat);
    abyssMesh.rotation.x = -Math.PI / 2;
    abyssMesh.position.set(0, -12, -110);
    this.levelGroup.add(abyssMesh);
  }

  _onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}

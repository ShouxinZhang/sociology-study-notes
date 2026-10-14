/**
 * @file main.js
 * @description 3D 魂斗罗（FPS 版）入口编排器：加载 JSON 数据，组装各叶子子系统并驱动主循环。
 */

import { GAME_STATE, events } from './core/state.js';
import { InputController } from './core/input.js';
import { SceneManager } from './render/scene-manager.js';
import { FirstPersonViewmodel } from './render/viewmodel.js';
import { ParticleSystem } from './render/particles.js';
import { Player } from './entities/player.js';
import { CapsuleManager } from './entities/capsule.js';
import { HazardManager } from './entities/hazard.js';
import { EnemyManager } from './entities/enemy.js';
import { BossController } from './entities/boss.js';
import { CombatSystem } from './systems/combat.js';
import { LevelLoader } from './systems/level-loader.js';
import { HudController } from './ui/hud.js';
import { sound } from './audio/sound.js';

async function bootstrap() {
  const [weaponsData, enemiesData, levelsData] = await Promise.all([
    fetch('./assets/data/weapons.json').then((r) => r.json()),
    fetch('./assets/data/enemies.json').then((r) => r.json()),
    fetch('./assets/data/levels.json').then((r) => r.json())
  ]);

  const canvas = document.getElementById('game-canvas');
  const input = new InputController(canvas);
  const sceneManager = new SceneManager(canvas);
  const viewmodel = new FirstPersonViewmodel(sceneManager.camera);
  const particles = new ParticleSystem(sceneManager.scene);

  const player = new Player(sceneManager.camera, weaponsData);
  const capsuleManager = new CapsuleManager(sceneManager.scene, particles);
  const hazardManager = new HazardManager(sceneManager.scene, particles);
  const enemyManager = new EnemyManager(sceneManager.scene, enemiesData, particles);
  const bossController = new BossController(sceneManager.scene, enemyManager, particles);
  const combat = new CombatSystem(
    sceneManager.scene,
    sceneManager.camera,
    viewmodel,
    particles,
    enemyManager,
    capsuleManager,
    bossController
  );
  const levelLoader = new LevelLoader(
    sceneManager,
    hazardManager,
    capsuleManager,
    enemyManager,
    bossController
  );
  const hud = new HudController();

  /**
   * 载入并切换到指定关卡
   * @param {number} idx 0..2
   */
  function startStage(idx) {
    GAME_STATE.currentStageIdx = idx;
    const stageData = levelsData[idx];
    particles.clear();
    combat.clear();
    levelLoader.loadStage(stageData);
    player.resetForStage(stageData.spawn);
    input.yaw = 0;
    input.pitch = 0;
    viewmodel.applyWeaponStyle(player.getCurrentWeapon());
    hud.renderBossHud(null);
    hud.showToast(`🚀 进入 ${stageData.name}`);
    sound.startBGM(idx);
  }

  /**
   * 启动或恢复战斗
   */
  function resumePlaying() {
    if (GAME_STATE.mode === 'game_over' || GAME_STATE.mode === 'victory') {
      player.lives = 3;
      GAME_STATE.score = 0;
      startStage(0);
    } else if (GAME_STATE.mode === 'stage_clear') {
      const nextIdx = (GAME_STATE.currentStageIdx + 1) % levelsData.length;
      startStage(nextIdx);
    }
    GAME_STATE.mode = 'playing';
    hud.hideMenu();
    input.lockPointer();
    sound.startBGM(GAME_STATE.currentStageIdx);
  }

  // 事件绑定
  events.on('weapon_changed', (spec) => viewmodel.applyWeaponStyle(spec));
  events.on('select_weapon_slot', (slotIdx) => player.selectSlot(slotIdx));
  events.on('cycle_weapon', (dir) => player.cycleWeapon(dir));

  events.on('toggle_cheat', () => {
    GAME_STATE.cheatMode = !GAME_STATE.cheatMode;
    if (GAME_STATE.cheatMode) {
      player.hp = player.maxHp;
      hud.showToast('⚡ F1 作弊模式已开启：无敌 + 全武器解锁 + 无限弹药 + 强化跳跃');
    } else {
      hud.showToast('F1 作弊模式已关闭');
    }
  });

  events.on('pause_menu', () => {
    GAME_STATE.mode = 'menu';
    hud.showMenu(
      'TACTICAL PAUSE · 战术暂停',
      levelsData[GAME_STATE.currentStageIdx].subtitle,
      '▶ 继续作战 (锁定鼠标视角)'
    );
  });

  events.on('boss_defeated', () => {
    hud.renderBossHud(null);
    const isFinal = GAME_STATE.currentStageIdx >= levelsData.length - 1;
    setTimeout(() => {
      input.unlockPointer();
      if (isFinal) {
        GAME_STATE.mode = 'victory';
        hud.showMenu(
          'MISSION ACCOMPLISHED · 全关卡通关！',
          `你成功摧毁了异形母体之心！最终得分：${GAME_STATE.score}`,
          '🔄 重新开始第 1 关'
        );
      } else {
        GAME_STATE.mode = 'stage_clear';
        const nextStage = levelsData[GAME_STATE.currentStageIdx + 1];
        hud.showMenu(
          `STAGE ${GAME_STATE.currentStageIdx + 1} CLEAR · 关底首领击破！`,
          `下一阶段目标：${nextStage.name} — ${nextStage.subtitle}`,
          `▶ 进入 ${nextStage.name}`
        );
      }
    }, 1200);
  });

  events.on('game_over', () => {
    GAME_STATE.mode = 'game_over';
    input.unlockPointer();
    hud.showMenu(
      'MISSION FAILED · 行动失败',
      `残机耗尽，最终得分：${GAME_STATE.score}。可按 F1 开启无敌模式或直接选关重战！`,
      '🔄 重新部署作战'
    );
  });

  // 菜单按钮事件
  document.getElementById('btn-start-resume').addEventListener('click', () => resumePlaying());
  document.getElementById('btn-toggle-cheat').addEventListener('click', () => events.emit('toggle_cheat'));
  document.getElementById('btn-toggle-mute').addEventListener('click', () => {
    GAME_STATE.muted = !GAME_STATE.muted;
    if (GAME_STATE.muted) sound.stopBGM();
  });

  document.querySelectorAll('.stage-select-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-stage'), 10);
      player.lives = 3;
      startStage(idx);
      GAME_STATE.mode = 'playing';
      hud.hideMenu();
      input.lockPointer();
    });
  });

  // 初始载入第 1 关作为背景 3D 实时预览
  startStage(0);
  GAME_STATE.mode = 'menu';

  // 暴露调试与自动化审查接口
  window.__CONTRA3D__ = {
    GAME_STATE,
    player,
    levelLoader,
    enemyManager,
    capsuleManager,
    hazardManager,
    bossController,
    combat,
    startStage,
    resumePlaying
  };

  let lastTime = performance.now();
  function animate(now) {
    requestAnimationFrame(animate);
    const dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;

    if (GAME_STATE.mode === 'playing') {
      GAME_STATE.timeElapsed += dt;
      player.update(dt, input, levelLoader.colliders);
      combat.update(dt, player, input, levelLoader.platformMeshes);
      hazardManager.update(dt, player);
      capsuleManager.update(dt, player);
      enemyManager.update(dt, player);
      bossController.update(dt, player);

      const horizSpeed = Math.hypot(player.vel.x, player.vel.z);
      viewmodel.update(dt, horizSpeed, player.onGround);
    }

    particles.update(dt);
    hud.update(dt, player, levelLoader.currentStage);
    sceneManager.render();
    input.endFrame();
  }

  requestAnimationFrame(animate);
}

bootstrap().catch((err) => {
  console.error('Contra 3D bootstrap error:', err);
});

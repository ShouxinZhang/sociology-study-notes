/**
 * 游戏状态机与关卡编排：title → playing → (clear | gameover) → … → victory。
 * 每关开始时为玩家与背包做快照，死亡重试时恢复到该快照。
 */
import { Level, TILE } from '../world/level.js';
import { Inventory } from '../systems/inventory.js';
import { overlap } from '../systems/physics.js';
import { createPlayer, placePlayer, updatePlayer } from '../entities/player.js';
import { createEnemy, updateEnemies } from '../entities/enemy.js';
import { updateProjectiles } from '../entities/projectile.js';
import { createPickup, updatePickups } from '../entities/pickup.js';
import { updateEffects } from '../entities/effect.js';
import { createHazards, updateHazards } from '../entities/hazard.js';
import { spawnBoss, updateBoss } from '../entities/boss-parts.js';

export class Game {
  /** audio 可为 null（无声运行，如脚本测试） */
  constructor(assets, input, audio = null) {
    this.sprites = assets.sprites;
    this.data = assets.data;
    this.levelDefs = assets.levels;
    this.input = input;
    this.audio = audio;
    this.time = 0;
    this.banner = null;
    this.level = null;
    this.cheat = false; // 作弊开关不进入关卡快照，重试/重开时保持
    this.resetRun();
    this.enter('title');
  }

  sfx(name) {
    if (name) this.audio?.sfx(name);
  }

  music(name) {
    this.audio?.music(name);
  }

  /** 切换状态并播放 music.json 中配置的状态音乐/音效 */
  enter(state) {
    this.state = state;
    const cue = this.data.music?.states?.[state];
    if (!cue) return;
    if ('music' in cue) this.music(cue.music);
    this.sfx(cue.sfx);
  }

  resetRun() {
    this.player = createPlayer(this.data.progression);
    this.inventory = new Inventory(this.data.weapons);
    this.levelIndex = 0;
  }

  startLevel(index) {
    this.levelIndex = index;
    this.level = new Level(this.levelDefs[index], this.data.legend);
    this.checkpoint = { player: structuredClone(this.player), inventory: this.inventory.snapshot() };

    const { spawns } = this.level;
    placePlayer(this.player, spawns.player);
    this.enemies = spawns.enemies.map((s) => createEnemy(s, this.data.enemies[s.type]));
    this.pickups = spawns.pickups.map((s) => createPickup(s.kind, s.x + TILE / 2, s.y + TILE / 2, { content: s.content }));
    this.projectiles = [];
    this.effects = [];
    this.hazards = createHazards(this.level);
    Object.assign(this, { hazardTime: 0, laserOn: false, electricOn: false, bridgeQueue: [], bridgeTriggered: new Set() });
    const def = this.levelDefs[index];
    this.bossGroup = def.boss && spawns.bossAnchor ? spawnBoss(this, def.boss, spawns.bossAnchor) : null;
    if (this.cheat) this.inventory.unlockAll();
    this.state = 'playing';
    this.music(def.music);
    this.toast(`第 ${index + 1} 关 · ${this.level.name}`, 2.5);
  }

  retryLevel() {
    this.player = structuredClone(this.checkpoint.player);
    this.inventory.restore(this.checkpoint.inventory);
    this.startLevel(this.levelIndex);
  }

  toast(text, duration = 1.6) {
    this.banner = { text, t: duration };
  }

  toggleCheat() {
    this.cheat = !this.cheat;
    if (this.cheat) this.inventory.unlockAll();
    else this.player.vy = 0;
    this.sfx(this.cheat ? 'cheat_on' : 'cheat_off');
    this.toast(this.cheat ? '作弊模式：开（无敌·无限弹药·10倍射速·飞行穿墙）' : '作弊模式：关');
  }

  get bossAlive() {
    return this.enemies.some((e) => e.def.behavior === 'boss' || e.group);
  }

  /** 进入下一关；若下一关配置了 worldIntro，先显示世界切换过场 */
  nextLevel() {
    const next = this.levelIndex + 1;
    if (!this.levelDefs[next].worldIntro) return this.startLevel(next);
    this.levelIndex = next;
    this.enter('intro');
  }

  update(dt) {
    this.time += dt;
    if (this.banner && (this.banner.t -= dt) <= 0) this.banner = null;
    const confirm = this.input.hit('confirm');
    if (confirm && this.state !== 'playing') this.sfx('ui_confirm');
    if (this.audio) {
      if (this.input.hit('mute')) this.audio.mixer.toggleMute();
      if (this.input.hit('volDown')) this.audio.mixer.changeVolume(-1);
      if (this.input.hit('volUp')) this.audio.mixer.changeVolume(1);
    }

    switch (this.state) {
      case 'title':
        if (confirm) this.startLevel(0);
        break;
      case 'playing':
        if (this.input.hit('cheat')) this.toggleCheat();
        this.updatePlaying(dt);
        break;
      case 'gameover':
        if (confirm) this.retryLevel();
        break;
      case 'clear':
        if (confirm) this.nextLevel();
        break;
      case 'intro':
        if (confirm) this.startLevel(this.levelIndex);
        break;
      case 'victory':
        if (confirm) {
          this.resetRun();
          this.startLevel(0);
        }
        break;
    }
  }

  updatePlaying(dt) {
    updatePlayer(this, dt);
    updateHazards(this, dt);
    updateBoss(this);
    updateEnemies(this, dt);
    updateProjectiles(this, dt);
    updatePickups(this, dt);
    updateEffects(this, dt);

    const flag = this.level.spawns.flag;
    if (this.state !== 'playing' || !flag || !overlap(this.player, { x: flag.x, y: flag.y, w: TILE, h: TILE })) return;
    if (this.level.requireBoss && this.bossAlive) {
      this.toast('先击败 BOSS！');
      this.sfx('flag_blocked');
    } else this.enter(this.levelIndex + 1 < this.levelDefs.length ? 'clear' : 'victory');
  }
}

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

export class Game {
  constructor(assets, input) {
    this.sprites = assets.sprites;
    this.data = assets.data;
    this.levelDefs = assets.levels;
    this.input = input;
    this.state = 'title';
    this.time = 0;
    this.banner = null;
    this.level = null;
    this.cheat = false; // 作弊开关不进入关卡快照，重试/重开时保持
    this.resetRun();
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
    if (this.cheat) this.inventory.unlockAll();
    this.state = 'playing';
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
    this.toast(this.cheat ? '作弊模式：开（无敌·无限弹药·10倍射速·飞行穿墙）' : '作弊模式：关');
  }

  get bossAlive() {
    return this.enemies.some((e) => e.def.behavior === 'boss');
  }

  update(dt) {
    this.time += dt;
    if (this.banner && (this.banner.t -= dt) <= 0) this.banner = null;
    const confirm = this.input.hit('confirm');

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
        if (confirm) this.startLevel(this.levelIndex + 1);
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
    updateEnemies(this, dt);
    updateProjectiles(this, dt);
    updatePickups(this, dt);
    updateEffects(this, dt);

    const flag = this.level.spawns.flag;
    if (this.state !== 'playing' || !flag || !overlap(this.player, { x: flag.x, y: flag.y, w: TILE, h: TILE })) return;
    if (this.level.requireBoss && this.bossAlive) this.toast('先击败 BOSS！');
    else this.state = this.levelIndex + 1 < this.levelDefs.length ? 'clear' : 'victory';
  }
}

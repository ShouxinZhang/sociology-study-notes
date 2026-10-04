/**
 * 锁屏战：玩家走到战场中央时镜头锁定在 arena.x（正好一屏宽），玩家不能离开这一屏；
 * 敌人按波次从屏幕外两侧或空中进场（并被拉入、限制在这一屏内），当前波全灭 WAVE_GAP 秒后刷下一波；
 * 全部清完（untilBoss 时还须摧毁关卡 BOSS）才解锁，并恢复关卡音乐。
 * 关卡 JSON：arenas: [{ col, row?, music?, untilBoss?, waves: [[{ enemy, side: left|right|top, count, row? }]] }]
 */
import { TILE } from '../world/level.js';
import { VIEW_W } from '../world/camera.js';
import { createEnemy } from '../entities/enemy.js';

const WAVE_GAP = 1; // 清完一波到下一波进场的间隔（秒）
const FIRST_WAVE = 0.6; // 锁屏后第一波进场的延迟
const SPACING = 22; // 同侧多个敌人的水平间隔
const DEFAULT_ROW = 9; // 地面敌人出生行（地面在第 10 行）
const ENTER_SPEED = 60; // 屏幕外的波次敌人被拉入战场的速度（像素/秒）

/** passedX：从检查点复活时，该位置左侧的战场视为已完成 */
export function createArenas(def, passedX = -1) {
  return (def.arenas ?? []).map((a) => ({ ...a, x: a.col * TILE, wave: -1, alive: [], wait: FIRST_WAVE, done: a.col * TILE < passedX }));
}

/** 一波敌人：left / right 从屏幕外依次排开走进来，top 在屏幕上方均匀分布落下 */
function spawnWave(game, a, wave) {
  for (const { enemy, side, count, row } of wave) {
    for (let i = 0; i < count; i++) {
      const x = side === 'left' ? a.x - 20 - i * SPACING
        : side === 'right' ? a.x + VIEW_W + 4 + i * SPACING
          : a.x + 40 + ((i + 0.5) * (VIEW_W - 80)) / count;
      const r = row ?? (side === 'top' ? 0 : a.row ?? DEFAULT_ROW);
      const e = createEnemy({ x, y: r * TILE }, game.data.enemies[enemy]);
      e.active = true;
      e.facing = x < a.x + VIEW_W / 2 ? 1 : -1;
      game.enemies.push(e);
      a.alive.push(e);
    }
  }
}

function lock(game, a) {
  game.arena = a;
  game.sfx('arena_lock');
  game.toast('锁屏战！消灭全部敌人');
  if (a.music) game.music(a.music);
}

function unlock(game, a) {
  a.done = true;
  game.arena = null;
  game.sfx('arena_clear');
  game.toast('GO! →');
  if (a.music) game.music(game.levelDefs[game.levelIndex].music);
}

export function updateArenas(game, dt) {
  const p = game.player;
  if (!game.arena) {
    const a = game.arenas.find((x) => !x.done && p.x + p.w / 2 >= x.x + VIEW_W / 2);
    if (!a) return;
    lock(game, a);
  }
  const a = game.arena;
  p.x = Math.max(a.x, Math.min(a.x + VIEW_W - p.w, p.x));
  a.alive = a.alive.filter((e) => !e.dead);
  // 波次敌人不能停在屏幕外（否则打不到也清不了场）：屏幕外的向内移动，进入后夹在锁定屏幕内
  for (const e of a.alive) {
    const max = a.x + VIEW_W - e.w;
    if (e.x < a.x) e.x = Math.min(a.x, e.x + ENTER_SPEED * dt);
    else if (e.x > max) e.x = Math.max(max, e.x - ENTER_SPEED * dt);
  }
  if (a.alive.length || (a.wait -= dt) > 0) return;
  if (a.wave + 1 < a.waves.length) {
    a.wave += 1;
    a.wait = WAVE_GAP;
    return spawnWave(game, a, a.waves[a.wave]);
  }
  if (a.untilBoss && !game.bossGroup?.defeated) return;
  unlock(game, a);
}

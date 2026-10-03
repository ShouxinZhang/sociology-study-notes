/**
 * 多部件 BOSS：按 assets/data/bosses.json 在地图锚点 Y 周围组装部件（部件本身是 static 敌人），
 * 玩家进入 wakeRange 后整组苏醒并切换 BOSS 音乐；击毁判定见 combat.js 的 defeatBossPart。
 */
import { TILE } from '../world/level.js';
import { createEnemy } from './enemy.js';

export function spawnBoss(game, id, anchor) {
  const def = game.data.bosses[id];
  const group = { id, def, anchor, awake: false, defeated: false };
  for (const part of def.parts) {
    const e = createEnemy({ x: anchor.x + part.dx * TILE, y: anchor.y + part.dy * TILE }, game.data.enemies[part.enemy]);
    Object.assign(e, { group, core: Boolean(part.core), facing: -1 });
    game.enemies.push(e);
  }
  return group;
}

export function updateBoss(game) {
  const g = game.bossGroup;
  if (!g || g.awake) return;
  const p = game.player;
  if (Math.hypot(p.x - g.anchor.x, p.y - g.anchor.y) > g.def.wakeRange) return;
  g.awake = true;
  game.toast(`${g.def.name} 出现了！`);
  game.sfx('boss_awake');
  game.music(g.def.music);
}

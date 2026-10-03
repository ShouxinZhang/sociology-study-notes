/**
 * 关卡机关：激光门（定时开关）、电网地板（周期通电）、酸液、传送带、爆炸桥（踩上后分段坍塌）。
 * 参数来自 assets/data/hazards.json；地板类机关是带标记的瓦片，激光门是地图 | 标记生成的实体。
 */
import { TILE } from '../world/level.js';
import { overlap } from '../systems/physics.js';
import { hurtPlayer } from '../systems/combat.js';
import { createEffect } from './effect.js';

const isOn = (t, cfg) => t % (cfg.on + cfg.off) < cfg.on;

/** 激光门：从发射器向下延伸到第一个实心瓦片 */
export function createHazards(level) {
  return level.spawns.hazards.map((h) => {
    const c = Math.floor(h.x / TILE);
    let r = Math.floor(h.y / TILE) + 1;
    while (r < level.rows && !level.tileAt(c, r)?.solid) r++;
    return { ...h, beam: { x: h.x + 5, y: h.y + TILE, w: 6, h: r * TILE - (h.y + TILE) } };
  });
}

export function updateHazards(game, dt) {
  const { player: p, level } = game;
  const cfg = game.data.hazards;
  const t = (game.hazardTime += dt);
  const laserOn = isOn(t, cfg.laser);
  if (laserOn && !game.laserOn && game.hazards.length) game.sfx('laser_on');
  game.laserOn = laserOn;
  game.electricOn = isOn(t, cfg.electric);

  if (laserOn) {
    for (const h of game.hazards) if (overlap(p, h.beam)) hurtPlayer(game, cfg.laser.damage, h.beam.x);
  }

  // 脚下瓦片类机关（作弊飞行时 onGround 为 false，自然免疫）
  if (p.onGround) {
    const r = Math.floor((p.y + p.h + 1) / TILE);
    const tiles = [p.x + 1, p.x + p.w - 1].map((x) => [Math.floor(x / TILE), level.tileAt(Math.floor(x / TILE), r)]);
    for (const [c, tile] of tiles) {
      if (!tile) continue;
      if (tile.electric && game.electricOn) {
        game.sfx('zap');
        hurtPlayer(game, cfg.electric.damage);
      }
      if (tile.acid) {
        game.sfx('acid_burn');
        hurtPlayer(game, cfg.acid.damage);
      }
      if (tile.bridge) triggerBridge(game, c, r);
    }
    const belt = tiles.find(([, tile]) => tile?.conveyor)?.[1];
    if (belt) {
      const nx = p.x + belt.conveyor * cfg.conveyor.speed * dt;
      if (!level.tileAtPoint(belt.conveyor > 0 ? nx + p.w : nx, p.y + p.h / 2)?.solid) p.x = nx;
    }
  }

  // 爆炸桥：到时的桥段被移除并爆炸
  for (const b of game.bridgeQueue) {
    if (b.done || t < b.at) continue;
    b.done = true;
    level.tiles[b.r][b.c] = null;
    game.effects.push(createEffect(game.sprites.explosion, b.c * TILE + TILE / 2, b.r * TILE + 4));
    game.sfx('bridge_break');
  }
}

/** 踩到桥时，整段相连的桥从触发点起依次坍塌（只触发一次） */
function triggerBridge(game, c, r) {
  const { level } = game;
  const cfg = game.data.hazards.bridge;
  let c0 = c;
  while (level.tileAt(c0 - 1, r)?.bridge) c0--;
  const key = `${c0},${r}`;
  if (game.bridgeTriggered.has(key)) return;
  game.bridgeTriggered.add(key);
  for (let k = c0; level.tileAt(k, r)?.bridge; k++) {
    game.bridgeQueue.push({ c: k, r, at: game.hazardTime + cfg.delay + (k - c0) * cfg.step, done: false });
  }
}

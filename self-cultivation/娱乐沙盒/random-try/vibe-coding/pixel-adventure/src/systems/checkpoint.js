/**
 * 检查点（地图 ! 标记）：玩家触碰后升旗，记录复活位置与此刻的玩家 / 背包快照；
 * 死亡重试时 game.retryLevel 从最近的检查点重开（左侧的敌人与锁屏战视为已通过）。
 */
import { TILE } from '../world/level.js';
import { overlap } from './physics.js';

/** 该检查点是否已到达（复活点在它右侧或就是它） */
export const reached = (game, cp) => cp.x <= (game.checkpoint?.spawn?.x ?? -1);

export function updateCheckpoints(game) {
  const p = game.player;
  for (const cp of game.level.spawns.checkpoints) {
    if (reached(game, cp) || !overlap(p, { x: cp.x, y: cp.y - TILE, w: TILE, h: TILE * 2 })) continue;
    game.checkpoint = { player: structuredClone(p), inventory: game.inventory.snapshot(), spawn: { x: cp.x, y: cp.y } };
    game.toast('检查点！死亡后从这里继续');
    game.sfx('checkpoint');
  }
}

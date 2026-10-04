/**
 * 镜头：世界视口 320×192，水平跟随玩家并夹在关卡范围内；锁屏战期间固定在战场左边界。
 * 逻辑层（锁屏战、呼叫支援选目标）与渲染层共用，保证“屏幕内”的判定和画面一致。
 */
export const VIEW_W = 320;
export const VIEW_H = 192;

export function cameraX(game) {
  if (game.arena) return game.arena.x;
  const { player: p, level } = game;
  return Math.round(Math.max(0, Math.min(p.x + p.w / 2 - VIEW_W / 2, level.width - VIEW_W)));
}

/** 当前屏幕内存活的敌人 */
export function enemiesOnScreen(game) {
  const x0 = cameraX(game);
  return game.enemies.filter((e) => !e.dead && e.x + e.w > x0 && e.x < x0 + VIEW_W);
}

/**
 * 一次性视觉特效（挥砍、爆炸）：播放完动画即移除；静态精灵默认显示 0.12 秒。
 */
const STATIC_LIFE = 0.12;

export function createEffect(sprite, cx, cy, flip = false) {
  return {
    sprite, flip, t: 0,
    x: cx - sprite.w / 2, y: cy - sprite.h / 2,
    life: sprite.fps ? sprite.frames.length / sprite.fps : STATIC_LIFE,
  };
}

export function updateEffects(game, dt) {
  for (const f of game.effects) f.t += dt;
  game.effects = game.effects.filter((f) => f.t < f.life);
}

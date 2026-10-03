/**
 * 投射物：子弹、火箭（命中或撞墙爆炸）、敌方骨头 / 孢子（受重力抛物线）、
 * 激光（pierce 贯穿，每个敌人只伤一次）、火焰（wave = [振幅, 角频率]，沿飞行方向的垂直方向蛇行）。
 */
import { GRAVITY, overlap } from '../systems/physics.js';
import { damageEnemy, explode, hurtPlayer } from '../systems/combat.js';

/** o: { x, y（中心点）, vx, vy, damage, owner: 'player'|'enemy', radius?, gravity?, flip?, life?, pierce?, wave? } */
export function createProjectile(sprite, o) {
  return {
    sprite, w: sprite.w, h: sprite.h, x: o.x - sprite.w / 2, y: o.y - sprite.h / 2,
    vx: o.vx, vy: o.vy, damage: o.damage, owner: o.owner,
    radius: o.radius ?? 0, gravity: o.gravity ?? false, flip: o.flip ?? false, hitSfx: o.hitSfx ?? null,
    pierce: o.pierce ?? false, hits: new Set(), wave: o.wave ?? null, t: 0,
    life: o.life ?? 2, dead: false,
  };
}

export function updateProjectiles(game, dt) {
  const { level, player } = game;
  for (const pr of game.projectiles) {
    pr.t += dt;
    if (pr.gravity) pr.vy += GRAVITY * 0.5 * dt;
    pr.x += pr.vx * dt;
    pr.y += pr.vy * dt;
    if (pr.wave) {
      // 位移是 sin 的导数，形成围绕直线的蛇行
      const [amp, freq] = pr.wave;
      const speed = Math.hypot(pr.vx, pr.vy) || 1;
      const offset = amp * freq * Math.cos(pr.t * freq) * dt;
      pr.x += (-pr.vy / speed) * offset;
      pr.y += (pr.vx / speed) * offset;
    }
    pr.life -= dt;

    const cx = pr.x + pr.w / 2;
    const cy = pr.y + pr.h / 2;
    const blocked = pr.life <= 0 || cy > level.height || Boolean(level.tileAtPoint(cx, cy)?.solid);
    const target = pr.owner === 'player'
      ? game.enemies.find((e) => !e.dead && !pr.hits.has(e) && overlap(pr, e))
      : overlap(pr, player) && player;
    if (!blocked && !target) continue;

    if (pr.pierce && target && !blocked) {
      pr.hits.add(target);
      damageEnemy(game, target, pr.damage, Math.sign(pr.vx) || 1);
      game.sfx(pr.hitSfx);
      continue;
    }
    pr.dead = true;
    if (pr.radius) explode(game, cx, cy, pr.radius, pr.damage);
    else if (target === player) hurtPlayer(game, pr.damage, cx);
    else if (target) {
      damageEnemy(game, target, pr.damage, Math.sign(pr.vx) || 1);
      game.sfx(pr.hitSfx);
    } else if (pr.owner === 'player') game.sfx('bullet_wall');
  }
  game.projectiles = game.projectiles.filter((pr) => !pr.dead);
}

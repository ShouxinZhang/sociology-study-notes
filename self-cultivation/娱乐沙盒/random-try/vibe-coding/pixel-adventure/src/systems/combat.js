/**
 * 战斗系统：玩家近战/射击、敌人受伤与死亡结算（经验、掉落）、爆炸范围伤害、玩家受伤。
 */
import { overlap } from './physics.js';
import { gainExp } from './leveling.js';
import { createEffect } from '../entities/effect.js';
import { createProjectile } from '../entities/projectile.js';
import { createPickup } from '../entities/pickup.js';

const center = (e) => ({ x: e.x + e.w / 2, y: e.y + e.h / 2 });

/** 用当前武器发动一次攻击；伤害 = 武器基础伤害 × 玩家攻击倍率 */
export function playerAttack(game, weapon) {
  const p = game.player;
  const damage = weapon.damage * p.attack;

  if (weapon.type === 'melee') {
    const box = { x: p.facing > 0 ? p.x + p.w : p.x - weapon.range, y: p.y - 2, w: weapon.range, h: p.h + 4 };
    game.enemies.filter((e) => overlap(box, e)).forEach((e) => damageEnemy(game, e, damage, p.facing));
    game.effects.push(createEffect(game.sprites[weapon.fx], box.x + box.w / 2, p.y + p.h / 2, p.facing < 0));
    return;
  }

  // muzzle = [距身体中线的水平偏移, 距碰撞盒顶部的纵向偏移]，对齐攻击动作中的枪口
  const [dx, dy] = weapon.muzzle;
  const muzzleX = p.x + p.w / 2 + p.facing * dx;
  const muzzleY = p.y + dy;
  game.effects.push(createEffect(game.sprites[weapon.fx], muzzleX, muzzleY, p.facing < 0));
  const spread = (Math.random() - 0.5) * (weapon.spread ?? 0) * weapon.speed;
  game.projectiles.push(
    createProjectile(game.sprites[weapon.projectile], {
      x: muzzleX,
      y: muzzleY,
      vx: p.facing * weapon.speed,
      vy: spread,
      damage,
      owner: 'player',
      radius: weapon.explosionRadius ?? 0,
      flip: p.facing < 0,
    }),
  );
}

export function damageEnemy(game, e, amount, dir) {
  if (e.dead) return;
  e.hp -= amount;
  e.flash = 0.12;
  e.x += dir * 3;
  if (e.hp <= 0) killEnemy(game, e);
}

function killEnemy(game, e) {
  e.dead = true;
  const c = center(e);
  game.effects.push(createEffect(game.sprites.explosion, c.x, c.y));
  if (gainExp(game.player, e.def.exp, game.data.progression)) game.toast(`升级！LV ${game.player.level}`);
  if (e.def.behavior === 'boss') game.toast('BOSS 被击败！前往终点旗帜');

  // 掉落：按配置概率依次判定，最多掉一件
  for (const [kind, chance] of Object.entries(e.def.drops ?? {})) {
    if (Math.random() < chance) {
      game.pickups.push(createPickup(kind, c.x, c.y));
      break;
    }
  }
}

/** 火箭爆炸：半径内所有敌人受伤（不伤玩家） */
export function explode(game, x, y, radius, damage) {
  game.effects.push(createEffect(game.sprites.explosion, x, y));
  for (const e of game.enemies) {
    const c = center(e);
    if (Math.hypot(c.x - x, c.y - y) <= radius + Math.max(e.w, e.h) / 2) {
      damageEnemy(game, e, damage, Math.sign(c.x - x) || 1);
    }
  }
}

/** 玩家受伤：作弊模式完全无敌；无敌时间内免疫（force 为 true 时强制，如坠崖）；fromX 用于计算击退方向 */
export function hurtPlayer(game, amount, fromX = null, force = false) {
  const p = game.player;
  if (game.cheat || (!force && p.invuln > 0)) return;
  p.hp = Math.max(0, p.hp - amount);
  p.invuln = game.data.progression.invulnTime;
  if (fromX !== null) {
    p.vx = (Math.sign(p.x + p.w / 2 - fromX) || 1) * 120;
    p.vy = -180;
    p.knock = 0.2;
  }
  if (p.hp <= 0) game.state = 'gameover';
}

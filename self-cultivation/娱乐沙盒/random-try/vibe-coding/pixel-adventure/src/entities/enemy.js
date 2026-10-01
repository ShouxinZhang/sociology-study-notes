/**
 * 敌人实体：属性来自 assets/data/enemies.json，行为按 behavior 字段分派：
 * patrol 巡逻不下崖 / fly 飞行追踪 / chase 发现玩家后追击并投掷 / boss 苏醒后追击、跳跃、扇形投掷。
 */
import { TILE } from '../world/level.js';
import { moveAndCollide, overlap } from '../systems/physics.js';
import { hurtPlayer } from '../systems/combat.js';
import { createProjectile } from './projectile.js';

export function createEnemy(spawn, def) {
  const y = spawn.y + TILE - def.h; // 脚底对齐出生格底部
  return {
    def, w: def.w, h: def.h, x: spawn.x + (TILE - def.w) / 2, y, baseY: y,
    vx: 0, vy: 0, hp: def.hp, facing: -1, onGround: false,
    t: Math.random() * 6, cd: def.throw?.cooldown ?? 0, jumpCd: 2, flash: 0, dead: false, awake: false,
  };
}

/** 玩家相对敌人中心的偏移 */
function sense(game, e) {
  const p = game.player;
  const dx = p.x + p.w / 2 - (e.x + e.w / 2);
  const dy = p.y + p.h / 2 - (e.y + e.h / 2);
  return { dx, dy, dist: Math.hypot(dx, dy) };
}

/** 地面行走：巡逻时遇墙/崖边掉头；追击时在崖边停下 */
function walk(game, e, dt, speed, chasing) {
  e.vx = e.facing * speed;
  if (e.onGround && !game.level.hasSupportAhead(e)) {
    if (!chasing) e.facing *= -1;
    e.vx = chasing ? 0 : e.facing * speed;
  }
  moveAndCollide(e, game.level, dt);
  if (e.hitWall && !chasing) e.facing *= -1;
}

/** 按冷却向玩家方向抛出骨头（count > 1 时呈扇形） */
function tryThrow(game, e, dt, dx) {
  const spec = e.def.throw;
  if (!spec || (e.cd -= dt) > 0) return;
  e.cd = spec.cooldown;
  game.sfx('bone_throw');
  const dir = Math.sign(dx) || e.facing;
  for (let i = 0; i < spec.count; i++) {
    game.projectiles.push(
      createProjectile(game.sprites.bone, {
        x: e.x + e.w / 2, y: e.y + 4,
        vx: dir * spec.speed * (1 - i * 0.25), vy: -160 - i * 40,
        damage: spec.damage, owner: 'enemy', gravity: true, life: 3,
      }),
    );
  }
}

const BEHAVIORS = {
  patrol(game, e, dt) {
    walk(game, e, dt, e.def.speed, false);
  },

  fly(game, e, dt) {
    const { dx, dy, dist } = sense(game, e);
    if (dist < 150) {
      e.facing = Math.sign(dx) || e.facing;
      e.x += e.facing * e.def.speed * dt;
      e.baseY += Math.sign(dy) * 15 * dt;
    }
    e.y = e.baseY + Math.sin(e.t * 4) * 10;
  },

  chase(game, e, dt) {
    const { dx, dy } = sense(game, e);
    const near = Math.abs(dx) < 120 && Math.abs(dy) < 40;
    if (near) e.facing = Math.sign(dx) || e.facing;
    walk(game, e, dt, e.def.speed * (near ? 1.4 : 1), near);
    if (near) tryThrow(game, e, dt, dx);
  },

  boss(game, e, dt) {
    const { dx } = sense(game, e);
    if (!e.awake) {
      e.vx = 0;
      moveAndCollide(e, game.level, dt);
      if (Math.abs(dx) > 200) return;
      e.awake = true;
      game.toast(`${e.def.name} 出现了！`);
      game.sfx('boss_awake');
      game.music(e.def.music);
    }
    e.facing = Math.sign(dx) || e.facing;
    const rage = e.hp < e.def.hp / 2 ? 1.6 : 1; // 半血后狂暴：更快、更频繁
    if (e.onGround && (e.jumpCd -= dt) <= 0) {
      e.vy = -300;
      e.jumpCd = 2.5 / rage;
    }
    const airborne = !e.onGround;
    walk(game, e, dt, e.def.speed * rage, true);
    if (airborne && e.onGround) game.sfx('boss_land');
    tryThrow(game, e, dt * rage, dx);
  },
};

export function updateEnemies(game, dt) {
  for (const e of game.enemies) {
    e.t += dt;
    e.flash -= dt;
    BEHAVIORS[e.def.behavior](game, e, dt);
    if (e.y > game.level.height) e.dead = true;
    else if (overlap(e, game.player)) hurtPlayer(game, e.def.damage, e.x + e.w / 2);
  }
  game.enemies = game.enemies.filter((e) => !e.dead);
}

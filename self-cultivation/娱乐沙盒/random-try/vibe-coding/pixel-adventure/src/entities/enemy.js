/**
 * 敌人实体：属性来自 assets/data/enemies.json，行为按 behavior 字段分派：
 * patrol 巡逻不下崖 / fly 飞行追踪 / chase 发现玩家后追击并投掷 / boss 苏醒后追击、跳跃、扇形投掷；
 * runner 冲锋步兵 / hopper 跳跃幼虫 / capsule 飞行胶囊 / static 固定单位（射击、孵化、地雷由数据字段组合）；
 * 合金弹头世界：soldier 步兵 / 伞兵 / 盾牌兵 / vehicle 运兵卡车、坦克 / heli 武装直升机。
 */
import { TILE } from '../world/level.js';
import { GRAVITY, moveAndCollide, overlap } from '../systems/physics.js';
import { hurtPlayer } from '../systems/combat.js';
import { createProjectile } from './projectile.js';
import { createEffect } from './effect.js';

export function createEnemy(spawn, def) {
  const y = spawn.y + TILE - def.h; // 脚底对齐出生格底部
  const x = spawn.x + (TILE - def.w) / 2;
  return {
    def, w: def.w, h: def.h, x, y, baseY: y, spawnX: x, content: spawn.content ?? null,
    vx: 0, vy: 0, hp: def.hp, facing: -1, onGround: false, aimFrame: 0, children: [],
    t: Math.random() * 6, cd: def.throw?.cooldown ?? 0, spawnCd: def.spawn?.cooldown ?? 0,
    jumpCd: def.behavior === 'hopper' ? 0.6 : 2, flash: 0, dead: false, awake: false, active: false,
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

/** 半血狂暴倍率（rageAt 为触发血量比例），用于加快射击与孵化 */
const rageOf = (e) => (e.def.rageAt && e.hp < e.def.hp * e.def.rageAt ? 2 : 1);

/**
 * 按冷却发射投射物，五种弹道：
 * radial 环形散射 / aimed 瞄准玩家（count>1 时按 spread 张开）/ lob 迫击炮（按飞行时间反推水平速度，落点在玩家附近）/
 * drop 垂直投弹 / 默认抛物线（骨头、孢子）。radius > 0 时落地爆炸（只伤玩家）
 */
function tryThrow(game, e, dt, dx, dy = 0) {
  const spec = e.def.throw;
  if (!spec || (e.cd -= dt) > 0) return;
  e.cd = spec.cooldown;
  game.sfx(spec.sfx ?? 'bone_throw');
  const sprite = game.sprites[spec.projectile ?? 'bone'];
  const base = Math.atan2(dy, dx);
  for (let i = 0; i < spec.count; i++) {
    let vx;
    let vy;
    if (spec.radial) {
      const a = (i / spec.count) * Math.PI * 2 + e.t;
      [vx, vy] = [Math.cos(a) * spec.speed, Math.sin(a) * spec.speed];
    } else if (spec.aimed) {
      const a = base + (i - (spec.count - 1) / 2) * (spec.spread ?? 0.2);
      [vx, vy] = [Math.cos(a) * spec.speed, Math.sin(a) * spec.speed];
    } else if (spec.lob) {
      const flight = (2 * spec.speed) / (GRAVITY * 0.5); // 抛物线回到发射高度所需时间（投射物重力为 GRAVITY / 2）
      [vx, vy] = [(dx / flight) * (1 + (i - (spec.count - 1) / 2) * 0.3), -spec.speed];
    } else if (spec.drop) {
      [vx, vy] = [0, spec.speed];
    } else {
      [vx, vy] = [(Math.sign(dx) || e.facing) * spec.speed * (1 - i * 0.25), -160 - i * 40];
    }
    game.projectiles.push(
      createProjectile(sprite, {
        x: e.x + e.w / 2, y: e.y + (spec.radial || spec.aimed ? e.h / 2 : 4),
        vx, vy, damage: spec.damage, owner: 'enemy', gravity: !spec.radial && !spec.aimed, life: 3, radius: spec.radius ?? 0,
      }),
    );
  }
}

/** 孵化：按冷却生成子单位，同时存活数不超过 max */
function trySpawn(game, e, dt) {
  const spec = e.def.spawn;
  if (!spec || (e.spawnCd -= dt) > 0) return;
  e.spawnCd = spec.cooldown;
  e.children = e.children.filter((c) => !c.dead);
  if (e.children.length >= spec.max) return;
  const child = createEnemy({ x: e.x + e.w / 2 - TILE / 2, y: e.y + e.h - TILE }, game.data.enemies[spec.enemy]);
  child.facing = e.facing;
  e.children.push(child);
  game.enemies.push(child);
  game.sfx('spawn');
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

  /** 冲锋步兵：进入视野后朝玩家狂奔，撞墙掉头，会跑下悬崖 */
  runner(game, e, dt) {
    const { dx } = sense(game, e);
    if (!e.active) {
      if (Math.abs(dx) > 220) return moveAndCollide(e, game.level, dt);
      e.active = true;
      e.facing = Math.sign(dx) || -1;
    }
    e.vx = e.facing * e.def.speed;
    moveAndCollide(e, game.level, dt);
    if (e.hitWall) e.facing *= -1;
  },

  /** 跳跃幼虫：着地后按冷却朝玩家弹跳 */
  hopper(game, e, dt) {
    const { dx } = sense(game, e);
    if (e.onGround) {
      e.vx = 0;
      if ((e.jumpCd -= dt) <= 0 && Math.abs(dx) < 200) {
        e.facing = Math.sign(dx) || e.facing;
        e.vy = -220;
        e.vx = e.facing * e.def.speed;
        e.jumpCd = 0.8 + Math.random() * 0.6;
      }
    }
    moveAndCollide(e, game.level, dt);
  },

  /** 飞行胶囊：玩家靠近后沿正弦轨迹横飞，飞出太远则消失 */
  capsule(game, e, dt) {
    const { dx } = sense(game, e);
    if (!e.active) {
      if (Math.abs(dx) > 200) return;
      e.active = true;
      e.facing = Math.sign(dx) || 1;
    }
    e.x += e.facing * e.def.speed * dt;
    e.y = e.baseY + Math.sin(e.t * 3) * 14;
    if (Math.abs(e.x - e.spawnX) > 420) e.dead = true;
  },

  /** 步兵：进入 range 后走向玩家，到 keep 距离内站定射击；para 伞兵空中以该速度缓降（显示 airSprite）并可空中开火 */
  soldier(game, e, dt) {
    const { dx, dy } = sense(game, e);
    if (e.def.para && !e.onGround) e.vy = Math.min(e.vy, e.def.para);
    if (!e.active) {
      if (Math.abs(dx) > e.def.range) return moveAndCollide(e, game.level, dt);
      e.active = true;
    }
    e.facing = Math.sign(dx) || e.facing;
    e.vx = e.onGround && Math.abs(dx) > e.def.keep ? e.facing * e.def.speed : 0;
    moveAndCollide(e, game.level, dt);
    if (e.onGround || e.def.para) tryThrow(game, e, dt, dx, dy);
  },

  /** 载具（运兵卡车、坦克）：驶向玩家并停在 keep 距离；retreat 时玩家贴太近会倒车；按冷却开炮 / 放兵，半血狂暴 */
  vehicle(game, e, dt) {
    const { dx } = sense(game, e);
    if (!e.active) {
      if (Math.abs(dx) > e.def.range) return moveAndCollide(e, game.level, dt);
      e.active = true;
    }
    const toward = Math.sign(dx) || e.facing;
    e.facing = toward;
    const dist = Math.abs(dx);
    const move = dist > e.def.keep + 16 ? 1 : e.def.retreat && dist < e.def.keep - 50 ? -1 : 0;
    e.vx = move * toward * e.def.speed;
    moveAndCollide(e, game.level, dt);
    const rage = rageOf(e);
    tryThrow(game, e, dt * rage, dx, 0);
    trySpawn(game, e, dt * rage);
  },

  /** 武装直升机：在出生高度盘旋，围绕玩家上空左右摆动跟随，接近头顶时投弹 */
  heli(game, e, dt) {
    const { dx } = sense(game, e);
    if (!e.active) {
      if (Math.abs(dx) > e.def.range) return;
      e.active = true;
    }
    e.facing = Math.sign(dx) || e.facing;
    const want = dx + Math.sin(e.t * 0.9) * 70;
    e.x += Math.max(-e.def.speed * dt, Math.min(e.def.speed * dt, want));
    e.y = e.baseY + Math.sin(e.t * 2) * 4;
    if (Math.abs(dx) < 60) tryThrow(game, e, dt, dx);
  },

  /** 固定单位：狙击手、炮台、口器、兵营、异形卵、地雷、BOSS 部件共用；能力由 throw / spawn / mine 字段决定 */
  static(game, e, dt) {
    if (!e.def.fly) {
      e.vx = 0;
      moveAndCollide(e, game.level, dt);
    }
    if (e.group && !e.group.awake) return; // BOSS 部件在苏醒前不行动
    const { dx, dy, dist } = sense(game, e);
    if (!e.def.fixedFacing) e.facing = Math.sign(dx) || e.facing;
    if (e.def.aimFrames) e.aimFrame = (Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) + 8) % 8;
    if (e.def.mine && dist < e.def.mine.radius) {
      e.dead = true;
      game.effects.push(createEffect(game.sprites.explosion, e.x + e.w / 2, e.y));
      game.sfx('explosion');
      hurtPlayer(game, e.def.mine.damage, e.x + e.w / 2);
      return;
    }
    if (dist > (e.def.range ?? 180)) return;
    const rage = rageOf(e);
    tryThrow(game, e, dt * rage, dx, dy);
    trySpawn(game, e, dt * rage);
  },
};

export function updateEnemies(game, dt) {
  for (const e of game.enemies) {
    e.t += dt;
    e.flash -= dt;
    BEHAVIORS[e.def.behavior](game, e, dt);
    if (e.y > game.level.height) e.dead = true;
    else if (e.def.damage && overlap(e, game.player)) hurtPlayer(game, e.def.damage, e.x + e.w / 2);
  }
  game.enemies = game.enemies.filter((e) => !e.dead);
}

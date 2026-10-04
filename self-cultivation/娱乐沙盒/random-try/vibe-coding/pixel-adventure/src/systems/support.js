/**
 * 呼叫支援（weapons.json 中 type: "strike"）：
 * - artillery（M777 榴弹炮）：准星锁定前方最近的敌人（没有则锁定前方地面），delay 秒后 shells 发炮弹
 *   每隔 interval 秒从屏幕上方陡峭落下，落点随目标移动，命中后重爆炸；
 * - airstrike（F22 空军支援）：战机从玩家身后掠过屏幕，飞到玩家上方时向屏幕内最多 missiles 个敌人
 *   各发射一枚追踪导弹；屏幕内没有敌人时向前方地面齐射 3 枚。
 * 进行中的支援保存在 game.strikes，由 updateSupport 逐帧推进，绘制见 renderer。
 */
import { TILE } from '../world/level.js';
import { cameraX, enemiesOnScreen, VIEW_W } from '../world/camera.js';
import { createProjectile } from '../entities/projectile.js';

const JET_SPEED = 420;
const JET_Y = 14;
const SHELL_DRIFT = 40; // 炮弹起点相对落点的水平偏移，形成陡峭斜落
const FALLBACK_RANGE = 128; // 屏幕内没有目标时，准星落在前方的距离

const centerX = (e) => e.x + e.w / 2;

/** 从 y 向下找第一块可站立瓦片的顶边；找不到返回关卡底部 */
function groundY(level, x, y) {
  for (let r = Math.max(0, Math.floor(y / TILE)); r < level.rows; r++) {
    const t = level.tileAtPoint(x, r * TILE);
    if (t?.solid || t?.oneWay) return r * TILE;
  }
  return level.height;
}

/** 玩家发动支援：按武器的 strike 字段创建进行中的支援 */
export function callStrike(game, weapon, damage) {
  const p = game.player;
  const px = p.x + p.w / 2;
  if (weapon.strike === 'artillery') {
    const ahead = enemiesOnScreen(game)
      .filter((e) => (centerX(e) - px) * p.facing >= -8)
      .sort((a, b) => Math.abs(centerX(a) - px) - Math.abs(centerX(b) - px))[0];
    const x = ahead ? centerX(ahead) : px + p.facing * FALLBACK_RANGE;
    game.strikes.push({ kind: 'artillery', weapon, damage, target: ahead ?? null, x, y: groundY(game.level, x, p.y), dir: p.facing, t: 0, fired: 0 });
  } else {
    const x0 = cameraX(game);
    const x = p.facing > 0 ? x0 - 40 : x0 + VIEW_W;
    game.strikes.push({ kind: 'airstrike', weapon, damage, x, y: JET_Y, dir: p.facing, t: 0, launched: false });
    game.sfx('jet_flyby');
  }
}

function shellAt(game, s) {
  const { weapon: w } = s;
  const startX = s.x - s.dir * SHELL_DRIFT + (Math.random() - 0.5) * 12;
  const startY = -10;
  const len = Math.hypot(s.x - startX, s.y - startY);
  return createProjectile(game.sprites[w.projectile], {
    x: startX, y: startY, vx: ((s.x - startX) / len) * w.speed, vy: ((s.y - startY) / len) * w.speed,
    damage: s.damage, owner: 'player', radius: w.explosionRadius, heavy: true, life: 3,
  });
}

function updateArtillery(game, s, dt) {
  const w = s.weapon;
  if (s.target && !s.target.dead) {
    s.x = centerX(s.target);
    s.y = groundY(game.level, s.x, s.target.y);
  }
  while (s.fired < w.shells && s.t >= w.delay + s.fired * w.interval) {
    if (s.fired === 0) game.sfx('shell_whistle');
    game.projectiles.push(shellAt(game, s));
    s.fired += 1;
  }
  return s.fired >= w.shells && s.t > w.delay + w.shells * w.interval + 0.4;
}

/** 导弹目标：屏幕内离玩家最近的若干敌人；没有敌人时改为前方地面上的若干点 */
function missileTargets(game, s) {
  const p = game.player;
  const px = p.x + p.w / 2;
  const enemies = enemiesOnScreen(game).sort((a, b) => Math.abs(centerX(a) - px) - Math.abs(centerX(b) - px));
  if (enemies.length) return enemies.slice(0, s.weapon.missiles);
  return [0, 1, 2].map((i) => {
    const x = px + s.dir * (60 + i * 40);
    return { x, y: groundY(game.level, x, p.y), w: 0, h: 0 };
  });
}

function updateAirstrike(game, s, dt) {
  const w = s.weapon;
  s.x += s.dir * JET_SPEED * dt;
  const p = game.player;
  if (!s.launched && (s.x + 20 - (p.x + p.w / 2)) * s.dir >= 0) {
    s.launched = true;
    game.sfx('missile_launch');
    const [ox, oy] = [s.x + 20, s.y + 10];
    for (const target of missileTargets(game, s)) {
      // 初速直接指向目标：玩家贴着关卡边界时，固定方向发射会先撞上边界墙
      const dx = target.x + target.w / 2 - ox;
      const dy = Math.max(8, target.y + target.h / 2 - oy);
      const len = Math.hypot(dx, dy);
      game.projectiles.push(createProjectile(game.sprites[w.projectile], {
        x: ox, y: oy, vx: (dx / len) * w.speed, vy: (dy / len) * w.speed,
        damage: s.damage, owner: 'player', radius: w.explosionRadius, homing: target, life: 3,
      }));
    }
  }
  const x0 = cameraX(game);
  return s.x < x0 - 80 || s.x > x0 + VIEW_W + 80;
}

const UPDATERS = { artillery: updateArtillery, airstrike: updateAirstrike };

export function updateSupport(game, dt) {
  for (const s of game.strikes) {
    s.t += dt;
    s.done = UPDATERS[s.kind](game, s, dt);
  }
  game.strikes = game.strikes.filter((s) => !s.done);
}

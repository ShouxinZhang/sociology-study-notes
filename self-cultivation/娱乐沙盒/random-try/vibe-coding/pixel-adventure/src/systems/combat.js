/**
 * 战斗系统：玩家近战/射击、敌人受伤与死亡结算（经验、掉落）、爆炸范围伤害、玩家受伤。
 */
import { overlap } from './physics.js';
import { gainExp } from './leveling.js';
import { createEffect } from '../entities/effect.js';
import { createProjectile } from '../entities/projectile.js';
import { createPickup } from '../entities/pickup.js';

const center = (e) => ({ x: e.x + e.w / 2, y: e.y + e.h / 2 });

// 攻击 / 瞄准精灵画布中，玩家碰撞盒“水平中线、顶边”所在的像素坐标（身体位于画布 (8, 8)）
const CANVAS_ORIGIN = [16, 9];

function rotate([x, y], a) {
  return [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
}

/**
 * 某瞄准方向的射击方向与枪口偏移。aim.json 的 dirs[dir] 给出旋转角与平移，pivot 为肩膀；
 * 枪口 = 武器朝前时的 muzzle 绕肩膀旋转，与 tools/gen_aim_sprites.py 生成的精灵一致。
 * 返回 { v: 单位方向（x 未乘朝向）, m: [距身体中线, 距碰撞盒顶部] }
 */
function aimGeometry(aimData, dir, muzzle) {
  const { angle, offset } = aimData.dirs[dir];
  const a = (angle * Math.PI) / 180;
  const [px, py] = aimData.pivot;
  const [ox, oy] = CANVAS_ORIGIN;
  const [rx, ry] = rotate([ox + muzzle[0] - px, oy + muzzle[1] - py], a);
  return { v: [Math.cos(a), Math.sin(a)], m: [px + rx + offset[0] - ox, py + ry + offset[1] - oy] };
}

/** 用当前武器发动一次攻击；伤害 = 武器基础伤害 × 玩家攻击倍率 */
export function playerAttack(game, weapon) {
  const p = game.player;
  const damage = weapon.damage * p.attack;
  game.sfx(weapon.sfxAttack);

  if (weapon.type === 'melee') {
    const box = { x: p.facing > 0 ? p.x + p.w : p.x - weapon.range, y: p.y - 2, w: weapon.range, h: p.h + 4 };
    const hits = game.enemies.filter((e) => overlap(box, e));
    hits.forEach((e) => damageEnemy(game, e, damage, p.facing));
    if (hits.length) game.sfx(weapon.sfxHit);
    game.effects.push(createEffect(game.sprites[weapon.fx], box.x + box.w / 2, p.y + p.h / 2, p.facing < 0));
    return;
  }

  // muzzle = [距身体中线的水平偏移, 距碰撞盒顶部的纵向偏移]，对齐攻击动作中的枪口
  const dirName = p.aim ?? 'fwd';
  const { v, m: [dx, dy] } = aimGeometry(game.data.aim, dirName, weapon.muzzle);
  const muzzleX = p.x + p.w / 2 + p.facing * dx;
  const muzzleY = p.y + dy;
  const dir = [v[0] * p.facing, v[1]];
  // 非水平方向优先使用圆形变体精灵（如 bullet_r），避免长条子弹斜飞时方向不对；火光使用旋转后的变体
  const sideways = dirName !== 'fwd';
  const sprite = (sideways && game.sprites[`${weapon.projectile}_r`]) || game.sprites[weapon.projectile];
  const fx = game.sprites[sideways ? `${weapon.fx}_${dirName}` : weapon.fx];
  game.effects.push(createEffect(fx, muzzleX, muzzleY, p.facing < 0));

  const pellets = weapon.pellets ?? 1;
  for (let i = 0; i < pellets; i++) {
    const angle = (i - (pellets - 1) / 2) * (weapon.pelletAngle ?? 0) + (Math.random() - 0.5) * (weapon.spread ?? 0);
    const [vx, vy] = rotate(dir, angle);
    game.projectiles.push(
      createProjectile(sprite, {
        x: muzzleX,
        y: muzzleY,
        vx: vx * weapon.speed,
        vy: vy * weapon.speed,
        damage,
        owner: 'player',
        radius: weapon.explosionRadius ?? 0,
        pierce: weapon.pierce ?? false,
        wave: weapon.wave ?? null,
        hitSfx: weapon.sfxHit,
        flip: p.facing < 0,
      }),
    );
  }
}

export function damageEnemy(game, e, amount, dir) {
  if (e.dead) return;
  e.hp -= amount;
  e.flash = 0.12;
  if (e.def.behavior !== 'static') e.x += dir * 3; // 固定类（炮台、BOSS 部件）不被击退
  if (e.hp <= 0) killEnemy(game, e);
  else game.sfx(e.def.sfxHit ?? 'enemy_hit'); // 受击材质音，与武器命中音叠加；致命一击由死亡音替代
}

export function killEnemy(game, e) {
  if (e.dead) return;
  e.dead = true;
  const c = center(e);
  game.effects.push(createEffect(game.sprites.explosion, c.x, c.y));
  game.sfx(e.def.sfxDie);
  if (gainExp(game.player, e.def.exp, game.data.progression)) {
    game.toast(`升级！LV ${game.player.level}`);
    game.sfx('levelup');
  }
  if (e.def.behavior === 'boss') {
    game.toast('BOSS 被击败！前往终点旗帜');
    game.music(game.levelDefs[game.levelIndex].music);
  }
  if (e.group) defeatBossPart(game, e);

  // 飞行胶囊：按关卡配置掉落指定武器或护盾
  if (e.content) {
    const weapon = game.inventory.byId(e.content);
    const pop = { vy: -200, delay: 0.3 };
    game.pickups.push(weapon
      ? createPickup('weapon', c.x, c.y, { ...pop, weaponId: weapon.id, sprite: weapon.icon })
      : createPickup(e.content, c.x, c.y, { ...pop, sprite: `icon_${e.content}` }));
    return;
  }

  // 掉落：按配置概率依次判定，最多掉一件；还没有枪时不掉弹药箱（捡了也没用）
  for (const [kind, chance] of Object.entries(e.def.drops ?? {})) {
    if (kind === 'ammo' && !game.inventory.hasGun) continue;
    if (Math.random() < chance) {
      game.pickups.push(createPickup(kind, c.x, c.y));
      break;
    }
  }
}

/** 多部件 BOSS：核心被毁或全部部件被毁时，连锁摧毁剩余部件并宣告胜利 */
function defeatBossPart(game, e) {
  const rest = game.enemies.filter((x) => x.group === e.group && !x.dead);
  if (!e.core && rest.length) return;
  rest.forEach((x) => killEnemy(game, x));
  if (e.group.defeated) return;
  e.group.defeated = true;
  game.toast(`${e.group.def.name} 被摧毁！前往终点旗帜`);
  game.music(game.levelDefs[game.levelIndex].music);
}

/** 火箭爆炸：半径内所有敌人受伤（不伤玩家） */
export function explode(game, x, y, radius, damage) {
  game.effects.push(createEffect(game.sprites.explosion, x, y));
  game.sfx('explosion');
  for (const e of game.enemies) {
    const c = center(e);
    if (Math.hypot(c.x - x, c.y - y) <= radius + Math.max(e.w, e.h) / 2) {
      damageEnemy(game, e, damage, Math.sign(c.x - x) || 1);
    }
  }
}

/** 玩家受伤：作弊或护盾期间完全无敌；无敌时间内免疫（force 为 true 时强制，如坠崖）；fromX 用于计算击退方向 */
export function hurtPlayer(game, amount, fromX = null, force = false) {
  const p = game.player;
  if (game.cheat || p.shield > 0 || (!force && p.invuln > 0)) return;
  p.hp = Math.max(0, p.hp - amount);
  p.invuln = game.data.progression.invulnTime;
  game.sfx('hurt');
  if (fromX !== null) {
    p.vx = (Math.sign(p.x + p.w / 2 - fromX) || 1) * 120;
    p.vy = -180;
    p.knock = 0.2;
  }
  if (p.hp <= 0) game.enter('gameover');
}

/**
 * 玩家实体：移动、可变高度跳跃 + 二段跳、八方向瞄准、攻击与换武器输入、护盾、坠崖复活。
 * 持久属性（等级/经验/生命）跨关卡保留，位置类状态在每关开始时重置。
 */
import { moveAndCollide } from '../systems/physics.js';
import { statsFor } from '../systems/leveling.js';
import { hurtPlayer, playerAttack } from '../systems/combat.js';

const MOVE_SPEED = 100;
const JUMP_SPEED = 330; // 满跳约 3.7 格高
const DOUBLE_JUMP_RATIO = 0.85; // 二段跳初速相对一段跳的比例（高度约 70%）
const JUMP_CUT = 120; // 提前松开跳跃键时截断上升速度
const FALL_DAMAGE = 2;
const LAND_SOUND_SPEED = 150; // 低于此下落速度的落地（如走下台阶）不出声

export function createPlayer(prog) {
  const p = { w: 10, h: 15, level: 1, exp: 0, ...statsFor(1, prog) };
  p.hp = p.maxHp;
  return p;
}

/** 放置到关卡出生点并重置瞬时状态、回满血 */
export function placePlayer(p, spawn) {
  const pos = { x: spawn.x + 3, y: spawn.y + 1 };
  Object.assign(p, pos, {
    vx: 0, vy: 0, facing: 1, onGround: false, hp: p.maxHp,
    invuln: 0, knock: 0, attackCd: 0, attackAnim: 0, attackT: 0, attackSprite: null, safe: { ...pos },
    airJumps: 1, spinT: 0, shield: 0, aim: 'fwd',
  });
}

/** 八方向瞄准：↑ 向上，↑+←/→ 斜上；空中 ↓ 向下，↓+←/→ 斜下 */
function aimOf(input, onGround) {
  const horiz = input.held('left') || input.held('right');
  if (input.held('up')) return horiz ? 'diag_up' : 'up';
  if (input.held('down') && !onGround) return horiz ? 'diag_down' : 'down';
  return 'fwd';
}

export function updatePlayer(game, dt) {
  const { player: p, input, inventory } = game;
  p.invuln -= dt;
  p.knock -= dt;
  p.attackCd -= dt;
  p.attackAnim -= dt;
  p.attackT += dt;
  p.spinT -= dt;
  p.shield -= dt;
  const weapon = inventory.current;
  p.gun = weapon.type === 'ranged' ? weapon.attackSprite : null; // 远程武器才有方向瞄准精灵
  p.aim = p.gun ? aimOf(input, p.onGround) : 'fwd';

  // 击退期间保留击退速度，不响应左右输入
  if (p.knock <= 0) {
    const dir = (input.held('right') ? 1 : 0) - (input.held('left') ? 1 : 0);
    p.vx = dir * MOVE_SPEED;
    if (dir) p.facing = dir;
  }
  if (game.cheat) fly(game, dt);
  else walkAndJump(game, dt);

  const slot = input.digit();
  const before = inventory.currentId;
  if (slot) inventory.selectSlot(slot);
  if (input.hit('prev')) inventory.cycle(-1);
  if (input.hit('next')) inventory.cycle(1);
  if (inventory.currentId !== before) game.sfx('weapon_switch');

  // 按住攻击键按武器冷却自动连发；冷却跨帧累计，射速高于帧率时同帧多发（作弊 10 倍射速需要）
  if (!input.held('attack')) p.attackCd = Math.max(p.attackCd, 0);
  while (input.held('attack') && p.attackCd <= 0) {
    const weapon = inventory.current;
    if (inventory.consume(game.cheat)) {
      const anim = game.sprites[weapon.attackSprite];
      p.attackCd += weapon.cooldown / (game.cheat ? game.data.cheat.fireRateMultiplier : 1);
      p.attackSprite = weapon.attackSprite;
      p.attackAnim = anim.frames.length / anim.fps; // 动作播完一遍即恢复常态
      p.attackT = 0;
      playerAttack(game, weapon);
    } else {
      p.attackCd = 0.4;
      game.sfx('ammo_empty');
      game.toast(`${weapon.name} 没有弹药！Q / E 换武器，Tab 打开装备栏`);
    }
  }
}

/** 常规移动：重力、跳跃、碰撞与坠崖复活 */
function walkAndJump(game, dt) {
  const { player: p, input, level } = game;
  if (p.onGround) p.airJumps = 1;
  if (input.hit('jump') && p.onGround) {
    p.vy = -JUMP_SPEED;
    game.sfx('jump');
  } else if (input.hit('jump') && p.airJumps > 0) {
    p.airJumps -= 1;
    p.vy = -JUMP_SPEED * DOUBLE_JUMP_RATIO;
    p.spinT = 0.4;
    game.sfx('jump2');
  }
  if (!input.held('jump') && p.vy < -JUMP_CUT) p.vy = -JUMP_CUT;

  const fallSpeed = p.onGround ? 0 : p.vy;
  moveAndCollide(p, level, dt);
  if (p.onGround && fallSpeed > LAND_SOUND_SPEED) game.sfx('land');
  if (p.onGround && level.isFirmlyGrounded(p)) p.safe = { x: p.x, y: p.y };
  if (p.y > level.height) {
    Object.assign(p, { ...p.safe, vx: 0, vy: 0 });
    game.sfx('fall');
    hurtPlayer(game, FALL_DAMAGE, null, true);
  }
}

/** 作弊飞行：无重力、穿墙，只限制在关卡范围内 */
function fly(game, dt) {
  const { player: p, input, level } = game;
  const speed = game.data.cheat.flySpeed;
  const dirX = (input.held('right') ? 1 : 0) - (input.held('left') ? 1 : 0);
  const dirY = (input.held('down') ? 1 : 0) - (input.held('up') || input.held('jump') ? 1 : 0);
  p.vx = dirX * speed;
  p.vy = 0;
  p.onGround = false;
  p.x = Math.max(0, Math.min(level.width - p.w, p.x + p.vx * dt));
  p.y = Math.max(0, Math.min(level.height - p.h, p.y + dirY * speed * dt));
}

/**
 * 选择玩家的绘制图层（自下而上）：{ name, t } 按时间 t 播放，{ name, rest: true } 停在最后一帧。
 * 优先级：二段跳空翻 > 远程武器瞄准 / 开火（腿 + <攻击动作>_<方向>，边走边瞄时腿照常摆动）> 近战攻击 > 常态。
 */
export function playerSprite(p, time) {
  if (p.spinT > 0 && !p.onGround) return [{ name: 'player_spin', t: time }];
  const firing = p.attackAnim > 0;
  if (p.gun && (p.aim !== 'fwd' || firing)) {
    const legs = !p.onGround ? 'legs_jump' : p.vx ? 'legs_walk' : 'legs_idle';
    const upper = `${p.gun}_${p.aim}`;
    return [{ name: legs, t: time }, firing ? { name: upper, t: p.attackT } : { name: upper, rest: true }];
  }
  if (firing) return [{ name: p.attackSprite, t: p.attackT }];
  if (!p.onGround) return [{ name: 'player_jump', t: time }];
  return [{ name: p.vx ? 'player_walk' : 'player_idle', t: time }];
}

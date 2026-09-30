/**
 * 玩家实体：移动、可变高度跳跃、攻击与换武器输入、坠崖复活。
 * 持久属性（等级/经验/生命）跨关卡保留，位置类状态在每关开始时重置。
 */
import { moveAndCollide } from '../systems/physics.js';
import { statsFor } from '../systems/leveling.js';
import { hurtPlayer, playerAttack } from '../systems/combat.js';

const MOVE_SPEED = 100;
const JUMP_SPEED = 330; // 满跳约 3.7 格高
const JUMP_CUT = 120; // 提前松开跳跃键时截断上升速度
const FALL_DAMAGE = 2;

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
    invuln: 0, knock: 0, attackCd: 0, attackAnim: 0, safe: { ...pos },
  });
}

export function updatePlayer(game, dt) {
  const { player: p, input, inventory, level } = game;
  p.invuln -= dt;
  p.knock -= dt;
  p.attackCd -= dt;
  p.attackAnim -= dt;

  // 击退期间保留击退速度，不响应左右输入
  if (p.knock <= 0) {
    const dir = (input.held('right') ? 1 : 0) - (input.held('left') ? 1 : 0);
    p.vx = dir * MOVE_SPEED;
    if (dir) p.facing = dir;
  }
  if (input.hit('jump') && p.onGround) p.vy = -JUMP_SPEED;
  if (!input.held('jump') && p.vy < -JUMP_CUT) p.vy = -JUMP_CUT;

  moveAndCollide(p, level, dt);
  if (p.onGround && level.isFirmlyGrounded(p)) p.safe = { x: p.x, y: p.y };
  if (p.y > level.height) {
    Object.assign(p, { ...p.safe, vx: 0, vy: 0 });
    hurtPlayer(game, FALL_DAMAGE, null, true);
  }

  const slot = input.digit();
  if (slot) inventory.selectSlot(slot);
  if (input.hit('prev')) inventory.cycle(-1);
  if (input.hit('next')) inventory.cycle(1);

  // 按住攻击键按武器冷却自动连发
  if (input.held('attack') && p.attackCd <= 0) {
    const weapon = inventory.current;
    if (inventory.consume()) {
      p.attackCd = weapon.cooldown;
      p.attackAnim = 0.15;
      playerAttack(game, weapon);
    } else {
      p.attackCd = 0.4;
      game.toast(`${weapon.name} 没有弹药！按 1 切回拳击`);
    }
  }
}

/** 根据状态选择精灵名 */
export function playerSprite(p) {
  if (p.attackAnim > 0) return 'player_attack';
  if (!p.onGround) return 'player_jump';
  return p.vx ? 'player_walk' : 'player_idle';
}

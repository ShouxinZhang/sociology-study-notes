/**
 * 拾取物：心（回血）、弹药箱（枪械补弹）、武器、宝箱（触碰后弹出内容物）。
 */
import { moveAndCollide, overlap } from '../systems/physics.js';

const POP_SPEED = -220;
const POP_DELAY = 0.4; // 弹出物短暂不可拾取，让玩家看清得到了什么

/** 以中心点 (cx, cy) 创建；extra 可含 content / weaponId / sprite / vy / delay */
export function createPickup(kind, cx, cy, extra = {}) {
  const [w, h] = kind === 'chest' ? [14, 9] : [12, 12];
  return { kind, sprite: kind, w, h, x: cx - w / 2, y: cy - h / 2, vx: 0, vy: 0, delay: 0, t: Math.random() * 6, ...extra };
}

export function updatePickups(game, dt) {
  for (const it of game.pickups) {
    it.t += dt;
    it.delay -= dt;
    moveAndCollide(it, game.level, dt);
    if (it.y > game.level.height) it.dead = true;
    else if (it.delay <= 0 && overlap(it, game.player)) it.dead = collect(game, it);
  }
  game.pickups = game.pickups.filter((it) => !it.dead);
}

/** 执行拾取效果；返回 false 表示暂不能拾取（保留在地上） */
function collect(game, it) {
  const { player: p, inventory } = game;
  switch (it.kind) {
    case 'heart': {
      const heal = game.data.progression.heartHeal;
      p.hp = Math.min(p.maxHp, p.hp + heal);
      game.toast(`+${heal} HP`);
      game.sfx('pickup_heart');
      return true;
    }
    case 'ammo':
      if (!inventory.refill()) return false;
      game.toast('弹药补充！');
      game.sfx('pickup_ammo');
      return true;
    case 'weapon':
      game.toast(`获得武器：${inventory.add(it.weaponId).name}`);
      game.sfx('pickup_weapon');
      return true;
    case 'chest':
      game.pickups.push(openChest(game, it));
      game.toast('打开宝箱！');
      game.sfx('chest_open');
      return true;
    default:
      return true;
  }
}

/** 宝箱内容为武器 id 时弹出武器，否则按拾取物种类（heart/ammo）弹出 */
function openChest(game, chest) {
  const cx = chest.x + chest.w / 2;
  const pop = { vy: POP_SPEED, delay: POP_DELAY };
  const weapon = game.inventory.byId(chest.content);
  return weapon
    ? createPickup('weapon', cx, chest.y, { ...pop, weaponId: weapon.id, sprite: weapon.icon })
    : createPickup(chest.content, cx, chest.y, pop);
}

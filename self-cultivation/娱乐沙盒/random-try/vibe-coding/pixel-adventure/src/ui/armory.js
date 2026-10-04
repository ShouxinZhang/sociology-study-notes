/**
 * 装备栏（状态 armory，游戏暂停）：在军械库网格中选择武器，再按 1/2/3、点击槽位或 Enter（当前槽）装备。
 * 方向键 / 鼠标悬停移动选择；Tab / I / Esc 关闭并回到游戏。
 */
import { armoryCells, ARMORY_SLOTS, ARMORY_COLS, hitRect } from './layout.js';

export function openArmory(game) {
  const index = game.data.weapons.findIndex((w) => w.id === game.inventory.currentId);
  game.armory = { index: Math.max(0, index) };
  game.state = 'armory';
  game.sfx('ui_confirm');
}

/** 网格内移动选择：左右逐个循环，上下按列跳行（越界则停在原地） */
function move(a, input, n) {
  if (input.hit('left')) a.index = (a.index + n - 1) % n;
  if (input.hit('right')) a.index = (a.index + 1) % n;
  if (input.hit('up') && a.index - ARMORY_COLS >= 0) a.index -= ARMORY_COLS;
  if (input.hit('down') && a.index + ARMORY_COLS < n) a.index += ARMORY_COLS;
}

/** 本帧要装备到的槽位：数字键 1-3 > 点击槽位 > Enter（当前槽）；没有则返回 -1 */
function targetSlot(input, inventory) {
  const digit = input.digit();
  if (digit >= 1 && digit <= ARMORY_SLOTS.length) return digit - 1;
  const clicked = hitRect(ARMORY_SLOTS, input.click);
  if (clicked >= 0) return clicked;
  return input.hit('confirm') ? inventory.slot : -1;
}

export function updateArmory(game) {
  const { input, inventory, data } = game;
  const a = game.armory;
  if (input.hit('armory') || input.hit('back')) {
    game.state = 'playing';
    game.sfx('ui_confirm');
    return;
  }
  const cells = armoryCells(data.weapons.length);
  move(a, input, data.weapons.length);
  const hover = input.moved ? hitRect(cells, input.pointer) : -1;
  if (hover >= 0) a.index = hover;
  const clicked = hitRect(cells, input.click);
  if (clicked >= 0) a.index = clicked;

  const slot = targetSlot(input, inventory);
  if (slot < 0) return;
  const weapon = data.weapons[a.index];
  if (inventory.equip(weapon.id, slot)) {
    game.sfx('weapon_switch');
    game.toast(`${weapon.name} → 槽位 ${slot + 1}`);
  } else {
    game.sfx('ammo_empty');
    game.toast('尚未获得该武器');
  }
}

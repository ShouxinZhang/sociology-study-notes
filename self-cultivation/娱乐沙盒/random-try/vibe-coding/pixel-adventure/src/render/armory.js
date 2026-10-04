/**
 * 装备栏画面：半透明遮罩上绘制军械库网格、3 个常备槽位与选中武器说明。
 * 位置全部来自 ui/layout.js，与鼠标命中检测一致。选中用加粗边框表示（不反色，否则墨色图标会看不见）。
 */
import { text, panel } from './draw-kit.js';
import { armoryCells, ARMORY_SLOTS, ARMORY_INFO } from '../ui/layout.js';

const TYPE_LABEL = { melee: '近战', ranged: '枪械', strike: '呼叫支援' };

function icon(ui, name, x, y, size) {
  ui.ctx.imageSmoothingEnabled = false;
  ui.ctx.drawImage(ui.sprites[name].frames[0], x, y, size, size);
}

function ammoLabel(game, w) {
  if (w.type === 'melee') return '不耗弹药';
  return `弹药 ${game.cheat ? '∞' : game.inventory.ammoOf(w)}`;
}

/** 武器说明：类型、伤害、冷却与 weapons.json 中可选的 desc */
function drawInfo(ui, game, w) {
  const { x, y, w: bw, h } = ARMORY_INFO;
  panel(ui, x, y, bw, h, 3);
  if (!game.inventory.owns(w.id)) return text(ui, '？？？ 尚未获得：击落飞行胶囊、打开宝箱或营救俘虏获取', x + 20, y + 38, { box: false });
  text(ui, `${w.name} · ${TYPE_LABEL[w.type]}`, x + 20, y + 14, { size: 22, box: false });
  text(ui, `伤害 ${w.damage}   冷却 ${w.cooldown}s   ${ammoLabel(game, w)}`, x + bw - 20, y + 18, { align: 'right', box: false });
  if (w.desc) text(ui, w.desc, x + 20, y + 56, { size: 16, box: false });
}

export function drawArmory(ui, game) {
  const { ctx, colors, width, height } = ui;
  const { inventory, data } = game;
  const index = game.armory.index;
  ctx.globalAlpha = 0.7;
  ctx.fillStyle = colors.ink;
  ctx.fillRect(0, 0, width, height);
  ctx.globalAlpha = 1;
  panel(ui, 36, 20, width - 72, height - 40, 4);
  text(ui, '装备栏 · 常备 3 槽', width / 2, 40, { align: 'center', size: 28, box: false });

  // 军械库：未获得的武器显示问号；已装备的武器右上角标出槽位号
  armoryCells(data.weapons.length).forEach((r, i) => {
    const w = data.weapons[i];
    panel(ui, r.x, r.y, r.w, r.h, i === index ? 7 : 2);
    if (!inventory.owns(w.id)) return text(ui, '?', r.x + r.w / 2, r.y + 26, { align: 'center', size: 36, box: false });
    icon(ui, w.icon, r.x + 18, r.y + 6, 56);
    text(ui, w.name, r.x + r.w / 2, r.y + r.h - 22, { align: 'center', size: 14, box: false });
    const slot = inventory.loadout.indexOf(w.id);
    if (slot >= 0) text(ui, String(slot + 1), r.x + r.w - 10, r.y + 8, { align: 'right', size: 16, box: false });
  });

  // 常备槽位：当前使用中的槽位加粗边框并标注
  ARMORY_SLOTS.forEach((r, i) => {
    const w = inventory.byId(inventory.loadout[i]);
    const active = i === inventory.slot;
    panel(ui, r.x, r.y, r.w, r.h, active ? 7 : 2);
    text(ui, String(i + 1), r.x + 16, r.y + 32, { size: 26, box: false });
    if (active) text(ui, '使用中', r.x + r.w - 14, r.y + 12, { align: 'right', size: 14, box: false });
    if (!w) return text(ui, '（空槽）', r.x + 70, r.y + 34, { size: 18, box: false });
    icon(ui, w.icon, r.x + 52, r.y + 14, 64);
    text(ui, w.name, r.x + 130, r.y + 22, { size: 20, box: false });
    text(ui, ammoLabel(game, w), r.x + 130, r.y + 52, { size: 15, box: false });
  });

  drawInfo(ui, game, data.weapons[index]);
  text(ui, '方向键 / 鼠标 选武器 · 1 2 3 或点击槽位 装备 · Enter 装进当前槽 · Tab / Esc 返回', width / 2, height - 52, { align: 'center', size: 14, box: false });
}

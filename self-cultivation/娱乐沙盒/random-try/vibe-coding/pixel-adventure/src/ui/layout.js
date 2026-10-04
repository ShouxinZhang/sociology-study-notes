/**
 * 菜单界面布局（显示画布像素坐标，960×576）。
 * 逻辑层用它做鼠标命中检测，渲染层用它绘制，两边共用一份，保证“看到的按钮”就是“点得到的按钮”。
 */
export const SCREEN_W = 960;
export const SCREEN_H = 576;

/** 音乐馆、设置页左上角的返回按钮 */
export const BACK_BUTTON = { x: 24, y: 20, w: 120, h: 40, label: '← 返回' };

/** 主菜单按钮：id 对应 screens.js 中的动作 */
const MENU_BTN = { w: 320, h: 52, top: 236, step: 68 };
export const MAIN_MENU = [
  { id: 'start', label: '开始游戏' },
  { id: 'levels', label: '选择关卡' },
  { id: 'jukebox', label: '音乐馆' },
  { id: 'settings', label: '设置' },
].map((item, i) => ({ ...item, x: (SCREEN_W - MENU_BTN.w) / 2, y: MENU_BTN.top + i * MENU_BTN.step, w: MENU_BTN.w, h: MENU_BTN.h }));

/** 竖排列表行：从 top 起逐行排列，左右各留 50 像素 */
function listRects(count, top, h, gap) {
  return Array.from({ length: count }, (_, i) => ({ x: 50, y: top + i * (h + gap), w: SCREEN_W - 100, h }));
}

/** 音乐馆曲目行 */
export const trackRects = (count) => listRects(count, 72, 30, 2);

/** 关卡选择行 */
export const levelRects = (count) => listRects(count, 86, 50, 8);

/** 音乐馆底部频谱区域 */
export const SPECTRUM = { x: 50, y: 466, w: SCREEN_W - 100, h: 60 };

/** 点 p 落在哪个矩形内，返回下标；p 为空或未命中返回 -1 */
export function hitRect(rects, p) {
  if (!p) return -1;
  return rects.findIndex((r) => p.x >= r.x && p.x < r.x + r.w && p.y >= r.y && p.y < r.y + r.h);
}

/** 装备栏：左侧军械库网格（4 列），右侧 3 个常备槽位，底部为选中武器说明 */
const ARMORY_CELL = { size: 92, gap: 10, cols: 4, left: 60, top: 96 };
export const armoryCells = (count) =>
  Array.from({ length: count }, (_, i) => ({
    x: ARMORY_CELL.left + (i % ARMORY_CELL.cols) * (ARMORY_CELL.size + ARMORY_CELL.gap),
    y: ARMORY_CELL.top + Math.floor(i / ARMORY_CELL.cols) * (ARMORY_CELL.size + ARMORY_CELL.gap),
    w: ARMORY_CELL.size,
    h: ARMORY_CELL.size,
  }));
export const ARMORY_COLS = ARMORY_CELL.cols;
export const ARMORY_SLOTS = [0, 1, 2].map((i) => ({ x: 560, y: 96 + i * 104, w: 340, h: 92 }));
export const ARMORY_INFO = { x: 60, y: 420, w: 840, h: 96 };

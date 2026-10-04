/**
 * 菜单界面布局（显示画布像素坐标，960×576）。
 * 逻辑层用它做鼠标命中检测，渲染层用它绘制，两边共用一份，保证“看到的按钮”就是“点得到的按钮”。
 */
export const SCREEN_W = 960;
export const SCREEN_H = 576;

/** 音乐馆、设置页左上角的返回按钮 */
export const BACK_BUTTON = { x: 24, y: 20, w: 120, h: 40, label: '← 返回' };

/** 主菜单按钮：id 对应 main-menu.js 中的动作 */
const MENU_BTN = { w: 320, h: 56, top: 260, step: 76 };
export const MAIN_MENU = [
  { id: 'start', label: '开始游戏' },
  { id: 'jukebox', label: '音乐馆' },
  { id: 'settings', label: '设置' },
].map((item, i) => ({ ...item, x: (SCREEN_W - MENU_BTN.w) / 2, y: MENU_BTN.top + i * MENU_BTN.step, w: MENU_BTN.w, h: MENU_BTN.h }));

/** 音乐馆曲目行：从 y=76 起逐行排列 */
const ROW = { x: 50, y: 76, w: SCREEN_W - 100, h: 32, gap: 2 };
export function trackRects(count) {
  return Array.from({ length: count }, (_, i) => ({ x: ROW.x, y: ROW.y + i * (ROW.h + ROW.gap), w: ROW.w, h: ROW.h }));
}

/** 音乐馆底部频谱区域 */
export const SPECTRUM = { x: 50, y: 466, w: SCREEN_W - 100, h: 60 };

/** 点 p 落在哪个矩形内，返回下标；p 为空或未命中返回 -1 */
export function hitRect(rects, p) {
  if (!p) return -1;
  return rects.findIndex((r) => p.x >= r.x && p.x < r.x + r.w && p.y >= r.y && p.y < r.y + r.h);
}

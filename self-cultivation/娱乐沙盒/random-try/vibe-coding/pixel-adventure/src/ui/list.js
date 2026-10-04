/**
 * 菜单通用交互：竖排列表的键盘 / 鼠标选择，以及“返回”判定。
 */
import { BACK_BUTTON, hitRect } from './layout.js';

/**
 * 竖排列表：↑↓ 循环移动、鼠标悬停即选中、Enter 或点击确认。
 * state = { index }（原地修改）；返回本帧被确认的下标，没有则返回 -1。
 */
export function updateList(state, input, rects) {
  const n = rects.length;
  if (input.hit('up')) state.index = (state.index + n - 1) % n;
  if (input.hit('down')) state.index = (state.index + 1) % n;
  const hover = input.moved ? hitRect(rects, input.pointer) : -1;
  if (hover >= 0) state.index = hover;

  const clicked = hitRect(rects, input.click);
  if (clicked >= 0) return (state.index = clicked);
  return input.hit('confirm') ? state.index : -1;
}

/** Esc 或点击左上角返回按钮 */
export function backPressed(input) {
  return input.hit('back') || hitRect([BACK_BUTTON], input.click) === 0;
}

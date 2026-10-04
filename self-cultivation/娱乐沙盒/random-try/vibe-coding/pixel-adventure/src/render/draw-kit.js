/**
 * 高分辨率 UI 层的绘图小工具：文字、描边面板、进度条、按钮。HUD 与菜单界面共用。
 * ui = { ctx, sprites, colors: { ink, paper }, width, height }
 */
export const FONT = '"Noto Sans Mono CJK SC", "WenQuanYi Micro Hei Mono", "Courier New", monospace';

/** 文字；box 为 true 时先垫一块纸色底，color 默认墨色 */
export function text(ui, str, x, y, { size = 16, align = 'left', box = true, color = ui.colors.ink } = {}) {
  const { ctx, colors } = ui;
  ctx.font = `bold ${size}px ${FONT}`;
  ctx.textAlign = align;
  ctx.textBaseline = 'top';
  if (box) {
    const w = ctx.measureText(str).width;
    const left = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
    ctx.fillStyle = colors.paper;
    ctx.fillRect(left - 6, y - 4, w + 12, size + 8);
  }
  ctx.fillStyle = color;
  ctx.fillText(str, x, y);
}

/** 带墨色描边的面板 */
export function panel(ui, x, y, w, h, border = 3) {
  const { ctx, colors } = ui;
  ctx.fillStyle = colors.paper;
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = colors.ink;
  ctx.lineWidth = border;
  ctx.strokeRect(x + border / 2, y + border / 2, w - border, h - border);
}

export function bar(ui, x, y, w, h, ratio) {
  panel(ui, x, y, w, h, 2);
  ui.ctx.fillStyle = ui.colors.ink;
  ui.ctx.fillRect(x + 3, y + 3, (w - 6) * Math.max(0, Math.min(1, ratio)), h - 6);
}

/** 按钮底板：选中时反色（墨底），返回应使用的文字颜色 */
export function button(ui, r, selected) {
  panel(ui, r.x, r.y, r.w, r.h, selected ? 4 : 2);
  if (!selected) return ui.colors.ink;
  ui.ctx.fillStyle = ui.colors.ink;
  ui.ctx.fillRect(r.x, r.y, r.w, r.h);
  return ui.colors.paper;
}

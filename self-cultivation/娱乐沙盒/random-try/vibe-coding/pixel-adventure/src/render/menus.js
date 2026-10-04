/**
 * 菜单界面渲染：主菜单、关卡选择、音乐馆曲目表与实时频谱、设置页按键说明。
 * 按钮位置全部来自 ui/layout.js，与鼠标命中检测一致。
 */
import { frameAt } from '../core/sprites.js';
import { text, panel, button } from './draw-kit.js';
import { MAIN_MENU, BACK_BUTTON, SPECTRUM, trackRects, levelRects, hitRect } from '../ui/layout.js';

const CONTROLS = [
  '← → / A D   移动', '空格 / K   跳跃（空中再按：二段跳）', 'J   攻击（按住连发）',
  '↑ / W 向上瞄准   空中 ↓ 向下瞄准', '1-9 / Q E   切换武器', 'F1   作弊模式（方向键飞行）', 'M 静音   - / = 音量',
];

/** 纸色清屏 */
function clear(ui) {
  ui.ctx.fillStyle = ui.colors.paper;
  ui.ctx.fillRect(0, 0, ui.width, ui.height);
}

/** 按钮 + 居中文字 */
function labeledButton(ui, r, label, selected, size = 22) {
  const color = button(ui, r, selected);
  text(ui, label, r.x + r.w / 2, r.y + (r.h - size) / 2, { align: 'center', size, box: false, color });
}

/** 页眉：左上返回按钮（鼠标悬停时反色）+ 居中标题 */
function header(ui, input, title) {
  labeledButton(ui, BACK_BUTTON, BACK_BUTTON.label, hitRect([BACK_BUTTON], input.pointer) === 0, 18);
  text(ui, title, ui.width / 2, 24, { align: 'center', size: 28, box: false });
}

function footer(ui, hint) {
  text(ui, hint, ui.width / 2, ui.height - 34, { align: 'center', size: 14, box: false });
}

function drawMainMenu(ui, game) {
  clear(ui);
  const hero = ui.sprites.player_walk;
  ui.ctx.imageSmoothingEnabled = false;
  ui.ctx.drawImage(hero.frames[frameAt(hero, game.time)], ui.width / 2 - 48, 40, 96, 96);
  text(ui, '黑白冒险岛', ui.width / 2, 160, { align: 'center', size: 44, box: false });
  const selected = game.menu?.index ?? 0;
  MAIN_MENU.forEach((b, i) => labeledButton(ui, b, b.label, i === selected));
  footer(ui, '↑↓ 选择 · Enter 确认 · 也可用鼠标点击');
}

// 频谱读数缓冲区，按分析器的频段数懒创建并复用
let bins = null;

function drawSpectrum(ui, analyser) {
  const { x, y, w, h } = SPECTRUM;
  panel(ui, x, y, w, h, 2);
  if (!analyser) return;
  if (bins?.length !== analyser.frequencyBinCount) bins = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(bins);
  const slot = (w - 12) / bins.length;
  ui.ctx.fillStyle = ui.colors.ink;
  bins.forEach((v, i) => {
    const barH = Math.max(2, (v / 255) * (h - 12));
    ui.ctx.fillRect(x + 6 + i * slot + 1, y + h - 6 - barH, slot - 2, barH);
  });
}

function drawJukebox(ui, game) {
  clear(ui);
  const { tracks, index } = game.jukebox;
  header(ui, game.input, `音乐馆 · ${tracks.length} 首`);
  const playing = game.audio?.nowPlaying();
  trackRects(tracks.length).forEach((r, i) => {
    const t = tracks[i];
    const color = button(ui, r, i === index);
    const opt = { size: 16, box: false, color };
    const y = r.y + 8;
    text(ui, `${t.id === playing ? '▶' : ' '} ${String(i + 1).padStart(2, '0')}  ${t.title ?? t.id}`, r.x + 14, y, opt);
    text(ui, t.author ?? '', r.x + 400, y, opt);
    text(ui, t.usage ?? '', r.x + r.w - 14, y, { ...opt, align: 'right' });
  });
  drawSpectrum(ui, game.audio?.mixer.analyser);
  footer(ui, '↑↓ 选择 · Enter / 点击 播放 · ← → 上一首 / 下一首 · Esc 返回');
}

function drawSettings(ui, game) {
  clear(ui);
  header(ui, game.input, '设置 · 按键说明');
  const boxW = 560;
  const boxH = 40 + CONTROLS.length * 36;
  const x = (ui.width - boxW) / 2;
  panel(ui, x, 100, boxW, boxH, 4);
  CONTROLS.forEach((line, i) => text(ui, line, ui.width / 2, 124 + i * 36, { align: 'center', size: 18, box: false }));
  footer(ui, 'Esc / Enter / 点击返回 回到主菜单');
}

/** 关卡所属世界：沿用该关及之前最近一次 worldIntro 的标题，第一个世界称“冒险岛” */
function worldOf(levelDefs, i) {
  for (let k = i; k >= 0; k--) if (levelDefs[k].worldIntro) return levelDefs[k].worldIntro.title;
  return '冒险岛';
}

function drawLevelSelect(ui, game) {
  clear(ui);
  header(ui, game.input, '选择关卡');
  const defs = game.levelDefs;
  const index = game.levelSelect?.index ?? 0;
  levelRects(defs.length).forEach((r, i) => {
    const color = button(ui, r, i === index);
    const opt = { size: 22, box: false, color };
    const y = r.y + (r.h - 22) / 2;
    text(ui, `第 ${i + 1} 关   ${defs[i].name}`, r.x + 24, y, opt);
    text(ui, `${worldOf(defs, i)}${defs[i].requireBoss ? ' · BOSS' : ''}`, r.x + r.w - 24, y, { ...opt, size: 18, align: 'right' });
  });
  footer(ui, '↑↓ 选择 · Enter / 点击 进入 · 等级与武器保持当前状态 · Esc 返回');
}

const MENUS = { title: drawMainMenu, levels: drawLevelSelect, jukebox: drawJukebox, settings: drawSettings };

/** 当前状态是菜单界面时整屏绘制，否则不做任何事 */
export function drawMenus(ui, game) {
  MENUS[game.state]?.(ui, game);
}

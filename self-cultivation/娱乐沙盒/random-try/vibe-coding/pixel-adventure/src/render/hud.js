/**
 * HUD 与关卡内全屏界面：等级/血量/经验、当前武器与弹药、武器栏、提示横幅，以及过场/失败/过关/通关画面。
 * 主菜单、音乐馆、设置页见 menus.js。ui = { ctx, sprites, colors: { ink, paper }, width, height }
 */
import { expToNext } from '../systems/leveling.js';
import { frameAt } from '../core/sprites.js';
import { text, panel, bar } from './draw-kit.js';

function icon(ui, sprite, x, y, size) {
  ui.ctx.imageSmoothingEnabled = false;
  ui.ctx.drawImage(sprite.frames[0], x, y, size, size);
}

export function drawHud(ui, game) {
  const { player: p, inventory, data } = game;
  const { width, sprites } = ui;

  // 左上：等级、生命、经验
  const need = expToNext(p.level, data.progression);
  panel(ui, 12, 12, 250, 74);
  text(ui, `LV ${p.level}`, 24, 20, { box: false });
  text(ui, `HP ${p.hp}/${p.maxHp}`, 110, 20, { box: false });
  bar(ui, 24, 44, 226, 16, p.hp / p.maxHp);
  bar(ui, 24, 66, 226, 10, need === Infinity ? 1 : p.exp / need);

  // 右上：当前武器与弹药
  const weapon = inventory.current;
  const ammo = game.cheat ? Infinity : inventory.ammoOf(weapon);
  panel(ui, width - 232, 12, 220, 74);
  icon(ui, sprites[weapon.icon], width - 76, 20, 56);
  text(ui, weapon.name, width - 88, 22, { align: 'right', box: false });
  text(ui, weapon.type === 'melee' ? '近战' : `弹药 ${ammo === Infinity ? '∞' : ammo}`, width - 88, 50, { align: 'right', box: false });
  if (game.cheat) text(ui, 'CHEAT', width - 122, 96, { align: 'center', size: 14 });
  if (game.audio?.mixer.muted) text(ui, '静音', 40, 96, { align: 'center', size: 14 });
  if (p.shield > 0) text(ui, `护盾 ${Math.ceil(p.shield)}s`, 130, 96, { align: 'center', size: 14 });

  // 顶部居中：武器栏（数字键对应槽位，未获得显示为空槽）
  const slotsLeft = (width - data.weapons.length * 48) / 2;
  data.weapons.forEach((w, i) => {
    const x = slotsLeft + i * 48;
    const y = 26;
    panel(ui, x, y, 44, 44, w.id === weapon.id ? 5 : 2);
    if (inventory.owns(w.id)) icon(ui, sprites[w.icon], x + 8, y + 8, 28);
    text(ui, String(i + 1), x + 6, y + 4, { size: 11, box: false });
  });

  if (game.banner) text(ui, game.banner.text, width / 2, 104, { align: 'center', size: 20 });
}

const SCREENS = {
  intro: (g) => {
    const intro = g.levelDefs[g.levelIndex].worldIntro;
    return { title: intro.title, lines: [...intro.lines, '', '按 Enter 出发'] };
  },
  gameover: (g) => ({ title: '你倒下了', lines: [`第 ${g.levelIndex + 1} 关 · ${g.level.name}`, '', '按 Enter 重试本关'] }),
  clear: (g) => ({ title: `第 ${g.levelIndex + 1} 关 通过！`, lines: [`当前等级 LV ${g.player.level}`, '', '按 Enter 进入下一关'] }),
  victory: (g) => ({
    title: '全部通关！',
    lines: [`最终等级 LV ${g.player.level}`, `武器收集 ${g.inventory.owned.length}/${g.data.weapons.length}`, '', '按 Enter 重新开始'],
  }),
};

export function drawOverlay(ui, game) {
  const screen = SCREENS[game.state]?.(game);
  if (!screen) return;
  const { ctx, colors, width, height, sprites } = ui;

  if (game.state === 'intro') {
    ctx.fillStyle = colors.paper;
    ctx.fillRect(0, 0, width, height);
    const hero = sprites.runner;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(hero.frames[frameAt(hero, game.time)], width / 2 - 48, 24, 96, 96);
  } else {
    // 半透明墨色遮罩
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = colors.ink;
    ctx.fillRect(0, 0, width, height);
    ctx.globalAlpha = 1;
  }

  const boxW = 520;
  const boxH = 96 + screen.lines.length * 30;
  const x = (width - boxW) / 2;
  const y = game.state === 'intro' ? 136 : (height - boxH) / 2;
  panel(ui, x, y, boxW, boxH, 4);
  text(ui, screen.title, width / 2, y + 22, { align: 'center', size: 32, box: false });
  screen.lines.forEach((line, i) => text(ui, line, width / 2, y + 76 + i * 30, { align: 'center', size: 18, box: false }));
}

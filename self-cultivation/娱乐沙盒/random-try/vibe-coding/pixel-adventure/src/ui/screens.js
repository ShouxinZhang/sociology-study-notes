/**
 * 菜单界面入口：主菜单（开始游戏 / 音乐馆 / 设置）与设置页逻辑，
 * 并导出 UI_SCREENS 注册表，game.js 按状态名分发到对应界面的 update。
 */
import { MAIN_MENU } from './layout.js';
import { updateList, backPressed } from './list.js';
import { openJukebox, updateJukebox } from './jukebox.js';

/** 主菜单按钮 id → 动作 */
const ACTIONS = {
  start: (game) => game.startLevel(0),
  jukebox: (game) => openJukebox(game),
  settings: (game) => game.enter('settings'),
};

function updateMainMenu(game) {
  game.menu ??= { index: 0 };
  const chosen = updateList(game.menu, game.input, MAIN_MENU);
  if (chosen < 0) return;
  game.sfx('ui_confirm');
  ACTIONS[MAIN_MENU[chosen].id](game);
}

/** 设置页目前只展示按键说明：Esc / Enter / 返回按钮回主菜单 */
function updateSettings(game) {
  if (!backPressed(game.input) && !game.input.hit('confirm')) return;
  game.sfx('ui_confirm');
  game.enter('title');
}

/** 游戏状态名 → 界面 update；title 即主菜单 */
export const UI_SCREENS = { title: updateMainMenu, jukebox: updateJukebox, settings: updateSettings };

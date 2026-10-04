/**
 * 菜单界面入口：主菜单（开始游戏 / 选择关卡 / 音乐馆 / 设置）、关卡选择与设置页逻辑，关卡内的装备栏，
 * 并导出 UI_SCREENS 注册表，game.js 按状态名分发到对应界面的 update。
 */
import { MAIN_MENU, levelRects } from './layout.js';
import { updateList, backPressed } from './list.js';
import { openJukebox, updateJukebox } from './jukebox.js';
import { updateArmory } from './armory.js';

/** 主菜单按钮 id → 动作 */
const ACTIONS = {
  start: (game) => game.startLevel(0),
  levels: (game) => {
    game.levelSelect ??= { index: 0 };
    game.enter('levels');
  },
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

/** 关卡选择：全部关卡开放，人物等级与武器保持当前状态（不额外发放） */
function updateLevelSelect(game) {
  if (backPressed(game.input)) {
    game.sfx('ui_confirm');
    game.enter('title');
    return;
  }
  const chosen = updateList(game.levelSelect, game.input, levelRects(game.levelDefs.length));
  if (chosen < 0) return;
  game.sfx('ui_confirm');
  game.jumpToLevel(chosen);
}

/** 设置页目前只展示按键说明：Esc / Enter / 返回按钮回主菜单 */
function updateSettings(game) {
  if (!backPressed(game.input) && !game.input.hit('confirm')) return;
  game.sfx('ui_confirm');
  game.enter('title');
}

/** 游戏状态名 → 界面 update；title 即主菜单 */
export const UI_SCREENS = { title: updateMainMenu, levels: updateLevelSelect, jukebox: updateJukebox, settings: updateSettings, armory: updateArmory };

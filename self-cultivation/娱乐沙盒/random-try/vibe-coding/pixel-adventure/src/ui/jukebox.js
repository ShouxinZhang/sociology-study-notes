/**
 * 音乐馆：列出 music.json 中的全部曲目，选中即切换播放（沿用 MusicPlayer 的淡入淡出）。
 * ↑↓ / 鼠标选曲，Enter / 点击播放，← → 直接播放上一首 / 下一首，Esc / 返回按钮回主菜单。
 */
import { trackRects } from './layout.js';
import { updateList, backPressed } from './list.js';

/** 曲目列表：保持 music.json 的登记顺序，附带展示字段 title / author / usage */
function trackList(game) {
  return Object.entries(game.data.music.tracks).map(([id, track]) => ({ id, ...track }));
}

/** 进入音乐馆，光标默认停在正在播放的曲目上 */
export function openJukebox(game) {
  const tracks = trackList(game);
  const playing = tracks.findIndex((t) => t.id === game.audio?.nowPlaying());
  game.jukebox = { tracks, index: Math.max(0, playing) };
  game.enter('jukebox');
}

export function updateJukebox(game) {
  const { input, jukebox: jb } = game;
  if (backPressed(input)) {
    game.sfx('ui_confirm');
    game.enter('title');
    return;
  }

  const n = jb.tracks.length;
  const step = (input.hit('right') ? 1 : 0) - (input.hit('left') ? 1 : 0);
  if (step) {
    jb.index = (jb.index + step + n) % n;
    game.music(jb.tracks[jb.index].id);
    return;
  }
  const chosen = updateList(jb, input, trackRects(n));
  if (chosen >= 0) game.music(jb.tracks[chosen].id);
}

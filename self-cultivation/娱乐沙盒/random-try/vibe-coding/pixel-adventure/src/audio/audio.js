/**
 * 音频系统入口：游戏逻辑只通过 sfx(name) / music(name) / mixer 访问音频。
 */
import { Mixer } from './mixer.js';
import { SfxPlayer } from './sfx.js';
import { MusicPlayer } from './music.js';

export function createAudio(assets, base = 'assets/audio/') {
  const mixer = new Mixer();
  const sfx = new SfxPlayer(mixer, assets.data.sfx);
  const music = new MusicPlayer(mixer, assets.data.music.tracks, base);
  return {
    mixer,
    sfx: (name) => sfx.play(name),
    music: (name) => music.play(name),
  };
}

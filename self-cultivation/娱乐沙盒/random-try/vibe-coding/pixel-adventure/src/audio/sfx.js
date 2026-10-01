/**
 * 音效播放器：启动时用 ZzFX 把 sfx.json 中的参数预合成为 AudioBuffer，
 * 播放时只做音高随机、节流（minInterval）与复音上限（maxVoices），防止作弊连射时爆音。
 */
import { ZZFX } from './vendor/zzfx.js';

const DEFAULTS = { volume: 1, minInterval: 0.02, maxVoices: 4, duck: false };
const DEFAULT_RANDOMNESS = 0.05; // ZzFX 第 2 个参数的默认值

export class SfxPlayer {
  constructor(mixer, defs) {
    this.mixer = mixer;
    this.sounds = {};
    for (const [name, def] of Object.entries(defs)) {
      if (name.startsWith('_')) continue; // 说明字段
      // JSON 无法表达 undefined，用 null 占位后在此还原为 ZzFX 默认值
      const params = def.zzfx.map((v) => v ?? undefined);
      const randomness = params[1] ?? DEFAULT_RANDOMNESS;
      params[1] = 0; // 预合成不带随机，随机性改由播放速率实现
      const samples = ZZFX.buildSamples(...params);
      const buffer = mixer.ctx.createBuffer(1, samples.length, ZZFX.sampleRate);
      buffer.getChannelData(0).set(samples);
      this.sounds[name] = { ...DEFAULTS, ...def, buffer, randomness, last: -Infinity, voices: 0 };
    }
  }

  play(name) {
    const s = this.sounds[name];
    const ctx = this.mixer.ctx;
    if (!s || ctx.state !== 'running') return;
    const now = ctx.currentTime;
    if (now - s.last < s.minInterval || s.voices >= s.maxVoices) return;
    s.last = now;
    s.voices += 1;

    const source = ctx.createBufferSource();
    source.buffer = s.buffer;
    source.playbackRate.value = 1 + s.randomness * (Math.random() * 2 - 1);
    const gain = ctx.createGain();
    gain.gain.value = s.volume;
    source.connect(gain).connect(this.mixer.sfxBus);
    source.onended = () => (s.voices -= 1);
    source.start();
    if (s.duck) this.mixer.duck();
  }
}

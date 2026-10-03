/**
 * 背景音乐：按需加载并解码曲目（同一文件只解码一次），场景切换时交叉淡入淡出。
 */
const FADE_OUT = 0.5;
const FADE_IN = 0.8;

export class MusicPlayer {
  constructor(mixer, tracks, base) {
    this.mixer = mixer;
    this.tracks = tracks;
    this.base = base;
    this.cache = new Map();
    this.track = null;
    this.current = null;
  }

  load(file) {
    if (!this.cache.has(file)) {
      const decoded = fetch(this.base + file)
        .then((res) => res.arrayBuffer())
        .then((data) => this.mixer.ctx.decodeAudioData(data));
      this.cache.set(file, decoded);
    }
    return this.cache.get(file);
  }

  /** 切换到指定曲目；name 为 null 时淡出静音；与当前曲目相同则不打断 */
  async play(name) {
    if (name === this.track) return;
    this.track = name;
    this.fadeOut();
    if (!name) return;

    const def = this.tracks[name];
    const buffer = await this.load(def.file).catch(() => null);
    if (!buffer || this.track !== name) return; // 加载期间已切到别的曲目

    const ctx = this.mixer.ctx;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = def.loop ?? true;
    source.loopStart = def.loopStart ?? 0; // 带前奏的曲目循环时跳过前奏
    source.loopEnd = buffer.duration;
    source.playbackRate.value = def.rate ?? 1;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(def.volume ?? 0.5, ctx.currentTime + FADE_IN);
    source.connect(gain).connect(this.mixer.musicBus);
    source.start();
    this.current = { source, gain };
  }

  fadeOut() {
    if (!this.current) return;
    const { source, gain } = this.current;
    const now = this.mixer.ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(0, now + FADE_OUT);
    source.stop(now + FADE_OUT);
    this.current = null;
  }
}

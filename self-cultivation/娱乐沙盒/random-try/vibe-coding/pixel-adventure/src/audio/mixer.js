/**
 * 混音器：共享 ZzFX 的 AudioContext，提供 master → (sfx, music) 两路总线、静音、音量与音乐闪避。
 * 浏览器要求用户手势后才能出声，因此在任意按键时恢复 AudioContext。
 */
import { ZZFX } from './vendor/zzfx.js';

const STORAGE_KEY = 'pixel-adventure.audio';
const VOLUME_STEP = 0.1;

function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {};
  } catch {
    return {};
  }
}

export class Mixer {
  constructor() {
    this.ctx = ZZFX.audioContext;
    const saved = loadSettings();
    this.muted = saved.muted ?? false;
    this.volume = saved.volume ?? 0.8;

    this.master = this.ctx.createGain();
    this.master.connect(this.ctx.destination);
    this.sfxBus = this.bus();
    // 音乐总线 → 频谱分析器 → master：分析器位于主音量之前，静音时频谱仍可显示
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 64;
    this.analyser.connect(this.master);
    this.musicBus = this.bus(this.analyser);
    this.apply();

    const resume = () => this.ctx.state !== 'running' && this.ctx.resume();
    window.addEventListener('keydown', resume);
    window.addEventListener('pointerdown', resume);
  }

  bus(output = this.master) {
    const gain = this.ctx.createGain();
    gain.connect(output);
    return gain;
  }

  apply() {
    this.master.gain.value = this.muted ? 0 : this.volume;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ muted: this.muted, volume: this.volume }));
  }

  toggleMute() {
    this.muted = !this.muted;
    this.apply();
  }

  changeVolume(dir) {
    this.volume = Math.round(Math.max(0, Math.min(1, this.volume + dir * VOLUME_STEP)) * 10) / 10;
    this.muted = false;
    this.apply();
  }

  /** 音乐临时压低 amount，duration 秒内恢复，用于突出爆炸、升级等关键音效 */
  duck(amount = 0.4, duration = 0.4) {
    const gain = this.musicBus.gain;
    const now = this.ctx.currentTime;
    gain.cancelScheduledValues(now);
    gain.setValueAtTime(gain.value, now);
    gain.linearRampToValueAtTime(1 - amount, now + 0.05);
    gain.linearRampToValueAtTime(1, now + duration);
  }
}

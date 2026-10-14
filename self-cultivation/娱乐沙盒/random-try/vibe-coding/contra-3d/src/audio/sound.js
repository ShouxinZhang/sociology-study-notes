/**
 * @file sound.js
 * @description 原创 WebAudio 合成音效与 8-bit 战术电子配乐引擎（零外部音频文件依赖）。
 */

import { GAME_STATE } from '../core/state.js';

export class SoundEngine {
  constructor() {
    this.ctx = null;
    this.bgmTimer = null;
    this.bgmStep = 0;
  }

  /**
   * 惰性初始化 AudioContext（浏览器要求用户交互后解锁）
   */
  _ensureContext() {
    if (GAME_STATE.muted) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * 播放枪械开火、爆头、拾取、爆炸等合成音效
   * @param {string} type 音效类型
   */
  play(type) {
    const ctx = this._ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'shoot_RIFLE' || type === 'shoot_M') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(type === 'shoot_M' ? 290 : 240, now);
      osc.frequency.exponentialRampToValueAtTime(55, now + 0.08);
      gain.gain.setValueAtTime(0.16, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'shoot_S') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(42, now + 0.14);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.14);
      osc.start(now);
      osc.stop(now + 0.14);
    } else if (type === 'shoot_L') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(980, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'shoot_F') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(38, now + 0.22);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === 'headshot') {
      // CSGO 风格清脆叮声爆头反馈
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1320, now);
      osc.frequency.setValueAtTime(1760, now + 0.04);
      gain.gain.setValueAtTime(0.26, now);
      gain.gain.exponentialRampToValueAtTime(0.008, now + 0.16);
      osc.start(now);
      osc.stop(now + 0.16);
    } else if (type === 'hit') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.05);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'jump' || type === 'jump2') {
      osc.type = 'sine';
      const base = type === 'jump2' ? 320 : 210;
      osc.frequency.setValueAtTime(base, now);
      osc.frequency.exponentialRampToValueAtTime(base * 1.9, now + 0.11);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.11);
      osc.start(now);
      osc.stop(now + 0.11);
    } else if (type === 'powerup') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(554, now + 0.06);
      osc.frequency.setValueAtTime(659, now + 0.12);
      osc.frequency.setValueAtTime(880, now + 0.18);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.28);
      osc.start(now);
      osc.stop(now + 0.28);
    } else if (type === 'explosion') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(24, now + 0.35);
      gain.gain.setValueAtTime(0.28, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'hurt') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.linearRampToValueAtTime(75, now + 0.18);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    }
  }

  /**
   * 启动芯片风格低音律动循环 BGM
   * @param {number} stageIdx 关卡序号
   */
  startBGM(stageIdx = 0) {
    this.stopBGM();
    const scales = [
      [110, 130.8, 146.8, 164.8, 146.8, 130.8, 98.0, 110],
      [98.0, 116.5, 130.8, 146.8, 138.6, 130.8, 87.3, 98.0],
      [82.4, 98.0, 110.0, 123.5, 116.5, 98.0, 73.4, 82.4]
    ];
    const notes = scales[stageIdx % scales.length];
    this.bgmStep = 0;

    this.bgmTimer = setInterval(() => {
      if (GAME_STATE.muted || GAME_STATE.mode !== 'playing') return;
      const ctx = this._ensureContext();
      if (!ctx) return;

      const freq = notes[this.bgmStep % notes.length];
      this.bgmStep++;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.055, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.19);
    }, 210);
  }

  stopBGM() {
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

export const sound = new SoundEngine();

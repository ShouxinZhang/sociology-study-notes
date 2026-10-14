/**
 * @file input.js
 * @description CSGO 风格键鼠输入与 PointerLock 鼠标视角锁定控制器。
 */

import { GAME_STATE, events } from './state.js';

export class InputController {
  /**
   * @param {HTMLCanvasElement} canvas 渲染画布
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.keys = new Set();
    this.justPressed = new Set();
    this.mouseDown = false;
    this.justShot = false;
    this.isLocked = false;

    // 鼠标视角欧拉角（yaw 水平旋转，pitch 垂直俯仰）
    this.yaw = 0;
    this.pitch = 0;
    this.sensitivity = 0.0021;

    this._bindEvents();
  }

  /**
   * 绑定浏览器键鼠与 PointerLock 事件
   */
  _bindEvents() {
    window.addEventListener('keydown', (e) => {
      if (!this.keys.has(e.code)) {
        this.justPressed.add(e.code);
      }
      this.keys.add(e.code);

      if (e.code === 'F1') {
        e.preventDefault();
        events.emit('toggle_cheat');
      }
      if (e.code.startsWith('Digit')) {
        const num = parseInt(e.code.replace('Digit', ''), 10);
        if (num >= 1 && num <= 5) {
          events.emit('select_weapon_slot', num - 1);
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.code);
    });

    window.addEventListener('mousedown', (e) => {
      if (e.button === 0 && this.isLocked && GAME_STATE.mode === 'playing') {
        this.mouseDown = true;
        this.justShot = true;
      }
    });

    window.addEventListener('mouseup', (e) => {
      if (e.button === 0) {
        this.mouseDown = false;
      }
    });

    window.addEventListener('wheel', (e) => {
      if (!this.isLocked || GAME_STATE.mode !== 'playing') return;
      events.emit('cycle_weapon', e.deltaY > 0 ? 1 : -1);
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isLocked || GAME_STATE.mode !== 'playing') return;
      this.yaw -= e.movementX * this.sensitivity;
      this.pitch -= e.movementY * this.sensitivity;
      const maxPitch = Math.PI / 2 - 0.08;
      this.pitch = Math.max(-maxPitch, Math.min(maxPitch, this.pitch));
    });

    document.addEventListener('pointerlockchange', () => {
      this.isLocked = document.pointerLockElement === this.canvas;
      if (!this.isLocked && GAME_STATE.mode === 'playing') {
        this.mouseDown = false;
        events.emit('pause_menu');
      }
    });
  }

  /**
   * 请求锁定鼠标指针进入第一人称操控
   */
  lockPointer() {
    if (document.pointerLockElement !== this.canvas && this.canvas.requestPointerLock) {
      try {
        const res = this.canvas.requestPointerLock();
        if (res && typeof res.catch === 'function') {
          res.catch(() => {});
        }
      } catch (_) {
        // 无头浏览器或未聚焦窗口忽略
      }
    }
  }

  /**
   * 释放鼠标指针
   */
  unlockPointer() {
    if (document.pointerLockElement) {
      document.exitPointerLock();
    }
  }

  /**
   * 消费单帧触发按键（如 Space 二段跳）
   * @param {string} code 按键码
   * @returns {boolean}
   */
  consumePress(code) {
    if (this.justPressed.has(code)) {
      this.justPressed.delete(code);
      return true;
    }
    return false;
  }

  /**
   * 每帧末尾清理瞬态输入
   */
  endFrame() {
    this.justPressed.clear();
    this.justShot = false;
  }
}

/**
 * @file state.js
 * @description 全局状态容器与轻量事件总线，负责解耦核心系统、实体与 UI。
 */

export const GAME_STATE = {
  mode: 'menu',         // 'menu' | 'playing' | 'stage_clear' | 'victory' | 'game_over'
  currentStageIdx: 0,   // 当前关卡索引 (0..2)
  score: 0,
  cheatMode: false,     // F1 作弊模式：无敌、无限弹药、全武器解锁、强化跳跃
  muted: false,
  timeElapsed: 0
};

/**
 * 简单事件发布订阅器，避免模块间循环引用
 */
class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  /**
   * 监听事件
   * @param {string} event 事件名
   * @param {Function} handler 回调函数
   */
  on(event, handler) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(handler);
  }

  /**
   * 触发事件
   * @param {string} event 事件名
   * @param {any} payload 载荷数据
   */
  emit(event, payload) {
    const list = this.listeners.get(event);
    if (!list) return;
    for (const fn of list) {
      fn(payload);
    }
  }
}

export const events = new EventBus();

/**
 * 键盘输入：区分“按住”（held）与“本帧刚按下”（hit），逻辑层只认动作名，不认具体按键。
 */
const BINDINGS = {
  left: ['ArrowLeft', 'KeyA'],
  right: ['ArrowRight', 'KeyD'],
  jump: ['Space', 'KeyK'],
  up: ['ArrowUp', 'KeyW'],
  down: ['ArrowDown', 'KeyS'],
  attack: ['KeyJ'],
  prev: ['KeyQ'],
  next: ['KeyE'],
  confirm: ['Enter'],
  back: ['Escape'],
  cheat: ['F1'],
  mute: ['KeyM'],
  volDown: ['Minus', 'NumpadSubtract'],
  volUp: ['Equal', 'NumpadAdd'],
};
// 阻止这些键滚动页面或打开浏览器帮助
const BLOCK_DEFAULT = new Set(['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'F1']);

export class Input {
  constructor(target = window) {
    this.down = new Set();
    this.pressed = new Set();
    this.pointer = null; // 鼠标在画布内的像素坐标（菜单悬停）
    this.moved = false; // 本帧鼠标是否移动过
    this.click = null; // 本帧鼠标点击坐标
    target.addEventListener('keydown', (e) => {
      if (!this.down.has(e.code)) this.pressed.add(e.code);
      this.down.add(e.code);
      if (BLOCK_DEFAULT.has(e.code)) e.preventDefault();
    });
    target.addEventListener('keyup', (e) => this.down.delete(e.code));
    target.addEventListener('blur', () => this.down.clear());
  }

  /** 监听画布上的鼠标；CSS 缩放后的位置换算回画布内部像素（扣除边框） */
  bindPointer(canvas) {
    const toCanvas = (e) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((e.clientX - rect.left - canvas.clientLeft) * canvas.width) / canvas.clientWidth,
        y: ((e.clientY - rect.top - canvas.clientTop) * canvas.height) / canvas.clientHeight,
      };
    };
    canvas.addEventListener('pointermove', (e) => {
      this.pointer = toCanvas(e);
      this.moved = true;
    });
    canvas.addEventListener('pointerdown', (e) => {
      this.pointer = this.click = toCanvas(e);
    });
  }

  held(action) {
    return BINDINGS[action].some((code) => this.down.has(code));
  }

  hit(action) {
    return BINDINGS[action].some((code) => this.pressed.has(code));
  }

  /** 本帧按下的数字键（1-9），无则返回 0 */
  digit() {
    for (const code of this.pressed) if (/^Digit[1-9]$/.test(code)) return Number(code.slice(5));
    return 0;
  }

  endFrame() {
    this.pressed.clear();
    this.moved = false;
    this.click = null;
  }
}

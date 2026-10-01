/**
 * 键盘输入：区分“按住”（held）与“本帧刚按下”（hit），逻辑层只认动作名，不认具体按键。
 */
const BINDINGS = {
  left: ['ArrowLeft', 'KeyA'],
  right: ['ArrowRight', 'KeyD'],
  jump: ['Space', 'ArrowUp', 'KeyW', 'KeyK'],
  up: ['ArrowUp', 'KeyW', 'Space'],
  down: ['ArrowDown', 'KeyS'],
  attack: ['KeyJ'],
  prev: ['KeyQ'],
  next: ['KeyE'],
  confirm: ['Enter'],
  cheat: ['F1'],
};
// 阻止这些键滚动页面或打开浏览器帮助
const BLOCK_DEFAULT = new Set(['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'F1']);

export class Input {
  constructor(target = window) {
    this.down = new Set();
    this.pressed = new Set();
    target.addEventListener('keydown', (e) => {
      if (!this.down.has(e.code)) this.pressed.add(e.code);
      this.down.add(e.code);
      if (BLOCK_DEFAULT.has(e.code)) e.preventDefault();
    });
    target.addEventListener('keyup', (e) => this.down.delete(e.code));
    target.addEventListener('blur', () => this.down.clear());
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
  }
}

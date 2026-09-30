/**
 * 入口：加载素材 → 创建游戏与渲染器 → 启动主循环；加载失败时给出启动提示。
 */
import { loadAssets } from './core/loader.js';
import { Input } from './core/input.js';
import { startLoop } from './core/loop.js';
import { Game } from './core/game.js';
import { Renderer } from './render/renderer.js';

try {
  const assets = await loadAssets();
  const input = new Input();
  const game = new Game(assets, input);
  const renderer = new Renderer(document.getElementById('screen'), assets);
  startLoop(
    (dt) => {
      game.update(dt);
      input.endFrame();
    },
    () => renderer.render(game),
  );
} catch (err) {
  document.getElementById('error').textContent =
    `${err.message}\n请在游戏目录运行 ./start.sh（浏览器禁止 file:// 直接读取 JSON 素材）。`;
  throw err;
}

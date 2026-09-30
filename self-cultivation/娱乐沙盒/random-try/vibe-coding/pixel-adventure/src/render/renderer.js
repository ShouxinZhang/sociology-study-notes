/**
 * 世界渲染：先在 320×192 的低分辨率画布上绘制像素世界，再整数倍放大到显示画布，
 * 最后在高分辨率层上绘制 HUD 文字，兼顾像素锐利与中文可读性。
 */
import { TILE } from '../world/level.js';
import { drawSprite, frameAt } from '../core/sprites.js';
import { playerSprite } from '../entities/player.js';
import { drawHud, drawOverlay } from './hud.js';

const VIEW_W = 320;
const VIEW_H = 192;
const SCALE = 3;

export class Renderer {
  constructor(canvas, assets) {
    this.sprites = assets.sprites;
    this.colors = { ink: assets.palette['#'], paper: assets.palette.o };
    canvas.width = VIEW_W * SCALE;
    canvas.height = VIEW_H * SCALE;
    this.ctx = canvas.getContext('2d');
    this.view = document.createElement('canvas');
    this.view.width = VIEW_W;
    this.view.height = VIEW_H;
    this.vctx = this.view.getContext('2d');
    this.ui = { ctx: this.ctx, sprites: this.sprites, colors: this.colors, width: canvas.width, height: canvas.height };
  }

  render(game) {
    const g = this.vctx;
    g.fillStyle = this.colors.paper;
    g.fillRect(0, 0, VIEW_W, VIEW_H);
    if (game.level) this.drawWorld(g, game);

    this.ctx.imageSmoothingEnabled = false;
    this.ctx.drawImage(this.view, 0, 0, VIEW_W * SCALE, VIEW_H * SCALE);
    if (game.level) drawHud(this.ui, game);
    drawOverlay(this.ui, game);
  }

  drawWorld(g, game) {
    const { level, player: p, time } = game;
    const camX = Math.round(Math.max(0, Math.min(p.x + p.w / 2 - VIEW_W / 2, level.width - VIEW_W)));
    const blink = (rate) => Math.floor(time * rate) % 2 === 1;
    g.save();
    g.translate(-camX, 0);

    // 只绘制可见列
    const c0 = Math.floor(camX / TILE);
    for (let r = 0; r < level.rows; r++) {
      for (let c = c0; c <= c0 + VIEW_W / TILE; c++) {
        const tile = level.tileAt(c, r);
        if (tile?.sprite) drawSprite(g, this.sprites[tile.sprite], 0, c * TILE, r * TILE);
      }
    }

    const flag = level.spawns.flag;
    if (flag) drawSprite(g, this.sprites.flag, 0, flag.x, flag.y);
    for (const it of game.pickups) {
      const bob = it.kind === 'chest' ? 0 : Math.round(Math.sin(it.t * 4) * 2);
      this.drawEntity(g, this.sprites[it.sprite], it, it.t, false, bob);
    }
    for (const e of game.enemies) {
      if (!(e.flash > 0 && blink(30))) this.drawEntity(g, this.sprites[e.def.sprite], e, e.t, e.facing < 0);
    }
    if (!(p.invuln > 0 && blink(15))) this.drawEntity(g, this.sprites[playerSprite(p)], p, time, p.facing < 0);
    for (const pr of game.projectiles) drawSprite(g, pr.sprite, 0, pr.x, pr.y, pr.flip);
    for (const f of game.effects) drawSprite(g, f.sprite, frameAt(f.sprite, f.t), f.x, f.y, f.flip);
    g.restore();
  }

  /** 精灵底边居中对齐实体碰撞盒底边 */
  drawEntity(g, sprite, e, time, flip, bob = 0) {
    drawSprite(g, sprite, frameAt(sprite, time), e.x + e.w / 2 - sprite.w / 2, e.y + e.h - sprite.h + bob, flip);
  }
}

/**
 * 世界渲染：先在 320×192 的低分辨率画布上绘制像素世界，再整数倍放大到显示画布，
 * 最后在高分辨率层上绘制 HUD 文字，兼顾像素锐利与中文可读性。
 */
import { TILE } from '../world/level.js';
import { drawSprite, frameAt } from '../core/sprites.js';
import { playerSprite } from '../entities/player.js';
import { drawHud, drawOverlay } from './hud.js';
import { drawMenus } from './menus.js';

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
    drawMenus(this.ui, game);
  }

  drawWorld(g, game) {
    const { level, player: p, time } = game;
    const camX = Math.round(Math.max(0, Math.min(p.x + p.w / 2 - VIEW_W / 2, level.width - VIEW_W)));
    const blink = (rate) => Math.floor(time * rate) % 2 === 1;
    g.save();
    g.translate(-camX, 0);

    // 只绘制可见列；电网通电时在地板上方叠加电火花
    const c0 = Math.floor(camX / TILE);
    for (let r = 0; r < level.rows; r++) {
      for (let c = c0; c <= c0 + VIEW_W / TILE; c++) {
        const tile = level.tileAt(c, r);
        if (!tile?.sprite) continue;
        const sprite = this.sprites[tile.sprite];
        drawSprite(g, sprite, frameAt(sprite, time), c * TILE, r * TILE);
        if (tile.electric && game.electricOn) drawSprite(g, this.sprites.spark, frameAt(this.sprites.spark, time), c * TILE, (r - 1) * TILE);
      }
    }
    for (const h of game.hazards ?? []) {
      drawSprite(g, this.sprites.laser_emitter, 0, h.x, h.y);
      if (!game.laserOn) continue;
      const beam = this.sprites.laser_beam_tile;
      for (let y = h.beam.y; y < h.beam.y + h.beam.h; y += TILE) drawSprite(g, beam, frameAt(beam, time), h.x, y);
    }

    const flag = level.spawns.flag;
    if (flag) drawSprite(g, this.sprites.flag, 0, flag.x, flag.y);
    for (const it of game.pickups) {
      const bob = it.kind === 'chest' ? 0 : Math.round(Math.sin(it.t * 4) * 2);
      this.drawEntity(g, this.sprites[it.sprite], it, it.t, false, bob);
    }
    for (const e of game.enemies) {
      if (e.flash > 0 && blink(30)) continue;
      const sprite = this.sprites[e.def.sprite];
      // 炮台类按瞄准角取帧（八方向炮管），不镜像
      if (e.def.aimFrames) this.drawEntity(g, sprite, e, 0, false, 0, e.aimFrame);
      else this.drawEntity(g, sprite, e, e.t, e.facing < 0);
    }
    if (!(p.invuln > 0 && blink(15))) {
      // 图层自下而上：腿部 → 上半身（瞄准 / 攻击）；rest 表示停在最后一帧（待机瞄准姿势）
      for (const layer of playerSprite(p, time)) {
        const sprite = this.sprites[layer.name];
        const frame = layer.rest ? sprite.frames.length - 1 : frameAt(sprite, layer.t);
        this.drawEntity(g, sprite, p, 0, p.facing < 0, 0, frame);
      }
    }
    if (p.shield > 0 && !(p.shield < 2 && blink(10))) {
      const aura = this.sprites.shield_aura;
      drawSprite(g, aura, frameAt(aura, time), p.x + p.w / 2 - aura.w / 2, p.y + p.h / 2 - aura.h / 2 - 2);
    }
    for (const pr of game.projectiles) drawSprite(g, pr.sprite, frameAt(pr.sprite, pr.t ?? 0), pr.x, pr.y, pr.flip);
    for (const f of game.effects) drawSprite(g, f.sprite, frameAt(f.sprite, f.t), f.x, f.y, f.flip);
    g.restore();
  }

  /** 精灵底边（扣除脚底以下的 below 留白）居中对齐实体碰撞盒底边；frame 未给出时按时间播放动画 */
  drawEntity(g, sprite, e, time, flip, bob = 0, frame = frameAt(sprite, time)) {
    drawSprite(g, sprite, frame, e.x + e.w / 2 - sprite.w / 2, e.y + e.h - sprite.h + sprite.below + bob, flip);
  }
}

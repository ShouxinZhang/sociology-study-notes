/**
 * 精灵编译：把字符像素网格（每个字符 = 一个像素）光栅化为离屏画布并缓存，
 * 同时预生成水平镜像版本，运行时只做贴图，不再逐像素绘制。
 * 约定：所有精灵默认朝右，朝左时使用镜像帧。
 */

/** 将全部精灵定义编译为 { w, h, below, fps, frames[], mirrored[] }；below 为脚底以下多出的像素行数 */
export function compileSprites(defs, palette) {
  const sprites = {};
  for (const [name, def] of Object.entries(defs)) {
    const scale = def.scale ?? 1;
    const frames = def.frames.map((rows) => rasterize(rows, palette, scale));
    sprites[name] = {
      w: frames[0].width,
      h: frames[0].height,
      below: (def.below ?? 0) * scale,
      fps: def.fps ?? 0,
      frames,
      mirrored: frames.map(mirror),
    };
  }
  return sprites;
}

/** 单帧字符网格 → 画布；调色板中映射为 null 的字符视为透明 */
function rasterize(rows, palette, scale) {
  const canvas = document.createElement('canvas');
  canvas.width = rows[0].length * scale;
  canvas.height = rows.length * scale;
  const g = canvas.getContext('2d');
  rows.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      const color = palette[ch];
      if (!color) return;
      g.fillStyle = color;
      g.fillRect(x * scale, y * scale, scale, scale);
    });
  });
  return canvas;
}

function mirror(src) {
  const canvas = document.createElement('canvas');
  canvas.width = src.width;
  canvas.height = src.height;
  const g = canvas.getContext('2d');
  g.scale(-1, 1);
  g.drawImage(src, -src.width, 0);
  return canvas;
}

/** 根据经过时间计算动画帧序号；fps 为 0 表示静态精灵 */
export function frameAt(sprite, time) {
  return sprite.fps ? Math.floor(time * sprite.fps) % sprite.frames.length : 0;
}

/** 按整数像素坐标贴图，保证像素边缘锐利 */
export function drawSprite(ctx, sprite, frame, x, y, flip = false) {
  const list = flip ? sprite.mirrored : sprite.frames;
  ctx.drawImage(list[frame % list.length], Math.round(x), Math.round(y));
}

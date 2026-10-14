/**
 * @file pixel-textures.js
 * @description 程序化生成 16x16 像素风格材质贴图，启用 NearestFilter 保证锐利的 3D 像素质感。
 */

import * as THREE from 'three';

const materialCache = new Map();

/**
 * 绘制 16x16 像素画布并转为 Three.js 纹理
 * @param {Function} drawFn 绘制回调 (ctx, size)
 * @param {number} repeatX 水平重复次数
 * @param {number} repeatY 垂直重复次数
 * @returns {THREE.CanvasTexture}
 */
function createPixelTexture(drawFn, repeatX = 2, repeatY = 2) {
  const size = 16;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  drawFn(ctx, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * 根据材质名与尺寸获取 3D 像素标准材质
 * @param {string} name 材质类型名
 * @param {number} w 宽度用于计算 UV 重复
 * @param {number} d 深度用于计算 UV 重复
 * @returns {THREE.MeshLambertMaterial}
 */
export function getPixelMaterial(name, w = 4, d = 4) {
  const key = `${name}_${Math.round(w)}_${Math.round(d)}`;
  if (materialCache.has(key)) return materialCache.get(key);

  const rx = Math.max(1, Math.round(w / 2));
  const ry = Math.max(1, Math.round(d / 2));

  const tex = createPixelTexture((ctx) => {
    if (name === 'jungle_grass') {
      ctx.fillStyle = '#15803d';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#166534';
      for (let i = 0; i < 24; i++) ctx.fillRect((i * 7) % 16, (i * 11) % 16, 2, 2);
      ctx.fillStyle = '#22c55e';
      for (let i = 0; i < 10; i++) ctx.fillRect((i * 5 + 3) % 16, (i * 9 + 1) % 16, 1, 2);
    } else if (name === 'rock') {
      ctx.fillStyle = '#475569';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, 7, 16, 2);
      ctx.fillRect(7, 0, 2, 8);
      ctx.fillRect(13, 8, 2, 8);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(2, 2, 4, 3);
      ctx.fillRect(9, 10, 4, 3);
    } else if (name === 'bridge') {
      ctx.fillStyle = '#9a3412';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#431407';
      ctx.fillRect(0, 3, 16, 1);
      ctx.fillRect(0, 7, 16, 1);
      ctx.fillRect(0, 11, 16, 1);
      ctx.fillRect(0, 15, 16, 1);
      ctx.fillStyle = '#fb923c';
      ctx.fillRect(2, 1, 2, 2);
      ctx.fillRect(12, 9, 2, 2);
    } else if (name === 'metal_floor') {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#334155';
      ctx.strokeRect(1, 1, 14, 14);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(2, 2, 2, 2);
      ctx.fillRect(12, 2, 2, 2);
      ctx.fillRect(2, 12, 2, 2);
      ctx.fillRect(12, 12, 2, 2);
    } else if (name === 'metal_box') {
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 16, 2);
      ctx.fillRect(0, 0, 2, 16);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(4, 7, 8, 2);
    } else if (name === 'hive_flesh') {
      ctx.fillStyle = '#4c1d95';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#701a75';
      for (let i = 0; i < 18; i++) ctx.fillRect((i * 5) % 15, (i * 9) % 15, 3, 2);
      ctx.fillStyle = '#be185d';
      for (let i = 0; i < 8; i++) ctx.fillRect((i * 7 + 2) % 14, (i * 3 + 4) % 14, 2, 2);
    } else {
      ctx.fillStyle = '#831843';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(3, 3, 4, 4);
      ctx.fillRect(10, 9, 4, 4);
    }
  }, rx, ry);

  const mat = new THREE.MeshLambertMaterial({ map: tex });
  materialCache.set(key, mat);
  return mat;
}

/**
 * 物理：重力 + 瓦片 AABB 碰撞（先 X 后 Y 分轴解算），支持只能从上方站立的单向平台。
 */
import { TILE } from '../world/level.js';

export const GRAVITY = 900;
const MAX_FALL = 420; // 限制下落速度，避免每帧位移超过一格而穿透平台

const isSolid = (t) => Boolean(t?.solid);
const isOneWay = (t) => Boolean(t?.oneWay);

/** 矩形相交判定（x, y, w, h） */
export const overlap = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

/** 在实体覆盖的瓦片范围内查找第一个满足条件的瓦片；rows 可限定行区间 */
function findTile(e, level, test, rows) {
  const c0 = Math.floor(e.x / TILE);
  const c1 = Math.floor((e.x + e.w - 0.01) / TILE);
  const [r0, r1] = rows ?? [Math.floor(e.y / TILE), Math.floor((e.y + e.h - 0.01) / TILE)];
  for (let r = r0; r <= r1; r++) {
    for (let c = c0; c <= c1; c++) if (test(level.tileAt(c, r))) return { c, r };
  }
  return null;
}

/** 应用重力并移动实体，更新 onGround / hitWall 标志 */
export function moveAndCollide(e, level, dt) {
  e.vy = Math.min(e.vy + GRAVITY * dt, MAX_FALL);

  e.hitWall = false;
  e.x += e.vx * dt;
  const wall = e.vx !== 0 && findTile(e, level, isSolid);
  if (wall) {
    e.x = e.vx > 0 ? wall.c * TILE - e.w : (wall.c + 1) * TILE;
    e.hitWall = true;
  }

  const prevBottom = e.y + e.h;
  e.y += e.vy * dt;
  e.onGround = false;
  const hit = findTile(e, level, isSolid);
  if (hit) {
    if (e.vy > 0) {
      e.y = hit.r * TILE - e.h;
      e.onGround = true;
    } else {
      e.y = (hit.r + 1) * TILE;
    }
    e.vy = 0;
  } else if (e.vy > 0) {
    // 单向平台：仅当上一帧脚底在平台顶面之上时才落地
    const r = Math.floor((e.y + e.h - 0.01) / TILE);
    if (prevBottom <= r * TILE + 0.01 && findTile(e, level, isOneWay, [r, r])) {
      e.y = r * TILE - e.h;
      e.vy = 0;
      e.onGround = true;
    }
  }
}

/**
 * @file physics.js
 * @description 3D AABB 平台碰撞检测、重力与角色空间约束求解器。
 */

export const GRAVITY = 28.0;
export const ABYSS_Y = -14.0;

/**
 * 检测两个 3D AABB 盒是否相交
 * @param {{x:number,y:number,z:number,w:number,h:number,d:number}} a
 * @param {{x:number,y:number,z:number,w:number,h:number,d:number}} b
 * @returns {boolean}
 */
export function intersectAABB(a, b) {
  return (
    Math.abs(a.x - b.x) * 2 < (a.w + b.w) &&
    Math.abs(a.y - b.y) * 2 < (a.h + b.h) &&
    Math.abs(a.z - b.z) * 2 < (a.d + b.d)
  );
}

/**
 * 求解玩家胶囊/包围盒与场景内所有激活平台（含未炸毁断桥段）的碰撞
 * @param {object} player 玩家实体
 * @param {Array<object>} colliders 激活的静态/动态平台盒列表
 * @param {number} dt 帧时间步长
 */
export function resolvePlayerPhysics(player, colliders, dt) {
  const halfW = player.radius;
  const height = player.height;

  // 1. 水平 X 位移与阻挡
  player.pos.x += player.vel.x * dt;
  for (const box of colliders) {
    if (!box.active) continue;
    if (checkPlayerBoxOverlap(player.pos, halfW, height, box)) {
      if (player.vel.x > 0) {
        player.pos.x = box.x - box.w / 2 - halfW;
      } else if (player.vel.x < 0) {
        player.pos.x = box.x + box.w / 2 + halfW;
      }
      player.vel.x = 0;
    }
  }

  // 2. 水平 Z 位移与阻挡
  player.pos.z += player.vel.z * dt;
  for (const box of colliders) {
    if (!box.active) continue;
    if (checkPlayerBoxOverlap(player.pos, halfW, height, box)) {
      if (player.vel.z > 0) {
        player.pos.z = box.z - box.d / 2 - halfW;
      } else if (player.vel.z < 0) {
        player.pos.z = box.z + box.d / 2 + halfW;
      }
      player.vel.z = 0;
    }
  }

  // 3. 垂直 Y 位移、落地与顶头判定
  player.pos.y += player.vel.y * dt;
  player.onGround = false;

  for (const box of colliders) {
    if (!box.active) continue;
    if (checkPlayerBoxOverlap(player.pos, halfW, height, box)) {
      const boxTop = box.y + box.h / 2;
      const boxBottom = box.y - box.h / 2;
      if (player.vel.y <= 0 && player.pos.y - player.vel.y * dt >= boxTop - 0.35) {
        player.pos.y = boxTop;
        player.vel.y = 0;
        player.onGround = true;
        player.jumpsLeft = 2;
        if (box.onStep) box.onStep();
      } else if (player.vel.y > 0 && player.pos.y + height - player.vel.y * dt <= boxBottom + 0.35) {
        player.pos.y = boxBottom - height;
        player.vel.y = 0;
      }
    }
  }
}

/**
 * 判断脚底坐标为 pos 的圆柱/长方体玩家是否与平台盒重叠
 */
function checkPlayerBoxOverlap(pos, halfW, height, box) {
  const pxMin = pos.x - halfW;
  const pxMax = pos.x + halfW;
  const pyMin = pos.y;
  const pyMax = pos.y + height;
  const pzMin = pos.z - halfW;
  const pzMax = pos.z + halfW;

  const bxMin = box.x - box.w / 2;
  const bxMax = box.x + box.w / 2;
  const byMin = box.y - box.h / 2;
  const byMax = box.y + box.h / 2;
  const bzMin = box.z - box.d / 2;
  const bzMax = box.z + box.d / 2;

  return (
    pxMax > bxMin && pxMin < bxMax &&
    pyMax > byMin && pyMin < byMax &&
    pzMax > bzMin && pzMin < bzMax
  );
}

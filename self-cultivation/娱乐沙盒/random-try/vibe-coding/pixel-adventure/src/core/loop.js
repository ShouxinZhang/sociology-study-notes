/**
 * 主循环：requestAnimationFrame 驱动；dt 上限 1/30 秒，防止切后台回来时穿墙。
 */
const MAX_DT = 1 / 30;

export function startLoop(update, render) {
  let last = performance.now();
  const tick = (now) => {
    // rAF 时间戳可能早于启动时的 performance.now()，首帧需钳到 0
    const dt = Math.max(0, Math.min((now - last) / 1000, MAX_DT));
    last = now;
    update(dt);
    render();
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

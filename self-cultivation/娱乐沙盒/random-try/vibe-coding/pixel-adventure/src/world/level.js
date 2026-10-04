/**
 * 关卡：把 ASCII 地图解析为瓦片网格与出生点清单，并提供瓦片查询。
 * 字符含义统一由 assets/data/legend.json 定义。
 */
export const TILE = 16;
// 关卡左右边界视为实心墙；上下越界视为空气（掉出底部即坠落）
const WALL = { solid: true };

export class Level {
  constructor(def, legend) {
    this.name = def.name;
    this.requireBoss = Boolean(def.requireBoss);
    this.rows = def.map.length;
    this.cols = Math.max(...def.map.map((row) => row.length));
    this.width = this.cols * TILE;
    this.height = this.rows * TILE;
    this.spawns = { player: { x: 0, y: 0 }, flag: null, enemies: [], pickups: [], hazards: [], checkpoints: [], bossAnchor: null };

    const boxes = { chest: [], pow: [] }; // 有内容物的拾取点：宝箱、俘虏
    this.tiles = def.map.map((row, r) =>
      Array.from({ length: this.cols }, (_, c) => {
        const ch = row[c] ?? legend.empty;
        const at = { x: c * TILE, y: r * TILE };
        if (legend.tiles[ch]) return legend.tiles[ch];

        const enemy = legend.enemies[ch];
        const marker = legend.markers[ch];
        if (enemy) this.spawns.enemies.push({ type: enemy, ...at });
        else if (marker === 'start') this.spawns.player = at;
        else if (marker === 'flag') this.spawns.flag = at;
        else if (marker in boxes) boxes[marker].push(at);
        else if (marker === 'checkpoint') this.spawns.checkpoints.push(at);
        else if (marker === 'boss') this.spawns.bossAnchor = at;
        else if (marker === 'laser') this.spawns.hazards.push({ type: 'laser', ...at });
        else if (marker) this.spawns.pickups.push({ kind: marker, ...at });
        return null;
      }),
    );

    // 宝箱、俘虏与飞行胶囊的内容按从左到右顺序依次取自 def.chests / def.pows / def.capsules
    this.spawns.enemies
      .filter((s) => s.type === 'capsule')
      .sort((a, b) => a.x - b.x)
      .forEach((s, i) => (s.content = def.capsules?.[i] ?? 'shield'));
    for (const [kind, list] of Object.entries(boxes)) {
      list
        .sort((a, b) => a.x - b.x)
        .forEach((at, i) => this.spawns.pickups.push({ kind, content: def[`${kind}s`]?.[i] ?? 'heart', ...at }));
    }
  }

  tileAt(c, r) {
    if (c < 0 || c >= this.cols) return WALL;
    if (r < 0 || r >= this.rows) return null;
    return this.tiles[r][c];
  }

  tileAtPoint(x, y) {
    return this.tileAt(Math.floor(x / TILE), Math.floor(y / TILE));
  }

  /** 实体前进方向脚下是否有落脚点（用于怪物不走下悬崖） */
  hasSupportAhead(e) {
    const t = this.tileAtPoint(e.facing > 0 ? e.x + e.w + 1 : e.x - 1, e.y + e.h + 1);
    return Boolean(t?.solid || t?.oneWay);
  }

  /** 实体两脚下都踩实且不是机关地面（用于记录坠崖后的安全复活点；桥会塌、酸液和电网会伤人） */
  isFirmlyGrounded(e) {
    const y = e.y + e.h + 1;
    return [e.x, e.x + e.w].every((x) => {
      const t = this.tileAtPoint(x, y);
      return Boolean((t?.solid || t?.oneWay) && !t.bridge && !t.acid && !t.electric);
    });
  }
}

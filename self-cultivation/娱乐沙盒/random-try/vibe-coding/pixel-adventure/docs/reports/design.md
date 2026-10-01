# 设计报告

> 维护模型：GitHub Copilot（Claude Opus 5.5）｜随功能迭代持续更新

## 1. 业务结论

- 改画面、调数值、加关卡只需编辑 `assets/` 下的 JSON，不用改代码。
- 无依赖：浏览器 + `python3` 即可运行。
- 局限：素材是程序生成或手写的极简像素画；数值平衡尚未经过人工完整通关验证。

## 2. 分层

```text
pixel-adventure/
├─ assets/            纯数据（manifest.json 统一登记）
│  ├─ sprites/        字符像素精灵
│  ├─ levels/         ASCII 关卡
│  └─ data/           weapons / enemies / progression / legend / cheat
├─ src/               纯逻辑
│  ├─ core/           loader · sprites · input · loop · game（状态机）
│  ├─ world/          level（地图解析与瓦片查询）
│  ├─ entities/       player · enemy · projectile · pickup · effect
│  ├─ systems/        physics · combat · leveling · inventory
│  └─ render/         renderer（320×192 世界 ×3 放大）· hud
└─ docs/              本文档中心
```

依赖方向：`render → entities/systems → world → core`；`game.js` 负责编排。

## 3. 素材格式

- 精灵：`{ "name": { "fps"?, "scale"?, "frames": [[行字符串…]] } }`。`#` 为墨色，`o` 为纸色，`.` 为透明（见 `palette.json`）。默认朝右，朝左时运行时镜像。
- 攻击动作（`attacks.json`）：32×24 画布，身体固定在 (8, 8)；由 `.agents/cache/pixel-adventure/gen_attacks.py` 生成，生成后可直接手改。
- 关卡：`map` 为 12 行 ASCII；字符含义见 `legend.json`；`chests` 按从左到右的顺序分配宝箱内容；`requireBoss` 为 true 时须先击败 BOSS 才能过关。

## 4. 关键数据字段

| 文件 | 字段 | 含义 |
|---|---|---|
| weapons.json | `type` | `melee` 按 `range` 判定命中盒；`ranged` 按 `projectile`、`speed` 发射 |
| weapons.json | `attackSprite` / `fx` / `muzzle` | 攻击动作、特效、枪口偏移 `[距身体中线, 距碰撞盒顶部]` |
| weapons.json | `pickupAmmo` / `ammoPerBox` / `explosionRadius` | 拾取弹药、弹药箱补给、爆炸半径 |
| enemies.json | `behavior` | `patrol` / `fly` / `chase` / `boss` |
| enemies.json | `throw` | 投掷冷却、速度、伤害、数量（扇形） |
| progression.json | `expTable` 等 | 升级经验、成长、无敌时间、回血量 |
| cheat.json | `fireRateMultiplier` / `flySpeed` | 作弊射速倍率、飞行速度 |

## 5. 验证方式

- 语法：`node --check` 检查全部 `src/**/*.js`。
- 逻辑：在浏览器内通过 `import('/src/...')` 构造 `Game`，用模拟输入逐帧推进（各任务日志中有示例与结果）。
- 注意：集成浏览器标签页在后台时 `requestAnimationFrame` 会暂停，看画面需要页面在前台；测试修改后的代码请换端口，以绕过模块缓存。

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
│  ├─ entities/       player · enemy · projectile · pickup · effect · hazard（机关）· boss-parts（多部件 BOSS）
│  ├─ systems/        physics · combat · leveling · inventory
│  ├─ ui/             菜单逻辑：layout（按钮布局，逻辑与渲染共用）· list（键鼠选择）· screens（主菜单 / 设置）· jukebox（音乐馆）
│  └─ render/         renderer（320×192 世界 ×3 放大）· hud · menus（主菜单 / 音乐馆 / 设置画面）· draw-kit（共用绘图）
│  └─ audio/          mixer（含音乐频谱分析器）· sfx（ZzFX 预合成）· music · vendor/zzfx.js
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
| enemies.json | `behavior` | `patrol` / `fly` / `chase` / `boss` / `runner` / `hopper` / `capsule` / `static`（static 的能力由 `throw`、`spawn`、`mine`、`aimFrames`、`rageAt`、`fly`、`fixedFacing` 字段组合） |
| enemies.json | `throw` | 投射物类型、冷却、速度、伤害、数量；`radial` 环形散射 / `aimed` 瞄准玩家 / 默认抛物线 |
| bosses.json | `parts` / `core` / `wakeRange` | 多部件 BOSS：部件引用 enemies.json，相对地图 Y 锚点的格数定位；核心被毁则整组被毁 |
| hazards.json | `laser` / `electric` / `acid` / `bridge` / `conveyor` | 机关周期、伤害、崩塌节奏、传送速度 |
| levels/*.json | `boss` / `capsules` / `worldIntro` | 关卡 BOSS、飞行胶囊内容（从左到右分配）、世界切换过场文案 |
| weapons.json | `pellets` / `pelletAngle` / `pierce` / `wave` | 散弹数量与夹角、激光贯穿、火焰蛇行 [振幅, 角频率] |
| progression.json | `expTable` 等 | 升级经验、成长、无敌时间、回血量 |
| cheat.json | `fireRateMultiplier` / `flySpeed` | 作弊射速倍率、飞行速度 |
| audio/sfx.json | `zzfx` / `volume` / `minInterval` / `maxVoices` / `duck` | ZzFX 参数（`null` 为默认值）、音量、节流、复音上限、是否压低音乐 |
| audio/music.json | `tracks` / `states` | 曲目文件与倍速；游戏状态 → 音乐/音效；曲目的 `title` / `author` / `usage` 仅供音乐馆展示，新增曲目登记后自动出现在音乐馆 |
| weapons / enemies / levels | `sfxAttack` `sfxHit` / `sfxDie` `sfxHit` `music` / `music` | 各实体绑定的音效与音乐；命中时叠加两层：武器 `sfxHit`（用什么打）和敌人 `sfxHit`（打中什么） |

## 5. 验证方式

- 语法：`node --check` 检查全部 `src/**/*.js`。
- 逻辑：在浏览器内通过 `import('/src/...')` 构造 `Game`，用模拟输入逐帧推进（各任务日志中有示例与结果）。
- 注意：集成浏览器标签页在后台时 `requestAnimationFrame` 会暂停，看画面需要页面在前台。`start.sh` 已对所有响应发送 `Cache-Control: no-store`，改代码后刷新页面即可；不要用 `python -m http.server` 启动，它会导致浏览器使用缓存的旧模块。

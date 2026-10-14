# 新增 3D 魂斗罗（FPS 版）项目与分阶段实现

- 任务 ID：`2026-10-14_09-33-55+contra-3d-game`
- 开始时间：2026-10-14 09:33:55 +0800
- 完成时间：2026-10-14 09:56:35 +0800
- 状态：completed
- 类型：repository-change
- 影响范围：`self-cultivation/娱乐沙盒/random-try/vibe-coding/contra-3d/`、`docs/plan/contra-3d/`
- 执行模型：Google Antigravity (Gemini 4 Argon Medium)

## 用户原始 Prompt

> self-cultivation/娱乐沙盒/random-try/vibe-coding
> 增加一个新的项目，3d魂斗罗. 首先我们需要制定计划
>
> A1: 纯粹3d. 类似于CSGO. 同时，关卡设计借鉴魂斗罗
> A2: 我思考，目前来看，简洁3d像素风格即可.
> A3: ES Modules和TS优缺点是？
>
> Go

## 用户目标

在 `self-cultivation/娱乐沙盒/random-try/vibe-coding/contra-3d/` 下创建「3D 魂斗罗（FPS 版）」完整可玩项目，融合 CSGO 第一人称射击手感与魂斗罗经典关卡/武器/多部件 Boss 设计，采用简洁 3D 像素风与原生 ES Modules 架构，并落盘 `docs/plan/contra-3d/plan.md` 阶段实施地图。

## 方案与边界

- 采用零构建原生 ES Modules + 本地化最新 Three.js（`three.module.min.js` 与 `three.core.js`），通过 `./start.sh` 即可无缓存一键启动。
- 按叶子模块严格拆分 `core/`、`render/`、`entities/`、`systems/`、`audio/`、`ui/`、`assets/data/` 与 `tools/`。
- 实现 5 把经典武器（M4-C 步枪、M 重机枪、S 散弹枪、L 穿透激光、F 爆裂等离子炮）、飞行胶囊与 B 护盾、爆头暴击、3 大经典关卡（丛林断桥/钢铁基地激光门/异形巢穴）、4 种独立头部 Hitbox 敌人、3 个多部件关底 Boss、F1 作弊模式及选关。
- 全部使用程序化 3D 像素材质与 WebAudio 原创合成音效，零外部版权素材依赖。

## 关键动作

- [x] 与用户对齐视角（CSGO 第一人称）、美术风格（简洁 3D 像素）与工程方案（原生 ES Modules），创建 `docs/plan/contra-3d/plan.md`。
- [x] 完成 P0：核心 FPS 操控、3D 像素材质生成、第一人称持枪模型与平台 AABB 物理碰撞。
- [x] 完成 P1–P3：5 把魂斗罗武器、飞行胶囊、3 大关卡与机关、AI 小怪与 3 个多部件 Boss。
- [x] 完成 P4：WebAudio 音效与 BGM、HUD 与选关菜单、F1 作弊模式，并通过 `tools/review-check.mjs` 无头 Chrome 全流程 E2E 验证。

## 变更文件

| 文件 | 变更 |
|---|---|
| `docs/plan/contra-3d/plan.md` | 新建并完成 3D 魂斗罗 P0–P4 阶段推进地图 |
| `self-cultivation/娱乐沙盒/random-try/vibe-coding/contra-3d/index.html` | 主页面、importmap、CSGO 动态准星与战术 HUD |
| `self-cultivation/娱乐沙盒/random-try/vibe-coding/contra-3d/start.sh` | 本地无缓存 HTTP 启动脚本（默认端口 8771） |
| `self-cultivation/娱乐沙盒/random-try/vibe-coding/contra-3d/assets/vendor/three.module.min.js` | 本地化最新版 Three.js ES Module 入口 |
| `self-cultivation/娱乐沙盒/random-try/vibe-coding/contra-3d/assets/vendor/three.core.js` | 本地化最新版 Three.js 核心依赖模块 |
| `self-cultivation/娱乐沙盒/random-try/vibe-coding/contra-3d/assets/data/weapons.json` | 5 把魂斗罗枪械的射速、散布、爆头倍率与弹药配置 |
| `self-cultivation/娱乐沙盒/random-try/vibe-coding/contra-3d/assets/data/enemies.json` | 4 类 3D 体素敌人的属性与行为配置 |
| `self-cultivation/娱乐沙盒/random-try/vibe-coding/contra-3d/assets/data/levels.json` | 3 大关卡的 3D 平台、断桥/激光/酸液机关、胶囊与多部件 Boss 配置 |
| `self-cultivation/娱乐沙盒/random-try/vibe-coding/contra-3d/src/core/state.js` | 全局状态容器与事件总线 |
| `self-cultivation/娱乐沙盒/random-try/vibe-coding/contra-3d/src/core/input.js` | 键鼠输入与 PointerLock 第一人称视角控制 |
| `self-cultivation/娱乐沙盒/random-try/vibe-coding/contra-3d/src/core/physics.js` | 3D AABB 平台碰撞与重力/二段跳求解器 |
| `self-cultivation/娱乐沙盒/random-try/vibe-coding/contra-3d/src/render/pixel-textures.js` | 程序化 16x16 像素贴图生成器（NearestFilter） |
| `self-cultivation/娱乐沙盒/random-try/vibe-coding/contra-3d/src/render/scene-manager.js` | Three.js 场景、灯光与关卡环境构建器 |
| `self-cultivation/娱乐沙盒/random-try/vibe-coding/contra-3d/src/render/viewmodel.js` | CSGO 风格第一人称持枪模型、移动摆动、后坐力与枪口闪光 |
| `self-cultivation/娱乐沙盒/random-try/vibe-coding/contra-3d/src/render/particles.js` | 3D 像素粒子爆炸与弹道曳光束特效系统 |
| `self-cultivation/娱乐沙盒/random-try/vibe-coding/contra-3d/src/audio/sound.js` | WebAudio 合成枪械音效、爆头音、爆炸音与 8-bit 配乐 |
| `self-cultivation/娱乐沙盒/random-try/vibe-coding/contra-3d/src/entities/player.js` | 玩家第一人称角色实体、冲刺、二段跳、护盾与武器槽 |
| `self-cultivation/娱乐沙盒/random-try/vibe-coding/contra-3d/src/entities/capsule.js` | 飞行武器胶囊与磁吸补给箱系统 |
| `self-cultivation/娱乐沙盒/random-try/vibe-coding/contra-3d/src/entities/hazard.js` | 爆炸断桥、周期激光门、电磁地板与酸液池机关 |
| `self-cultivation/娱乐沙盒/random-try/vibe-coding/contra-3d/src/entities/enemy.js` | 4 类 3D 敌人 AI 与躯干/头部独立 Hitbox |
| `self-cultivation/娱乐沙盒/random-try/vibe-coding/contra-3d/src/entities/boss.js` | 3 大关底多部件巨型 Boss 状态机 |
| `self-cultivation/娱乐沙盒/random-try/vibe-coding/contra-3d/src/systems/combat.js` | 射线/散弹/贯穿激光/抛物线榴弹射击与爆头结算 |
| `self-cultivation/娱乐沙盒/random-try/vibe-coding/contra-3d/src/systems/level-loader.js` | 关卡加载与平台网格/碰撞盒组装 |
| `self-cultivation/娱乐沙盒/random-try/vibe-coding/contra-3d/src/ui/hud.js` | 动态准星、Boss 多部件血条、击杀播报与菜单控制 |
| `self-cultivation/娱乐沙盒/random-try/vibe-coding/contra-3d/src/main.js` | 游戏引导与主循环入口 |
| `self-cultivation/娱乐沙盒/random-try/vibe-coding/contra-3d/tools/review-check.mjs` | 静态模块语法审查与无头 Chrome E2E 自动测试脚本 |

## 验证结果

| 验证项 | 结果 | 证据 |
|---|---|---|
| 静态模块与无头浏览器 E2E 审查 | PASS | `node self-cultivation/娱乐沙盒/random-try/vibe-coding/contra-3d/tools/review-check.mjs`（17 个 ES 模块 + 3 个 JSON 契约 + Headless Chrome 零报错通过） |
| 开发日志索引校验 | PASS | `python3 .agents/skills/dev-logs/scripts/validate_dev_logs.py --root docs/dev_logs --record docs/dev_logs/2026-10/2026-10-14/09-33-55+contra-3d-game.md` |

## 风险与回滚

无已知阻塞风险。回滚可直接删除新增目录 `self-cultivation/娱乐沙盒/random-try/vibe-coding/contra-3d/` 与 `docs/plan/contra-3d/`。

## 最终成果

交付了开箱即玩的「3D 魂斗罗（FPS 版）」完整工程，直接运行 `./self-cultivation/娱乐沙盒/random-try/vibe-coding/contra-3d/start.sh` 即可体验第一人称 3D 像素风魂斗罗三关挑战。

# 武器专属攻击动画

- 任务 ID：`2026-10-01_23-59-26+weapon-attack-animations`
- 开始时间：2026-10-01 23:59:26 +0800
- 完成时间：2026-10-02 00:01:52 +0800
- 状态：completed
- 类型：repository-change
- 影响范围：`self-cultivation/娱乐沙盒/random-try/vibe-coding/pixel-adventure/`
- 执行模型：GitHub Copilot（Claude Opus 5.5）

## 用户原始 Prompt

> 不同武器的攻击动画都需要单独设计

> Go

## 用户目标

6 种武器各有独立的玩家攻击动作与命中/开火特效。

## 方案与边界

- 新增 `assets/sprites/attacks.json`：`attack_*`（32×24 玩家动作，身体与常态对齐）与 `fx_*` 特效，由临时脚本 `.agents/cache/pixel-adventure/gen_attacks.py` 以绘图原语生成。
- `weapons.json` 增加 `attackSprite`、`fx`、`muzzle`（枪口偏移）字段，逻辑按数据播放，不硬编码武器。
- 移除通用 `player_attack` 与 `slash`（备份于 `.agents/cache/weapon-attack-animations/`）。

## 关键动作

- [x] 生成攻击动作与特效精灵并 ASCII 预览
- [x] 玩家攻击动画从第 0 帧播放一遍（时长 = 帧数 / fps）；枪械特效与子弹从枪口出现
- [x] 浏览器渲染 6 种武器 × 3 个时刻的拼图检查

## 变更文件

| 文件 | 变更 |
|---|---|
| `pixel-adventure/assets/sprites/attacks.json` | 新增 6 套攻击动作与 6 种特效 |
| `pixel-adventure/assets/sprites/player.json`、`effects.json` | 删除 `player_attack`、`slash` |
| `pixel-adventure/assets/data/weapons.json`、`assets/manifest.json` | 新字段与登记 attacks.json |
| `pixel-adventure/src/entities/player.js`、`src/systems/combat.js`、`src/render/renderer.js` | 按武器播放动作、特效与枪口定位 |
| `docs/architecture/.../self-cultivation/entertainment-sandbox.md` | 更新 assets 说明 |

## 验证结果

| 验证项 | 结果 | 证据 |
|---|---|---|
| 语法 | PASS | `node --check` 全部 `src/**/*.js` |
| 渲染 | PASS | 浏览器内对 6 种武器各在第 1/4/8 帧调用 `Renderer.render`，无异常；拼图截图显示各武器动作与特效区分明显 |

## 风险与回滚

- 动作为程序生成的极简像素画，美感有限；可直接手改 attacks.json。
- 回滚：从 `.agents/cache/weapon-attack-animations/` 恢复两份精灵 JSON 并撤销上述代码改动。

## 最终成果

拳击直拳、木棍过头劈砍、刀前刺、手枪后坐、AK47 抖动连射加抛壳、火箭筒扛肩发射，各有专属动作和特效。

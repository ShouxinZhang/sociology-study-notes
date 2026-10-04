# pixel-adventure 开枪方向动画修复（摘要）

- 任务 ID：`2026-10-04_10-48-46+aim-animations`
- 开始时间：2026-10-04 10:48:46 +0800
- 完成时间：2026-10-04 10:57:36 +0800
- 状态：completed
- 类型：repository-change
- 影响范围：`self-cultivation/娱乐沙盒/random-try/vibe-coding/pixel-adventure/`
- 执行模型：Antigravity（Claude Opus 5.5）

## 用户原始 Prompt

> 嗯嗯，除此之外，我感觉，目前不同方向开枪的动画，还有问题，需要fix

> B

## 用户目标

修复上 / 斜上 / 下 / 斜下开枪时的人物动画：每把武器有自己的枪和开火动作、全方向有枪口火光、边走边瞄腿会摆动。

## 方案与边界

新增生成器把朝前开枪帧绕肩膀旋转为 5 方向精灵；腿部拆为独立图层；枪口位置与精灵共用 `aim.json` 参数。近战动作不变。

## 关键动作

- [x] 截图诊断 4 类问题
- [x] `tools/gen_aim_sprites.py` + `assets/data/aim.json` + `assets/sprites/aim.json`
- [x] 渲染图层、`below` 留白、枪口几何与火光
- [x] 精灵对照表、无头 Chrome 8 方向截图、Node 单测

## 变更文件

| 文件 | 变更 |
|---|---|
| `self-cultivation/娱乐沙盒/random-try/vibe-coding/pixel-adventure/` | tools/、assets/data/aim.json、assets/sprites/{aim,contra}.json、manifest、src/{core,render,entities,systems}、docs |
| `docs/architecture/repository-structure/modules/self-cultivation/entertainment-sandbox.md` | 登记 tools/ 与瞄准素材 |

## 验证结果

| 验证项 | 结果 | 证据 |
|---|---|---|
| 语法与资源 | PASS | `node --check`；aim.json 无缺失、行宽一致 |
| 游戏内截图 | PASS | `.agents/cache/pixel-adventure-aim/sheet_ak.png`、`sheet_rocket.png`、`sprites_v2.png` |
| 图层逻辑 | PASS | Node 单测 6 种状态 |

## 风险与回滚

见详细日志；备份在 `.agents/cache/pixel-adventure-aim/`。

## 最终成果

详细日志：`.../pixel-adventure/docs/logs/2026-10-04_10-48-46+aim-animations.md`。

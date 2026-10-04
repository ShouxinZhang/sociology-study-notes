# pixel-adventure 选关与拾取修复（摘要）

- 任务 ID：`2026-10-04_11-00-39+level-select-pickup-fixes`
- 开始时间：2026-10-04 11:00:39 +0800
- 完成时间：2026-10-04 11:12:04 +0800
- 状态：completed
- 类型：repository-change
- 影响范围：`self-cultivation/娱乐沙盒/random-try/vibe-coding/pixel-adventure/`
- 执行模型：Antigravity（Claude Opus 5.5）

## 用户原始 Prompt

> 嗯，再增加一个关卡跳跃选择功能. 此外:
> - 目前补给血包太大了，似乎是一个bug
> - 前期没有枪支的时候赠送子弹包，似乎不是那么合理

## 用户目标

主菜单可直接跳到任意关；修复血包显示过大；没枪时不掉弹药箱。

## 方案与边界

6 关全开放，跳关不改等级与武器；BOSS 精灵改名消除重名覆盖并加重名告警；掉落表按是否持枪过滤。

## 关键动作

- [x] 定位血包根因（精灵重名覆盖）并修复 + 加告警
- [x] 无枪不掉弹药箱
- [x] 主菜单「选择关卡」页
- [x] 无头 Chrome 端到端验证

## 变更文件

| 文件 | 变更 |
|---|---|
| `self-cultivation/娱乐沙盒/random-try/vibe-coding/pixel-adventure/` | assets/{sprites/contra.json,data/enemies.json}、src/{core,systems,ui,render}、docs |
| `docs/architecture/repository-structure/modules/self-cultivation/entertainment-sandbox.md` | 登记选关功能 |

## 验证结果

| 验证项 | 结果 | 证据 |
|---|---|---|
| 语法 | PASS | `node --check` |
| 单测 | PASS | hasGun / refill |
| 端到端 | PASS | `.agents/cache/pixel-adventure-level-select/sheet.png` |

## 风险与回滚

见详细日志；备份在 `.agents/cache/pixel-adventure-level-select/`。

## 最终成果

详细日志：`.../pixel-adventure/docs/logs/2026-10-04_11-00-39+level-select-pickup-fixes.md`。

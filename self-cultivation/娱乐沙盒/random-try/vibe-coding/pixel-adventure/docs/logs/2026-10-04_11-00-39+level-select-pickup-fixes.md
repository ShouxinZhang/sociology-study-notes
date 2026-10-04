# 选关与拾取修复

- 任务 ID：`2026-10-04_11-00-39+level-select-pickup-fixes`
- 执行模型：Antigravity（Claude Opus 5.5）

## 用户原始 Prompt

> 嗯，再增加一个关卡跳跃选择功能. 此外:
> - 目前补给血包太大了，似乎是一个bug
> - 前期没有枪支的时候赠送子弹包，似乎不是那么合理

对齐结论：6 关全部开放；跳关时等级与武器保持当前状态（不发放）。

## 根因

1. 血包过大：`contra.json` 中 BOSS「异形心脏」精灵也叫 `heart`（scale 3，48×48），晚于 `items.json` 加载，覆盖了 16×16 的拾取血包。
2. 弹药箱：敌人掉落表不判断是否已有远程武器。

## 变更文件

| 文件 | 变更 |
|---|---|
| `assets/sprites/contra.json`、`assets/data/enemies.json` | BOSS 精灵改名 `alien_heart` |
| `.agents/cache/pixel-adventure/gen_contra.py` | 生成器同步改名 |
| `src/core/loader.js` | `mergeSprites()`：精灵重名时 `console.warn` |
| `src/systems/inventory.js` | 新增 `guns` / `hasGun`，`refill()` 复用 |
| `src/systems/combat.js` | 无枪时跳过 `ammo` 掉落（地图预置弹药不变） |
| `src/ui/layout.js` | 主菜单 4 按钮；通用 `listRects`；`levelRects` |
| `src/ui/screens.js` | `levels` 页：键鼠选择、Esc 返回 |
| `src/core/game.js` | `jumpToLevel()`（含世界开场介绍），`nextLevel()` 复用 |
| `src/render/menus.js` | `drawLevelSelect`：关名、所属世界、BOSS 标记 |

## 验证

| 项 | 结果 | 证据 |
|---|---|---|
| 语法 | PASS | 全部 src `node --check` |
| hasGun / refill | PASS | Node 单测：开局 false，拿手枪后 true |
| 端到端 | PASS | `.agents/cache/pixel-adventure-level-select/e2e.mjs`、`shots/`、`sheet.png`：4 按钮、选第 4 关先出魂斗罗世界介绍再进关（LV1 + 拳头）；`heart` 16×16、`alien_heart` 48×48；无警告与异常 |

## 备份与回滚

备份：`.agents/cache/pixel-adventure-level-select/{contra.json,enemies.json}`。回滚：恢复两份备份并撤销上表 src 改动。

## 已知局限

从主菜单直接跳到后期关卡是 LV1 + 拳头，难度高（按用户选择不发放装备）。

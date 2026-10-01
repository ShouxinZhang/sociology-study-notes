# 冒险岛作弊模式

- 任务 ID：`2026-10-02_00-01-52+pixel-adventure-cheat-mode`
- 开始时间：2026-10-02 00:01:52 +0800
- 完成时间：2026-10-02 00:05:25 +0800
- 状态：completed
- 类型：repository-change
- 影响范围：`self-cultivation/娱乐沙盒/random-try/vibe-coding/pixel-adventure/`
- 执行模型：GitHub Copilot（Claude Opus 5.5）

## 用户原始 Prompt

> 此外，增加一个作弊模式。作弊模式下，无限子弹，10倍射速，飞天遁地，解锁全部武器

> Go

> 对了，作弊时候当然无敌了

## 用户目标

一键开关作弊：无敌、无限弹药、10 倍射速、自由飞行穿墙、解锁全部武器。

## 方案与边界

- F1 开关（仅游戏中），HUD 显示 `CHEAT` 与 `弹药 ∞`；数值在 `assets/data/cheat.json`。
- 作弊开关不进关卡快照，重试/重开保持；关闭后保留已解锁武器与原弹药。

## 关键动作

- [x] 输入新增 up/down/cheat 绑定，屏蔽 F1 浏览器默认行为
- [x] 玩家移动拆为常规 `walkAndJump` 与作弊 `fly`；`hurtPlayer` 作弊时直接返回
- [x] 射击冷却改为跨帧累计，射速超过帧率时同帧多发，保证真实 10 倍

## 变更文件

| 文件 | 变更 |
|---|---|
| `pixel-adventure/assets/data/cheat.json`、`assets/manifest.json` | 新增作弊数值并登记 |
| `pixel-adventure/src/core/input.js`、`src/core/game.js` | 绑定与开关、开局自动解锁 |
| `pixel-adventure/src/entities/player.js` | 飞行、射速倍率、冷却累计 |
| `pixel-adventure/src/systems/inventory.js`、`src/systems/combat.js` | `unlockAll`、免费消耗、无敌 |
| `pixel-adventure/src/render/hud.js` | CHEAT 标记、∞ 弹药、标题页操作说明 |
| `docs/architecture/.../self-cultivation/entertainment-sandbox.md` | 登记作弊模式 |

## 验证结果

| 验证项 | 结果 | 证据 |
|---|---|---|
| 语法 | PASS | `node --check` 全部 `src/**/*.js` |
| 功能冒烟 | PASS | 浏览器内脚本：开启后武器 6/6；强制 99 伤害后 HP 10→10；上飞 145→65、下穿地面至底界 177；飞越坑无扣血；关闭后武器保留；重试后作弊仍开 |
| 射速 | PASS | 2 秒内射击数（普通→作弊）：手枪 6→58、AK47 23→223、火箭筒 3→23，作弊弹药消耗 0 |
| 画面 | PASS | 截图可见作弊横幅、6 武器全解锁、`弹药 ∞`、`CHEAT` 标记 |

## 风险与回滚

- 在墙内关闭作弊时，角色会被逐帧推出地形，可能出现短暂卡顿。
- 回滚：撤销上述文件改动并删除 `cheat.json`。

## 最终成果

游戏中按 F1 即进入作弊模式：无敌、无限子弹、10 倍射速、方向键自由飞行穿墙、全部武器解锁；再按 F1 关闭。

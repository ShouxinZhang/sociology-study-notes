# 黑白像素冒险岛游戏

- 任务 ID：`2026-10-01_01-14-07+pixel-adventure-game`
- 开始时间：2026-10-01 01:14:07 +0800
- 完成时间：2026-10-01 01:28:10 +0800
- 状态：completed
- 类型：repository-change
- 影响范围：`self-cultivation/娱乐沙盒/random-try/vibe-coding/pixel-adventure/`
- 执行模型：GitHub Copilot（Claude Opus 5.5）

## 用户原始 Prompt

> self-cultivation/娱乐沙盒/random-try/vibe-coding
> 创建一个黑白像素风格冒险岛游戏，一共3个关卡.
> 玩家有等级系统和装备系统.
> 无装备的时候默认拳击. 装备包括木棍/刀/手枪/AK47/火箭筒

> 我思考，最好素材和逻辑代码模块分离

> 也行吧，先这么做

## 用户目标

交付一个浏览器可玩的黑白像素横版冒险游戏：3 关、等级成长、6 种武器（拳击默认）。

## 方案与边界

- 纯前端 ES Modules，零依赖；`assets/`（字符像素精灵、关卡、数值 JSON）与 `src/`（逻辑）分离。
- 通过 `start.sh` 起本地 HTTP 服务运行（浏览器禁止 `file://` 读 JSON）。
- 未做：音效、存档、手柄。

## 关键动作

- [x] 编写素材与数值 JSON（关卡由临时脚本 `.agents/cache/pixel-adventure/gen_levels.py` 生成）
- [x] 编写逻辑模块（core / world / entities / systems / render）
- [x] 修复首帧 `dt` 为负导致动画帧越界；武器栏移至顶部避免遮挡地面
- [x] 自测并更新架构记录

## 变更文件

| 文件 | 变更 |
|---|---|
| `self-cultivation/娱乐沙盒/random-try/vibe-coding/pixel-adventure/` | 新增游戏：`index.html`、`start.sh`、`assets/`（15 个 JSON）、`src/`（17 个 JS 模块） |
| `docs/architecture/repository-structure/modules/self-cultivation/entertainment-sandbox.md` | 登记 pixel-adventure 及其子目录 |
| `docs/architecture/repository-structure/modules/self-cultivation/README.md` | 娱乐沙盒摘要补充"像素小游戏" |
| `docs/dev_logs/INDEX.md`、`docs/dev_logs/2026-10/README.md`、`docs/dev_logs/2026-10/2026-10-01/README.md` | 新建 2026-10 月/日索引并登记本任务 |

## 验证结果

| 验证项 | 结果 | 证据 |
|---|---|---|
| 语法 | PASS | `node --check` 全部 `src/**/*.js` 无报错 |
| 素材格式 | PASS | Python 校验所有精灵帧行宽一致、仅含 `#o.` |
| 浏览器运行 | PASS | 本地 `http.server` + 集成浏览器：标题页、第 1 关画面、HUD 截图正常，无 pageError |
| 逻辑冒烟 | PASS | 浏览器内脚本模拟：拳击击杀史莱姆得经验；3 关宝箱依次获得 6 件武器与弹药；BOSS 存活时终点提示"先击败 BOSS！"，火箭筒击杀后到终点 → `victory`；死亡 → 重试恢复；坠崖 → 回安全点扣血 |

## 风险与回滚

- 数值平衡仅经脚本冒烟，未经人工完整通关。
- 回滚：删除 `pixel-adventure/` 目录并撤销上述文档改动（删除前先备份至 `.agents/cache/pixel-adventure/`）。

## 最终成果

在游戏目录运行 `./start.sh` 即可在浏览器游玩黑白像素冒险岛：3 关（草原/洞穴/城堡 BOSS）、等级成长、6 种武器。改素材、数值、关卡只需编辑 `assets/` 下的 JSON。
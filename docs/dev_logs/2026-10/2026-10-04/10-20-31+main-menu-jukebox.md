# pixel-adventure 主菜单与音乐馆（摘要）

- 任务 ID：`2026-10-04_10-20-31+main-menu-jukebox`
- 开始时间：2026-10-04 10:20:31 +0800
- 完成时间：2026-10-04 10:27:47 +0800
- 状态：completed
- 类型：repository-change
- 影响范围：`self-cultivation/娱乐沙盒/random-try/vibe-coding/pixel-adventure/`
- 执行模型：Antigravity（Claude Opus 5.5）

## 用户原始 Prompt

> self-cultivation/娱乐沙盒/random-try/vibe-coding/pixel-adventure
> 我思考，我们目前在这里制作了一些音乐。但我如何有一个可视化的音乐文档，并可以在我的Ubuntu本地播放音乐合集的任意一首呢

> 嗯，我思考，可以在我们的游戏web界面增加一个音乐馆功能。然后可以切换播放

> 呃，我想增加一个界面上的按钮。就是类似于传统游戏那种，有一个主界面，开始游戏，音乐馆，设置，这种

> （选项确认）键盘 ↑↓+Enter 与鼠标点击都支持；设置页：按键说明

## 用户目标

在游戏网页里提供传统主菜单，并能在音乐馆中浏览、切换播放全部游戏音乐。

## 方案与边界

主菜单三按钮（键鼠）；音乐馆读取 `music.json` 自动列曲并显示实时频谱；设置页只放按键说明。未做音量滑块、自动连播。

## 关键动作

- [x] 新增 `src/ui/` 菜单逻辑层与 `src/render/menus.js`；输入加入鼠标与 Esc；混音器接入频谱分析器
- [x] 无头 Chrome 端到端验证与截图

## 变更文件

| 文件 | 变更 |
|---|---|
| `self-cultivation/娱乐沙盒/random-try/vibe-coding/pixel-adventure/` | assets/audio/music.json、src/ui/*、src/render/*、src/core/*、src/audio/*、docs/* |
| `docs/architecture/repository-structure/modules/self-cultivation/entertainment-sandbox.md` | 更新模块描述 |

## 验证结果

| 验证项 | 结果 | 证据 |
|---|---|---|
| 语法 | PASS | `node --check` 全部 src/**/*.js |
| 端到端 | PASS | `.agents/cache/pixel-adventure-jukebox/cdp_test.mjs` + `shots/` 8 张截图，无页面异常 |

## 风险与回滚

见详细日志；`music.json` 备份在 `.agents/cache/pixel-adventure-jukebox/music.json.bak`。

## 最终成果

详细日志：`.../pixel-adventure/docs/logs/2026-10-04_10-20-31+main-menu-jukebox.md`。

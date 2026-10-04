# 主菜单与音乐馆

- 任务 ID：`2026-10-04_10-20-31+main-menu-jukebox`
- 执行模型：Antigravity（Claude Opus 5.5）

## 用户原始 Prompt

> self-cultivation/娱乐沙盒/random-try/vibe-coding/pixel-adventure
> 我思考，我们目前在这里制作了一些音乐。但我如何有一个可视化的音乐文档，并可以在我的Ubuntu本地播放音乐合集的任意一首呢

> 嗯，我思考，可以在我们的游戏web界面增加一个音乐馆功能。然后可以切换播放

> 呃，我想增加一个界面上的按钮。就是类似于传统游戏那种，有一个主界面，开始游戏，音乐馆，设置，这种

确认：操作方式为键盘 ↑↓ + Enter 与鼠标点击都支持；设置页只放按键说明。

## 方案与边界

- 标题页改为主菜单：开始游戏 / 音乐馆 / 设置。
- 音乐馆读取 `music.json` 全部 11 个曲目，选中即切换播放（复用 `MusicPlayer` 淡入淡出），底部显示实时频谱。
- 设置页只展示按键说明（原标题页操作列表移入）。
- 未做：音量滑块、自动连播、暂停菜单。

## 关键动作

- [x] `music.json` 每首曲目补充 `title` / `author` / `usage`（脚本迁移，备份在 `.agents/cache/pixel-adventure-jukebox/music.json.bak`）
- [x] `src/ui/`：`layout.js` 布局唯一来源（鼠标命中与绘制共用）、`list.js` 键鼠列表选择、`screens.js` 主菜单 / 设置与 `UI_SCREENS` 注册表、`jukebox.js` 音乐馆
- [x] `src/render/menus.js` 三个画面；`draw-kit.js` 从 `hud.js` 抽出共用绘图，新增反色按钮
- [x] `input.js` 增加 Esc 与鼠标（CSS 缩放 → 画布坐标）；`mixer.js` 音乐总线接入 AnalyserNode，点击鼠标也能唤醒 AudioContext；`audio.js` 暴露 `nowPlaying`
- [x] `game.js` 菜单状态分发到 `UI_SCREENS`

## 变更文件

| 文件 | 变更 |
|---|---|
| `assets/audio/music.json` | 新增展示字段 |
| `src/ui/{layout,list,screens,jukebox}.js` | 新增 |
| `src/render/{menus,draw-kit}.js` | 新增 |
| `src/render/{hud,renderer}.js`、`src/core/{game,input}.js`、`src/audio/{mixer,audio}.js`、`src/main.js` | 接入 |
| `docs/reports/design.md`、`docs/README.md` | 文档同步 |

## 验证结果

| 验证项 | 结果 | 证据 |
|---|---|---|
| 语法 / JSON | PASS | `node --check` 全部 `src/**/*.js`；`music.json` 可解析 |
| 端到端（无头 Chrome + CDP 真实鼠标/键盘事件） | PASS | `.agents/cache/pixel-adventure-jukebox/cdp_test.mjs`，无页面异常；截图在同目录 `shots/` |
| 主菜单 | PASS | 三按钮渲染，默认选中“开始游戏” |
| 音乐馆 | PASS | 鼠标点第 7 行 → ▶ Mercury；按 → → ▶ Mars；频谱条随音乐跳动 |
| 返回 | PASS | Esc 回主菜单；设置页点“← 返回”回主菜单 |
| 开始游戏 | PASS | 点击按钮进入“第 1 关 · 草原”，HUD 正常 |

## 风险与回滚

- 音乐馆中曲目均为循环播放，不会自动切下一首。
- 回滚：撤销上述文件改动，删除 `src/ui/`、`src/render/{menus,draw-kit}.js`，用备份恢复 `music.json`。

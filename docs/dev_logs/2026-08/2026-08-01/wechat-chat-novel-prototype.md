# 微信聊天体小说第一章 HTML 原型

- 最后变更时间：2026-08-01 11:12:40 +0800
- 业务目标：交付一个「小说正文 + 仿微信手机界面聊天记录」的静态阅读原型，创作者后续只写数据文件即可产出新章节。
- 工作区：`.agents/sandbox/2026-08/2026-08-01/2026-08-01_10-26-26+wechat-chat-novel/`（sandbox 隔离区，不进入业务内容层）

## 交付内容

- 第一章《八月，和一场没打完的团》：叙述正文 2021 字，4 段聊天共 146 条消息，单条 ≤ 15 字。
- 人物：陆时衍（清华计算机系大二）、宋知宜（清华数学系大三），配角周昀、蒋落落、韩迟、老白、徐老师通过对话带出。
- 场景覆盖：暑假北京、簋街吃饭、咖啡馆做题、什刹海骑行、FPV 穿越机、青海与北海道旅行计划、深夜对话。
- 消息类型：文本、引用回复、表情、语音、图片、链接卡片、红包、撤回系统提示、时间分割。

## 架构

数据与渲染完全分离，三层结构：

| 层 | 文件 | 职责 |
|---|---|---|
| 骨架 | `src/index.html` | 只挂载 `#app` 与按序引入模块 |
| 样式 | `src/css/{tokens,phone,chat,novel}.css` | 变量 / 手机壳 / 气泡 / 书页四份，互不越界 |
| 渲染 | `src/js/render/{dom,phone,chat,novel}.js` | DOM 工具、手机壳、消息流分派、章节交错排版 |
| 数据 | `src/js/data/characters.js`、`src/js/data/chapters/{ch01,index}.js` | 角色档案、章节内容、章节注册表 |

- 命名空间 `window.WX`，使用传统 script 而非 ES Module，保证 `file://` 双击可直接阅读。
- 新增章节：复制 `ch01.js` → 改内容 → `index.html` 加一行 script → `chapters/index.js` 的 `order` 追加 id。
- 支持 `index.html?ch=chXX` 指定章节，默认渲染 `order` 中最后一章。
- 聊天窗口默认「微信长截图」模式（`.phone--auto`），整段对话一次展开；数据块加 `fixedHeight: true` 可切回固定屏高 + 内部滚动。

## 变更文件

新增（全部位于 sandbox 任务目录内）：

```text
.gitignore
README.md
docs/plans/2026-08-01_10-26+wechat-chat-novel.md
logs/2026-08-01_10-26-26+wechat-chat-novel.md
src/index.html
src/css/tokens.css
src/css/phone.css
src/css/chat.css
src/css/novel.css
src/js/render/dom.js
src/js/render/phone.js
src/js/render/chat.js
src/js/render/novel.js
src/js/data/characters.js
src/js/data/chapters/ch01.js
src/js/data/chapters/index.js
src/tools/validate.py
output/validate.txt
output/screenshot-full.png
output/screenshot-chat.png
output/screenshot-chat-trip.png
output/screenshot-chat-night.png
output/screenshot-quote.png
```

同时新建轻量 `.agents/sandbox/.venv`（Python 3.12）供 sandbox 公共使用。

## 验证

| 门禁 | 结果 |
|---|---|
| 单条聊天消息 ≤ 15 字 | PASS（146 条，最长 9 字） |
| 叙述正文 ≥ 2000 字 | PASS（2021 字） |
| 浏览器 pageerror | PASS（0 条；4 台手机 / 150 条消息行 / 12 个段落均渲染） |
| 视觉确认 | PASS（5 张截图，状态栏、导航栏、气泡、引用、语音、链接、红包、撤回提示均正确） |

校验命令：

```bash
cd .agents/sandbox/2026-08/2026-08-01/2026-08-01_10-26-26+wechat-chat-novel
../../../.venv/bin/python src/tools/validate.py | tee output/validate.txt
```

## 时间线

- 2026-08-01 10:26:26 建立 sandbox 目录与局部 `.gitignore`
- 2026-08-01 10:28:00 与用户对齐人物姓名、内容尺度、验收方式
- 2026-08-01 10:52:00 渲染层与第一章数据完成，首轮校验正文 1909 字未达标
- 2026-08-01 10:58:00 补写三处叙述，正文 2021 字，两项门禁通过
- 2026-08-01 11:06:00 浏览器验收，改为长截图模式，输出 5 张截图
- 2026-08-01 11:12:40 补齐 README、开发日志与架构记录

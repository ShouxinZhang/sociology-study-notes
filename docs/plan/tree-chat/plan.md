# 本地 Tree Chat 实施地图

- 任务：`tree-chat`
- 开始时间：2026-08-17 16:13:14 +0800
- Last updated: 2026-08-17 17:16
- 初始规划模型：grok-4.6
- 参考采集脚本模型：gpt-5.6-sol
- 界面盘点：[aistudio-surface.md](aistudio-surface.md)
- Chat 三块规格：[chat-panel.md](chat-panel.md)
- 参考采集：[references/README.md](references/README.md)
- 落地目录：`self-cultivation/娱乐沙盒/random-try/vibe-coding/tree-chat/`

目标：先复刻 Chat 面板的 User / Thinking / Answer，再挂到对话树上。走官方 Gemini API。

## 任务地图

- [x] 盘点 AI Studio 公开工作区与 Chat 控件
- [x] 对照公开前端 `ms-chat-turn` 写出三块规格
- [x] 参考采集（用户放弃补笔记/截图，跳过剩余项）
  - [x] 油猴脚本：登录后导出 Chat Panel HTML、可见样式与资源清单
  - [x] 不把 MakerSuite JS/CSS 提交进仓库
- [x] 用户确认本计划后开工（「放弃了，从头开始 Build」）
- [x] P0 Chat 面板（最优先）
  - [x] `UserTurn`：用户 prompt + 复制/编辑
  - [x] `ThinkingBlock`：流式 Thinking... → 结束后可折叠 Thoughts
  - [x] `AnswerBlock`：最终回答 + markdown/代码块
  - [x] `Composer`：Type something + Run
  - [x] 薄代理：`includeThoughts`，流式拆 thought / answer parts（无 Key 走 mock）
- [x] P0 树：节点、路径、fork、面包屑；发送只带当前路径
- [ ] P1 壳：右栏 Run settings 子集（左树已随 P0 落地）
- [ ] P1 消息操作：重新生成、删除子树
- [x] 更新娱乐沙盒叶子记录、跑通一次「提问 → thinking → answer → 分叉」

## 目录

```text
vibe-coding/tree-chat/
├── packages/shared/   # 树域模型
├── packages/server/   # Gemini/mock 代理
├── packages/web/      # 深色 Chat + 左树
└── data/              # 本地树（gitignore）
```

## 验收

1. 一轮回复先出 Thinking，再出 Answer；结束后 Thinking 可折叠。
2. User / Thinking / Answer 三块视觉分离，和 Studio Chat 同构。
3. 任意消息可分叉，发送不带兄弟分支。
4. 仓库里没有 Google 前端源码，也没有 API Key。

## 边界

- 公开前端只当结构说明书，实现自己写。
- 不做 Live / Video / Build / 网页反代。
- P0 不做工具调用、Search grounding、多账号。

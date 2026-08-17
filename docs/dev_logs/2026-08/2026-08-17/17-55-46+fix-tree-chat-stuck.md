# 修复 Tree Chat 卡住

- 任务 ID：`2026-08-17_17-55-46+fix-tree-chat-stuck`
- 开始时间：2026-08-17 17:55:46 +0800
- 完成时间：2026-08-17 18:00:11 +0800
- 状态：completed
- 类型：repository-change
- 影响范围：`self-cultivation/娱乐沙盒/random-try/vibe-coding/tree-chat/packages/web/`
- 执行模型：grok-4.6

## 用户原始 Prompt

> 怎么一直卡住了,搞得什么飞机?

## 用户目标

修好 Tree Chat 发送后像死机、看不到回复和输入框的问题。

## 方案与边界

- 根因：网格被消息撑高，输入框和最新回复掉到视口外；每次 SSE 整页重绘把滚动弹回顶部。
- 锁死视口、钉住输入框、壳只建一次并自动滚到底。不改树协议。

## 关键动作

- [x] 给 html/grid/flex 加 `overflow:hidden` 与 `min-height:0`。
- [x] `mountShell` 只替换树和消息，不拆输入框。
- [x] 截图确认输入框钉底、最新回复可见。

## 变更文件

| 文件 | 变更 |
|---|---|
| `packages/web/src/styles/tokens.css` | 根节点禁止撑出视口 |
| `packages/web/src/styles/layout.css` | grid/flex 子项锁高度 |
| `packages/web/src/styles/chat.css` | 消息区单独滚动 |
| `packages/web/src/ui/shell.ts` | 稳定挂载，流式滚到底 |
| `packages/web/src/ui/chat/panel.ts` | 只渲染消息列表 |
| `packages/web/src/app.ts` | 改用 mountShell |
| `packages/web/src/api/client.ts` | JSON 请求 8s 超时 |
| `packages/web/vite.config.ts` | 代理超时 |
| `packages/server/src/providers/mock.ts` | mock 回显用户原文 |
| `docs/dev_logs/2026-08/2026-08-17/17-55-46+fix-tree-chat-stuck.md` | 本任务日志 |
| `docs/dev_logs/2026-08/2026-08-17/README.md` | 登记本任务 |
| `docs/dev_logs/2026-08/README.md` | 当日 7 → 8 |
| `docs/dev_logs/INDEX.md` | 2026-08 36 → 37 |

路径相对于仓库根，web/server 在 `self-cultivation/娱乐沙盒/random-try/vibe-coding/tree-chat/` 下。

## 验证结果

| 验证项 | 结果 | 证据 |
|---|---|---|
| 类型检查 | PASS | `pnpm --filter @tree-chat/web typecheck` 与 server 通过 |
| 输入框钉底 | PASS | 截图 `/tmp/tree-chat-debug/page-fixed.png` 可见 Type something + Run |
| 新回复可见 | PASS | 发送 `layout check` 后截图可见「已收到：layout check」，输入框仍在底部 |

## 风险与回滚

刷新浏览器后生效。回滚本任务对 `packages/web` 与 mock 的编辑即可。

## 最终成果

输入框钉在窗口底部，新回复不再掉到屏幕外，发送后不会再被整页重绘弹回顶部。

# Chat Panel 复刻规格

P0 只复刻 Chat 画布里的三块：User Prompt、Thinking、Answer。结构来自公开前端（Angular `ms-*` 自定义元素）和官方 thought 数据模型。自己写组件，不把 Google 的 JS/CSS 放进仓库。

## 公开前端里真实存在的壳

登录后的 Chat 是 MakerSuite Angular 应用。社区脚本长期对着这套选择器工作，和欢迎页 JS 里的 `thought: true` part 对得上：

```text
ms-app
├── ms-navbar
├── ms-autoscroll-container          # 聊天画布
│   └── ms-chat-turn
│         [data-turn-role="User"]    # 用户 prompt
│         [data-turn-role="Model"]   # thinking + answer
│         ms-chat-turn-options
│         .turn-footer
│         ms-code-block
├── ms-prompt-input-wrapper
│     textarea[aria-label="Type something"]
│     button.run-button[aria-label="Run"]
├── ms-run-settings / ms-right-side-panel
└── ms-system-instructions
```

本地对应关系（自己的名字）：

```text
ChatPanel
├── UserTurn          ← ms-chat-turn[User]
├── ModelTurn
│   ├── ThinkingBlock ← Model 回合里可折叠的 Thoughts
│   └── AnswerBlock   ← 最终回答 + 代码块
└── Composer          ← Type something + Run
```

## 数据（官方 API，不是他们的前端）

`gemini-3.7-flash` 的一轮 model 消息拆成 parts：

| part | 前端块 |
|---|---|
| `{ thought: true, text }` | ThinkingBlock |
| `{ text }` | AnswerBlock |
| `usage.thoughtsTokenCount` | Thinking 标题上的 token |

流式时官方文档用 `Thinking...` 占位，再增量推 thought summary，最后才出 answer。关 thinking 可见文本要设 `includeThoughts`；3.7 Flash 仍可能先吃 thoughts tokens。

## 三块交互

```text
UserTurn
  左/上角色标 User
  markdown 原文
  footer：复制 / 编辑 / 从这里分叉

ThinkingBlock
  流式中：展开，标题 Thinking...
  结束后：默认折叠，标题 Thoughts · N tokens
  点击展开/收起；空 thought 则整块不渲染

AnswerBlock
  markdown + 代码块
  footer：复制 / 重新生成 / 分叉
```

## 不做

不复制 `ms-*` 源码、Material 主题包、logo。只借「User 一条、Model 里 thinking 叠 answer」这套信息结构。

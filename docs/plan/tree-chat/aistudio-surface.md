# AI Studio 公开界面盘点

- 日期：2026-08-17
- 执行模型：grok-4.6
- 方法：公开 HTML/JS 路由、登录后 `ms-*` 元素名（社区脚本长期使用）、官方 thought 文档。不入库其源码。
- 内部产品名：MakerSuite（`boq-makersuite` PWA，暗色 `#000`，启动页 `/prompts/new_chat`）

## 产品工作区（公开路由）

```text
aistudio.google.com
├── /welcome                 营销首页
├── /prompts                 Prompt 库
│   ├── /prompts/new_chat    Playground / Chat   ← 我们只借这一块的信息架构
│   ├── /prompts/new_image
│   ├── /prompts/new_video
│   └── /prompts/new_data
├── /live                    Realtime streaming
├── /apps · /build           Build / 应用画廊
├── /library
├── /api-keys
├── /rate-limit · /usage
└── Dashboard / Docs（顶栏入口）
```

本地 tree-chat **不实现** Image / Video / Speech / Live / Build。

## Chat 工作区（公开前端 + 官方 quickstart）

中栏真实组件（Angular `ms-*`，登录后 Chat 页）：

```text
ms-autoscroll-container
└── ms-chat-turn
      [data-turn-role="User"]     用户 prompt
      [data-turn-role="Model"]    thinking + answer
      ms-chat-turn-options
      .turn-footer
ms-prompt-input-wrapper
      textarea[aria-label="Type something"]
      button.run-button[aria-label="Run"]
```

欢迎页 JS 里 model part 已带 `thought: true`。细节见 [chat-panel.md](chat-panel.md)。

右栏仍是 Run settings（`ms-run-settings` / `ms-system-instructions`）：模型、Temperature、Thinking、Safety、工具开关。P0 不先做右栏。

官方明确：每轮 user+model 都进 prompt，线性对话会把主线冲掉——这正是我们要加树的原因。

## 我们要做的增量

```text
Studio 壳（自绘，不抄代码）
└── Tree（AI Studio 没有）
    ├── 左栏：整棵对话树，当前节点高亮
    ├── 中栏：只渲染根→当前节点这条路径
    ├── 任意消息 fork
    └── 顶栏面包屑：根 > 主线 > 分叉
```

发送时只带当前路径，不带兄弟分支。

# Chat 面板参考采集

- 本次更新模型：gpt-5.6-sol

给其他模型的投放点。采集完成后，实现模型只读这里和 [../chat-panel.md](../chat-panel.md)。

```text
references/
├── README.md                              # 本说明
├── aistudio-chat-panel-capture.user.js    # 登录后采集 Chat Panel
├── notes/                                 # 可提交：选择器、三态交互、截图说明
└── incoming/                              # 本地暂存，不进 Git
```

## 油猴采集

1. 在 Tampermonkey 中安装或覆盖更新 `aistudio-chat-panel-capture.user.js`。
2. 登录 AI Studio，刷新页面并打开一个 Chat 对话。
3. 点击右下角“保存 Chat 前端”。

脚本会弹出“另存为”窗口并生成一个 HTML：有对话时采集 Chat Panel，没有对话时采集当前 Playground；内容包括 DOM、可见样式和原始资源 URL 清单，不含 Cookie、API Key，也不下载整站 JS bundle。对话正文会进入快照，分享前需自行检查隐私。

按钮未出现时，先确认 Tampermonkey 中脚本版本为 `0.3.1`，再强制刷新 AI Studio；控制台应出现 `[AI Studio Chat Capture] loaded`。

## 要交的

1. `notes/selectors.md`：User / Thinking / Answer / Composer 的元素、角色属性、展开按钮。
2. `notes/states.md`：Thinking 流式中、折叠后、空 thought；User 编辑；Answer 代码块。
3. `notes/shots/`：三块各至少一张截图（png）。

## 不要交

- MakerSuite / `boq-makersuite` / gstatic 上的 JS、CSS、sourcemap
- 整站镜像、cookie、API Key

那些即使下到本机，也只放 `incoming/`，不要提交。

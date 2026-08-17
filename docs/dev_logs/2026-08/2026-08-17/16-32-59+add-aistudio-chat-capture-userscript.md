# 新增 AI Studio Chat 前端采集油猴脚本

- 任务 ID：`2026-08-17_16-32-59+add-aistudio-chat-capture-userscript`
- 开始时间：2026-08-17 16:32:59 +0800
- 完成时间：2026-08-17 17:01:01 +0800
- 状态：completed
- 类型：repository-change
- 影响范围：`docs/plan/tree-chat/references/`
- 执行模型：gpt-5.6-sol

## 用户原始 Prompt

> docs/plan/tree-chat/references  
> 这里，保存[https://aistudio.google.com/prompts](https://aistudio.google.com/prompts)的前端代码，特别是chat pannel部分

> 思考一下，简单，写个油猴脚本就OK了

> 油猴脚本没有采集啊按钮显示啊？  
> `[附图：AI Studio /prompts/new_chat 页面未显示采集按钮]`

> 按了一次按钮，保存到哪里了？

> 没有“另存为”弹出啊？  
> `[附图：showSaveFilePicker 报 Failed to execute / Illegal invocation]`

## 用户目标

在 Tree Chat 参考目录中提供一个简单油猴脚本，让用户从已登录的 AI Studio 页面导出 Chat Panel 前端快照。

## 方案与边界

新增单文件 userscript：注入采集按钮，导出 Chat Panel HTML、相关 CSS 与资源清单；不保存 Cookie、API Key，也不抓取整站 JS bundle。

## 关键动作

- [x] 编写 Chat Panel 采集 userscript
- [x] 根据实机反馈加固 AI Studio 页面注入与按钮重挂
- [x] 为无历史的新 Chat 增加 Playground 回退采集和明确的“另存为”窗口
- [x] 修复 Tampermonkey 隔离 Window 导致的 `showSaveFilePicker` 非法调用
- [x] 更新参考说明、计划与架构记录
- [x] 完成静态检查和开发日志校验

## 变更文件

| 文件 | 变更 |
|---|---|
| `docs/plan/tree-chat/references/aistudio-chat-panel-capture.user.js` | 新增 Chat Panel HTML 快照采集脚本 |
| `docs/plan/tree-chat/references/README.md` | 补充安装、使用和隐私边界 |
| `docs/plan/tree-chat/plan.md` | 登记采集脚本完成状态与执行模型 |
| `docs/architecture/repository-structure/modules/repository-support/docs.md` | 更新 Tree Chat 叶子记录 |
| `docs/architecture/repository-structure/modules/repository-support/README.md` | 同步文档模块父索引 |
| `docs/dev_logs/INDEX.md` | 总任务数加一 |
| `docs/dev_logs/2026-08/README.md` | 当日任务数加一 |
| `docs/dev_logs/2026-08/2026-08-17/README.md` | 登记当前任务 |
| `docs/dev_logs/2026-08/2026-08-17/16-32-59+add-aistudio-chat-capture-userscript.md` | 记录任务及验证证据 |
| `.agents/cache/add-aistudio-chat-capture-userscript/` | 保存忽略的无头 Chrome 验证夹具与截图 |

## 验证结果

| 验证项 | 结果 | 证据 |
|---|---|---|
| JavaScript 语法 | PASS | `node --check docs/plan/tree-chat/references/aistudio-chat-panel-capture.user.js` |
| 浏览器功能 | PASS | 无头 Chrome 的正常 Chat、空白 Playground、另存为三场景均返回 `data-export="true"` |
| Picker 绑定 | PASS | 强制校验调用接收者为真实 Window，返回 `data-picker` 与 `data-export="true"` |
| 实机下载诊断 | PASS | `~/Downloads` 与 Chrome 下载记录均无新 HTML，确认旧版点击未写入文件 |
| 视觉快照 | PASS | `.agents/cache/add-aistudio-chat-capture-userscript/snapshot.png` 可见消息、输入框与资源清单 |
| 开发日志 | PASS | `python3 .agents/skills/dev-logs/scripts/validate_dev_logs.py --root docs/dev_logs --record docs/dev_logs/2026-08/2026-08-17/16-32-59+add-aistudio-chat-capture-userscript.md` |

## 风险与回滚

AI Studio 更新 DOM 结构后可能需要调整 `SELECTORS`。导出文件包含当前对话正文，分享前需检查隐私。Tampermonkey 中的旧版需在已打开的更新页确认覆盖并刷新 AI Studio。回滚时删除 userscript，并恢复本任务涉及的 README、计划、架构和日志索引行。

## 最终成果

用户获得已加固的 `0.3.1` 油猴脚本：支持 SPA 重绘后自动恢复按钮、空白新 Chat 回退采集，并在真实页面 Window 上调用“另存为”选择器。

# 增加 Tree Chat 参考采集目录

- 任务 ID：`2026-08-17_16-26-51+add-tree-chat-reference-drop`
- 开始时间：2026-08-17 16:26:51 +0800
- 完成时间：2026-08-17 16:29:01 +0800
- 状态：completed
- 类型：repository-change
- 影响范围：`docs/plan/tree-chat/`
- 执行模型：grok-4.6

## 用户原始 Prompt

> 这样吧,你创建一个源码储存文件夹,并在计划里增加download源码的模块,我让别的模型干这个事情.回头你参考就可以了

## 用户目标

给其他模型一个投放点，并把采集任务写进计划。

## 方案与边界

- 目录收选择器、交互笔记、截图。
- 不把 MakerSuite JS/CSS 列为可提交物；本地暂存放 `incoming/` 且忽略。
- 本任务不写应用代码。

## 关键动作

- [x] 建立 `references/` 与采集说明。
- [x] 在计划地图增加「参考采集」模块。
- [x] 更新 docs 叶子说明。

## 变更文件

| 文件 | 变更 |
|---|---|
| `docs/plan/tree-chat/references/README.md` | 其他模型采集说明 |
| `docs/plan/tree-chat/references/.gitignore` | 忽略 incoming 与前端包 |
| `docs/plan/tree-chat/references/notes/.gitkeep` | 占位 |
| `docs/plan/tree-chat/plan.md` | 增加参考采集勾选 |
| `docs/architecture/repository-structure/modules/repository-support/docs.md` | 计划说明同步 |

## 验证结果

| 验证项 | 结果 | 证据 |
|---|---|---|
| 采集目录可读 | PASS | `references/README.md` 写明 notes / incoming |
| 计划含其他模型模块 | PASS | `plan.md` 有「参考采集」勾选 |
| 单任务日志 | PASS | `validate_dev_logs.py --record` |

## 风险与回滚

其他模型仍可能把前端包丢进 `notes/`。发现后移出并检查 gitignore。删除本目录前先备份。

## 最终成果

其他模型可往 `docs/plan/tree-chat/references/` 投放笔记和截图；实现阶段只读该目录。

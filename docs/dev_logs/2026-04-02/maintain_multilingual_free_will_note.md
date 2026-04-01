# 维护自由意志与框架惯性多语言版本

## 修改时间
2026-04-02 04:46:47

## 修改内容
将 `llm-mock-notes/Free_Will_And_Framework_Inertia/` 维护为三语言目录结构：`en-us/`、`zh-cn/`、`jp/`。

## 结构调整
- 将旧的中文 Markdown 原稿移动到 `zh-cn/Free_Will_And_Framework_Inertia.md`
- 保持英文 LaTeX 版本位于 `en-us/tex/`
- 新建并补齐中文 LaTeX 版本 `zh-cn/tex/`
- 新建并补齐日文 LaTeX 版本 `jp/tex/`

## 编译结果
- `en-us/tex/Free_Will_And_Framework_Inertia.pdf` 已存在
- `zh-cn/tex/Free_Will_And_Framework_Inertia_zh.pdf` 已成功生成
- `jp/tex/Free_Will_And_Framework_Inertia_jp.pdf` 已成功生成
- 三个版本的中间产物均位于各自 `tex/build/`

## 涉及文件
| 文件 | 操作 | 说明 |
|------|------|------|
| `llm-mock-notes/Free_Will_And_Framework_Inertia/zh-cn/Free_Will_And_Framework_Inertia.md` | 移动 | 中文原稿归档到中文目录 |
| `llm-mock-notes/Free_Will_And_Framework_Inertia/zh-cn/tex/*` | 新增/修正 | 中文 LaTeX 版本与编译配置 |
| `llm-mock-notes/Free_Will_And_Framework_Inertia/jp/tex/*` | 新增/修正 | 日文 LaTeX 版本与编译配置 |
| `llm-mock-notes/Free_Will_And_Framework_Inertia/en-us/tex/*` | 保留 | 英文 LaTeX 版本 |
| `docs/architecture/repository-structure.md` | 修改 | 更新多语言目录结构描述 |

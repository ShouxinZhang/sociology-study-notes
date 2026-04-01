# 创建自由意志与框架惯性 LaTeX 教科书版本

## 修改时间
2026-04-02

## 修改内容
将 `Free_Will_And_Framework_Inertia.md` 的内容重写为数学系教科书风格的 LaTeX 文档，使用 Definition / Theorem / Discussion / Example / Methodology 等结构化块。

## 文件结构
```
llm-mock-notes/Free_Will_And_Framework_Inertia/tex/
├── preamble.tex                          # 模板：文档类、宏包、自定义环境
├── content.tex                           # 实际内容：定义、定理、论述、例子
├── main.tex                              # 入口文件：标题、摘要、引入 preamble + content
├── .latexmkrc                            # 构建配置（输出到 build/）
├── Free_Will_And_Framework_Inertia.pdf   # 编译产物副本
└── build/                                # 编译中间文件和 main.pdf
```

## 涉及文件
| 文件 | 操作 | 说明 |
|------|------|------|
| `llm-mock-notes/Free_Will_And_Framework_Inertia/tex/preamble.tex` | 新增 | LaTeX 引言模板（文档类、宏包、定理环境、tcolorbox 环境） |
| `llm-mock-notes/Free_Will_And_Framework_Inertia/tex/content.tex` | 新增 | 教科书风格正文内容 |
| `llm-mock-notes/Free_Will_And_Framework_Inertia/tex/main.tex` | 新增 | 入口文件 |
| `llm-mock-notes/Free_Will_And_Framework_Inertia/tex/.latexmkrc` | 新增 | Latexmk 构建配置 |
| `llm-mock-notes/Free_Will_And_Framework_Inertia/tex/Free_Will_And_Framework_Inertia.pdf` | 生成 | 编译产出 PDF |
| `docs/architecture/repository-structure.md` | 修改 | 添加 tex/ 子目录结构描述 |
| `docs/dev_logs/2026-04-02/create_free_will_latex_textbook.md` | 新增 | 本开发日志 |

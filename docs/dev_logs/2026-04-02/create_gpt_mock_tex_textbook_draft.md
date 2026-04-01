# 创建 Free Will And Framework Inertia gpt-mock 教材原型 TeX

## 修改时间
2026-04-02 05:12:52

## 修改概述
在 `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/` 工作区下新建独立的 `tex/` 子模块，不覆盖既有 `en-us/tex/`，而是先落一版更接近 textbook 形态的英文教材原型。该版本补入章节化结构、案例库、干预模式、练习层和符号附录，并完成编译验证；同时对并行写作产生的重复章节稿做了备份后清理。

## 修改文件

| 文件 | 操作 | 说明 |
|------|------|------|
| `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/.latexmkrc` | 新建 | latexmk 输出配置，统一编译到 `build/` |
| `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/main.tex` | 新建 | TeX 入口，串联章节与附录 |
| `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/preamble.tex` | 新建 | `report` 类 preamble、定理环境、教学型 box 与符号宏 |
| `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/00_overview.tex` | 新建 | 导论、学习目标、全书架构 |
| `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/01_formal_language.tex` | 新建 | 状态、惯性、激活障碍的形式语言 |
| `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/02_dynamics_and_decision_windows.tex` | 新建 | 自由意志杠杆、决策窗口与失败模式 |
| `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/03_planning_architecture.tex` | 新建 | 计划作为结构性干预的章节 |
| `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/04_case_library.tex` | 新建 | 学习、锻炼、写作、睡眠四类案例库 |
| `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/05_interventions.tex` | 新建 | 干预模式、比较表和实施模板 |
| `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/06_exercises_and_prompts.tex` | 新建 | 练习、反思题与自检表 |
| `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/appendix_a_notation_and_templates.tex` | 新建 | 符号表与规划模板附录 |
| `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/build/main.pdf` | 生成 | 编译产物，22 页教材原型 |
| `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/Free_Will_And_Framework_Inertia_Gpt_Mock.pdf` | 生成 | 便于直接查看的 PDF 副本 |
| `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/backup/tex-duplicates-2026-04-02/*` | 新建 | 删除前保留的重复章节稿与多余 PDF 备份 |
| `docs/architecture/repository-structure.md` | 更新 | 将 `gpt-mock/tex/` 纳入仓库结构文档 |
| `docs/dev_logs/2026-04-02/README.md` | 更新 | 增补本次 TeX 原型变更摘要 |
| `docs/dev_logs/INDEX.md` | 更新 | 更新总索引计数与摘要 |
| `docs/dev_logs/2026-04-02/create_gpt_mock_tex_textbook_draft.md` | 新建 | 本开发日志 |

## 验证
- 运行 `latexmk -pdf -outdir=build main.tex`，编译通过
- 生成 `build/main.pdf`，共 22 页
- 目录已包含 chapter 级结构、案例、练习与附录
- 重复章节稿已先备份后清理，主文档只保留一条章节主线

## 业务价值
这次工作把原先偏短文式的想法，升级成了一个更像教材产品的交付物。它的价值不在于“已经定稿”，而在于已经具备了更厚的目录、可复用案例、练习层和附录层，后续再扩写时不会继续退回到散文式堆字。

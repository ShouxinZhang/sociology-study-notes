# 将 gpt-mock TeX 主稿重排为研究扩展结构

## 修改时间
2026-04-02 05:29:21

## 修改概述
按照新的研究扩展计划，重排 `gpt-mock/tex/main.tex` 的章节结构，把意识生物学/状态转移、涌现与框架形成、先进动力系统三层真正接入教材主线，同时新增 frontier appendix，并为主要章节补入 `Recommended Reading` 区块。

## 修改文件

| 文件 | 操作 | 说明 |
|------|------|------|
| `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/main.tex` | 更新 | 将主稿从教材骨架版重排为研究扩展版 chapter stack |
| `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/preamble.tex` | 更新 | 新增 `readingbox` 环境，支撑每章推荐阅读模块 |
| `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/00_overview.tex` | 更新 | 改写学习目标、全书结构与证据分层政策 |
| `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/01_formal_language.tex` | 更新 | 补入推荐阅读区块 |
| `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/02_dynamics_and_decision_windows.tex` | 更新 | 补入推荐阅读区块 |
| `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/03_planning_architecture.tex` | 更新 | 补入推荐阅读区块 |
| `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/04_consciousness_biology_and_state_transitions.tex` | 新建 | 接入意识前沿生物学/状态转移研究层 |
| `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/05_emergence_and_framework_formation.tex` | 新建 | 接入涌现与框架形成章节 |
| `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/06_advanced_dynamical_systems.tex` | 新建 | 接入高等动力系统章节 |
| `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/04_case_library.tex` | 更新 | 补入推荐阅读区块 |
| `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/05_interventions.tex` | 更新 | 补入推荐阅读区块 |
| `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/06_exercises_and_prompts.tex` | 更新 | 补入推荐阅读区块 |
| `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/appendix_b_frontier_hypotheses.tex` | 新建 | 将高风险 consciousness-physics 内容隔离到 frontier appendix |
| `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tests/test-plan.md` | 更新 | 增补 evidence-grading、reading appendix 和 frontier boundary 验证 |
| `docs/plan/Free_Will_And_Framework_Inertia_Research_Expansion_Plan.md` | 更新 | 将章节顺序重排、阅读附录格式和测试更新勾选为完成 |
| `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/build/main.pdf` | 生成 | 新研究版主稿编译产物，30 页 |
| `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/Free_Will_And_Framework_Inertia_Gpt_Mock.pdf` | 覆盖生成 | 研究版 PDF 副本 |
| `docs/architecture/repository-structure.md` | 更新 | 将 `gpt-mock/tex/chapters/` 描述同步为研究层版本 |
| `docs/dev_logs/2026-04-02/README.md` | 更新 | 增补本次章节重排摘要 |
| `docs/dev_logs/INDEX.md` | 更新 | 更新当日汇总与总计数 |
| `docs/dev_logs/2026-04-02/restructure_gpt_mock_tex_for_research_layers.md` | 新建 | 本开发日志 |

## 验证
- 运行 `latexmk -pdf -outdir=build main.tex`，编译通过
- 生成 `build/main.pdf`，当前为 30 页
- `git diff --check` 通过
- 目录已扩展为 10 个 chapter 和 2 个 appendix，并为主要章节加入推荐阅读区块

## 业务价值
这次修改把研究扩展计划真正落到了成文结构里。项目不再只是“计划上有意识生物学/涌现/动力系统”，而是已经在教材主线中为这些内容预留了明确章节、证据分层和阅读入口，后续扩写时不会再回到散点式堆料。


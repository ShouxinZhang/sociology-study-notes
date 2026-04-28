# Repository Structure

> 三层展开模式：**顶级概览 → 模块小节 → 文件清单**，逐层下钻阅读。

---

## Root Directory 概览

| 路径 | 说明 |
|------|------|
| `notes/` | 主模块，分类存放学习笔记与反思 |
| `self-cultivation/` | 自我修炼与社交场景素材区 |
| `llm-mock-notes/` | LLM 生成的实验性模拟笔记 |
| `draft-notes/` | 用户原始草稿（待处理） |
| `ref/` | 参考资料 |
| `docs/` | 项目架构、计划与开发日志 |
| `.agents/` | Agent 运行缓存与归档区 |
| `.github/skills/` | 自定义 Agent Skills |
| `.gitignore` | Git 忽略规则 |
| `AGENTS.md` | Agent 指令文件 |
| `LICENSE` | 许可证 |

---

### notes/

主模块，包含 5 个分类子模块。

#### notes/Methodology_Academic_Strategy/

学习方法、数学学术、效率策略相关笔记。

| 文件 | 说明 |
|------|------|
| `Learning_Cognition.md` | 认知负荷、反馈、学习策略 |
| `Mathematics_Academic.md` | 数学学习、概率、形式化 |
| `Productivity_Strategy.md` | 工作效率、习惯、长期策略 |

#### notes/Qiushi_Study_Materials/

求是学习材料的结构化解读与政策学习笔记。

| 路径 | 说明 |
|------|------|
| `15th_Five_Year_Plan_Outline_Draft_Interpretation.md` | 2026-2030 国家五年规划纲要概述解读 |
| `Historical_Social_Development_Frameworks/` | 可复用的历史与社会发展解读框架 |
| ↳ `Historical_And_Social_Development_Framework.md` | 通过历史发展解读公正、斗争、成长与秩序的统一框架 |
| `Key_Paragraph_Interpretations/` | 重点政策段落的深度解读 |
| ↳ `Strategic_Determination_In_Uncertain_Times.md` | 不确定性下战略定力的深度解读 |
| ↳ `Leadership_And_Political_Alignment_In_Daily_Life.md` | 从治理逻辑和日常案例解读政治对齐语言 |
| ↳ `Open_Cooperation_And_Mutual_Benefit_In_Daily_Life.md` | 从发展逻辑和日常案例解读开放合作与互利 |
| ↳ `Eliminating_Two_Faced_Officials.md` | "两面人"治理逻辑深度解读 |
| ↳ `Tight_Budget_For_Better_Lives.md` | 政府紧日子与民生好日子的辩证关系解读 |
| `Practical_Scenario_Interpretations/` | 将政策逻辑映射到日常决策的场景笔记 |
| ↳ `How_To_Handle_Threatening_People_Without_Self_Damage.md` | 先离开危险不等于放纵攻击者 |
| ↳ `How_To_Prioritize_When_Energy_Is_Limited.md` | 精力有限时如何战略排优先级 |
| ↳ `How_To_Understand_Shibian_Yingbian_Qiubian_When_Capability_Is_Insufficient.md` | 能力不足时如何理解识变应变求变 |
| `MyProblems/` | 从求是与政策学习中衍生的实践决策笔记 |
| ↳ `Agent_Developer_5_Year_Focus.md` | Agent 开发者五年聚焦与能力建设 |
| ↳ `Graduate_Student_5_Year_Focus.md` | 研究生五年行动与行业方向指引 |
| ↳ `Employment_And_Entrepreneurship_Advice.md` | 就业创业实用建议 |

#### notes/Philosophy_Life_Reflection/

个人哲学、生命叙事与工具类笔记。

| 文件 | 说明 |
|------|------|
| `Idea_Management.md` | 想法/问题的可视化与价值 |
| `Personal_Growth_Philosophy.md` | 内在成长、梦想、心态 |
| `Life_Tools_Misc.md` | 日常生活观察、专用工具 |

#### notes/Social_Interaction_Skills/

日常沟通、关系建设与低压社交的实践笔记。

| 文件 | 说明 |
|------|------|
| `Topics_For_Less_Familiar_Friends.md` | 中国语境下按关系、年龄、职业等选择安全话题的分层指南 |
| `Real_Chat_Examples_And_Techniques.md` | 脱敏真实聊天案例与可复用社交技巧 |

#### notes/Speculative_Deep_Dives/

实验区，用于模糊想法、讨论和假设场景的深度思辨。

| 文件 | 说明 |
|------|------|
| `AI_Era_Learning_Confusion_And_Human_Stratification.md` | AI 加速学习、学习者 vs 研究者鸿沟、认知分层 |
| `Formalized_Tasks_Economic_Distribution_And_Post_Survival_Vision.md` | 形式化任务陷阱、经济分配不平等、后生存时代愿景 |
| `Intrinsic_Human_Differentiation.md` | 状态完全重置后的人类价值思想实验 |
| `Existential_Void_Dreams_And_The_Meaning_Of_Happiness.md` | 存在虚无、梦想重量、幸福碎片性与穿越黑暗的哲学 |
| `AI_Tool_Boundaries_And_Human_Irreplaceability.md` | AI 工具边界、"许愿机"陷阱、人的不可替代性 |
| `Masters_As_Summer_Hobby_In_AGI_Era.md` | 硕士生涯在百年时间线上的相对性：核心隐喻、兴趣与生产力错配、2126 年畅想、有限生命与无穷探索 |

---

### self-cultivation/

自我修炼与对话素材沉淀区。

| 路径 | 说明 |
|------|------|
| `chat-with-bot.md` | 社交媒体对话截图、背景链接与跟帖回复素材 |
| `image/` | `chat-with-bot.md` 等自我修炼素材的配图资源目录 |
| `plan.txt` | 自我修炼相关临时计划文本 |
| `self-talk-with-llm.txt` | 与 LLM 的自我对话草稿沉淀 |
| `天赋探索/` | 面向个人能力结构、潜在优势与后续自我盘点问题的分析子模块 |
| ↳ `analysis.txt` | 基于学习、记忆、运动、想象力与天赋组合视角的分析文档，含追问清单与 v2 判断 |
| ↳ `Claude/` | Claude 生成的天赋分析衍生文档 |
| ↳ `Claude/career_paths_and_skill_roadmap.md` | 基于天赋组合的三条职业路径与分阶段技能栈路线图，含杠杆点、短板补足与退出策略 |
| ↳ `Claude/one_year_verification_plan.md` | 以软件开发为载体的一年天赋验证计划，含季度拆分、产出物清单、月度自检与项目序列 |
| ↳ `Claude/talent_landing_strategy.md` | 天赋落地策略与作品集构建方法：转化框架、五种作品类型指南、作品集构建、组合稀缺性表达、持续产出习惯系统 |
| ↳ `Claude/meta_attributes_assessment_framework.md` | 元属性识别与自评框架：天赋之外的底层属性（意志力、情绪韧性、延迟满足等）定义、基于原文的初步画像、场景化自评问卷、人生阶段 ROI 分析 |
| ↳ `Claude/meta_attributes_training_strategy.md` | 面向天赋落地的元属性训练策略：执行启动力、专注持久力、抗挫折韧性、延迟满足、注意力管理的场景化训练方法及 30 天启动计划 |
| ↳ `Claude/meta_talent_interaction_analysis.md` | 元属性与天赋交互机制分析：天赋-元属性交互模型、六大天赋模块元属性依赖图谱、瓶颈诊断、杠杆效应、常见误区警告 |
| `古文学习/` | 古文原文与现代汉语译文练习子模块 |
| ↳ `1.txt` ~ `9.txt` | 《兰亭集序》《赤壁赋》《桃花源记》《滕王阁序》《春夜宴从弟桃花园序》《谏太宗十思疏》《阿房宫赋》《送东阳马生序》《游褒禅山记》原文与译文 |
| `book_reading/` | 书籍阅读与长篇文献转写/翻译工作区 |
| ↳ `resources/` | 原始 PDF 资源目录 |
| ↳ `resources/book_9780262369978.pdf` | 《Active Inference》原始 PDF |
| ↳ `book_9780262369978.txt` | 基于 PDF 文本层抽取并清洗后的全书纯文本稿 |
| ↳ `QA/` | 基于长篇阅读材料的问答、推导式回答与专题澄清子目录 |
| ↳ `QA/1.md` | 基于《Active Inference》全文，对自由能、意识产生与意识-记忆关系的定理化回答 |
| ↳ `tex/` | 长篇阅读材料的独立 TeX 工作区根目录 |
| ↳ `tex/book_9780262369978/` | 《Active Inference》中文 TeX 工作区 |
| ↳ `tex/book_9780262369978/main.tex` | 中文版主入口，组织 front matter、章节与附录 |
| ↳ `tex/book_9780262369978/preamble.tex` | 版式、页眉页脚与常用环境配置 |
| ↳ `tex/book_9780262369978/frontmatter.tex` | 版本说明与原书元信息 |
| ↳ `tex/book_9780262369978/sections/` | 按 section 拆分的中文章节/附录 TeX 文件 |
| `虚拟朋友圈/` | 面向“虚拟朋友圈”系列内容的独立素材子模块 |
| ↳ `1.md` | 梦境门世界原始中文图文稿 |
| ↳ `image/1/` | `1.md` 使用的 4 张原始配图 |
| ↳ `tex/` | `1.md` 的独立中文 LaTeX 工作区与编译输出 |
| ↳ `tex/main.tex` | 英文主文 + 中文逐段译文的 LaTeX 主入口 |
| ↳ `tex/preamble.tex` | 页面样式、图文排版与译文盒样式配置 |
| ↳ `tex/content.tex` | 梦境叙事、配图、感悟与虚拟评论区的双语正文 |
| ↳ `tex/main.pdf` | 编译生成的 A4 双语图文 PDF，含 3 则虚拟短评 |
| ↳ `diverse_worlds_match/` | 面向“不同世界观是否匹配”主题的轻量英文内容实验子目录 |
| ↳ `diverse_worlds_match/1.md` | 将《我的叔叔于勒》与数学系数值分析、神经网络梗结合后润色翻译成中文的趣味短篇 |
| ↳ `diverse_worlds_match/my_uncle_jules_en_public_domain.txt` | 从 Project Gutenberg 公版英文卷宗中抽取的《My Uncle Jules》英文全文 |

---

### llm-mock-notes/

LLM 生成的实验性模拟笔记，附多语言 LaTeX 教科书版本。

| 路径 | 说明 |
|------|------|
| `Free_Will_And_Framework_Inertia/` | LaTeX 教科书版本（多语言） |
| ↳ `en-us/` | 英文版目录 |
| ↳ `en-us/tex/` | 英文版 LaTeX 源码与编译输出 |
| ↳ `gpt-mock/` | 面向教材化重构的活跃工作区，现保留上下文、来源、TeX 主稿、中文主稿与审阅层 |
| ↳ `gpt-mock/context/` | 任务背景与上下文冻结文档 |
| ↳ `gpt-mock/sources/` | 研究扩展所需的本地 PDF、元数据索引与期刊跟进记录 |
| ↳ `gpt-mock/sources/pdfs/` | 已成功下载的 arXiv 论文 PDF |
| ↳ `gpt-mock/sources/metadata/` | Science 跟进记录与其他元数据文档 |
| ↳ `gpt-mock/tex/` | 英文教材原型的独立 TeX 工作区与编译输出 |
| ↳ `gpt-mock/tex/chapters/` | 分章节正文，现已由平铺编号文件重构为 chapter-folder tree；每章以 `chapter.tex` 为入口并拆分为多个可并行写作的子文件，研究层章节、案例库、练习与 frontier appendix 都已纳入新结构；当前 `Exercises and Reflection Prompts` 已新增面向读者直达求解的 `reader_questions/` 问答层，`Dynamics and Decision Windows` 与 `Consciousness Biology and State Transitions` 也已进一步加厚机制层、失败模式层与证据桥接层 |
| ↳ `gpt-mock/tex-zh-cn/` | `gpt-mock` 教材原型的正式中文 TeX 工作区与编译输出，现已切换主入口到 chapter-folder tree |
| ↳ `gpt-mock/tex-zh-cn/chapters/` | 中文版分章节正文，现与英文研究版同步采用 chapter-folder tree，并以 `chapter.tex` 作为各章入口；当前 `Exercises` 章节也已补齐 `reader_questions/` 快速问答层，与英文主稿保持同构 |
| ↳ `gpt-mock/tex/Free_Will_And_Framework_Inertia_Gpt_Mock.pdf` | gpt-mock 教材原型 PDF 副本 |
| ↳ `gpt-mock/zh-cn-review/` | 面向审阅的中文陪审文档，不直接替代正式中文 LaTeX 稿 |
| ↳ `gpt-mock/zh-cn-review/research_expansion_review.md` | 当前 research-backed 教材原型的中文审阅说明，现已覆盖应用层升级、第二章模型诚实化、第四章证明链加固，以及 Chapter 5/6 深化后的研究层升级 |
| ↳ `zh-cn/` | 中文版目录，包含中文 Markdown 原稿与 LaTeX 版本 |
| ↳ `zh-cn/Free_Will_And_Framework_Inertia.md` | 中文科学方法论笔记原稿 |
| ↳ `zh-cn/tex/` | 中文版 LaTeX 源码与编译输出 |
| ↳ `jp/` | 日文版目录 |
| ↳ `jp/tex/` | 日文版 LaTeX 源码与编译输出 |

---

### draft-notes/

用户原始草稿文件，待处理。

| 文件 | 说明 |
|------|------|
| `1.txt` ~ `6.txt` | 原始草稿 |

---

### ref/

参考资料。

| 文件 | 说明 |
|------|------|
| `1.txt` ~ `3.txt` | 参考文本 |

---

### .github/skills/

自定义 Agent Skills。

| 路径 | 说明 |
|------|------|
| `sociology-note-formatter/` | 笔记格式化与分类 Skill |
| `plan-subagent-orchestrator/` | 通用计划驱动型协调 Skill，现以中文正文维护，用于上下文冻结、计划拆解、subagent 分发、验证门禁与收尾同步 |

### .agents/

Agent 运行缓存与归档区。

| 路径 | 说明 |
|------|------|
| `cache/` | 不再进入版本控制的陈旧计划、测试、备份与草稿缓存 |
| `cache/gpt-mock/` | 从 `llm-mock-notes/.../gpt-mock/` 迁出的历史 `backup/`、`plan/`、`tests/` 与 `subagent-drafts/` |

## Docs

| 路径 | 说明 |
|------|------|
| `dev_logs/` | 按日期归档的开发周期日志，记录修改时间、业务目的、变更文件与验证结果 |

### docs/architecture/

仓库自身的架构文档。

| 文件 | 说明 |
|------|------|
| `repository-structure.md` | 本文件 |

### docs/plan/

面向跨轮次任务协调的计划文档。

| 文件 | 说明 |
|------|------|
| `old/` | 已归档的历史计划 |
| `old/Free_Will_And_Framework_Inertia_Gpt_Mock_Coordination_Plan_2026-04-02.md` | 第一轮 gpt-mock 协调计划归档 |
| `Free_Will_And_Framework_Inertia_Research_Expansion_Plan.md` | 面向意识前沿研究、涌现、动力系统与推荐阅读层的新主计划 |
| `Free_Will_And_Framework_Inertia_Reader_QA_Acceleration_Plan.md` | 面向 `Exercises` 章节快速问答入口、subagent 分发与集成验收的新计划 |

### docs/dev_logs/

开发日志，采用三层 folder tree 加载模式（类数据库分区索引）。

| 层级 | 路径 | 说明 |
|------|------|------|
| 第一层 | `INDEX.md` | 总索引，按日期汇总所有变更，支持快速定位与快照回滚 |
| 第二层 | `<date>/README.md` | 日期级摘要，列出当天所有变更记录的一行摘要与链接 |
| 第三层 | `<date>/<change>.md` | 具体变更记录，含文件修改列表、时间戳、业务动机 |

日期文件夹: `2026-02-03/`, `2026-02-05/`, `2026-03-13/`, `2026-03-16/`, `2026-03-23/`, `2026-03-27/`, `2026-03-28/`, `2026-03-30/`, `2026-04-02/`, `2026-04-03/`, `2026-04-04/`, `2026-04-05/`, `2026-04-06/`, `2026-04-19/`.

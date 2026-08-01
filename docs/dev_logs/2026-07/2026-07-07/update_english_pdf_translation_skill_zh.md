# 工作区级英文论文中文 TeX/PDF 翻译 Skill 更新

## 基本信息

- 修改时间：2026-07-07 17:28:11 CST
- 任务类型：工作区级 Skill 维护
- 目标：`.github/skills/english-pdf-paper-translation`
- 业务结果：把近期多篇 arXiv、OpenReview、PMLR 论文翻译任务中沉淀出的稳定流程写入 Skill，使后续论文翻译默认使用中文规则、官方模板复用、分层 TeX 产物和可验证收尾。

## 修改文件

- `.github/skills/english-pdf-paper-translation/SKILL.md`
  - 改为中文主体说明。
  - 压缩为 58 行总控规则，明确完整翻译、源码优先、模板优先、结构保真、prompt 工件保真、字体策略、长文 subagent 分工、验证门禁和仓库收尾。
- `.github/skills/english-pdf-paper-translation/references/arxiv-source-workflow.md`
  - 改为中文 arXiv/官方源码工作流。
  - 增补 arXiv PDF/abs/html/e-print 归档、官方 source 编译、中文工作区复制、XeLaTeX/CJK 最小改造、分段翻译、编译和 QA 规则。
- `.github/skills/english-pdf-paper-translation/references/pdf-only-workflow.md`
  - 改为中文 PDF-only 工作流。
  - 明确 PDF-only 重建不能冒充官方源码，补入文本层抽取、页面渲染、图形裁剪、阅读顺序优先和验证规则。
- `.github/skills/english-pdf-paper-translation/agents/openai.yaml`
  - 使用 Skill Creator 脚本重建中文 UI 元数据和中文默认提示。
- `docs/architecture/repository-structure.md`
  - 更新该 Skill 的架构登记，反映中文维护、官方模板复用、prompt 工件保真和验证门禁。
- `docs/dev_logs/2026-07/2026-07-07/README.md`
  - 新增当天日志索引。
- `docs/dev_logs/INDEX.md`
  - 新增 2026-07-07 分区记录并更新总记录数。

## 实现说明

- 采用“主 Skill 精简 + reference 分流”的结构：主文件只保留高频硬规则和路由，arXiv/source 与 PDF-only 细节分别进入 reference。
- 保留英文 skill name `english-pdf-paper-translation`，保证已有调用方式不变；正文、UI 说明和默认提示改为中文。
- 明确后续翻译任务应优先复用官方英文模板和数学字体，减少中文版与英文版视觉差异。
- 明确 prompt、tool schema、JSON、raw transcript、system/user prompt 等论文实验工件默认保留英文，避免把实验材料误翻译成普通正文。

## 验证

- 使用 Skill Creator 生成器更新 `agents/openai.yaml`：
  - `python3 /home/wudizhe001/.codex/skills/.system/skill-creator/scripts/generate_openai_yaml.py ...`
- 使用 Skill Creator 校验脚本验证 Skill frontmatter、命名和基础结构：
  - `python3 /home/wudizhe001/.codex/skills/.system/skill-creator/scripts/quick_validate.py .github/skills/english-pdf-paper-translation`
  - 结果：`Skill is valid!`

## 回滚定位

- 主要变更集中在 `.github/skills/english-pdf-paper-translation/`。
- 若需要回滚，可恢复该 Skill 目录下四个文件，并恢复本日志、`docs/dev_logs/INDEX.md` 与 `docs/architecture/repository-structure.md` 中对应记录。

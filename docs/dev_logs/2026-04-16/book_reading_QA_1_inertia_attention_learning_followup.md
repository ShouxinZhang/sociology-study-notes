# 开发日志：Active Inference 问答稿再续答

- 时间：2026-04-16 02:06:37
- 任务：继续在 `self-cultivation/book_reading/QA/1.md` 中追加四个问题的定理化回答：
  1. 人为什么会有惰性
  2. 为什么人不喜欢做慢反馈的事情
  3. 人的注意力机制如何工作
  4. 天才的记忆力和学习速度比普通人强很多，为什么

## 本轮业务结果

- 补齐了关于行为惰性、慢反馈厌恶、注意力机制与高水平学习者机制的四组回答。
- 在方法上，继续坚持把问题压回主动推断框架，不用泛泛心理学常识替代书中框架。
- 对“天才”“10-20 倍”这样的高风险定量说法，明确写成框架内解释假说，而非作者原书已证结论，从而控制引用风险。

## 修改文件

- `self-cultivation/book_reading/QA/1.md`
- `docs/dev_logs/2026-04-16/book_reading_QA_1_inertia_attention_learning_followup.md`

## 具体修改

### 1. `self-cultivation/book_reading/QA/1.md`

- 新增“再续答：惰性、慢反馈、注意力与‘天才学习速度’”部分。
- 新增一段边界说明，标明四问中哪些有较强原书支撑，哪些属于依框架推演。
- 新增“定理 7”，把惰性解释为审议性、持续性、习惯先验和复杂度成本共同作用的结果。
- 新增“定理 8”，把慢反馈任务的不受偏好解释为策略精度提升慢、信用分配链条长、时间深度要求高和复杂度成本高。
- 新增“定理 9”，将注意力直接定义为与感觉输入相关联的精度，并区分注意与显著性。
- 新增“定理 10”，把高水平学习者的优势解释为精度分配、时间深度、结构学习、复杂度承受和模型更新效率等多机制联合占优。
- 最后新增 `结论 G/H/I/J`，压缩出本轮四个问题的管理层版本结论。

### 2. `docs/dev_logs/2026-04-16/book_reading_QA_1_inertia_attention_learning_followup.md`

- 新增本轮续答日志，记录任务目标、业务结果、修改文件和边界处理方式。

## 依据材料

- `self-cultivation/book_reading/tex/book_9780262369978/sections/06_message_passing.tex`
- `self-cultivation/book_reading/tex/book_9780262369978/sections/08_discrete_time.tex`
- `self-cultivation/book_reading/tex/book_9780262369978/sections/10_other_theories.tex` 中关于控制、强化学习、有限理性、习惯与审议行为的章节内容
- `self-cultivation/book_reading/tex/book_9780262369978/sections/11_unified_theory.tex`
- `self-cultivation/book_reading/book_9780262369978.txt`

## 备注

- 本轮没有新增目录或模块，因此未修改 `docs/architecture/repository-structure.md`。
- 本轮为文档型续写任务，未涉及编译、测试、删除或回滚。

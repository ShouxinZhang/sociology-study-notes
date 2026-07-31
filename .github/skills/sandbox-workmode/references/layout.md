# Sandbox 目录结构规则

每个 sandbox 任务目录应像一个轻量代码仓库，而不是只把文件堆进 `output/`。

## 默认结构

```text
docs/            # 说明文档、分析记录、设计稿、结论文档
docs/plans/      # 长程任务地图、阶段计划、打钩状态
docs/reports/    # 用户要求的报告、汇报、学术分析、回答草稿
src/             # 主要资源、脚本、原型代码、输入素材
logs/            # prompt 任务记录、验证记录、命令日志
output/          # 代码或脚本运行产生的输出文件
```

## 放置规则

- `docs/`: 用来写给人看的材料，例如设计讨论、方案解释、README；计划与报告草稿分别进入对应子目录。
- `docs/plans/`: 用来放多份计划文件，例如主计划、P1/P2 阶段计划、迁移计划；新建文件名默认 `YYYY-MM-DD_HH-MM+slug.md`。
- `docs/reports/`: 用来放用户要求写出的自由格式 report，例如老板汇报、学术说明、调研结论、回答草稿；新建文件名默认 `YYYY-MM-DD_HH-MM+slug.md`，不要把它当日志模板。
- `src/`: 用来放主要工作资源，例如脚本、Notebook、实验代码、数据处理配置、输入样例。
- `logs/`: 用来放任务验收索引和执行日志；每个用户 prompt 必须有独立 Markdown 任务记录。
- `output/`: 只放运行产生的文件，例如图表、JSON、CSV、编译结果、模型输出、截图。

## 禁止倾向

- 不要把 `output/` 当作“最终结果”目录。
- 不要把 plan 或 report 平铺在 `docs/` 根目录。
- 不要把脚本默认放到 `scripts/`；新的 sandbox 默认使用 `src/`。
- 不要用 `tmp/` 作为常规中间文件目录；确实需要时可在 `output/tmp/` 或 `src/tmp/` 下局部创建，并在日志中说明。

## 最终汇报

收尾时分别说明：

- 文档：`docs/...`
- 计划：`docs/plans/...`
- 报告草稿：`docs/reports/...`
- 资源/代码：`src/...`
- 日志：`logs/...`
- 运行输出：`output/...`

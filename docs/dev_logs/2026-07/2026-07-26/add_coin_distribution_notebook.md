# 新增硬币分布实验 Notebook

- **修改时间**：2026-07-26 10:01:57 CST
- **业务目标**：通过可交互的 Jupyter Notebook 模拟大量公平硬币投掷，直观观察正面频率向理论概率 $0.5$ 靠近的现象。

## 具体变更

| 文件 | 变更类型 | 内容 |
|---|---|---|
| `self-cultivation/娱乐沙盒/random-try/vibe-coding/硬币分布实验/硬币分布实验.ipynb` | 新增 | 提供公平硬币投掷函数、默认参数 `N = 10000` 及正面次数与频率输出 |
| `docs/architecture/repository-structure/modules/self-cultivation/entertainment-sandbox.md` | 更新 | 登记 vibe-coding、硬币分布实验目录及 Notebook 的用途 |
| `docs/architecture/repository-structure/modules/self-cultivation/README.md` | 更新 | 在娱乐沙盒入口中补充随机模拟的业务定位 |
| `docs/dev_logs/2026-07/2026-07-26/README.md` | 新增 | 建立当天开发日志索引并登记本记录 |
| `docs/dev_logs/INDEX.md` | 更新 | 登记 2026-07-26 的开发变更并同步汇总数量 |

## 内容边界

- 实验只依赖 Python 标准库，不增加第三方运行依赖。
- 使用独立函数封装模拟逻辑，参数单元格负责调整实验次数，结果单元格负责展示统计值。
- 每次投掷以相同概率产生正面或反面；实验结果会随每次运行而变化。

## 验证结果

- 使用 Python 标准库完成 Notebook JSON 解析，确认 `nbformat = 4`，Markdown、函数、参数和运行单元结构完整。
- 按 Notebook 原有顺序成功执行全部代码单元；默认实验完成 10,000 次投掷并输出正面次数与频率。
- 自定义 `N = 37` 的实验通过计数与频率一致性检查；`0`、负数、浮点数和布尔值均被正确拒绝。
- `git diff --check` 通过，变更文件没有行尾空白或补丁格式错误。

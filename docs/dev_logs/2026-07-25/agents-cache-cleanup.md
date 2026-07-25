# .agents/cache 磁盘占用排查与清理

- 日期：2026-07-25
- 操作时间：2026-07-25 （本地时区，清理与清单生成于同一批次执行）
- 类型：本地运行时缓存清理 / 仓库配置微调

## 背景

用户反馈仓库内 `.agents` 目录占用磁盘异常巨大，要求排查并清理。

## 排查结论

`.agents` 清理前总计 **8.5 GB**，构成如下：

| 路径 | 大小 | 说明 |
| --- | --- | --- |
| `.agents/cache/book_9780262369978_ocr_translation/.venv` | 8.2 G | OCR 翻译任务的 Python 虚拟环境，内含 vLLM + PyTorch(CUDA) 全套依赖 |
| `.agents/cache/vscode_insiders_update/*.deb` | 176 M | 下载的 VS Code Insiders 安装包 |
| `.agents/cache/docx_convert/.venv` | 31 M | docx 转换任务虚拟环境 |
| 其余 30+ 个任务缓存目录 | 各 ≤ 32 M | 论文翻译类中间产物，量级正常 |

单文件 Top 体积（均位于 OCR 任务 venv 内）：`libcublasLt.so.13` 542M、`libtorch_cuda.so` 456M、`libtorch_cpu.so` 451M、`vllm/_C.abi3.so` 438M、`libtriton.so` 416M、`libcufft.so.12` 287M 等。

根因：agent 在任务缓存目录内单独创建了重型 GPU 推理虚拟环境，未复用仓库根 `.venv`。

`.gitignore` 原已排除 `.agents/cache/`，因此该体积仅影响本地磁盘，不影响 Git 仓库大小。

## 变更内容

### 新增（本地，不入库）

- `.agents/manifest/2026-07-25-cache-sizes.txt`（35 行）：删除前各缓存目录体积快照
- `.agents/manifest/2026-07-25-cache-tree.txt`（436 行）：删除前缓存目录结构（深度 3，排除 venv 内部）
- `.agents/manifest/2026-07-25-book_9780262369978_ocr_translation-requirements.txt`（179 行）：OCR 任务 venv 依赖清单，供将来重建
- `.agents/manifest/2026-07-25-docx_convert-requirements.txt`（3 行）：docx 转换任务 venv 依赖清单

### 删除

- `.agents/cache/` 全部内容（8.5 G），随后重建为空目录

### 修改

- `.gitignore`：在 Agent 运行时缓存段落追加 `.agents/manifest/`，使清单同样保持本地化，不污染仓库

## 结果验证

- `du -sh .agents` → **64K**（清理前 8.5G，释放约 8.5 GB）
- `.agents/cache/` 存在且为空
- `git status --short` 中 `.agents/` 已不再作为未跟踪项出现

## 后续约定

`.agents/cache/` 仅存放轻量脚本与中间文本产物；重型 Python 依赖统一安装到仓库根 `.venv`，禁止在任务缓存目录内新建含 CUDA/PyTorch/vLLM 的虚拟环境。

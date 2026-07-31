# Sandbox Python Environment

## 统一规则

1. `.agents/sandbox/.venv` 是整个 sandbox 的唯一通用 Python 环境。
2. 日期任务目录内默认禁止创建私有 `.venv`，避免重复安装 PyTorch、CUDA、NumPy、SciPy 等重包。
3. `.agents/sandbox/.venv` 必须通过 `.agents/skills/shared-python-env/scripts/setup_shared_env.sh attach` 接入共享重包环境。
4. 重型依赖只放在 `~/Documents/GitHub/.shared-python-envs/`；sandbox `.venv` 只承担轻量隔离和共享路径接入。

## 初始化

当前仓库推荐使用已有 Python 3.12 共享环境：

```bash
bash .agents/skills/sandbox-workmode/scripts/ensure_sandbox_venv.sh
```

该脚本等价于在缺失时调用：

```bash
SHARED_ENV_NAME=py312-torch-cu130 \
  bash .agents/skills/shared-python-env/scripts/setup_shared_env.sh attach "$(pwd)/.agents/sandbox"
```

初始化后应存在：

```text
.agents/sandbox/.venv/
.agents/sandbox/.venv/lib/python*/site-packages/_shared_heavy_packages.pth
```

## 使用方式

优先显式调用 sandbox 解释器：

```bash
.agents/sandbox/.venv/bin/python <script.py>
.agents/sandbox/.venv/bin/python -m pip list
```

需要交互时再激活：

```bash
source .agents/sandbox/.venv/bin/activate
```

## 依赖策略

1. 安装依赖前先检查 `.agents/sandbox/.venv/bin/python -m pip list`。
2. 不在任务目录内安装重型依赖；需要新重包时先维护 `shared-python-env`。
3. 轻量且跨任务复用的依赖可以安装到 `.agents/sandbox/.venv`，并记录到任务日志。
4. 若任务确实存在强版本冲突，先向用户说明冲突与替代方案，不直接新建任务私有 `.venv`。

## 清理策略

旧任务目录中遗留的私有 `.venv` 属于清理候选。清理前至少确认：

1. 该任务目录没有运行中的进程。
2. `.venv` 不是仍被其他任务目录符号链接引用的目标。
3. 任务输出、日志、源码和数据不依赖 `.venv` 内的非公开文件。

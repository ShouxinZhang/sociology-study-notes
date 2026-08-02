# 创建并应用多语言共享开发环境 Skill

- 任务 ID：`2026-08-02_08-33-01+manage-shared-dev-environment`
- 开始时间：2026-08-02 08:33:01 +0800
- 完成时间：2026-08-02 08:43:15 +0800
- 状态：completed
- 类型：repository-change + environment
- 影响范围：仓库级 Skills、Agent sandbox、Python/Node/Rust 本地开发环境
- 执行模型：OpenAI Codex（GPT-5）

## 用户原始 Prompt

> /home/wudizhe001/Documents/GitHub/sociology-study-notes/.agents/sandbox/.venv
> 我注意到这个和/home/wudizhe001/Documents/GitHub/sociology-study-notes/.venv重复了
> 有鉴于我们可能还会开发npm，我认为最好在根目录create一个集成各种语言的环境总库，然后后续利用的时候从这个文件夹继承，例如py3.14, ts, rust等

> 现有沙盒初始化脚本引用了不存在的 .agents/skills/shared-python-env，规范已失效。
> 【这是从别的仓库迁移来的SKILL陈述】
> 我的意思是，我们可以额外创造一个新的集成环境SKILL

> seems great, 无需确认，接下来你自己干

## 用户目标

创建一个可复用的仓库级多语言环境 Skill，用统一入口管理 Python、Node/TypeScript 和 Rust 的环境发现、初始化、接入与验证；随后用该 Skill 消除当前两个 Python 虚拟环境的重复占用。

## 方案与边界

新建 `manage-shared-dev-environment` Skill，以 `.agents/runtime/` 作为本地环境库。Python 3.14 使用单一共享 venv，并为根目录和 sandbox 保留兼容入口；Node/TypeScript 复用 nvm 与 pnpm 内容寻址仓库；Rust 复用 rustup/cargo 缓存。现有 Node、pnpm、Rust 工具链不升级、不重装，不共享易互相污染的 `node_modules` 或 Rust 编译产物。

## 关键动作

- [x] 2026-08-02 08:33:01 +0800：固定任务时间并完成现状与架构审查。
- [x] 使用标准初始化器创建 Skill，将主入口、通用安全逻辑及三种语言治理拆分为独立模块。
- [x] 在临时 Git 仓库演练 `init/attach-python/validate`，并验证重复执行不创建额外备份。
- [x] 首次恢复因两个非 PyPI 包丢失 VCS 来源而停止；改用 `pip freeze` 保留 Git commit 后重试成功，旧环境未在失败阶段移动。
- [x] 逐一导入 17 个迁移包并通过依赖检查后，将两个旧 venv 完整备份并接入共享 Python 3.14 环境。
- [x] 将 `sandbox-workmode` 改为委托新 Skill，删除外部仓库的失效路径假设。
- [x] 更新忽略规则、架构叶子记录、直接父索引、实施地图和开发日志索引。
- [x] 完成 Skill、Bash、工具链、依赖等价性、幂等性、路径防护和 Git 差异检查。

## 变更文件

| 文件 | 变更 |
|---|---|
| `.github/skills/manage-shared-dev-environment/SKILL.md` | 新增多语言环境核心工作流、脚本接口和安全边界 |
| `.github/skills/manage-shared-dev-environment/agents/openai.yaml` | 新增中文 UI 元数据和默认调用提示 |
| `.github/skills/manage-shared-dev-environment/references/architecture.md` | 新增共享运行库结构、生命周期和恢复原则 |
| `.github/skills/manage-shared-dev-environment/references/python.md` | 新增 Python ABI、依赖快照、验证和冲突规则 |
| `.github/skills/manage-shared-dev-environment/references/node-typescript.md` | 新增 nvm/pnpm 原生复用与项目隔离规则 |
| `.github/skills/manage-shared-dev-environment/references/rust.md` | 新增 rustup/cargo 复用与编译产物边界 |
| `.github/skills/manage-shared-dev-environment/scripts/manage-runtime.sh` | 新增 `inspect/init/attach-python/validate` 薄命令入口 |
| `.github/skills/manage-shared-dev-environment/scripts/lib/common.sh` | 新增路径解析、唯一备份目录、相对软链接和通用校验逻辑 |
| `.github/skills/manage-shared-dev-environment/scripts/lib/python.sh` | 新增 VCS 来源保真的依赖快照、Python 环境迁移和 ABI 校验逻辑 |
| `.github/skills/manage-shared-dev-environment/scripts/lib/node.sh` | 新增 Node/npm/pnpm 及 pnpm store 审计逻辑 |
| `.github/skills/manage-shared-dev-environment/scripts/lib/rust.sh` | 新增 rustup/rustc/cargo 工具链审计逻辑 |
| `.github/skills/sandbox-workmode/SKILL.md` | 将 Python 环境职责委托给新 Skill |
| `.github/skills/sandbox-workmode/references/venv.md` | 用本仓库真实共享环境入口替换外部仓库陈述 |
| `.github/skills/sandbox-workmode/scripts/ensure_sandbox_venv.sh` | 改为调用新环境管理器并完成幂等验证 |
| `.gitignore` | 忽略 `.agents/runtime/`，并让 `.venv` 规则同时覆盖目录和软链接 |
| `docs/architecture/repository-structure/modules/repository-support/skills.md` | 登记新 Skill 及 sandbox 委托关系 |
| `docs/architecture/repository-structure/modules/repository-support/agent-storage.md` | 登记 runtime、状态层、兼容软链接和迁移备份 |
| `docs/architecture/repository-structure/modules/repository-support/root-files.md` | 更新共享 runtime 忽略边界 |
| `docs/architecture/repository-structure/modules/repository-support/docs.md` | 登记活跃实施地图 |
| `docs/architecture/repository-structure/modules/repository-support/README.md` | 更新直属支持模块摘要 |
| `docs/plan/manage-shared-dev-environment/implementation-plan.md` | 新增带勾选框的分层实施地图 |
| `docs/dev_logs/2026-08/2026-08-02/08-33-01+manage-shared-dev-environment.md` | 新增本任务验收日志 |
| `docs/dev_logs/2026-08/2026-08-02/README.md` | 登记本任务 |
| `docs/dev_logs/2026-08/README.md` | 更新当月任务数与工作摘要 |
| `docs/dev_logs/INDEX.md` | 更新总任务数 |
| `.agents/runtime/python/3.14/.venv/` | 新建唯一的共享 Python 3.14.6 实体环境（Git 忽略） |
| `.agents/runtime/state/python-3.14-requirements.lock` | 保存含两个 Git commit 来源的 17 包兼容快照（Git 忽略） |
| `.agents/runtime/state/toolchains.lock` | 保存 Python、Node/pnpm、Rust 的当前版本、路径和原生存储清单（Git 忽略） |
| `.venv` | 由 Python 3.10 实体目录改为指向共享环境的相对软链接（Git 忽略） |
| `.agents/sandbox/.venv` | 由 Python 3.12 实体目录改为指向共享环境的相对软链接（Git 忽略） |
| `.agents/cache/manage-shared-dev-environment/2026-08-02_08-39-57/` | 保存两个旧 venv 和备份清单的完整回滚副本（Git 忽略） |

## 验证结果

| 验证项 | 结果 | 证据 |
|---|---|---|
| Skill 结构 | PASS | `uv run --with pyyaml python .../quick_validate.py .github/skills/manage-shared-dev-environment` 输出 `Skill is valid!` |
| Bash 语法 | PASS | `bash -n` 检查新 Skill 全部脚本与 `ensure_sandbox_venv.sh` |
| 临时仓库端到端 | PASS | 在 `/tmp/manage-shared-dev-environment.aW6H32` 完成初始化、双入口备份、接入、验证和重复执行 |
| Python ABI 与入口 | PASS | `manage-runtime.sh validate --python-version 3.14 --scope all`；两个入口均解析到 Python 3.14.6 共享环境 |
| 依赖完整性 | PASS | `python -m pip check`；旧/新 `pip freeze` 的 `diff -u` 无差异 |
| 模块导入 | PASS | `bs4`、两个 `ccl_*` 包及其余 15 个迁移模块逐一输出 `IMPORT_OK` |
| sandbox 幂等性 | PASS | 重复运行 `ensure_sandbox_venv.sh` 前后备份目录数均为 1 |
| 参数防护 | PASS | `--python-version ../unsafe` 被拒绝，未产生越界路径 |
| 多语言工具链 | PASS | Node `v22.19.0`、npm `10.9.3`、pnpm `10.23.0`、Rust `1.92.0` 和原生存储均可解析 |
| 忽略规则 | PASS | `git check-ignore -v` 命中 runtime、sandbox、cache 和根 `.venv` |
| Git 差异 | PASS | `git diff --check` 无错误；既有用户修改 `AGENTS.md` 未被本任务触碰 |

## 风险与回滚

完整回滚副本位于 `.agents/cache/manage-shared-dev-environment/2026-08-02_08-39-57/`，包含 `root-venv/`、`sandbox-venv/` 与 `backup-manifest.txt`。恢复时先停止相关 Python 进程，再备份当前两个软链接，最后将旧目录移动回清单中的原入口。

兼容依赖 `ccl_chromium_reader` 固定要求已被上游撤回且注明线程安全缺陷的 `zstd==1.5.7.3`。本任务为了保持旧环境行为而原样迁移，`pip check` 和导入均通过；在验证上游替代版本前不擅自解除该固定依赖。系统未安装 shellcheck，因此以 `bash -n`、临时仓库端到端测试和真实环境幂等测试覆盖脚本验证。

## 最终成果

仓库现已拥有可复用的多语言共享环境 Skill。根目录与 sandbox 不再维护两套 Python 依赖，而是通过相对软链接使用唯一的 Python 3.14.6 环境；Node/TypeScript 与 Rust 保持原生缓存复用和项目隔离，完整旧环境仍可从时间戳备份恢复。

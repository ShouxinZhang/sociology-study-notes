# 多语言共享开发环境实施地图

- 任务：`manage-shared-dev-environment`
- 开始时间：2026-08-02 08:33:01 +0800
- 目标：以仓库级 Skill 统一管理 Python、Node/TypeScript 与 Rust 的共享运行环境，并消除根目录与 sandbox 的重复 Python 环境。

## 任务地图

- [x] 审查现有环境、Skill、架构索引与忽略规则
- [x] 创建标准化 `manage-shared-dev-environment` Skill 骨架
  - [x] 编写精简的主工作流与触发描述
  - [x] 拆分 Python、Node/TypeScript、Rust 参考规则
  - [x] 实现模块化环境管理脚本
- [x] 让 `sandbox-workmode` 委托新 Skill 管理 Python 环境
- [x] 建立 `.agents/runtime/` 本地共享环境库
  - [x] 备份现有根 `.venv` 与 sandbox `.venv`
  - [x] 创建 Python 3.14 共享环境并恢复现有依赖
  - [x] 将两个兼容入口接入共享环境
  - [x] 登记 Node/pnpm 与 Rust 原生共享存储
- [x] 更新目标架构叶子记录及直接父索引
- [x] 验证 Skill、脚本、环境幂等性与现有依赖导入
- [x] 精修实现、完成开发日志并交付

## 验收摘要

- 标准 Skill 校验、Bash 语法检查、临时仓库端到端迁移均通过。
- 旧 Python 3.10 与新 Python 3.14 的 `pip freeze` 完全一致，17 个迁移包逐一导入成功。
- 根 `.venv` 与 sandbox `.venv` 解析到同一共享环境；重复接入不新增备份。
- Node/npm/pnpm、pnpm store、rustup/rustc/cargo 均完成只读审计，未执行升级或重装。
- 完整回滚备份位于 `.agents/cache/manage-shared-dev-environment/2026-08-02_08-39-57/`。

## 边界

- 不升级或重装现有 Node、pnpm、Rust 工具链。
- 不创建共享 `node_modules`，避免跨项目依赖污染。
- 不默认共享 Rust 编译产物，只复用 rustup/cargo 原生缓存。
- 删除或替换旧环境前，先将完整目录移动到任务备份区，保留恢复入口。

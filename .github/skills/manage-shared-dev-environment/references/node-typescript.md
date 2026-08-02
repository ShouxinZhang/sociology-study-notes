# Node 与 TypeScript 共享规则

## 共享对象

- Node 运行时由已有版本管理器提供，例如 nvm。
- npm/pnpm 可执行文件随 Node 或用户级包管理器提供。
- 包内容通过 pnpm 的内容寻址 store 跨项目复用。
- 多个相关应用通过 pnpm workspace 共享 lockfile 和任务入口。

## 不共享对象

不要让多个不相关项目直接继承同一 `node_modules`。Node 的依赖解析、原生扩展、peer dependency 和生命周期脚本都可能依赖项目上下文；共享可变目录会把节省空间变成隐蔽污染。

## 新项目规则

1. 只有实际出现 Node/TypeScript 项目时才创建 `package.json`，不要预建空工程。
2. 优先使用 pnpm，并提交 lockfile。
3. 多包项目使用 workspace；单包项目保持叶子目录自治。
4. 用 `pnpm store path` 确认内容仓库已复用，不在仓库内复制 store。
5. 安装新 Node 或 pnpm 版本前，从 Node.js 与 pnpm 官方来源核对当前稳定/LTS 版本。

## 验证

- `node --version`、`npm --version`、`pnpm --version` 可执行。
- `pnpm store path` 指向稳定的用户级内容仓库。
- 有项目清单时运行其 lint、test、build；没有项目清单时只做工具链审计。

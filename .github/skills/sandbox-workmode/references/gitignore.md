# Sandbox 局部 Git 忽略规则

每个 sandbox 任务目录必须自带一个 `.gitignore`。仓库根 `.gitignore` 只保留全局规则，不硬编码具体活跃任务。

## 默认策略

- 默认隐藏任务目录内所有文件。
- 只暴露审计入口：`.gitignore`、README/plan、顶层 Markdown、`docs/**/*.md`、`logs/**/*.md`、`output/**/*.md`。
- 数据集、缓存、虚拟环境、图片、模型权重、外部 repo、临时目录和批量结果默认不进入 Git 视图。
- 如果某个 sandbox 原型需要直接追踪源码或测试，在该 sandbox 的 `.gitignore` 里按需取消注释补充规则。
- 如果临时暴露了 `references/`、`literature/`、`external/`、`source/`、`code/`、`repos/` 等目录，必须在文件末尾追加覆盖规则，避免嵌套 Git 仓库进入 GitHub Desktop。

## 默认模板

```gitignore
# Local sandbox policy: expose audit docs by default, hide everything else.
*

!.gitignore
!README.md
!README*.md
!plan.md
!PLAN.md
!*.md

!logs/
!logs/**/
!logs/**/*.md
!docs/
!docs/**/
!docs/**/*.md
!output/
!output/**/
!output/**/*.md

# If sandbox resources or prototypes should be tracked directly, opt in locally, for example:
# !app.py
# !requirements*.txt
# !pyproject.toml
# !pytest.ini
# !src/
# !src/**/
# !src/**/*.py
# !tests/
# !tests/**/
# !tests/**/*.py

# External source checkouts stay local. Keep these terminal rules after any opt-in blocks.
source/
external/
code/
repos/
references/**/source/
literature/*/
literature/**/.git/
```

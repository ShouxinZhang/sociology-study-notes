# Rust 共享环境规则

## 共享对象

- rustup 管理的 stable 或项目指定工具链。
- Cargo registry 与 git source 缓存。
- `cargo install` 安装的用户级命令。

## 谨慎共享对象

默认不要跨不相关项目共享 `target/`。feature、编译参数、build script、目标平台和环境变量会影响产物；强行共用目标目录可能造成缓存膨胀或难以诊断的污染。

若大型 workspace 确实需要统一编译目录，只在同一 workspace 内配置，并在项目文档中声明边界。需要更广泛的编译加速时，优先评估编译缓存工具，而不是复用可变 `target/`。

## 新项目规则

1. 只有实际出现 Rust 项目时才创建 `Cargo.toml` 或 workspace。
2. 提交应用项目的 `Cargo.lock`；库项目按其发布策略处理 lockfile。
3. 项目需要固定工具链时使用 `rust-toolchain.toml`。
4. 安装或升级前从 Rust 官方渠道核对 stable 版本。

## 验证

- `rustup --version`、`rustc --version`、`cargo --version` 可执行。
- `rustup show active-toolchain` 能解析当前工具链。
- 有 `Cargo.toml` 时运行与改动风险匹配的 `cargo check`、测试和格式检查；没有项目清单时只做工具链审计。

# 开发日志按月份归档

- 最后变更时间：2026-08-02 04:52:53 +0800
- 业务目标：降低 `docs/dev_logs/` 根目录的日期分区数量，让历史变更按月份快速定位，同时保留日期级快照回滚能力。

## 结构变更

```text
docs/dev_logs/
├── INDEX.md
└── YYYY-MM/
    ├── README.md
    └── YYYY-MM-DD/
        ├── README.md
        └── <change-record>.md
```

- 将 49 个 `YYYY-MM-DD/` 日期目录迁移到 7 个 `YYYY-MM/` 月份分区。
- 根 `INDEX.md` 从日期明细表收敛为月份汇总表。
- 每个月份新增 `README.md`，承接日期摘要与变更数量。
- 日期目录内部文件名和相对链接保持不变。
- 机械修正仓库内 `docs/dev_logs/YYYY-MM-DD/` 形式的旧路径引用。
- 补齐 5 个历史日期分区缺失的 `README.md`，并将月份及总索引的计数统一为磁盘实际记录数。

## 归档结果

- 月份分区：7 个。
- 日期分区：49 个。
- 具体变更记录：139 条。
- 根目录遗留日期分区：0 个。

## 架构同步

| 文件 | 变更 |
|---|---|
| `docs/architecture/repository-structure.md` | 开发日志登记路径改为 `<month>/<date>` |
| `docs/architecture/repository-structure/conventions.md` | 更新日志维护约定 |
| `docs/architecture/repository-structure/modules/repository-support/docs.md` | 明确四层开发日志结构 |
| `docs/dev_logs/INDEX.md` | 建立月份级总索引 |
| `docs/dev_logs/YYYY-MM/README.md` | 新增月份级日期索引 |

## 回滚备份

- 迁移前压缩包：`.agents/cache/archive_dev_logs_by_month/pre-migration-2026-08-02.tar.gz`
- SHA-256：`7e4666361e42145e008cd91d44b2d3e70858aabac66244ceaaa6a64beb567efa`
- 原总索引：`.agents/cache/archive_dev_logs_by_month/original-INDEX.md`

## 验证

- 逐层核对总索引、月份索引、日期索引与 139 条实际记录，未发现漏挂记录。
- 检查 `docs/dev_logs/` 内 Markdown 相对链接，未发现失效链接。
- 全仓检查旧式日期路径引用，结果为 0。
- 运行 `git diff --check`，通过。
- 校验迁移前备份 SHA-256，结果一致。

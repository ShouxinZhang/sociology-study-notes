# QQ 音乐歌单本地导出

- 首次导出时间：2026-07-31 12:48:43 +0800
- 最后变更时间：2026-07-31 12:54:25 +0800
- 业务目标：把当前 QQ 音乐账号的“我喜欢”、其它自建歌单和已收藏歌单完整导出到 `self-cultivation/娱乐沙盒/音乐/`，并提供可重复执行、不会把登录凭据写入仓库的本地工具。
- 结果：已生成本地批次 `self-cultivation/娱乐沙盒/音乐/exports/20260731_124843/`，共 48 个歌单、4008 条歌单成员记录、3462 个去重歌曲 MID；QQ 音乐原窗口与播放状态未被修改。

## 文件变更

### 音乐叶子模块

- `self-cultivation/娱乐沙盒/音乐/README.md`
  - 记录模块边界、导出格式、运行命令、凭据隔离方案与已知局限。
- `self-cultivation/娱乐沙盒/音乐/.gitignore`
  - 忽略 Python 缓存文件，保持叶子目录干净。
- `self-cultivation/娱乐沙盒/音乐/exports/.gitignore`
  - 默认排除本地个人歌单批次，防止个人数据和约 22MB 批量导出被意外提交。
- `self-cultivation/娱乐沙盒/音乐/tools/qqmusic_export/client.py`
  - 复制登录态所需配置到系统临时目录，排除网络缓存、进程锁和本地套接字。
  - 在 Xvfb 隔离显示器中启动临时 QQ 音乐客户端，隐藏会打印认证参数的客户端输出，并保证结束时清理进程和临时配置。
- `self-cultivation/娱乐沙盒/音乐/tools/qqmusic_export/runtime/`
  - 通过 Chrome DevTools Protocol 接入 QQ 音乐 Electron 渲染进程。
  - 调用客户端自身的歌单刷新和完整歌曲列表接口，读取 44 个自建歌单（含“我喜欢”）及 4 个收藏歌单。
- `self-cultivation/娱乐沙盒/音乐/tools/qqmusic_export/models.py`
  - 提供歌单业务模型及预期歌曲数/实际歌曲数完整性判断。
- `self-cultivation/娱乐沙盒/音乐/tools/qqmusic_export/security.py`
  - 递归过滤 Cookie、token、music key、授权键和 session key 等认证字段。
- `self-cultivation/娱乐沙盒/音乐/tools/qqmusic_export/playlist_service.py`
  - 校验歌单载荷结构、歌单唯一性、“我喜欢”存在性及歌曲计数。
- `self-cultivation/娱乐沙盒/音乐/tools/qqmusic_export/exporters/`
  - 分别输出原始 JSON、统一 JSON、UTF-8 BOM CSV、Markdown 阅读视图和每歌单一个 M3U8 文件。
  - Markdown 采用一个总索引加 48 个逐歌单文档，避免把 4008 条成员记录堆在单一文件中；每行展示歌曲、歌手、专辑、时长和详情页链接。
  - 歌曲详情链接优先使用 MID；对 2 条指向同一残缺歌曲、缺少 MID 的成员记录，回退使用数值 song ID，避免 M3U 出现空地址。
- `self-cultivation/娱乐沙盒/音乐/tools/qqmusic_export/cli.py`
  - 提供单命令全量导出入口；若任一歌单数量不完整则中止。
- `self-cultivation/娱乐沙盒/音乐/tests/`
  - 覆盖认证字段清理、歌单业务校验、文件名清理和多格式导出。

### 架构文档

- `docs/architecture/repository-structure/modules/self-cultivation/entertainment-sandbox.md`
  - 登记 `音乐/` 叶子模块及其工具、测试和本地数据边界。
- `docs/architecture/repository-structure/modules/self-cultivation/README.md`
  - 在直接父索引中补充个人音乐数据归档职责。

## 数据批次

`self-cultivation/娱乐沙盒/音乐/exports/20260731_124843/`：

- `manifest.json`：48 个歌单，4008 条歌单成员记录，3462 个去重歌曲 MID，`complete=true`。
- `raw/`：48 个逐歌单 JSON 加 1 个索引；“我喜欢”单独位于 `raw/我喜欢.json`。
- `normalized/playlists.json`：48 个统一结构歌单。
- `normalized/songs.csv`：4008 行歌单—歌曲关系。
- `normalized/markdown/README.md`：阅读总索引，链接到 48 个逐歌单 Markdown 文档。
- `normalized/markdown/playlists/`：48 个可读歌单表格，共 4008 行歌曲记录。
- `normalized/m3u/`：48 个 M3U8 文件。
- 批次总大小：约 22MB。

## 验证快照

- `python3 -m compileall -q tools tests`：通过。
- `python3 -m unittest discover -s tests -v`：6 项测试通过。
- 使用已开启 CDP 的隔离 QQ 音乐实例执行真实导出：通过。
- 不传 `--endpoint`，从默认 QQ 音乐配置自动创建隔离会话并向系统临时目录端到端导出：通过。
- 原始 JSON、统一 JSON、CSV、Markdown、M3U 五路数量对账：48 / 48 / 4008 / 48 / 48，全部与 manifest 一致。
- 对全部原始 JSON 扫描认证字段路径：0 个命中。
- 全部 4008 条规范化成员记录均生成非空 QQ 音乐详情页地址；其中 2 条通过数值 song ID 回退。
- 临时 QQ 音乐进程、Xvfb 显示器、隔离配置副本和临时重复导出均已清理。

## 回滚线索

- Python 测试生成的 `__pycache__` 在删除前备份到 `.agents/cache/qqmusic-playlist-export/pycache-20260731-124954.tar.gz`。
- 规范化文件增加 song ID 链接回退前，备份到 `.agents/cache/qqmusic-playlist-export/normalized-before-song-id-fallback-20260731-125019.tar.gz`。
- `manifest.json` 登记 Markdown 文件前，备份到 `.agents/cache/qqmusic-playlist-export/manifest-before-markdown-20260731-1254.json`。
- 最终检查产生的 Python 缓存，在删除前备份到 `.agents/cache/qqmusic-playlist-export/pycache-final-20260731-125425.tar.gz`。
- 正式导出批次是用户数据，不参与 Git；如需删除，应先按仓库规则另行备份。

# QQ 音乐个人音乐库导出

- 最后变更时间：2026-07-31 15:07:23 +0800
- 业务目标：在 `self-cultivation/娱乐沙盒/音乐/` 中提供一个无重复批次、无登录凭据、可重复执行的 QQ 音乐个人库导出。
- 唯一正式快照：`self-cultivation/娱乐沙盒/音乐/exports/current/`；实际导出时间保存在 `manifest.json`。

## 最终数据

- 自建歌单：44 个，其中“我喜欢”2620 首。
- 收藏歌单：4 个。
- 歌单成员记录：4008 条。
- 收藏专辑：12 张。
- 收藏专辑曲目：405 条。
- 跨歌单与专辑去重歌曲 MID：3851 个。
- 批次大小：约 24MB。

## 导出结构

- `raw/`：逐歌单 JSON、逐专辑 JSON 及两类索引，保留可恢复的客户端原始业务字段。
- `normalized/playlists.json`：48 个歌单及歌曲的统一结构。
- `normalized/albums.json`：12 张收藏专辑及完整曲目的统一结构。
- `normalized/songs.csv`：4008 条歌单—歌曲关系。
- `normalized/album_tracks.csv`：405 条专辑—曲目关系。
- `normalized/markdown/README.md`：按“我喜欢、其它自建歌单、收藏歌单、收藏专辑”分区的阅读索引。
- `normalized/markdown/playlists/`：48 份歌单 Markdown。
- `normalized/markdown/albums/`：12 份收藏专辑 Markdown。
- `normalized/m3u/`：48 份歌单 M3U8；`m3u/albums/` 另含 12 份专辑 M3U8。

## 实现

- `tools/qqmusic_export/client.py`
  - 将当前 QQ 音乐配置复制到系统临时目录，排除网络缓存、进程锁和本地套接字。
  - 在隔离 Xvfb 中启动临时客户端；客户端会输出认证参数，因此 stdout/stderr 全部丢弃。
  - 成功或失败后终止临时进程并删除临时登录态副本。
- `tools/qqmusic_export/runtime/`
  - 通过本地 Chrome DevTools Protocol 复用客户端登录态。
  - 读取“我喜欢”、其它自建歌单、收藏歌单、收藏专辑和逐专辑完整曲目。
- `tools/qqmusic_export/playlist_service.py`、`album_service.py`
  - 校验对象结构、唯一标识、声明条目数和实际导出数。
- `tools/qqmusic_export/security.py`
  - 在数据进入导出目录前递归过滤 Cookie、token、music key、授权键和 session key。
- `tools/qqmusic_export/exporters/`
  - 分模块输出原始/规范化 JSON、CSV、Markdown 和 M3U8。
- `tools/qqmusic_export/cli.py`
  - 提供单命令全量导出；任何歌单或专辑数量不完整都会中止。
- `tools/qqmusic_export/exporters/snapshot.py`
  - 在隐藏临时目录完成全部格式后原子替换 `exports/current/`，并立即清理旧快照；重复执行不会累积时间戳目录。
- `tests/`
  - 使用无凭据小样本覆盖歌单、专辑、安全过滤和全部格式。

## 数据来源核对

- 自建歌单：`music.musicasset.PlaylistBaseRead.GetPlaylistByUin`。
- 收藏歌单：`music.musicasset.PlaylistFavRead.GetPlaylistFavInfo`。
- 收藏专辑：`music.musicasset.AlbumFavRead.GetAlbumFavInfo`。
- 专辑曲目：`music.musichallAlbum.AlbumSongList.GetAlbumSongList`。
- 客户端 IndexedDB 中的 `music_playlist.db` 只保存最多 100 首播放队列，不是完整个人歌单库，因此正式导出使用已登录客户端运行时接口。

## 验证快照

- Python 单元测试：10 项通过，其中包含连续两次导出只保留 `current/` 的替换测试。
- 默认命令端到端：48 个歌单、12 张专辑、405 条专辑曲目，`complete=true`。
- 歌单 JSON / CSV / Markdown：4008 / 4008 / 4008。
- 专辑 JSON / CSV / Markdown / M3U：405 / 405 / 405 / 405。
- Markdown 索引：60 个链接，缺失 0。
- manifest 登记文件：缺失 0。
- 原始 JSON 认证字段路径：0 个命中。
- 隔离 QQ 音乐进程、Xvfb 和临时登录态：残留 0。

## 合并与清理

- 最终快照的 48 个歌单与旧 `20260731_124843` 完全一致；旧批次唯一原始字段差异是“我喜欢”的动态 `createTime`，最终快照值更新。
- 最终快照在旧批次基础上增加 12 张收藏专辑和 405 条曲目，因此旧批次已移除，时间戳目录已统一为稳定的 `current/`。
- 原两份 QQ 音乐开发日志已合并为本文件。
- 本任务产生的 `.agents/cache/qqmusic-playlist-export/` 和临时合并备份在验证后移入系统回收站，仓库内不保留 QQ 音乐任务缓存。
- 旧批次和临时备份在系统回收站清空前仍可恢复。

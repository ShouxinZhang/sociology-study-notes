# 音乐数据归档

这里集中保存 QQ 音乐歌单导出工具和本地导出结果，避免把脚本、临时登录态或批量数据散落到仓库其它目录。

## 目录

```text
音乐/
├── tools/qqmusic_export/   # QQ 音乐采集、规范化和格式导出
├── exports/                # 本地导出批次（默认不纳入 Git）
└── tests/                  # 不访问 QQ 音乐账号的单元测试
```

每个导出批次包含：

- `manifest.json`：批次时间、歌单数、歌曲条目数和完整性检查结果。
- `raw/`：QQ 音乐客户端运行时返回的歌单元数据和歌曲对象；认证字段会被过滤。
- `normalized/playlists.json`：适合再次导入或程序处理的统一 JSON。
- `normalized/songs.csv`：一行表示一条“歌单—歌曲”关系，适合表格查看。
- `normalized/markdown/README.md`：可读总索引，链接到每个歌单独立的歌曲表格。
- `normalized/markdown/playlists/`：每个歌单一份 Markdown，展示序号、歌名、歌手、专辑、时长和 QQ 音乐链接。
- `normalized/m3u/`：每个歌单一个 M3U 文件，曲目指向 QQ 音乐歌曲详情页。

## 导出

在本目录运行：

```bash
python3 -m tools.qqmusic_export.cli
```

工具会复制当前 QQ 音乐用户配置中与登录态有关的必要数据到系统临时目录（排除网络缓存、进程锁与本地套接字），在隔离的虚拟显示器里启动一个临时客户端，通过客户端自身已登录的接口读取：

1. “我喜欢”；
2. 其它自建歌单；
3. 已收藏的歌单。

原 QQ 音乐窗口和播放队列不会被关闭或修改。临时客户端、临时配置和其中的登录态会在成功或失败后清理。项目内不会保存 Cookie、access token、refresh token 或 music key。

可选参数：

```bash
python3 -m tools.qqmusic_export.cli \
  --source-profile ~/.config/qqmusic \
  --qqmusic-bin /opt/qqmusic/qqmusic
```

调试时也可以连接一个已经开启 CDP 的 QQ 音乐实例，避免再次启动客户端：

```bash
python3 -m tools.qqmusic_export.cli \
  --endpoint http://127.0.0.1:49222
```

## 局限

- 采集依赖 QQ 音乐 Linux 客户端当前登录态以及客户端内部接口；客户端大版本更新后，运行时模块编号可能变化。
- M3U 使用稳定的歌曲详情页链接（优先歌曲 MID，残缺记录回退到数值 song ID），不是带时效签名的音频直链，因此适合做曲目清单而不是离线音频播放列表。
- 同一首歌出现在多个歌单时，会在 CSV 中保留多条歌单成员关系。

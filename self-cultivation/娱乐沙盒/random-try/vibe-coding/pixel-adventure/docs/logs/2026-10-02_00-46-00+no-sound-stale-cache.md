# 浏览器无音效：缓存旧模块

- 任务 ID：`2026-10-02_00-46-00+no-sound-stale-cache`
- 开始时间：2026-10-02 00:46:00 +0800
- 完成时间：2026-10-02 00:47:41 +0800
- 状态：completed
- 类型：diagnosis
- 影响范围：`pixel-adventure/start.sh`
- 执行模型：GitHub Copilot（Claude Opus 5.5）

## 用户原始 Prompt

> 奇怪，浏览器打开，没音效？

## 诊断

| 排查项 | 结论 | 证据 |
|---|---|---|
| 数据文件（用户编辑过 weapons / enemies） | 正常 | 脚本读取后 `sfxAttack/sfxHit/sfxDie/music` 字段齐全 |
| 磁盘上的代码 | 正常 | `game.js` 中有 audio 相关代码，`main.js` 中有 `createAudio` |
| 浏览器实际运行的代码 | **旧版本** | 在 8765 端口用 `fetch('/src/main.js', {cache:'force-cache'})` 取到的内容不含 `createAudio` |
| 根因 | `python -m http.server` 不发送 Cache-Control 头，浏览器按启发式规则缓存了前一天的 JS 模块 | `curl -I` 返回头中无 Cache-Control |

## 修复

- `start.sh` 改为内联的 Python 服务，所有响应带 `Cache-Control: no-store`；默认端口改为 8770，避开 8765 上的旧缓存。
- 已停止旧的 8765 服务并重新启动：服务日志显示浏览器请求了 `src/audio/*.js` 和 `music/title.ogg`；`curl -I` 返回 `Cache-Control: no-store`。

## 风险与回滚

无；以后改代码只需刷新页面。

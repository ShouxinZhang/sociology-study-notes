---
id: self-cultivation.entertainment-sandbox
parent: self-cultivation
repo_path: self-cultivation/娱乐沙盒
profile: module/v1
status: active
---

# self-cultivation/娱乐沙盒/

面向娱乐向连载小说、沙盒脑洞、数学未解问题、个人音乐数据归档等趣味知识清单与轻量创意写作的实验子模块。

## 结构明细

| 相对路径 | 说明 |
|---|---|
| `1.txt` | 娱乐沙盒入口/草稿占位文本 |
| `愿望之盒/` | 个人愿望、兴趣主题与待探索问题的轻量收藏目录 |
| `愿望之盒/数学未解之迷.md` | 以极简题面、例子、当前边界和权威来源分层整理十七个数学未解问题；涵盖数论、代数几何、随机介质、随机路径与随机生长，并区分二维雅可比问题与三维反例 |
| `开心一刻/` | 乐趣分享与人格解耦实验目录 |
| `开心一刻/happy.md` | 乐趣分享正文 |
| `开心一刻/人格.txt` | 多人格解耦草稿 |
| `开心一刻/image/` | 配图资源 |
| `random-try/` | 轻量试写与碎片文段实验区 |
| `random-try/vibe-coding/` | 可直接运行的轻量编程实验区 |
| `random-try/vibe-coding/硬币分布实验/` | 公平硬币随机投掷与频率观察实验目录 |
| `random-try/vibe-coding/硬币分布实验/硬币分布实验.ipynb` | 默认模拟 10,000 次公平硬币投掷并计算正面频率的 Jupyter Notebook；可通过参数 `N` 调整实验次数 |
| `random-try/vibe-coding/tree-chat/` | 本地对话树：中栏只渲染当前路径，发送不带兄弟分支 |
| `random-try/vibe-coding/tree-chat/packages/shared/` | 树节点、路径、分叉与 transcript 规则 |
| `random-try/vibe-coding/tree-chat/packages/server/` | Gemini/mock 流式代理与 `data/forest.json` |
| `random-try/vibe-coding/tree-chat/packages/web/` | User / Thinking / Answer 与左树、面包屑 |
| `random-try/vibe-coding/pixel-adventure/` | 黑白像素横版冒险游戏：主菜单（开始游戏 / 选择关卡 / 音乐馆 / 设置，键鼠均可操作；7 关全开放跳关）；7 关（第 4–6 关为魂斗罗风格世界，含机关与多部件 BOSS；第 7 关为 520 列的合金弹头世界，含锁屏战、检查点、俘虏、坦克与陆行要塞）、等级成长、二段跳与八方向射击、11 种武器（常备 3 槽 + Tab 装备栏，含 M777 / F22 呼叫支援）；音乐馆可切换播放全部 12 首曲目并显示实时频谱；F1 作弊模式（无敌、无限弹药、10 倍射速、飞行穿墙、全武器）；`./start.sh` 起本地服务游玩 |
| `random-try/vibe-coding/pixel-adventure/assets/` | 纯数据素材：`sprites/` 字符像素精灵（含 `attacks.json` 武器专属攻击动作与特效、`aim.json` 由生成器产出的 5 方向瞄准精灵与腿部图层）、`levels/` ASCII 关卡（含锁屏战 `arenas`、俘虏 `pows`）、`slug.json` 合金弹头世界精灵、`data/` 武器/敌人/成长/图例/作弊/瞄准旋转参数、`audio/` ZzFX 音效参数与 CC0 芯片音乐（`music.json` 含音乐馆展示用的曲名/作者/用途）；由 `manifest.json` 登记 |
| `random-try/vibe-coding/pixel-adventure/src/` | 纯逻辑 ES Modules：`core/` 加载·输入（键盘 + 鼠标）·循环·状态机，`world/` 关卡解析·镜头，`entities/` 玩家·敌人·投射物·拾取物·特效，`systems/` 物理·战斗·等级·装备（军械库 + 3 槽）·呼叫支援·锁屏战·检查点，`ui/` 主菜单·选关·音乐馆·设置·装备栏的交互逻辑与共用布局，`render/` 世界·HUD·菜单·装备栏画面，`audio/` 混音（含频谱分析）·音效·音乐（内含 MIT 许可的 ZzFX） |
| `random-try/vibe-coding/pixel-adventure/tools/` | 素材生成器：`gen_aim_sprites.py` 把每把远程武器的朝前开枪帧绕肩膀旋转为 5 方向瞄准精灵、旋转枪口火光并拆出腿部图层；新增远程武器后重跑 |
| `random-try/vibe-coding/pixel-adventure/docs/` | 模块文档中心（详细记录的唯一权威）：`plans/` 勾选地图、`reports/` 设计报告、`logs/` 详细任务日志；入口 `README.md` |

> 本次更新模型：Antigravity（Claude Opus 5.5）
| `random-try/碎片文段.txt` | 碎片文段草稿 |
| `碎片情感/` | 碎片情感短记目录 |
| `碎片情感/5.txt` | 碎片情感短记第 5 篇 |
| `音乐/` | 个人音乐歌单的本地归档叶子模块；脚本、测试与导出批次均封装在此目录 |
| `音乐/README.md` | QQ 音乐导出范围、目录约定、运行方法、凭据隔离策略与格式局限 |
| `音乐/tools/qqmusic_export/` | 复用 QQ 音乐既有登录态的隔离采集工具；按客户端会话、运行时桥接、歌单/收藏专辑校验和 JSON/CSV/Markdown/M3U 导出分层 |
| `音乐/tests/` | 使用无凭据小样本验证歌单与收藏专辑完整性、认证字段清理及多格式输出 |
| `音乐/exports/current/` | 只保留一个原子替换的当前音乐库快照；提供歌单与收藏专辑的机器可恢复 JSON、表格 CSV、分区 Markdown 阅读视图及 M3U，避免累积时间戳重复批次；内容默认不进入 Git |

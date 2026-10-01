# 游戏音效计划

> 维护模型：GitHub Copilot（Claude Opus 5.5）｜状态：待确认｜创建：2026-10-02

## 0. 结论先行

- **音效（SFX）自己合成**：使用 [ZzFX](https://github.com/KilledByAPixel/ZzFX)（MIT，v1.4.0，不到 1 KB）。每个音效是一行参数数组，存放在 `assets/audio/sfx.json` 中，和"字符像素画"一样是可直接编辑的数据，零音频文件。
- **音乐（BGM）用开源素材**：Juhani Junkala 的《[5 Chiptunes (Action)](https://opengameart.org/content/5-chiptunes-action)》（CC0）。正好 5 首可无缝循环的曲子：标题、第 1/2/3 关、结局，和本游戏的结构一一对应。原文件约 50 MB，用本机 `ffmpeg` 转成 OGG（目标总量小于 5 MB）。
- **备用采样**：遇到 ZzFX 难以合成好的音色（例如厚重的爆炸、BOSS 吼叫），从 SubspaceAudio《[512 Sound Effects (8-bit style)](https://opengameart.org/content/512-sound-effects-8-bit-style)》（CC0）或 [Kenney Audio](https://kenney.nl/assets/category:Audio)（CC0）中挑选 WAV 替代。
- 原则是**先合成，不行再用采样**，保持仓库轻量和黑白复古风格的统一。

## 1. 架构

```text
assets/audio/
├─ sfx.json          事件名 → { zzfx: [参数], volume, minInterval, maxVoices, sample? }
├─ music.json        场景 → { file, loop, volume }
├─ music/*.ogg       BGM（CC0）
├─ samples/*.ogg     备用采样（CC0，按需）
└─ CREDITS.md        来源、作者、许可证
src/audio/
├─ vendor/zzfx.js    ZzFX 原样引入（保留 MIT 头注释）
├─ mixer.js          AudioContext 解锁、master/music/sfx 三路音量、静音、localStorage 持久化
├─ sfx.js            预生成缓冲、节流、复音上限、音高随机、立体声定位
└─ music.js          场景切换淡入淡出、音量闪避（ducking）
```

- **触发方式**：逻辑层只调用 `game.sfx('jump')` 和 `game.music('level1')`，不出现任何音频细节；音频层按事件名查表。
- **浏览器自动播放限制**：标题页第一次按键时恢复 `AudioContext`；在此之前静默，不报错。
- **作弊模式保护**：AK47 作弊射速约每秒 110 发，必须靠 `minInterval` 和 `maxVoices` 节流，否则会爆音。

## 2. 音效清单

优先级：P0 = 首批（核心反馈），P1 = 完整清单，P2 = 锦上添花。

### 2.1 玩家

| 事件 | 触发点 | 音色设计 | 优先级 |
|---|---|---|---|
| `jump` | `player.js` 起跳 | 方波短促上滑，约 0.08 s | P0 |
| `land` | 由空中转为着地 | 低频噪声"噗"，很轻 | P1 |
| `hurt` | `hurtPlayer` | 锯齿波下滑 + 轻微失真 | P0 |
| `fall` | 坠崖复活 | 长下滑音 | P1 |
| `levelup` | `gainExp` 返回 true | 三音上行琶音（C-E-G） | P0 |
| `death` | 进入 gameover | 下行琶音 + 噪声尾 | P0 |
| `step` | 行走动画切帧 | 极短噪声，音高随机，默认关闭 | P2 |

### 2.2 武器（与 6 套攻击动画一一对应）

| 事件 | 音色设计 | 节流 | 优先级 |
|---|---|---|---|
| `fist_swing` / `fist_hit` | 风声短噪 / 闷响 | — | P0 |
| `stick_swing` / `stick_hit` | 较长风声 / 木质"咚" | — | P0 |
| `knife_swing` / `knife_hit` | 高频"嗖" / 金属"叮" | — | P0 |
| `pistol_shot` | 短噪声 + 方波冲击 | 0.05 s | P0 |
| `ak47_shot` | 更短更尖，带音高随机 | 0.03 s，最多 4 个复音 | P0 |
| `rocket_launch` | 低频长"嘶" | — | P0 |
| `explosion` | 低通噪声爆裂 + 长尾；不理想时换采样 | 最多 3 个复音 | P0 |
| `bullet_wall` | 极短高频"啪" | 0.04 s | P1 |
| `ammo_empty` | 干涩"咔哒" | 0.3 s | P1 |
| `weapon_switch` | 机械"咔" | — | P1 |

### 2.3 敌人

| 事件 | 音色设计 | 优先级 |
|---|---|---|
| `enemy_hit` | 通用受击短促音（按敌人类型微调音高） | P0 |
| `slime_die` / `bat_die` / `skeleton_die` | 黏液"噗啾" / 高频尖叫 / 骨头散落 | P1 |
| `bone_throw` | 旋转"呼呼" | P1 |
| `bat_flap` | 靠近时轻微扇翅，按距离衰减 | P2 |
| `boss_awake` | 低沉吼叫（备选采样） | P1 |
| `boss_land` | 重落地 + 画面震动（震动不在本计划内） | P1 |
| `boss_die` | 连续爆炸 + 长尾 | P1 |

### 2.4 拾取与界面

| 事件 | 音色设计 | 优先级 |
|---|---|---|
| `pickup_heart` | 柔和上滑（参考 ZzFX 示例 "Heart"） | P0 |
| `pickup_ammo` | 两声金属"咔咔" | P0 |
| `pickup_weapon` | 明亮短琶音 | P0 |
| `chest_open` | 木箱"吱呀" + 闪光音 | P0 |
| `ui_confirm` | 标题页、各结算页按 Enter 时的确认音 | P1 |
| `flag_blocked` | BOSS 未死时触碰终点旗的低沉"嗡" | P1 |
| `cheat_on` / `cheat_off` | 上行 / 下行电子音 | P1 |

## 3. 音乐方案

| 场景 | 曲目（Junkala 包） | 处理 |
|---|---|---|
| 标题 | title screen | 循环 |
| 第 1 关 草原 | level 1 | 循环 |
| 第 2 关 洞穴 | level 2 | 循环，可选加低通营造洞穴感（P2） |
| 第 3 关 城堡 | level 3 | 循环 |
| BOSS 战 | level 3 以 1.12 倍速播放（P1）→ 用 ZzFXM 自制 BOSS 主题（P3） | BOSS 苏醒时交叉淡入 |
| 过关 | ZzFX 合成的短号角 | 一次性；BGM 闪避 |
| 失败 / 通关 | 失败用合成下行音；通关用 ending 曲 | — |

- 切换：淡出 0.5 s、淡入 0.8 s；音乐默认音量 0.5，音效 0.8。
- 闪避：爆炸、升级、拾取武器时，BGM 临时降低 40%，持续 0.4 s。

## 4. 控制与设置

- `M` 键：静音 / 恢复（HUD 角落显示喇叭图标）。
- `-` / `=` 键：调整主音量；设置保存在 `localStorage`。
- 标题页增加一行"M 静音"操作说明。

## 5. 执行地图（MVP 优先，每一阶段都可试玩）

### P0 音频底座 + 核心反馈

- [ ] 引入 ZzFX 1.4.0 到 `src/audio/vendor/`，保留许可证头
- [ ] `mixer.js`：AudioContext 解锁、三路音量、静音
- [ ] `sfx.js`：预生成缓冲、节流、复音上限、音高随机
- [ ] `sfx.json`：P0 共 19 个音效参数（在 ZzFX Designer 中调好后写入）
- [ ] 在 player / combat / pickup / game 中埋点 `game.sfx()`
- [ ] 验收：作弊模式下 AK47 连射 10 s 不爆音，帧率不下降

### P1 音乐 + 完整清单

- [ ] 下载 Junkala 曲包，`ffmpeg` 转 OGG（96 kbps 左右），写 `CREDITS.md`
- [ ] `music.js`：场景切换、淡入淡出、闪避
- [ ] BOSS 苏醒时切到加速版 level 3
- [ ] 补齐 P1 音效；ZzFX 不理想的音效从 CC0 采样包中替换
- [ ] `M` 静音与音量键、HUD 图标

### P2 精修

- [ ] 立体声定位：按敌人相对镜头的 x 坐标做 pan，按距离衰减
- [ ] 洞穴低通、脚步声、蝙蝠扇翅
- [ ] 混音平衡：统一响度、限幅防削波

### P3 原创

- [ ] 用 ZzFXM 自制 BOSS 主题（黑白冷峻风格，约 30 s 循环）

## 6. 验证方法

| 项 | 方法 |
|---|---|
| 埋点完整 | 浏览器内用 spy 替换 `game.sfx`，脚本跑 3 关，统计每个事件是否至少触发一次 |
| 不爆音 | 用 ZzFX 生成采样缓冲，检查峰值 ≤ 1；作弊连射时统计同时发声数 ≤ `maxVoices` |
| 性能 | 作弊连射 10 s，`requestAnimationFrame` 平均帧间隔 ≤ 17 ms |
| 主观听感 | 交给你试听的检查表：每个事件一行，标"好 / 改" |

## 7. 许可证与风险

- ZzFX：MIT，需保留版权头。Junkala 曲包、SubspaceAudio 512、Kenney：CC0，可商用、无需署名，仍会在 `CREDITS.md` 中致谢。
- 风险 1：ZzFX 合成的爆炸和吼叫可能偏"电子"→ 用 CC0 采样兜底。
- 风险 2：音乐文件让仓库变大 → 只放 OGG，总量控制在 5 MB 内；如仍不能接受，可改为全部用 ZzFXM 合成（P3 提前）。
- 风险 3：Junkala 曲风偏 C64 SID，可能比 FC 风格更"厚" → 试听后再决定，备选是 OGA 上其他 CC0 芯片音乐。

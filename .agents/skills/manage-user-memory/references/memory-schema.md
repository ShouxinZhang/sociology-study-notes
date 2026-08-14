# 记忆路由与格式

```text
.agents/memory/
├── INDEX.md
├── governance/{evidence-policy,corrections}.md
├── user/
│   ├── background.md
│   ├── personality/
│   │   ├── INDEX.md
│   │   ├── core.md
│   │   └── contexts/{work,entertainment}.md
│   └── cognition/{preferences,behavior-models,latent-hypotheses}.md
└── work/{lessons,archive/YYYY-MM}.md
```

| 内容 | 目标文件 |
|---|---|
| 用户明确背景 | `user/background.md` |
| 跨情境稳定特征 | `user/personality/core.md` |
| 情境独有的目标、偏好、语气和回应方式 | `user/personality/contexts/<context>.md` |
| 明确偏好与预设 | `user/cognition/preferences.md` |
| 重复行为与决策逻辑 | `user/cognition/behavior-models.md` |
| 潜在想法、动机与潜意识解释 | `user/cognition/latent-hypotheses.md` |
| 尚不足以成为 Skill 的经验 | `work/lessons.md` |

情境人格至少包含触发条件、目标、偏好、语气、AI 回应方式、依据和更新时间。其他条目至少包含稳定语义 ID、认识类型、结论、依据、限制或反证、日期和置信度。潜意识假说另加其他解释与推翻条件。

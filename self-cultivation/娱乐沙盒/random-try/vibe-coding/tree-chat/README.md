# Tree Chat

本地对话树：中栏只渲染根到当前节点的路径，发送时不带兄弟分支。

```text
packages/
├── shared/   树域模型（无 IO、无 UI）
├── server/   Gemini/mock 代理 + 树文件存储
└── web/      深色 Chat 三块 + 左树
```

```bash
cp .env.example .env   # 可填 GEMINI_API_KEY；不填则 mock
pnpm install
pnpm test
pnpm dev               # web :5173  代理 server :8787
```

Key 只放本目录 `.env`，不要提交。

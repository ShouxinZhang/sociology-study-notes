#!/usr/bin/env bash
# 启动本地 HTTP 服务并打开浏览器（浏览器禁止 file:// 读取 JSON 素材）。用法：./start.sh [端口]
set -euo pipefail
cd "$(dirname "$0")"
PORT="${1:-8765}"
URL="http://127.0.0.1:${PORT}/"
(sleep 1; xdg-open "$URL" >/dev/null 2>&1 || echo "请在浏览器打开 $URL") &
exec python3 -m http.server "$PORT" --bind 127.0.0.1

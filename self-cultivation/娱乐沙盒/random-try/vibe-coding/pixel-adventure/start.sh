#!/usr/bin/env bash
# 启动本地 HTTP 服务并打开浏览器（浏览器禁止 file:// 读取 JSON 素材）。用法：./start.sh [端口]
set -euo pipefail
cd "$(dirname "$0")"
PORT="${1:-8770}"
URL="http://127.0.0.1:${PORT}/"
(sleep 1; xdg-open "$URL" >/dev/null 2>&1 || echo "请在浏览器打开 $URL") &
# 禁用浏览器缓存：否则改代码后浏览器仍运行旧的 JS 模块
exec python3 - "$PORT" <<'PY'
import http.server, sys

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

http.server.ThreadingHTTPServer(("127.0.0.1", int(sys.argv[1])), NoCacheHandler).serve_forever()
PY

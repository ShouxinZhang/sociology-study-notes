#!/usr/bin/env bash
# 启动 3D 魂斗罗本地无缓存 HTTP 服务并打开浏览器。用法：./start.sh [端口]
set -euo pipefail
cd "$(dirname "$0")"
PORT="${1:-8771}"
URL="http://127.0.0.1:${PORT}/"
(sleep 1; xdg-open "$URL" >/dev/null 2>&1 || echo "请在浏览器打开 $URL") &
exec python3 - "$PORT" <<'PY'
import http.server, sys

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

http.server.ThreadingHTTPServer(("127.0.0.1", int(sys.argv[1])), NoCacheHandler).serve_forever()
PY

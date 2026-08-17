import type { ServerResponse } from "node:http";

export type SseWriter = {
  send: (event: string, data: unknown) => void;
  close: () => void;
};

export function openSse(res: ServerResponse): SseWriter {
  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
  });
  return {
    send(event, data) {
      res.write(`event: ${event}\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    },
    close() {
      res.end();
    },
  };
}

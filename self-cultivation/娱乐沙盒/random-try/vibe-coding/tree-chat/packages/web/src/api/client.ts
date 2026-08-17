import type { ChatNode, Forest } from "@tree-chat/shared";

async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = (await res.json().catch(() => ({ error: res.statusText }))) as { error?: string };
    throw new Error(body.error ?? res.statusText);
  }
  return (await res.json()) as T;
}

export function fetchTree(): Promise<Forest> {
  return fetch("/api/tree").then((res) => parseJson<Forest>(res));
}

export function fetchHealth(): Promise<{ provider: string; model: string }> {
  return fetch("/api/health").then((res) => parseJson<{ provider: string; model: string }>(res));
}

export function postTree(path: "select" | "fork" | "edit", body: object): Promise<Forest> {
  return fetch(`/api/tree/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then((res) => parseJson<Forest>(res));
}

export type ChatHandlers = {
  onUser: (node: ChatNode) => void;
  onModelStart: (node: ChatNode) => void;
  onThinking: (payload: { id: string; text: string; thinking: string }) => void;
  onAnswer: (payload: { id: string; text: string; answer: string }) => void;
  onUsage: (payload: { id: string; thoughtsTokens: number }) => void;
  onDone: (node: ChatNode) => void;
  onError: (message: string) => void;
};

export async function streamChat(text: string, handlers: ChatHandlers): Promise<void> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok || !res.body) {
    throw new Error(`chat failed: ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    buffer += decoder.decode(value ?? new Uint8Array(), { stream: !done });
    const frames = buffer.split("\n\n");
    buffer = frames.pop() ?? "";
    for (const frame of frames) {
      dispatchFrame(frame, handlers);
    }
    if (done) {
      break;
    }
  }
}

function dispatchFrame(frame: string, handlers: ChatHandlers): void {
  const event = /(?:^|\n)event: (.+)/.exec(frame)?.[1]?.trim();
  const dataLine = frame
    .split("\n")
    .filter((line) => line.startsWith("data: "))
    .map((line) => line.slice(6))
    .join("\n");
  if (!event || !dataLine) {
    return;
  }
  const data = JSON.parse(dataLine) as never;
  if (event === "user") handlers.onUser(data);
  if (event === "model-start") handlers.onModelStart(data);
  if (event === "thinking") handlers.onThinking(data);
  if (event === "answer") handlers.onAnswer(data);
  if (event === "usage") handlers.onUsage(data);
  if (event === "done") handlers.onDone(data);
  if (event === "error") handlers.onError((data as { message: string }).message);
}

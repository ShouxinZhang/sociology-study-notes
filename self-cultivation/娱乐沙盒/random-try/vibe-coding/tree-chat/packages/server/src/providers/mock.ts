import type { ChatProvider, StreamDelta } from "./types.ts";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** 无 Key 时走这条路径，保证前端三块和树逻辑可独立验收。 */
export class MockProvider implements ChatProvider {
  readonly name = "mock";

  async *stream(messages: { text: string }[]): AsyncGenerator<StreamDelta> {
    const last = messages.at(-1)?.text ?? "";
    yield { type: "thinking", text: "先确认当前路径不含兄弟分支。" };
    await delay(80);
    yield { type: "thinking", text: " 再给出可折叠的 Thoughts。" };
    yield { type: "usage", thoughtsTokens: 24 };
    await delay(80);
    yield {
      type: "answer",
      text: last ? `已收到：${last}` : "空消息。",
    };
  }
}

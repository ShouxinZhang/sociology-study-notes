import type { ChatProvider, StreamDelta } from "./types.ts";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** 无 Key 时走这条路径，保证前端三块和树逻辑可独立验收。 */
export class MockProvider implements ChatProvider {
  readonly name = "mock";

  async *stream(): AsyncGenerator<StreamDelta> {
    yield { type: "thinking", text: "先确认当前路径不含兄弟分支。" };
    await delay(80);
    yield { type: "thinking", text: " 再给出可折叠的 Thoughts。" };
    yield { type: "usage", thoughtsTokens: 24 };
    await delay(80);
    yield { type: "answer", text: "这是 mock 回答。填 `GEMINI_API_KEY` 后会走官方 Gemini。" };
  }
}

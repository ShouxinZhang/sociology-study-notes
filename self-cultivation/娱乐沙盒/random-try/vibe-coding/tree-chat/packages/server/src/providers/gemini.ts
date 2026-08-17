import { GoogleGenAI } from "@google/genai";
import type { PathMessage } from "@tree-chat/shared";
import type { ChatProvider, StreamDelta } from "./types.ts";

export class GeminiProvider implements ChatProvider {
  readonly name = "gemini";

  constructor(
    private readonly apiKey: string,
    private readonly model: string,
  ) {}

  async *stream(messages: PathMessage[]): AsyncGenerator<StreamDelta> {
    const ai = new GoogleGenAI({ apiKey: this.apiKey });
    const response = await ai.models.generateContentStream({
      model: this.model,
      contents: messages.map((item) => ({
        role: item.role === "user" ? "user" : "model",
        parts: [{ text: item.text }],
      })),
      config: {
        thinkingConfig: { includeThoughts: true },
      },
    });

    for await (const chunk of response) {
      const thoughts = chunk.usageMetadata?.thoughtsTokenCount;
      if (typeof thoughts === "number") {
        yield { type: "usage", thoughtsTokens: thoughts };
      }
      for (const part of chunk.candidates?.[0]?.content?.parts ?? []) {
        if (!part.text) {
          continue;
        }
        yield { type: part.thought ? "thinking" : "answer", text: part.text };
      }
    }
  }
}

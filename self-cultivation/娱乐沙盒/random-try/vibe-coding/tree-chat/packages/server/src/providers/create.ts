import type { AppConfig } from "../config.ts";
import { GeminiProvider } from "./gemini.ts";
import { MockProvider } from "./mock.ts";
import type { ChatProvider } from "./types.ts";

export function createProvider(config: AppConfig): ChatProvider {
  if (config.provider === "gemini") {
    if (!config.apiKey) {
      throw new Error("GEMINI_API_KEY is required for TREE_CHAT_PROVIDER=gemini");
    }
    return new GeminiProvider(config.apiKey, config.model);
  }
  return new MockProvider();
}

import type { PathMessage } from "@tree-chat/shared";

export type StreamDelta =
  | { type: "thinking"; text: string }
  | { type: "answer"; text: string }
  | { type: "usage"; thoughtsTokens: number };

export interface ChatProvider {
  readonly name: string;
  stream(messages: PathMessage[]): AsyncGenerator<StreamDelta>;
}

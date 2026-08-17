import type { ChatNode } from "@tree-chat/shared";
import { el } from "../dom.ts";
import { renderAnswerBlock } from "./answer-block.ts";
import { renderThinkingBlock } from "./thinking-block.ts";

export function renderModelTurn(
  node: ChatNode,
  opts: {
    streaming: boolean;
    thinkingOpen: boolean;
    onToggleThinking: () => void;
    onFork: (id: string) => void;
  },
): HTMLElement {
  const wrap = el("article", "turn model-turn");
  wrap.append(el("div", "turn-role", "Model"));
  const thinking = renderThinkingBlock(node, {
    streaming: opts.streaming,
    open: opts.thinkingOpen || opts.streaming,
    onToggle: opts.onToggleThinking,
  });
  if (thinking) {
    wrap.append(thinking);
  }
  wrap.append(renderAnswerBlock(node, { onFork: opts.onFork }));
  return wrap;
}

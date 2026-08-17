import type { ChatNode } from "@tree-chat/shared";
import { el } from "../dom.ts";
import { renderMarkdown } from "./markdown.ts";

export function renderThinkingBlock(
  node: ChatNode,
  opts: { streaming: boolean; open: boolean; onToggle: () => void },
): HTMLElement | null {
  if (!node.thinking && !opts.streaming) {
    return null;
  }

  const wrap = el("section", "thinking-block");
  const title = opts.streaming
    ? "Thinking..."
    : `Thoughts${node.thoughtsTokens ? ` · ${node.thoughtsTokens} tokens` : ""}`;
  const toggle = el("button", "thinking-toggle", title);
  toggle.type = "button";
  toggle.setAttribute("aria-expanded", String(opts.open || opts.streaming));
  toggle.addEventListener("click", opts.onToggle);
  wrap.append(toggle);

  if (opts.open || opts.streaming) {
    const body = el("div", "thinking-body");
    body.innerHTML = renderMarkdown(node.thinking);
    wrap.append(body);
  }
  return wrap;
}

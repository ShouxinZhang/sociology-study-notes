import type { ChatNode } from "@tree-chat/shared";
import { button, copyText, el } from "../dom.ts";
import { renderMarkdown } from "./markdown.ts";

export function renderAnswerBlock(
  node: ChatNode,
  actions: { onFork: (id: string) => void },
): HTMLElement {
  const wrap = el("section", "answer-block");
  wrap.append(el("div", "turn-role", "Answer"));
  const body = el("div", "turn-body");
  body.innerHTML = renderMarkdown(node.answer || (node.thinking ? "" : "…"));
  wrap.append(body);

  const footer = el("div", "turn-footer");
  footer.append(
    button("复制", () => void copyText(node.answer)),
    button("分叉", () => actions.onFork(node.id)),
  );
  wrap.append(footer);
  return wrap;
}

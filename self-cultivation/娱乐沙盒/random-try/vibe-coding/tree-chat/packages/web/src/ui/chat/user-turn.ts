import type { ChatNode } from "@tree-chat/shared";
import { button, copyText, el } from "../dom.ts";
import { renderMarkdown } from "./markdown.ts";

export function renderUserTurn(
  node: ChatNode,
  actions: { onFork: (id: string) => void; onEdit: (id: string, text: string) => void },
): HTMLElement {
  const wrap = el("article", "turn user-turn");
  wrap.append(el("div", "turn-role", "User"));

  const body = el("div", "turn-body");
  body.innerHTML = renderMarkdown(node.text);
  wrap.append(body);

  const footer = el("div", "turn-footer");
  footer.append(
    button("复制", () => void copyText(node.text)),
    button("编辑", () => {
      const next = window.prompt("编辑这条用户消息", node.text);
      if (next && next.trim() && next.trim() !== node.text) {
        actions.onEdit(node.id, next.trim());
      }
    }),
    button("分叉", () => actions.onFork(node.id)),
  );
  wrap.append(footer);
  return wrap;
}

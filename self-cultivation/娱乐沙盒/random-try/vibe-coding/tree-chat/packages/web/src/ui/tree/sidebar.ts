import type { ChatNode, Forest } from "@tree-chat/shared";
import { el } from "../dom.ts";

function labelOf(node: ChatNode): string {
  const raw = node.role === "user" ? node.text : node.answer || node.thinking;
  const compact = raw.replace(/\s+/g, " ").trim();
  return `${node.role === "user" ? "U" : "M"} · ${compact.slice(0, 28) || "(空)"}`;
}

function renderBranch(
  forest: Forest,
  ids: string[],
  currentId: string | null,
  onSelect: (id: string) => void,
): HTMLElement {
  const list = el("ul", "tree-list");
  for (const id of ids) {
    const node = forest.nodes[id];
    if (!node) {
      continue;
    }
    const item = el("li");
    const btn = el("button", id === currentId ? "tree-node is-current" : "tree-node", labelOf(node));
    btn.type = "button";
    btn.addEventListener("click", () => onSelect(id));
    item.append(btn);
    if (node.children.length) {
      item.append(renderBranch(forest, node.children, currentId, onSelect));
    }
    list.append(item);
  }
  return list;
}

export function renderSidebar(forest: Forest, onSelect: (id: string) => void): HTMLElement {
  const aside = el("aside", "tree-sidebar");
  aside.append(el("h2", "pane-title", "Tree"));
  aside.append(renderBranch(forest, forest.roots, forest.currentId, onSelect));
  return aside;
}

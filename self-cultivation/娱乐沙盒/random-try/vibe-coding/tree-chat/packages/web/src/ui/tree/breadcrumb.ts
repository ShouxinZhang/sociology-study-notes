import type { ChatNode } from "@tree-chat/shared";
import { el } from "../dom.ts";

export function renderBreadcrumb(path: ChatNode[], onSelect: (id: string) => void): HTMLElement {
  const nav = el("nav", "breadcrumb");
  if (path.length === 0) {
    nav.append(el("span", "", "根"));
    return nav;
  }
  path.forEach((node, index) => {
    if (index > 0) {
      nav.append(el("span", "crumb-sep", ">"));
    }
    const label = node.role === "user" ? node.text.slice(0, 16) || "User" : "Model";
    const btn = el("button", "crumb", label);
    btn.type = "button";
    btn.addEventListener("click", () => onSelect(node.id));
    nav.append(btn);
  });
  return nav;
}

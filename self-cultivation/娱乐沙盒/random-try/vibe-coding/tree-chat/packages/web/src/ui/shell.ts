import type { Store } from "../state/store.ts";
import { renderPanel } from "./chat/panel.ts";
import { el } from "./dom.ts";
import { renderBreadcrumb } from "./tree/breadcrumb.ts";
import { renderSidebar } from "./tree/sidebar.ts";

export function renderShell(
  store: Store,
  actions: {
    onSend: (text: string) => void;
    onSelect: (id: string) => void;
    onFork: (id: string) => void;
    onEdit: (id: string, text: string) => void;
  },
): HTMLElement {
  const state = store.get();
  const root = el("div", "app-shell");
  root.append(renderSidebar(state.forest, actions.onSelect));

  const main = el("main", "main-pane");
  const top = el("header", "main-header");
  top.append(renderBreadcrumb(store.path(), actions.onSelect));
  if (state.status) {
    top.append(el("p", "status-line", state.status));
  }
  main.append(top, renderPanel(store, actions));
  root.append(main);
  return root;
}

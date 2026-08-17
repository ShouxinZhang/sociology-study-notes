import type { Store } from "../state/store.ts";
import { renderComposer } from "./chat/composer.ts";
import { renderTurns } from "./chat/panel.ts";
import { el } from "./dom.ts";
import { renderBreadcrumb } from "./tree/breadcrumb.ts";
import { renderSidebar } from "./tree/sidebar.ts";

type Actions = {
  onSend: (text: string) => void;
  onSelect: (id: string) => void;
  onFork: (id: string) => void;
  onEdit: (id: string, text: string) => void;
};

/** 壳只建一次。流式更新只替换树、路径和消息，避免把输入框和滚动位置毁掉。 */
export function mountShell(root: HTMLElement, store: Store, actions: Actions): () => void {
  const sidebarHost = el("div", "tree-sidebar-host");
  const header = el("header", "main-header");
  const scroll = el("div", "chat-scroll");
  const composerHost = el("div", "composer-host");

  const panel = el("section", "chat-panel");
  panel.append(scroll, composerHost);
  const main = el("main", "main-pane");
  main.append(header, panel);
  const shell = el("div", "app-shell");
  shell.append(sidebarHost, main);
  root.replaceChildren(shell);

  let composerDisabled: boolean | null = null;

  return () => {
    const state = store.get();
    sidebarHost.replaceChildren(renderSidebar(state.forest, actions.onSelect));
    header.replaceChildren(renderBreadcrumb(store.path(), actions.onSelect));
    if (state.status) {
      header.append(el("p", "status-line", state.status));
    }
    scroll.replaceChildren(...renderTurns(store, actions));
    scroll.scrollTop = scroll.scrollHeight;

    const disabled = Boolean(state.streamingId);
    if (disabled !== composerDisabled) {
      composerDisabled = disabled;
      composerHost.replaceChildren(renderComposer({ disabled, onSubmit: actions.onSend }));
    }
  };
}

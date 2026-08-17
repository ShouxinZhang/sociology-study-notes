import type { ChatNode } from "@tree-chat/shared";
import type { Store } from "../../state/store.ts";
import { el } from "../dom.ts";
import { renderComposer } from "./composer.ts";
import { renderModelTurn } from "./model-turn.ts";
import { renderUserTurn } from "./user-turn.ts";

export function renderPanel(
  store: Store,
  actions: {
    onSend: (text: string) => void;
    onFork: (id: string) => void;
    onEdit: (id: string, text: string) => void;
  },
): HTMLElement {
  const state = store.get();
  const wrap = el("section", "chat-panel");
  const scroller = el("div", "chat-scroll");

  const path = store.path();
  const lastModelId = [...path].reverse().find((node) => node.role === "model")?.id;
  for (const node of path) {
    scroller.append(renderTurn(node, store, actions, lastModelId));
  }
  if (store.path().length === 0) {
    scroller.append(el("p", "empty-hint", "从当前节点提问。发送只带这条路径。"));
  }

  wrap.append(
    scroller,
    renderComposer({
      disabled: Boolean(state.streamingId),
      onSubmit: actions.onSend,
    }),
  );
  return wrap;
}

function renderTurn(
  node: ChatNode,
  store: Store,
  actions: { onFork: (id: string) => void; onEdit: (id: string, text: string) => void },
  lastModelId: string | undefined,
): HTMLElement {
  const state = store.get();
  if (node.role === "user") {
    return renderUserTurn(node, actions);
  }
  return renderModelTurn(node, {
    streaming: state.streamingId === node.id,
    thinkingOpen: state.streamingId === node.id || (state.thinkingOpen && node.id === lastModelId),
    onToggleThinking: () => store.toggleThinking(),
    onFork: actions.onFork,
  });
}

import type { ChatNode } from "@tree-chat/shared";
import type { Store } from "../../state/store.ts";
import { el } from "../dom.ts";
import { renderModelTurn } from "./model-turn.ts";
import { renderUserTurn } from "./user-turn.ts";

export function renderTurns(
  store: Store,
  actions: { onFork: (id: string) => void; onEdit: (id: string, text: string) => void },
): HTMLElement[] {
  const path = store.path();
  const lastModelId = [...path].reverse().find((node) => node.role === "model")?.id;
  if (path.length === 0) {
    return [el("p", "empty-hint", "从当前节点提问。发送只带这条路径。")];
  }
  return path.map((node) => renderTurn(node, store, actions, lastModelId));
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

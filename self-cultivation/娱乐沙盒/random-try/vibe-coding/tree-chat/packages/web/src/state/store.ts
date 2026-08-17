import { currentPath, emptyForest, type ChatNode, type Forest } from "@tree-chat/shared";

export type AppState = {
  forest: Forest;
  streamingId: string | null;
  thinkingOpen: boolean;
  status: string;
};

type Listener = (state: AppState) => void;

export function createStore() {
  let state: AppState = {
    forest: emptyForest(),
    streamingId: null,
    thinkingOpen: false,
    status: "",
  };
  const listeners = new Set<Listener>();

  const emit = (): void => {
    for (const listener of listeners) {
      listener(state);
    }
  };

  return {
    get: () => state,
    path: () => currentPath(state.forest),
    subscribe(listener: Listener): () => void {
      listeners.add(listener);
      listener(state);
      return () => listeners.delete(listener);
    },
    setForest(forest: Forest): void {
      state = { ...state, forest };
      emit();
    },
    upsert(node: ChatNode): void {
      const forest = structuredClone(state.forest);
      forest.nodes[node.id] = node;
      const parent = node.parentId ? forest.nodes[node.parentId] : undefined;
      if (parent && !parent.children.includes(node.id)) {
        parent.children.push(node.id);
      } else if (!node.parentId && !forest.roots.includes(node.id)) {
        forest.roots.push(node.id);
      }
      forest.currentId = node.id;
      state = { ...state, forest };
      emit();
    },
    patchModel(id: string, patch: Partial<Pick<ChatNode, "thinking" | "answer" | "thoughtsTokens">>): void {
      const forest = structuredClone(state.forest);
      const node = forest.nodes[id];
      if (!node) {
        return;
      }
      Object.assign(node, patch);
      state = { ...state, forest };
      emit();
    },
    setStreaming(id: string | null, thinkingOpen = Boolean(id)): void {
      state = { ...state, streamingId: id, thinkingOpen };
      emit();
    },
    toggleThinking(): void {
      state = { ...state, thinkingOpen: !state.thinkingOpen };
      emit();
    },
    setStatus(status: string): void {
      state = { ...state, status };
      emit();
    },
  };
}

export type Store = ReturnType<typeof createStore>;

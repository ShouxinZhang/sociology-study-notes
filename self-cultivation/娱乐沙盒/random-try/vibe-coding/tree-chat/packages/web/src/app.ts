import { fetchHealth, fetchTree, postTree, streamChat } from "./api/client.ts";
import { createStore } from "./state/store.ts";
import { renderShell } from "./ui/shell.ts";

export async function startApp(root: HTMLElement): Promise<void> {
  const store = createStore();

  const paint = (): void => {
    root.replaceChildren(
      renderShell(store, {
        onSend: (text) => void send(text),
        onSelect: (id) => void mutate("select", { nodeId: id }),
        onFork: (id) => void mutate("fork", { nodeId: id }),
        onEdit: (id, text) => void mutate("edit", { nodeId: id, text }),
      }),
    );
  };
  store.subscribe(paint);

  try {
    const [forest, health] = await Promise.all([fetchTree(), fetchHealth()]);
    store.setForest(forest);
    store.setStatus(`${health.provider} · ${health.model}`);
  } catch (error) {
    store.setStatus(error instanceof Error ? error.message : String(error));
  }

  async function mutate(path: "select" | "fork" | "edit", body: object): Promise<void> {
    try {
      store.setForest(await postTree(path, body));
    } catch (error) {
      store.setStatus(error instanceof Error ? error.message : String(error));
    }
  }

  async function send(text: string): Promise<void> {
    store.setStatus("running");
    try {
      await streamChat(text, {
        onUser: (node) => store.upsert(node),
        onModelStart: (node) => {
          store.upsert(node);
          store.setStreaming(node.id, true);
        },
        onThinking: (payload) => store.patchModel(payload.id, { thinking: payload.thinking }),
        onAnswer: (payload) => store.patchModel(payload.id, { answer: payload.answer }),
        onUsage: (payload) => store.patchModel(payload.id, { thoughtsTokens: payload.thoughtsTokens }),
        onDone: (node) => {
          store.upsert(node);
          store.setStreaming(null, false);
          store.setStatus("done");
        },
        onError: (message) => {
          store.setStreaming(null, false);
          store.setStatus(message);
        },
      });
    } catch (error) {
      store.setStreaming(null, false);
      store.setStatus(error instanceof Error ? error.message : String(error));
    }
  }
}

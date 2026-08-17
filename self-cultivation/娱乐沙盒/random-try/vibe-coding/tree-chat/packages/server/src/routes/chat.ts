import type { IncomingMessage, ServerResponse } from "node:http";
import { addNode, makeNode, patchNode, pathTranscript } from "@tree-chat/shared";
import { sendError, readJson } from "../http/json.ts";
import { openSse } from "../http/sse.ts";
import type { ChatProvider } from "../providers/types.ts";
import type { FileForestRepository } from "../tree/file-repository.ts";

type ChatBody = { text?: string };

export async function handleChat(
  repo: FileForestRepository,
  provider: ChatProvider,
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  const { text } = await readJson<ChatBody>(req);
  const prompt = text?.trim() ?? "";
  if (!prompt) {
    sendError(res, 400, "text required");
    return;
  }

  const sse = openSse(res);
  try {
    let forest = repo.load();
    const user = makeNode("user", forest.currentId, { text: prompt });
    forest = addNode(forest, user);
    const model = makeNode("model", user.id);
    forest = addNode(forest, model);
    repo.save(forest);
    sse.send("user", user);
    sse.send("model-start", model);

    let thinking = "";
    let answer = "";
    let thoughtsTokens: number | null = null;
    for await (const delta of provider.stream(pathTranscript(forest, user.id))) {
      if (delta.type === "thinking") {
        thinking += delta.text;
        forest = patchNode(forest, model.id, { thinking });
        sse.send("thinking", { id: model.id, text: delta.text, thinking });
      } else if (delta.type === "answer") {
        answer += delta.text;
        forest = patchNode(forest, model.id, { answer });
        sse.send("answer", { id: model.id, text: delta.text, answer });
      } else {
        thoughtsTokens = delta.thoughtsTokens;
        forest = patchNode(forest, model.id, { thoughtsTokens });
        sse.send("usage", { id: model.id, thoughtsTokens });
      }
      repo.save(forest);
    }

    const done = forest.nodes[model.id];
    sse.send("done", done);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    sse.send("error", { message });
  } finally {
    sse.close();
  }
}

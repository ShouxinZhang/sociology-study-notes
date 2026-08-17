import type { IncomingMessage, ServerResponse } from "node:http";
import { editUser, forkFrom, selectNode } from "@tree-chat/shared";
import { sendError, sendJson, readJson } from "../http/json.ts";
import type { FileForestRepository } from "../tree/file-repository.ts";

type NodeBody = { nodeId?: string; text?: string };

export function handleGetTree(repo: FileForestRepository, res: ServerResponse): void {
  sendJson(res, 200, repo.load());
}

export async function handleSelect(
  repo: FileForestRepository,
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  const { nodeId } = await readJson<NodeBody>(req);
  if (!nodeId) {
    sendError(res, 400, "nodeId required");
    return;
  }
  const forest = selectNode(repo.load(), nodeId);
  repo.save(forest);
  sendJson(res, 200, forest);
}

export async function handleFork(
  repo: FileForestRepository,
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  const { nodeId } = await readJson<NodeBody>(req);
  if (!nodeId) {
    sendError(res, 400, "nodeId required");
    return;
  }
  const forest = forkFrom(repo.load(), nodeId);
  repo.save(forest);
  sendJson(res, 200, forest);
}

export async function handleEdit(
  repo: FileForestRepository,
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  const { nodeId, text } = await readJson<NodeBody>(req);
  if (!nodeId || !text?.trim()) {
    sendError(res, 400, "nodeId and text required");
    return;
  }
  const forest = editUser(repo.load(), nodeId, text.trim());
  repo.save(forest);
  sendJson(res, 200, forest);
}

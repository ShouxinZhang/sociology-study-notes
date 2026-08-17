import type { IncomingMessage, ServerResponse } from "node:http";
import { sendError, sendJson } from "./json.ts";
import type { AppConfig } from "../config.ts";
import type { ChatProvider } from "../providers/types.ts";
import { handleChat } from "../routes/chat.ts";
import { handleEdit, handleFork, handleGetTree, handleSelect } from "../routes/tree.ts";
import type { FileForestRepository } from "../tree/file-repository.ts";

export function createRouter(
  config: AppConfig,
  repo: FileForestRepository,
  provider: ChatProvider,
) {
  return async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
    const path = url.pathname;
    const method = req.method ?? "GET";

    try {
      if (method === "GET" && path === "/api/health") {
        sendJson(res, 200, { ok: true, provider: provider.name, model: config.model });
        return;
      }
      if (method === "GET" && path === "/api/tree") {
        handleGetTree(repo, res);
        return;
      }
      if (method === "POST" && path === "/api/tree/select") {
        await handleSelect(repo, req, res);
        return;
      }
      if (method === "POST" && path === "/api/tree/fork") {
        await handleFork(repo, req, res);
        return;
      }
      if (method === "POST" && path === "/api/tree/edit") {
        await handleEdit(repo, req, res);
        return;
      }
      if (method === "POST" && path === "/api/chat") {
        await handleChat(repo, provider, req, res);
        return;
      }
      sendError(res, 404, "not found");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      sendError(res, 500, message);
    }
  };
}

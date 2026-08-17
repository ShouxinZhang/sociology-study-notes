import type { ChatNode, Forest, Role } from "../types.ts";
import { createId } from "../ids.ts";

export function emptyForest(): Forest {
  return { nodes: {}, roots: [], currentId: null };
}

export function makeNode(
  role: Role,
  parentId: string | null,
  init: Partial<Pick<ChatNode, "text" | "thinking" | "answer" | "thoughtsTokens">> = {},
): ChatNode {
  return {
    id: createId(role),
    parentId,
    role,
    text: init.text ?? "",
    thinking: init.thinking ?? "",
    answer: init.answer ?? "",
    thoughtsTokens: init.thoughtsTokens ?? null,
    children: [],
    createdAt: new Date().toISOString(),
  };
}

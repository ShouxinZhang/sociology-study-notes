import { createId } from "../ids.ts";
import type { ChatNode, Forest } from "../types.ts";
import { cloneForest } from "./clone.ts";
import { getNode } from "./path.ts";

function attach(forest: Forest, node: ChatNode): Forest {
  const next = cloneForest(forest);
  next.nodes[node.id] = node;
  if (node.parentId) {
    getNode(next, node.parentId).children.push(node.id);
  } else {
    next.roots.push(node.id);
  }
  next.currentId = node.id;
  return next;
}

export function addNode(forest: Forest, node: ChatNode): Forest {
  if (node.parentId && !forest.nodes[node.parentId]) {
    throw new Error(`missing parent: ${node.parentId}`);
  }
  return attach(forest, node);
}

export function selectNode(forest: Forest, id: string): Forest {
  getNode(forest, id);
  return { ...cloneForest(forest), currentId: id };
}

/**
 * 分叉只改指针：模型节点下继续长子节点；
 * 用户节点则回到它的父节点，让下一条成为兄弟分支。
 */
export function forkFrom(forest: Forest, id: string): Forest {
  const node = getNode(forest, id);
  if (node.role === "model") {
    return selectNode(forest, id);
  }
  if (!node.parentId) {
    const next = cloneForest(forest);
    next.currentId = null;
    return next;
  }
  return selectNode(forest, node.parentId);
}

export function patchNode(
  forest: Forest,
  id: string,
  patch: Partial<Pick<ChatNode, "text" | "thinking" | "answer" | "thoughtsTokens">>,
): Forest {
  const next = cloneForest(forest);
  Object.assign(getNode(next, id), patch);
  return next;
}

/** 编辑用户消息：无子节点则原地改；已有子节点则在同一父下长出兄弟分支。 */
export function editUser(forest: Forest, id: string, text: string): Forest {
  const node = getNode(forest, id);
  if (node.role !== "user") {
    throw new Error("can only edit user nodes");
  }
  if (node.children.length === 0) {
    return patchNode(forest, id, { text });
  }
  const sibling: ChatNode = {
    ...node,
    id: createId(node.role),
    text,
    children: [],
    createdAt: new Date().toISOString(),
  };
  return addNode(forest, sibling);
}

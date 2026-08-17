import type { ChatNode, Forest } from "../types.ts";

export function getNode(forest: Forest, id: string): ChatNode {
  const node = forest.nodes[id];
  if (!node) {
    throw new Error(`missing node: ${id}`);
  }
  return node;
}

/** 从根到目标节点，不含兄弟。 */
export function pathTo(forest: Forest, id: string | null): ChatNode[] {
  if (!id) {
    return [];
  }
  const chain: ChatNode[] = [];
  let cursor: string | null = id;
  while (cursor) {
    const node = getNode(forest, cursor);
    chain.push(node);
    cursor = node.parentId;
  }
  return chain.reverse();
}

export function currentPath(forest: Forest): ChatNode[] {
  return pathTo(forest, forest.currentId);
}

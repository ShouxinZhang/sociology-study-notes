import type { Forest, PathMessage } from "../types.ts";
import { pathTo } from "./path.ts";

function nodeText(node: Forest["nodes"][string]): string {
  return node.role === "user" ? node.text : node.answer;
}

/** 只序列化当前路径上的可见正文，thinking 与兄弟分支都不进入 prompt。 */
export function pathTranscript(forest: Forest, leafId: string | null = forest.currentId): PathMessage[] {
  return pathTo(forest, leafId)
    .map((node) => ({ role: node.role, text: nodeText(node) }))
    .filter((item) => item.text.length > 0);
}

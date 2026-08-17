import type { Forest } from "../types.ts";

export function cloneForest(forest: Forest): Forest {
  return structuredClone(forest);
}

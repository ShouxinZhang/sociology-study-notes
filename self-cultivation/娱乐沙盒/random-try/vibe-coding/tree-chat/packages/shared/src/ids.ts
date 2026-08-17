/** 节点 id 只用于本地树，不要求跨进程稳定。 */
export function createId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
}

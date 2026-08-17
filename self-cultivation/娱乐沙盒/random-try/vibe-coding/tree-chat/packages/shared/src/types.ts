export type Role = "user" | "model";

export type ChatNode = {
  id: string;
  parentId: string | null;
  role: Role;
  /** 用户原文。model 节点为空。 */
  text: string;
  thinking: string;
  answer: string;
  thoughtsTokens: number | null;
  children: string[];
  createdAt: string;
};

export type Forest = {
  nodes: Record<string, ChatNode>;
  roots: string[];
  currentId: string | null;
};

/** 发给模型的路径消息：model 只带最终回答，不带兄弟分支。 */
export type PathMessage = {
  role: Role;
  text: string;
};

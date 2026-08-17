import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");

function loadEnvFile(path: string): void {
  if (!existsSync(path)) {
    return;
  }
  for (const raw of readFileSync(path, "utf8").split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#") || !line.includes("=")) {
      continue;
    }
    const eq = line.indexOf("=");
    const key = line.slice(0, eq).trim();
    const value = line.slice(eq + 1).trim().replace(/^['"]|['"]$/g, "");
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(resolve(rootDir, ".env"));

export type ProviderName = "gemini" | "mock";

export type AppConfig = {
  port: number;
  dataFile: string;
  model: string;
  apiKey: string;
  provider: ProviderName;
  rootDir: string;
};

function resolveProvider(apiKey: string): ProviderName {
  const requested = (process.env.TREE_CHAT_PROVIDER ?? "auto").toLowerCase();
  if (requested === "mock" || requested === "gemini") {
    return requested;
  }
  return apiKey ? "gemini" : "mock";
}

export function loadConfig(): AppConfig {
  const apiKey = process.env.GEMINI_API_KEY?.trim() ?? "";
  return {
    port: Number(process.env.PORT ?? 8787),
    dataFile: process.env.TREE_CHAT_DATA ?? resolve(rootDir, "data/forest.json"),
    model: process.env.TREE_CHAT_MODEL ?? "gemini-2.5-flash",
    apiKey,
    provider: resolveProvider(apiKey),
    rootDir,
  };
}

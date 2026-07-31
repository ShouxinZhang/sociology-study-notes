#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { CdpClient } from "./cdp_client.mjs";

const endpoint = (process.argv[2] || "").replace(/\/+$/, "");
if (!endpoint) {
  throw new Error("Usage: collect.mjs http://127.0.0.1:PORT");
}

const targetsResponse = await fetch(`${endpoint}/json/list`);
if (!targetsResponse.ok) {
  throw new Error(`CDP target list failed: HTTP ${targetsResponse.status}`);
}
const targets = await targetsResponse.json();
const target = targets.find(
  (item) =>
    item.type === "page" &&
    typeof item.url === "string" &&
    item.url.includes("index.html"),
);
if (!target?.webSocketDebuggerUrl) {
  throw new Error("QQ Music main renderer target was not found");
}

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const expression = fs.readFileSync(
  path.join(currentDirectory, "extract.js"),
  "utf8",
);

const client = new CdpClient(target.webSocketDebuggerUrl);
try {
  await client.connect();
  const evaluation = await client.send(
    "Runtime.evaluate",
    {
      expression,
      awaitPromise: true,
      returnByValue: true,
    },
    600_000,
  );
  const remote = evaluation.result;
  if (remote?.subtype === "error" || evaluation.exceptionDetails) {
    const description =
      evaluation.exceptionDetails?.exception?.description ||
      remote?.description ||
      "unknown renderer error";
    throw new Error(description);
  }
  if (typeof remote?.value !== "string") {
    throw new Error("QQ Music renderer did not return serialized JSON");
  }
  process.stdout.write(remote.value);
} finally {
  client.close();
}

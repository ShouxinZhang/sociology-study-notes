import { createServer } from "node:http";
import { loadConfig } from "./config.ts";
import { createRouter } from "./http/router.ts";
import { createProvider } from "./providers/create.ts";
import { FileForestRepository } from "./tree/file-repository.ts";

const config = loadConfig();
const repo = new FileForestRepository(config.dataFile);
const provider = createProvider(config);
const server = createServer(createRouter(config, repo, provider));

server.listen(config.port, () => {
  process.stdout.write(
    `tree-chat server :${config.port} provider=${provider.name} model=${config.model}\n`,
  );
});

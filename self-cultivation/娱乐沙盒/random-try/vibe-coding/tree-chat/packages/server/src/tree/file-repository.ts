import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { emptyForest, type Forest } from "@tree-chat/shared";

export class FileForestRepository {
  constructor(private readonly file: string) {}

  load(): Forest {
    if (!existsSync(this.file)) {
      return emptyForest();
    }
    return JSON.parse(readFileSync(this.file, "utf8")) as Forest;
  }

  save(forest: Forest): void {
    mkdirSync(dirname(this.file), { recursive: true });
    writeFileSync(this.file, `${JSON.stringify(forest, null, 2)}\n`, "utf8");
  }
}

/**
 * 资源加载：读取 assets/manifest.json，并行拉取调色板、精灵、数值与关卡 JSON。
 * 新增素材/关卡只需登记到 manifest，无需改动逻辑代码。
 */
import { compileSprites } from './sprites.js';

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`加载失败：${url}（HTTP ${res.status}）`);
  return res.json();
}

export async function loadAssets(base = 'assets/') {
  const manifest = await fetchJson(base + 'manifest.json');
  const load = (path) => fetchJson(base + path);

  const [palette, spriteFiles, dataEntries, levels] = await Promise.all([
    load(manifest.palette),
    Promise.all(manifest.sprites.map(load)),
    Promise.all(Object.entries(manifest.data).map(async ([key, path]) => [key, await load(path)])),
    Promise.all(manifest.levels.map(load)),
  ]);

  return {
    palette,
    sprites: compileSprites(mergeSprites(manifest.sprites, spriteFiles), palette),
    data: Object.fromEntries(dataEntries),
    levels,
  };
}

/** 合并各精灵文件；同名精灵会被后加载的覆盖，因此告警提示改名 */
function mergeSprites(paths, files) {
  const merged = {};
  files.forEach((file, i) => {
    for (const name of Object.keys(file)) {
      if (name in merged) console.warn(`精灵重名：${name}（${paths[i]} 覆盖了之前的定义）`);
    }
    Object.assign(merged, file);
  });
  return merged;
}

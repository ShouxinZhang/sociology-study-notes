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
    sprites: compileSprites(Object.assign({}, ...spriteFiles), palette),
    data: Object.fromEntries(dataEntries),
    levels,
  };
}

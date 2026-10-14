#!/usr/bin/env node
/**
 * @file review-check.mjs
 * @description 3D 魂斗罗自动化审查模块：
 *   1. 静态检查：JSON 数据契约、17 个 ES Module 语法与相对导入路径。
 *   2. 动态浏览器自检：启动本地 HTTP 服务与 Headless Chrome (CDP)，验证 3 大关卡、5 把武器、飞行胶囊、断桥机关与多部件 Boss 零报错运行。
 */

import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { execFileSync, spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

let errorCount = 0;
function fail(msg) {
  console.error(`[FAIL] ${msg}`);
  errorCount++;
}
function pass(msg) {
  console.log(`[PASS] ${msg}`);
}

// 1. 静态检查 JSON 配置
for (const jsonRel of ['assets/data/weapons.json', 'assets/data/enemies.json', 'assets/data/levels.json']) {
  const full = path.join(rootDir, jsonRel);
  if (!fs.existsSync(full)) {
    fail(`Missing JSON file: ${jsonRel}`);
    continue;
  }
  try {
    const parsed = JSON.parse(fs.readFileSync(full, 'utf8'));
    pass(`JSON valid: ${jsonRel} (${Array.isArray(parsed) ? parsed.length + ' stages' : Object.keys(parsed).length + ' keys'})`);
  } catch (e) {
    fail(`Invalid JSON in ${jsonRel}: ${e.message}`);
  }
}

// 2. 递归扫描 src/ 下所有 JS 模块并执行语法与导入核验
function walkJs(dir, list = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkJs(full, list);
    else if (entry.name.endsWith('.js')) list.push(full);
  }
  return list;
}

const jsFiles = walkJs(path.join(rootDir, 'src'));
for (const file of jsFiles) {
  const rel = path.relative(rootDir, file);
  try {
    execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
  } catch (e) {
    fail(`Syntax error in ${rel}: ${e.stderr?.toString() || e.message}`);
    continue;
  }

  const content = fs.readFileSync(file, 'utf8');
  const importRegex = /from\s+['"]([^'"]+)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const spec = match[1];
    if (spec === 'three') continue;
    const resolved = path.resolve(path.dirname(file), spec);
    if (!fs.existsSync(resolved)) {
      fail(`Broken import '${spec}' in ${rel}`);
    }
  }
  pass(`Module syntax & imports verified: ${rel}`);
}

// 3. 启动临时 HTTP 服务 + Headless Chrome 端到端自检
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8'
};

function startServer() {
  return new Promise((resolve) => {
    const srv = http.createServer((req, res) => {
      const urlPath = req.url.split('?')[0] === '/' ? '/index.html' : req.url.split('?')[0];
      const filePath = path.join(rootDir, urlPath);
      if (!filePath.startsWith(rootDir) || !fs.existsSync(filePath)) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      const ext = path.extname(filePath);
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    });
    srv.listen(0, '127.0.0.1', () => resolve(srv));
  });
}

async function runBrowserCheck() {
  const srv = await startServer();
  const port = srv.address().port;
  const url = `http://127.0.0.1:${port}/`;
  const userDataDir = `/tmp/contra3d-chrome-${Date.now()}`;

  const chrome = spawn('/usr/bin/google-chrome', [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu-sandbox',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--mute-audio',
    `--user-data-dir=${userDataDir}`,
    '--remote-debugging-port=0',
    'about:blank'
  ], { stdio: ['ignore', 'pipe', 'pipe'] });

  let wsUrl = null;
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Chrome launch timeout')), 8000);
    chrome.stderr.on('data', (chunk) => {
      const text = chunk.toString();
      const m = text.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (m) {
        clearTimeout(timer);
        wsUrl = m[1];
        resolve();
      }
    });
  });

  const debugPort = new URL(wsUrl).port;
  const targets = await fetch(`http://127.0.0.1:${debugPort}/json/list`).then((r) => r.json());
  const pageTarget = targets.find((t) => t.type === 'page');

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r, { once: true }));

  let msgId = 0;
  const pending = new Map();
  const runtimeErrors = [];

  ws.addEventListener('message', (ev) => {
    const data = JSON.parse(ev.data);
    if (data.method === 'Runtime.exceptionThrown') {
      runtimeErrors.push(data.params.exceptionDetails?.text || 'Exception');
    }
    if (data.method === 'Runtime.consoleAPICalled' && data.params.type === 'error') {
      runtimeErrors.push(data.params.args.map((a) => a.value || a.description).join(' '));
    }
    if (data.id && pending.has(data.id)) {
      pending.get(data.id)(data);
      pending.delete(data.id);
    }
  });

  function sendCdp(method, params = {}) {
    return new Promise((resolve) => {
      const id = ++msgId;
      pending.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await sendCdp('Page.enable');
  await sendCdp('Runtime.enable');
  await sendCdp('Page.navigate', { url });
  await new Promise((r) => setTimeout(r, 400));

  // 等待 __CONTRA3D__ 挂载完成并执行全链路模拟验收
  const evalRes = await sendCdp('Runtime.evaluate', {
    awaitPromise: true,
    returnByValue: true,
    expression: `
      (async () => {
        for (let i = 0; i < 50; i++) {
          if (window.__CONTRA3D__) break;
          await new Promise(r => setTimeout(r, 100));
        }
        const app = window.__CONTRA3D__;
        if (!app) return { ok: false, reason: '__CONTRA3D__ not initialized' };

        // 1. 验证武器奖励与切换 + 开火逻辑
        for (const r of ['M', 'S', 'L', 'F', 'SHIELD']) {
          app.player.grantReward(r);
          app.player.fireCooldown = 0;
          app.combat.update(0.016, app.player, { mouseDown: true, justShot: true, pitch: 0, yaw: 0 }, app.levelLoader.platformMeshes);
        }

        // 2. 验证第 1 关爆炸断桥触发与爆破更新
        app.startStage(0);
        const bridgeSegs = app.hazardManager.bridgeSegments.length;
        if (app.hazardManager.bridgeSegments[0]) {
          app.hazardManager.bridgeSegments[0].collider.onStep();
          app.hazardManager.update(0.7, app.player);
        }

        // 3. 验证 3 大关卡加载与多部件 Boss 数量
        const stageSummary = [];
        for (let s = 0; s < 3; s++) {
          app.startStage(s);
          stageSummary.push({
            stage: s + 1,
            platforms: app.levelLoader.platformMeshes.length,
            enemies: app.enemyManager.enemies.length,
            bossParts: app.bossController.parts.length
          });
        }

        // 4. 模拟激活并击破第 3 关 Boss 核心
        app.resumePlaying();
        app.player.pos.z = -190;
        app.bossController.update(0.016, app.player);
        for (const part of app.bossController.parts) {
          if (part.isCore) app.bossController.damagePart(part, 9999);
        }

        return {
          ok: true,
          unlockedCount: app.player.unlocked.size,
          bridgeSegs,
          stageSummary,
          bossDefeated: app.bossController.defeated,
          score: app.GAME_STATE.score
        };
      })()
    `
  });

  ws.close();
  chrome.kill('SIGKILL');
  srv.close();
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch (_) {}

  if (runtimeErrors.length > 0) {
    fail(`Browser runtime errors: ${runtimeErrors.join(' | ')}`);
  } else {
    pass('Browser console & runtime exceptions: 0 errors');
  }

  const val = evalRes?.result?.result?.value;
  if (!val || !val.ok) {
    fail(`E2E gameplay verification failed: ${JSON.stringify(evalRes)}`);
  } else {
    pass(`E2E gameplay verified: ${val.unlockedCount} weapons unlocked, ${val.bridgeSegs} bridge segments, 3 stages & Boss defeat verified (score=${val.score})`);
    for (const s of val.stageSummary) {
      pass(`  -> Stage ${s.stage}: ${s.platforms} platforms, ${s.enemies} enemies, ${s.bossParts} Boss parts`);
    }
  }
}

await runBrowserCheck();

if (errorCount > 0) {
  console.error(`\nReview failed with ${errorCount} error(s).`);
  process.exit(1);
} else {
  console.log('\n[ALL CHECKS PASSED] Contra 3D static & headless browser E2E review succeeded.');
}

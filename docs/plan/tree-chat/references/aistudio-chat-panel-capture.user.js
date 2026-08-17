// ==UserScript==
// @name         AI Studio Chat Panel Capture
// @namespace    local.tree-chat
// @version      0.3.1
// @description  Export the visible AI Studio chat panel as a standalone HTML reference.
// @match        https://aistudio.google.com/*
// @match        https://aistudio.google.com/prompts/*
// @match        https://aistudio.google.com/app/prompts/*
// @include      https://aistudio.google.com/*
// @run-at       document-idle
// @noframes
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// ==/UserScript==

(() => {
  'use strict';

  const BUTTON_ID = 'tree-chat-capture-button';
  const UI_MARKER = 'data-tree-chat-capture-ui';

  // Keep the selector list small and editable because AI Studio is a changing SPA.
  const SELECTORS = {
    history: [
      'ms-autoscroll-container',
      '[data-test-id="chat-history"]',
      '[role="log"]',
    ],
    composer: [
      'ms-prompt-input-wrapper',
      'textarea[aria-label="Type something"]',
      '[role="textbox"][contenteditable="true"]',
      'textarea',
    ],
  };

  // These properties reproduce the visible panel without copying the whole site CSS.
  const STYLE_PROPERTIES = [
    'align-items', 'background', 'border', 'border-radius', 'box-shadow',
    'box-sizing', 'color', 'column-gap', 'display', 'flex', 'flex-direction',
    'flex-grow', 'flex-shrink', 'font', 'gap', 'grid-template-columns', 'height',
    'justify-content', 'letter-spacing', 'line-height', 'margin', 'max-height',
    'max-width', 'min-height', 'min-width', 'opacity', 'overflow', 'padding',
    'position', 'row-gap', 'text-align', 'text-decoration', 'text-overflow',
    'text-transform', 'transform', 'white-space', 'width', 'word-break',
  ];

  function firstMatch(selectors) {
    return selectors.map((selector) => document.querySelector(selector)).find(Boolean);
  }

  function cloneWithVisibleStyles(source) {
    const clone = source.cloneNode(true);
    const sourceElements = [source, ...source.querySelectorAll('*')];
    const cloneElements = [clone, ...clone.querySelectorAll('*')];

    sourceElements.forEach((sourceElement, index) => {
      const cloneElement = cloneElements[index];
      const computed = getComputedStyle(sourceElement);

      cloneElement.setAttribute(
        'style',
        STYLE_PROPERTIES
          .map((property) => `${property}:${computed.getPropertyValue(property)};`)
          .join(''),
      );

      // Preserve the current UI state, but never export password-like values.
      if (sourceElement instanceof HTMLTextAreaElement) {
        cloneElement.textContent = sourceElement.value;
      } else if (sourceElement instanceof HTMLInputElement) {
        cloneElement.setAttribute(
          'value',
          sourceElement.type === 'password' ? '' : sourceElement.value,
        );
      }

      [...cloneElement.attributes]
        .filter((attribute) => attribute.name.startsWith('on'))
        .forEach((attribute) => cloneElement.removeAttribute(attribute.name));
    });

    clone.querySelectorAll(`script, iframe, object, embed, [${UI_MARKER}]`).forEach((node) => node.remove());
    clone.querySelectorAll('form').forEach((form) => form.removeAttribute('action'));
    return clone;
  }

  function resourceManifest() {
    return {
      capturedAt: new Date().toISOString(),
      sourceUrl: location.href,
      stylesheets: [...document.querySelectorAll('link[rel="stylesheet"]')]
        .map((link) => link.href)
        .filter(Boolean),
      scripts: [...document.scripts]
        .map((script) => script.src)
        .filter(Boolean),
    };
  }

  function captureTarget() {
    const history = firstMatch(SELECTORS.history);
    const composer = firstMatch(SELECTORS.composer);
    const fallback = composer?.closest('main, [role="main"]')
      || document.querySelector('main, [role="main"]')
      || document.body;

    return {
      history: history || fallback,
      composer,
    };
  }

  function buildSnapshot(history, composer) {
    const snapshot = document.implementation.createHTMLDocument('AI Studio Chat Panel Capture');
    const base = snapshot.createElement('base');
    base.href = location.href;
    snapshot.head.append(base);

    const style = snapshot.createElement('style');
    style.textContent = `
      html { color-scheme: dark; background: #111; }
      body { margin: 0; padding: 24px; background: #111; color: #eee; font-family: sans-serif; }
      .capture-meta { margin: 0 auto 16px; max-width: 1100px; color: #aaa; font-size: 12px; }
      .capture-panel { margin: 0 auto; max-width: 1100px; }
      .capture-panel > * { margin-bottom: 16px; }
      details { margin: 24px auto 0; max-width: 1100px; }
      pre { overflow: auto; padding: 12px; background: #1c1c1c; }
    `;
    snapshot.head.append(style);

    const metadata = resourceManifest();
    const meta = snapshot.createElement('p');
    meta.className = 'capture-meta';
    meta.textContent = `Captured ${metadata.capturedAt} from ${metadata.sourceUrl}`;

    const panel = snapshot.createElement('main');
    panel.className = 'capture-panel';
    panel.append(cloneWithVisibleStyles(history));
    if (composer && !history.contains(composer)) {
      panel.append(cloneWithVisibleStyles(composer.closest('ms-prompt-input-wrapper') || composer));
    }

    const manifest = snapshot.createElement('details');
    manifest.innerHTML = '<summary>Original resource manifest</summary>';
    const manifestCode = snapshot.createElement('pre');
    manifestCode.textContent = JSON.stringify(metadata, null, 2);
    manifest.append(manifestCode);

    snapshot.body.append(meta, panel, manifest);
    return `<!doctype html>\n${snapshot.documentElement.outerHTML}`;
  }

  async function downloadSnapshot() {
    const { history, composer } = captureTarget();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `aistudio-chat-panel-${timestamp}.html`;

    try {
      // Chromium's picker makes the destination explicit and confirms the write completed.
      const pageWindow = typeof unsafeWindow === 'undefined' ? window : unsafeWindow;
      const picker = pageWindow.showSaveFilePicker;
      if (typeof picker === 'function') {
        const handle = await picker.call(pageWindow, {
          suggestedName: filename,
          types: [{ description: 'HTML', accept: { 'text/html': ['.html'] } }],
        });
        const writable = await handle.createWritable();
        await writable.write(buildSnapshot(history, composer));
        await writable.close();
        return;
      }

      const blob = new Blob([buildSnapshot(history, composer)], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      if (error?.name !== 'AbortError') {
        console.error('[AI Studio Chat Capture] save failed', error);
        alert(`保存失败：${error?.message || error}`);
      }
    }
  }

  function installButton() {
    if (!document.body || document.getElementById(BUTTON_ID)) return;

    const button = document.createElement('button');
    button.id = BUTTON_ID;
    button.type = 'button';
    button.setAttribute(UI_MARKER, '');
    button.textContent = '保存 Chat 前端';
    button.title = '导出当前 AI Studio Chat Panel 的 HTML、可见样式和资源清单';
    button.style.cssText = [
      'position:fixed', 'right:20px', 'bottom:20px', 'z-index:2147483647',
      'padding:10px 14px', 'border:1px solid #666', 'border-radius:8px',
      'background:#202124', 'color:#fff', 'font:13px sans-serif', 'cursor:pointer',
      'box-shadow:0 4px 16px rgba(0,0,0,.35)',
    ].join(';');
    button.style.setProperty('display', 'block', 'important');
    button.style.setProperty('position', 'fixed', 'important');
    button.style.setProperty('z-index', '2147483647', 'important');
    button.addEventListener('click', downloadSnapshot);
    document.body.append(button);
  }

  function start() {
    installButton();

    // AI Studio may replace parts of the document during SPA navigation.
    new MutationObserver(installButton).observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
    console.info('[AI Studio Chat Capture] loaded');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }

  if (typeof GM_registerMenuCommand === 'function') {
    GM_registerMenuCommand('保存 AI Studio Chat 前端', downloadSnapshot);
  }
})();

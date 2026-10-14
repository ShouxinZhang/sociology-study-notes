/**
 * @file hud.js
 * @description CSGO 风格动态十字准星、爆头反馈、多部件 Boss 血条、右上角击杀播报与主菜单控制器。
 */

import { GAME_STATE, events } from '../core/state.js';
import { WEAPON_ORDER } from '../entities/player.js';

export class HudController {
  constructor() {
    this.elStageName = document.getElementById('hud-stage-name');
    this.elScore = document.getElementById('hud-score');
    this.elProgress = document.getElementById('hud-progress');
    this.elCheatFlag = document.getElementById('hud-cheat-flag');

    this.elHp = document.getElementById('hud-hp');
    this.elShield = document.getElementById('hud-shield');
    this.elLives = document.getElementById('hud-lives');
    this.elWeaponName = document.getElementById('hud-weapon-name');
    this.elAmmo = document.getElementById('hud-ammo');
    this.slotPills = Array.from(document.querySelectorAll('.slot-pill'));

    this.chTop = document.getElementById('ch-t');
    this.chBottom = document.getElementById('ch-b');
    this.chLeft = document.getElementById('ch-l');
    this.chRight = document.getElementById('ch-r');
    this.elHitMarker = document.getElementById('hit-marker');
    this.elVignette = document.getElementById('damage-vignette');

    this.elBossHud = document.getElementById('boss-hud');
    this.elBossName = document.getElementById('boss-name-text');
    this.elBossParts = document.getElementById('boss-parts-list');
    this.elKillFeed = document.getElementById('kill-feed');
    this.elToast = document.getElementById('toast-msg');

    this.elOverlay = document.getElementById('overlay-menu');
    this.elMenuHeading = document.getElementById('menu-heading');
    this.elMenuSub = document.getElementById('menu-subtitle');
    this.btnStart = document.getElementById('btn-start-resume');
    this.btnCheat = document.getElementById('btn-toggle-cheat');
    this.btnMute = document.getElementById('btn-toggle-mute');

    this.toastTimer = 0;
    this.hitMarkerTimer = 0;
    this._bindEvents();
  }

  _bindEvents() {
    events.on('toast', (msg) => this.showToast(msg));
    events.on('hit_marker', ({ headshot }) => this.triggerHitMarker(headshot));
    events.on('player_damaged', () => this.flashDamageVignette());
    events.on('kill_feed', (info) => this.pushKillFeed(info));
    events.on('boss_engaged', (boss) => this.renderBossHud(boss));
    events.on('boss_hud_update', (boss) => this.renderBossHud(boss));
  }

  showToast(text) {
    this.elToast.textContent = text;
    this.elToast.style.opacity = '1';
    this.toastTimer = 2.4;
  }

  triggerHitMarker(headshot = false) {
    this.elHitMarker.classList.toggle('headshot', headshot);
    this.elHitMarker.style.opacity = '1';
    this.elHitMarker.style.transform = `translate(-50%, -50%) rotate(45deg) scale(${headshot ? 1.25 : 0.95})`;
    this.hitMarkerTimer = 0.14;
  }

  flashDamageVignette() {
    this.elVignette.style.boxShadow = 'inset 0 0 120px rgba(239, 68, 68, 0.72)';
    setTimeout(() => {
      this.elVignette.style.boxShadow = 'inset 0 0 110px rgba(239, 68, 68, 0)';
    }, 180);
  }

  pushKillFeed({ weapon, victim, headshot }) {
    const item = document.createElement('div');
    item.className = `kill-item${headshot ? ' hs' : ''}`;
    item.textContent = `[${weapon}] ${headshot ? '🎯 HEADSHOT ' : '⚡ '} ${victim}`;
    this.elKillFeed.appendChild(item);
    while (this.elKillFeed.children.length > 5) {
      this.elKillFeed.removeChild(this.elKillFeed.firstChild);
    }
    setTimeout(() => {
      if (item.parentNode) item.parentNode.removeChild(item);
    }, 3200);
  }

  /**
   * 渲染关底多部件 Boss 的独立血条列表
   * @param {import('../entities/boss.js').BossController} boss
   */
  renderBossHud(boss) {
    if (!boss || !boss.engaged || boss.defeated) {
      this.elBossHud.style.display = 'none';
      return;
    }
    this.elBossHud.style.display = 'block';
    this.elBossName.textContent = boss.bossData.name;
    this.elBossParts.innerHTML = '';

    for (const p of boss.parts) {
      const pct = Math.max(0, Math.round((p.hp / p.maxHp) * 100));
      const row = document.createElement('div');
      row.className = 'boss-part-row';
      row.innerHTML = `
        <span class="boss-part-name">${p.isCore ? '★ ' : ''}${p.name}</span>
        <div class="boss-part-bar-bg">
          <div class="boss-part-bar-fill" style="width:${pct}%"></div>
        </div>
        <span style="width:42px;text-align:right">${pct}%</span>
      `;
      this.elBossParts.appendChild(row);
    }
  }

  /**
   * 每帧同步玩家血量、护盾、弹药、进度与 CSGO 动态十字准星间距
   * @param {number} dt
   * @param {import('../entities/player.js').Player} player
   * @param {object} stageData
   */
  update(dt, player, stageData) {
    if (this.toastTimer > 0) {
      this.toastTimer -= dt;
      if (this.toastTimer <= 0) this.elToast.style.opacity = '0';
    }
    if (this.hitMarkerTimer > 0) {
      this.hitMarkerTimer -= dt;
      if (this.hitMarkerTimer <= 0) {
        this.elHitMarker.style.opacity = '0';
        this.elHitMarker.style.transform = 'translate(-50%, -50%) rotate(45deg) scale(0.7)';
      }
    }

    this.elScore.textContent = String(GAME_STATE.score);
    this.elCheatFlag.style.display = GAME_STATE.cheatMode ? 'inline' : 'none';
    this.btnCheat.textContent = `⚡ F1 作弊模式: ${GAME_STATE.cheatMode ? '开启 (GOD)' : '关闭'}`;
    this.btnMute.textContent = `🔊 音效与配乐: ${GAME_STATE.muted ? '静音' : '开启'}`;

    if (stageData) {
      this.elStageName.textContent = stageData.name;
      const pct = Math.min(100, Math.max(0, Math.round((Math.abs(player.pos.z) / Math.abs(stageData.bossTriggerZ)) * 100)));
      this.elProgress.textContent = `${pct}%`;
    }

    this.elHp.textContent = GAME_STATE.cheatMode ? 'GOD' : String(Math.max(0, Math.ceil(player.hp)));
    this.elShield.textContent = player.shieldTimer > 0 ? `${player.shieldTimer.toFixed(1)}s` : '0s';
    this.elLives.textContent = String(player.lives);

    const w = player.getCurrentWeapon();
    this.elWeaponName.textContent = w.name;
    this.elAmmo.textContent = (w.infiniteAmmo || GAME_STATE.cheatMode)
      ? '∞'
      : String(player.ammo[w.id] || 0);

    // 武器槽高亮
    WEAPON_ORDER.forEach((id, idx) => {
      const pill = this.slotPills[idx];
      if (!pill) return;
      const isUnlocked = GAME_STATE.cheatMode || player.unlocked.has(id);
      pill.classList.toggle('unlocked', isUnlocked);
      pill.classList.toggle('active', player.currentWeaponId === id);
    });

    // 动态十字准星扩散（根据玩家移动与开火后坐力实时张开）
    const gap = Math.round(player.dynamicSpread * 240);
    this.chTop.style.transform = `translateY(${-gap}px)`;
    this.chBottom.style.transform = `translateY(${gap}px)`;
    this.chLeft.style.transform = `translateX(${-gap}px)`;
    this.chRight.style.transform = `translateX(${gap}px)`;
  }

  /**
   * 显示菜单或结算遮罩
   */
  showMenu(heading, subtitle, btnText) {
    this.elMenuHeading.textContent = heading;
    this.elMenuSub.textContent = subtitle;
    this.btnStart.textContent = btnText;
    this.elOverlay.style.display = 'flex';
  }

  hideMenu() {
    this.elOverlay.style.display = 'none';
  }
}

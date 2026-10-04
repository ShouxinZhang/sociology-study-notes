/**
 * 装备系统：军械库（已获得的全部武器）+ 常备 3 槽（数字键 1-3 / Q E 切换）+ 各武器弹药。
 * 武器目录顺序（assets/data/weapons.json）即装备栏中军械库的排列顺序；第一件为默认徒手武器。
 * 带弹药的武器：ranged（枪械）与 strike（呼叫支援）；近战武器不耗弹药。
 */
export const SLOT_COUNT = 3;

const usesAmmo = (w) => w.type === 'ranged' || w.type === 'strike';

export class Inventory {
  constructor(catalog) {
    this.catalog = catalog;
    this.reset();
  }

  reset() {
    this.owned = [this.catalog[0].id];
    this.loadout = [this.catalog[0].id, ...Array(SLOT_COUNT - 1).fill(null)];
    this.slot = 0; // 当前使用的槽位下标，始终指向非空槽
    this.ammo = {};
  }

  byId(id) {
    return this.catalog.find((w) => w.id === id);
  }

  get currentId() {
    return this.loadout[this.slot];
  }

  get current() {
    return this.byId(this.currentId);
  }

  owns(id) {
    return this.owned.includes(id);
  }

  /**
   * 获得武器：加入军械库并追加弹药；已在槽位中则切过去，
   * 否则放入第一个空槽，没有空槽时替换当前槽（被换下的武器仍在军械库）。
   */
  add(id) {
    const weapon = this.byId(id);
    if (!this.owns(id)) this.owned.push(id);
    if (usesAmmo(weapon)) this.ammo[id] = (this.ammo[id] ?? 0) + weapon.pickupAmmo;
    const inSlot = this.loadout.indexOf(id);
    const empty = this.loadout.indexOf(null);
    this.slot = inSlot >= 0 ? inSlot : empty >= 0 ? empty : this.slot;
    this.loadout[this.slot] = id;
    return weapon;
  }

  /** 把军械库中的武器装进指定槽位；该武器已在别的槽位时两槽互换，保证不重复 */
  equip(id, slot) {
    if (!this.owns(id)) return false;
    const from = this.loadout.indexOf(id);
    if (from >= 0) this.loadout[from] = this.loadout[slot];
    this.loadout[slot] = id;
    if (!this.currentId) this.slot = slot; // 当前槽被换空时跟随到新槽
    return true;
  }

  /** 数字键 1-3 */
  selectSlot(n) {
    if (this.loadout[n - 1]) this.slot = n - 1;
  }

  /** Q / E：在非空槽位间轮换 */
  cycle(step) {
    for (let k = 1; k <= SLOT_COUNT; k++) {
      const i = (this.slot + step * k + SLOT_COUNT * k) % SLOT_COUNT;
      if (this.loadout[i]) return void (this.slot = i);
    }
  }

  /** 军械库中带弹药的武器（枪械 + 呼叫支援） */
  get guns() {
    return this.catalog.filter((w) => usesAmmo(w) && this.owns(w.id));
  }

  /** 是否至少有一件带弹药的武器（决定敌人是否掉弹药箱） */
  get hasGun() {
    return this.guns.length > 0;
  }

  /** 弹药箱：为军械库中所有带弹药的武器补给；一件都没有时返回 false（弹药箱保留在地上） */
  refill() {
    const guns = this.guns;
    guns.forEach((w) => (this.ammo[w.id] = (this.ammo[w.id] ?? 0) + w.ammoPerBox));
    return guns.length > 0;
  }

  /** 作弊：全部武器进入军械库（已有弹药保留），槽位仍由玩家在装备栏中选择 */
  unlockAll() {
    for (const w of this.catalog) {
      if (!this.owns(w.id)) this.owned.push(w.id);
      if (usesAmmo(w)) this.ammo[w.id] ??= 0;
    }
  }

  ammoOf(weapon) {
    return usesAmmo(weapon) ? (this.ammo[weapon.id] ?? 0) : Infinity;
  }

  /** 消耗一次攻击所需弹药；近战或 free（作弊无限弹药）时永远成功 */
  consume(free = false) {
    const weapon = this.current;
    if (free || !usesAmmo(weapon)) return true;
    if (!this.ammo[weapon.id]) return false;
    this.ammo[weapon.id] -= 1;
    return true;
  }

  snapshot() {
    return structuredClone({ owned: this.owned, loadout: this.loadout, slot: this.slot, ammo: this.ammo });
  }

  restore(state) {
    Object.assign(this, structuredClone(state));
  }
}

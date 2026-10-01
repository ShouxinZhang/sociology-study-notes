/**
 * 装备系统：已拥有武器、当前武器与各枪械弹药。
 * 武器目录顺序（assets/data/weapons.json）即数字键 1-6 的槽位顺序；第一件为默认徒手武器。
 */
export class Inventory {
  constructor(catalog) {
    this.catalog = catalog;
    this.reset();
  }

  reset() {
    this.owned = [this.catalog[0].id];
    this.currentId = this.catalog[0].id;
    this.ammo = {};
  }

  byId(id) {
    return this.catalog.find((w) => w.id === id);
  }

  get current() {
    return this.byId(this.currentId);
  }

  owns(id) {
    return this.owned.includes(id);
  }

  /** 获得武器：新武器加入背包；枪械追加弹药；并自动切换为该武器 */
  add(id) {
    const weapon = this.byId(id);
    if (!this.owns(id)) this.owned.push(id);
    if (weapon.type === 'ranged') this.ammo[id] = (this.ammo[id] ?? 0) + weapon.pickupAmmo;
    this.currentId = id;
    return weapon;
  }

  selectSlot(slot) {
    const weapon = this.catalog[slot - 1];
    if (weapon && this.owns(weapon.id)) this.currentId = weapon.id;
  }

  cycle(step) {
    const list = this.catalog.filter((w) => this.owns(w.id));
    const i = list.findIndex((w) => w.id === this.currentId);
    this.currentId = list[(i + step + list.length) % list.length].id;
  }

  /** 弹药箱：为所有已拥有枪械补弹；没有枪械时返回 false（弹药箱保留在地上） */
  refill() {
    const guns = this.catalog.filter((w) => w.type === 'ranged' && this.owns(w.id));
    guns.forEach((w) => (this.ammo[w.id] += w.ammoPerBox));
    return guns.length > 0;
  }

  /** 作弊：解锁全部武器（已有弹药保留） */
  unlockAll() {
    for (const w of this.catalog) {
      if (!this.owns(w.id)) this.owned.push(w.id);
      if (w.type === 'ranged') this.ammo[w.id] ??= 0;
    }
  }

  ammoOf(weapon) {
    return weapon.type === 'ranged' ? (this.ammo[weapon.id] ?? 0) : Infinity;
  }

  /** 消耗一次攻击所需弹药；近战或 free（作弊无限弹药）时永远成功 */
  consume(free = false) {
    const weapon = this.current;
    if (free || weapon.type !== 'ranged') return true;
    if (!this.ammo[weapon.id]) return false;
    this.ammo[weapon.id] -= 1;
    return true;
  }

  snapshot() {
    return structuredClone({ owned: this.owned, currentId: this.currentId, ammo: this.ammo });
  }

  restore(state) {
    Object.assign(this, structuredClone(state));
  }
}

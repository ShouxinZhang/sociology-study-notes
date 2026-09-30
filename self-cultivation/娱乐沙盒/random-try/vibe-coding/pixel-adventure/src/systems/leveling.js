/**
 * 等级系统：经验累积、升级与属性成长；曲线与成长值来自 assets/data/progression.json。
 */

/** 指定等级对应的最大生命与攻击倍率 */
export function statsFor(level, prog) {
  return {
    maxHp: prog.baseHp + prog.hpPerLevel * (level - 1),
    attack: prog.baseAttack + prog.attackPerLevel * (level - 1),
  };
}

/** 升到下一级所需经验；已满级返回 Infinity */
export function expToNext(level, prog) {
  return prog.expTable[level - 1] ?? Infinity;
}

/** 增加经验并处理连升；升级时回满血。返回是否升级 */
export function gainExp(player, amount, prog) {
  player.exp += amount;
  let leveled = false;
  while (player.exp >= expToNext(player.level, prog)) {
    player.exp -= expToNext(player.level, prog);
    player.level += 1;
    leveled = true;
  }
  if (leveled) {
    Object.assign(player, statsFor(player.level, prog));
    player.hp = player.maxHp;
  }
  return leveled;
}

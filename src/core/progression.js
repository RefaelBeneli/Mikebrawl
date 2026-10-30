export function xpToNext(level) {
  return Math.round(40 * level ** 1.5);
}

export function addXp({ level, xp }, amount) {
  let nextLevel = level;
  let remaining = xp + amount;
  while (remaining >= xpToNext(nextLevel)) {
    remaining -= xpToNext(nextLevel);
    nextLevel += 1;
  }
  return { level: nextLevel, xp: remaining, gained: nextLevel - level };
}

export function rollDrops(drops = [], rng = Math.random) {
  return drops.filter((drop) => rng() < drop.chance).map((drop) => drop.item);
}

export function sweatFromXp(totalXp) {
  return Math.floor(totalXp / 10);
}

export function upgradeCost(upgrade, rank) {
  return Math.round(upgrade.baseCost * upgrade.costGrowth ** rank);
}

export function createRng(seed = Date.now()) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

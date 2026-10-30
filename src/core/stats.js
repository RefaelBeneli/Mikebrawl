export const STAT_KEYS = ["hp", "power", "defense", "atkSpeed", "speed", "crit"];

const MAX_CRIT = 0.75;
const MIN_ATK_SPEED = 0.3;

export function emptyStats() {
  return Object.fromEntries(STAT_KEYS.map((key) => [key, 0]));
}

export function addStats(target, bonus = {}) {
  STAT_KEYS.forEach((key) => {
    if (bonus[key]) target[key] += bonus[key];
  });
  return target;
}

export function scaleStats(stats, factor, keys = ["hp", "power", "defense"]) {
  const scaled = { ...stats };
  keys.forEach((key) => {
    scaled[key] = Math.round(stats[key] * factor);
  });
  return scaled;
}

export function computeStats({ base, growth = {}, level = 1, gear = [], gym = {} }) {
  const total = addStats(emptyStats(), base);
  STAT_KEYS.forEach((key) => {
    total[key] += (growth[key] ?? 0) * (level - 1);
  });
  gear.forEach((item) => addStats(total, item.stats));
  addStats(total, gym);
  total.crit = Math.min(total.crit, MAX_CRIT);
  total.atkSpeed = Math.max(total.atkSpeed, MIN_ATK_SPEED);
  return total;
}

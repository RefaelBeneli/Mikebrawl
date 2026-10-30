import { computeStats, emptyStats } from "../core/stats.js";
import { sweatFromXp, upgradeCost } from "../core/progression.js";
import { createInventory, equippedItems } from "../core/inventory.js";
import { heroes, items } from "../../data/registry.js";
import gym from "../../data/gym.js";

export const LEVEL_CLEAR_SWEAT = 10;
export const WIN_SWEAT = 40;

export function emptyMeta() {
  return { sweat: 0, gym: {}, runs: 0, wins: 0 };
}

export function gymBonus(ranks = {}) {
  const bonus = emptyStats();
  gym.forEach((upgrade) => {
    bonus[upgrade.stat] += upgrade.amount * (ranks[upgrade.id] ?? 0);
  });
  return bonus;
}

export function createRun(meta = emptyMeta()) {
  return {
    levelIndex: 0,
    progress: { level: 1, xp: 0 },
    totalXp: 0,
    kills: 0,
    heroHp: null,
    inventory: createInventory(),
    gym: gymBonus(meta.gym),
  };
}

export function heroStatsFor(run) {
  const mike = heroes.get("mike");
  return computeStats({
    base: mike.stats,
    growth: mike.growth,
    level: run.progress.level,
    gear: equippedItems(run.inventory, items),
    gym: run.gym,
  });
}

// levelsCleared counts finished levels; a win means every level was cleared.
export function runSweat(run, { levelsCleared, won }) {
  return sweatFromXp(run.totalXp) + levelsCleared * LEVEL_CLEAR_SWEAT + (won ? WIN_SWEAT : 0);
}

export function endRun(meta, run, { levelsCleared, won }) {
  const sweat = runSweat(run, { levelsCleared, won });
  return {
    sweat,
    meta: { ...meta, sweat: meta.sweat + sweat, runs: meta.runs + 1, wins: meta.wins + (won ? 1 : 0) },
  };
}

export function nextUpgradeCost(meta, upgrade) {
  const rank = meta.gym[upgrade.id] ?? 0;
  return rank >= upgrade.maxRank ? null : upgradeCost(upgrade, rank);
}

export function buyUpgrade(meta, upgrade) {
  const cost = nextUpgradeCost(meta, upgrade);
  if (cost === null || meta.sweat < cost) return { meta, bought: false };
  const rank = (meta.gym[upgrade.id] ?? 0) + 1;
  return { meta: { ...meta, sweat: meta.sweat - cost, gym: { ...meta.gym, [upgrade.id]: rank } }, bought: true };
}

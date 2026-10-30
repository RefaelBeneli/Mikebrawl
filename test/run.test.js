import { test } from "node:test";
import assert from "node:assert/strict";
import { createRun, emptyMeta, heroStatsFor, endRun, buyUpgrade, nextUpgradeCost, LEVEL_CLEAR_SWEAT, WIN_SWEAT } from "../src/game/runState.js";
import { createSave } from "../src/game/save.js";
import { heroes } from "../data/registry.js";
import gym from "../data/gym.js";

const cardio = gym.find((u) => u.id === "cardio");
const memoryStorage = () => {
  const data = new Map();
  return { getItem: (k) => data.get(k) ?? null, setItem: (k, v) => data.set(k, v), removeItem: (k) => data.delete(k) };
};

test("a new run starts at level 1 with no gear, whatever the last run had", () => {
  const run = createRun({ ...emptyMeta(), gym: {} });
  assert.deepEqual(run.progress, { level: 1, xp: 0 });
  assert.deepEqual(run.inventory, { equipped: {}, bag: [] });
  assert.equal(heroStatsFor(run).hp, heroes.get("mike").stats.hp);
});

test("gym ranks carry into new runs as permanent stat bonuses", () => {
  const run = createRun({ ...emptyMeta(), gym: { cardio: 2 } });
  assert.equal(heroStatsFor(run).hp, heroes.get("mike").stats.hp + 2 * cardio.amount);
});

test("ending a run pays sweat for XP, cleared levels and a win", () => {
  const run = { ...createRun(), totalXp: 205 };
  const lost = endRun(emptyMeta(), run, { levelsCleared: 1, won: false });
  assert.equal(lost.sweat, 20 + LEVEL_CLEAR_SWEAT);
  assert.deepEqual([lost.meta.runs, lost.meta.wins], [1, 0]);
  const won = endRun(lost.meta, run, { levelsCleared: 3, won: true });
  assert.equal(won.sweat, 20 + 3 * LEVEL_CLEAR_SWEAT + WIN_SWEAT);
  assert.equal(won.meta.sweat, lost.sweat + won.sweat);
  assert.equal(won.meta.wins, 1);
});

test("buying an upgrade spends sweat, raises the rank and makes the next rank pricier", () => {
  const meta = { ...emptyMeta(), sweat: 100 };
  const first = nextUpgradeCost(meta, cardio);
  const { meta: after, bought } = buyUpgrade(meta, cardio);
  assert.equal(bought, true);
  assert.equal(after.sweat, 100 - first);
  assert.equal(after.gym.cardio, 1);
  assert.ok(nextUpgradeCost(after, cardio) > first);
});

test("upgrades can't be bought without enough sweat or past max rank", () => {
  assert.equal(buyUpgrade({ ...emptyMeta(), sweat: 1 }, cardio).bought, false);
  const maxed = { ...emptyMeta(), sweat: 9999, gym: { cardio: cardio.maxRank } };
  assert.equal(nextUpgradeCost(maxed, cardio), null);
  assert.equal(buyUpgrade(maxed, cardio).bought, false);
});

test("save keeps meta and the current run, and survives broken storage", () => {
  const save = createSave(memoryStorage());
  assert.deepEqual(save.loadMeta(), emptyMeta());
  save.saveMeta({ ...emptyMeta(), sweat: 42 });
  assert.equal(save.loadMeta().sweat, 42);
  const run = { ...createRun(), levelIndex: 2 };
  save.saveRun(run);
  assert.equal(save.loadRun().levelIndex, 2);
  save.clearRun();
  assert.equal(save.loadRun(), null);

  const broken = createSave({ getItem: () => "{nope", setItem: () => { throw new Error("full"); }, removeItem: () => {} });
  assert.deepEqual(broken.loadMeta(), emptyMeta());
  assert.doesNotThrow(() => broken.saveMeta(emptyMeta()));
});

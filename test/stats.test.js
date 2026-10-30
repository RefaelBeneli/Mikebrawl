import { test } from "node:test";
import assert from "node:assert/strict";
import { computeStats, scaleStats, STAT_KEYS } from "../src/core/stats.js";

const base = { hp: 100, power: 10, defense: 3, atkSpeed: 1, speed: 80, crit: 0.05 };

test("level 1 with nothing equipped returns base stats", () => {
  assert.deepEqual(computeStats({ base }), base);
});

test("adds growth per level above 1, gear and gym bonuses", () => {
  const stats = computeStats({
    base,
    growth: { hp: 12, power: 2 },
    level: 3,
    gear: [{ stats: { power: 4, crit: 0.05 } }, { stats: { speed: 10 } }],
    gym: { hp: 8 },
  });
  assert.equal(stats.hp, 100 + 24 + 8);
  assert.equal(stats.power, 10 + 4 + 4);
  assert.equal(stats.speed, 90);
  assert.ok(Math.abs(stats.crit - 0.1) < 1e-9);
});

test("caps crit and floors attack speed", () => {
  const stats = computeStats({ base: { ...base, crit: 2, atkSpeed: 0 } });
  assert.equal(stats.crit, 0.75);
  assert.equal(stats.atkSpeed, 0.3);
});

test("every stat key is present on the result", () => {
  const stats = computeStats({ base: {} });
  assert.deepEqual(Object.keys(stats), STAT_KEYS);
});

test("scaleStats scales only combat stats by default", () => {
  const scaled = scaleStats(base, 1.5);
  assert.equal(scaled.hp, 150);
  assert.equal(scaled.power, 15);
  assert.equal(scaled.speed, 80);
});

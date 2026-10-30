import { test } from "node:test";
import assert from "node:assert/strict";
import { xpToNext, addXp, rollDrops, sweatFromXp, upgradeCost, createRng } from "../src/core/progression.js";
import { Animator } from "../src/core/animation.js";

test("xp curve grows with level", () => {
  assert.equal(xpToNext(1), 40);
  assert.equal(xpToNext(2), 113);
  assert.ok(xpToNext(5) > xpToNext(4));
});

test("addXp levels up, possibly several times, and keeps the remainder", () => {
  assert.deepEqual(addXp({ level: 1, xp: 0 }, 39), { level: 1, xp: 39, gained: 0 });
  assert.deepEqual(addXp({ level: 1, xp: 30 }, 15), { level: 2, xp: 5, gained: 1 });
  assert.deepEqual(addXp({ level: 1, xp: 0 }, 40 + 113 + 1), { level: 3, xp: 1, gained: 2 });
});

test("rollDrops returns items whose chance beats the roll", () => {
  const table = [
    { item: "gloves", chance: 0.1 },
    { item: "boots", chance: 1 },
  ];
  assert.deepEqual(rollDrops(table, () => 0.5), ["boots"]);
  assert.deepEqual(rollDrops(table, () => 0.05), ["gloves", "boots"]);
  assert.deepEqual(rollDrops(undefined, () => 0), []);
});

test("sweat points and upgrade costs", () => {
  assert.equal(sweatFromXp(259), 25);
  const upgrade = { baseCost: 20, costGrowth: 1.5 };
  assert.equal(upgradeCost(upgrade, 0), 20);
  assert.equal(upgradeCost(upgrade, 2), 45);
});

test("seeded rng is deterministic and in [0, 1)", () => {
  const a = createRng(42);
  const b = createRng(42);
  const values = Array.from({ length: 100 }, () => a());
  assert.deepEqual(values, Array.from({ length: 100 }, () => b()));
  assert.ok(values.every((v) => v >= 0 && v < 1));
});

test("animator loops, finishes one-shots and maps cells", () => {
  const animator = new Animator({
    idle: { row: 0, frames: 4, fps: 10, loop: true },
    punch2: { row: 2, start: 3, frames: 3, fps: 10 },
  });
  animator.update(0.45);
  assert.equal(animator.frame, 0);
  animator.play("punch2");
  animator.update(0.15);
  assert.deepEqual(animator.cell, { col: 4, row: 2 });
  assert.equal(animator.done, false);
  animator.update(0.2);
  assert.equal(animator.done, true);
  assert.equal(animator.frame, 2);
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { createInventory, pickUp, equipFromBag, unequip, equippedItems, statDelta } from "../src/core/inventory.js";
import { computeStats } from "../src/core/stats.js";
import { items, heroes } from "../data/registry.js";

const gloves = items.get("fight_gloves");
const otherGloves = { id: "gold_gloves", slot: "hands", stats: { power: 7 } };

test("first item for a slot is auto-equipped, second goes to the bag", () => {
  let { inventory, result } = pickUp(createInventory(), gloves);
  assert.equal(result, "equipped");
  assert.equal(inventory.equipped.hands, "fight_gloves");
  ({ inventory, result } = pickUp(inventory, otherGloves));
  assert.equal(result, "bagged");
  assert.deepEqual(inventory.bag, ["gold_gloves"]);
});

test("picking up an owned item is a duplicate and changes nothing", () => {
  const first = pickUp(createInventory(), gloves).inventory;
  const { inventory, result } = pickUp(first, gloves);
  assert.equal(result, "duplicate");
  assert.equal(inventory, first);
});

test("equipping from the bag swaps the old item into the bag", () => {
  let inventory = pickUp(createInventory(), gloves).inventory;
  inventory = pickUp(inventory, otherGloves).inventory;
  inventory = equipFromBag(inventory, otherGloves);
  assert.equal(inventory.equipped.hands, "gold_gloves");
  assert.deepEqual(inventory.bag, ["fight_gloves"]);
});

test("unequip moves the item to the bag", () => {
  const inventory = unequip(pickUp(createInventory(), gloves).inventory, "hands");
  assert.deepEqual(inventory, { equipped: {}, bag: ["fight_gloves"] });
});

test("equipped gear feeds into Mike's stats", () => {
  const inventory = pickUp(createInventory(), gloves).inventory;
  const mike = heroes.get("mike");
  const stats = computeStats({ base: mike.stats, gear: equippedItems(inventory, items) });
  assert.equal(stats.power, mike.stats.power + gloves.stats.power);
});

test("statDelta shows gains and losses against the current item", () => {
  assert.deepEqual(statDelta(gloves, otherGloves), { power: 3, crit: -0.04 });
  assert.deepEqual(statDelta(undefined, gloves), { power: 4, crit: 0.04 });
});

test("every item has a valid slot Mike can draw", () => {
  const slots = heroes.get("mike").gearDrawOrder;
  items.forEach((item) => assert.ok(slots.includes(item.slot), `${item.id}: bad slot ${item.slot}`));
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { calcDamage, canHit, attackBox, DEPTH_BAND } from "../src/core/combat.js";

const never = () => 0.99;
const always = () => 0;

test("damage = power x strength - defense (design example: 12)", () => {
  const result = calcDamage({ attacker: { power: 10, crit: 0 }, defender: { defense: 3 }, strength: 1.5, rng: never });
  assert.deepEqual(result, { damage: 12, crit: false });
});

test("crit multiplies before defense", () => {
  const result = calcDamage({ attacker: { power: 10, crit: 0.5 }, defender: { defense: 3 }, strength: 1.5, rng: always });
  assert.deepEqual(result, { damage: 20, crit: true });
});

test("damage never drops below 1", () => {
  const result = calcDamage({ attacker: { power: 1, crit: 0 }, defender: { defense: 50 }, strength: 1, rng: never });
  assert.equal(result.damage, 1);
});

const fighter = (overrides) => ({ x: 0, y: 200, z: 0, facing: 1, def: { body: { w: 28, h: 70 } }, ...overrides });
const jab = { x: 6, y: 50, w: 28, h: 14 };

test("attack box mirrors when facing left", () => {
  assert.equal(attackBox(fighter({ facing: 1 }), jab).x, 6);
  assert.equal(attackBox(fighter({ facing: -1 }), jab).x, -34);
});

test("hits a target in front at the same depth", () => {
  assert.ok(canHit(fighter(), fighter({ x: 30 }), jab));
});

test("misses a target behind", () => {
  assert.equal(canHit(fighter(), fighter({ x: -40 }), jab), false);
});

test("misses when depth differs by more than the band", () => {
  assert.equal(canHit(fighter(), fighter({ x: 30, y: 200 + DEPTH_BAND + 1 }), jab), false);
  assert.ok(canHit(fighter(), fighter({ x: 30, y: 200 + DEPTH_BAND }), jab));
});

test("misses a jumping target above the hitbox", () => {
  assert.equal(canHit(fighter(), fighter({ x: 30, z: 70 }), jab), false);
});

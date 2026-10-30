import { test } from "node:test";
import assert from "node:assert/strict";
import { Fighter, DOWN_TIME, GETUP_INVULN } from "../src/core/fighter.js";
import { createBrain } from "../src/core/ai.js";
import { moves, heroes, enemies } from "../data/registry.js";

const STEP = 1 / 60;

function createWorld() {
  const attacks = [];
  const tokens = new Set();
  return {
    attacks,
    hero: null,
    resolveAttack: (fighter, move) => attacks.push({ fighter, move, frame: fighter.animator.frame }),
    requestToken: (f) => (tokens.add(f), true),
    releaseToken: (f) => tokens.delete(f),
  };
}

const mike = () =>
  new Fighter({ def: heroes.get("mike"), team: "hero", x: 100, y: 200, stats: { ...heroes.get("mike").stats }, moves });

function run(fighter, world, seconds, intent = {}) {
  const frames = Math.round(seconds / STEP);
  for (let i = 0; i < frames; i += 1) {
    fighter.intent = { x: 0, y: 0, attack: null, jump: false, ...(i === 0 ? intent : {}) };
    fighter.update(STEP, world);
  }
}

test("punch starts the combo and hits only on the active frame", () => {
  const world = createWorld();
  const hero = mike();
  run(hero, world, 0.3, { attack: "punch" });
  assert.ok(world.attacks.length > 0);
  assert.ok(world.attacks.every((a) => a.move.id === "punch1" && a.frame === 1));
  assert.equal(hero.state, "idle");
});

test("pressing a direction and punch on the same frame turns before punching", () => {
  const world = createWorld();
  const hero = mike();
  run(hero, world, 0.2, { x: -1, attack: "punch" });
  assert.equal(hero.facing, -1);
  assert.ok(world.attacks.length > 0);
});

test("pressing punch again during the punch chains to punch2", () => {
  const world = createWorld();
  const hero = mike();
  run(hero, world, 0.1, { attack: "punch" });
  run(hero, world, 0.2, { attack: "punch" });
  assert.ok(world.attacks.some((a) => a.move.id === "punch2"));
});

test("jump leaves the ground and lands back in idle", () => {
  const world = createWorld();
  const hero = mike();
  run(hero, world, 0.2, { jump: true });
  assert.equal(hero.state, "jump");
  assert.ok(hero.z > 0);
  run(hero, world, 1);
  assert.equal(hero.z, 0);
  assert.equal(hero.state, "idle");
});

test("attacking in the air uses the air moveset", () => {
  const world = createWorld();
  const hero = mike();
  run(hero, world, 0.15, { jump: true });
  run(hero, world, 0.2, { attack: "kick" });
  assert.equal(world.attacks[0].move.id, "jumpKick");
});

test("lethal hit knocks down, then the fighter dies", () => {
  const world = createWorld();
  const hero = mike();
  hero.takeHit({ damage: 999, fromX: 0 });
  assert.equal(hero.state, "down");
  run(hero, world, DOWN_TIME + 0.5);
  assert.equal(hero.state, "dead");
  assert.equal(hero.alive, false);
});

test("knockdown then get up grants invulnerability", () => {
  const world = createWorld();
  const hero = mike();
  hero.takeHit({ damage: 5, knockdown: true, fromX: 0 });
  assert.equal(hero.takeHit({ damage: 5, fromX: 0 }), false, "can't be hit while down");
  run(hero, world, DOWN_TIME + 0.6);
  assert.equal(hero.state, "idle");
  assert.ok(hero.invuln > 0 && hero.invuln <= GETUP_INVULN);
  assert.equal(hero.takeHit({ damage: 5, fromX: 0 }), false);
});

test("poise absorbs hits before flinching", () => {
  const def = { ...enemies.get("thug"), poise: 3 };
  const boss = new Fighter({ def, team: "enemy", x: 0, y: 200, stats: { ...def.stats, hp: 500 }, moves });
  boss.takeHit({ damage: 1, fromX: -10 });
  boss.takeHit({ damage: 1, fromX: -10 });
  assert.equal(boss.state, "idle");
  boss.takeHit({ damage: 1, fromX: -10 });
  assert.equal(boss.state, "hurt");
});

test("enemy AI winds up (telegraph) before it attacks", () => {
  const world = createWorld();
  const hero = mike();
  world.hero = hero;
  const def = enemies.get("thug");
  const thug = new Fighter({ def, team: "enemy", x: hero.x + def.ai.range, y: hero.y, stats: { ...def.stats }, moves });
  const think = createBrain(def.ai);
  let sawTelegraph = false;
  for (let i = 0; i < 300 && !world.attacks.length; i += 1) {
    think(thug, world, STEP);
    if (thug.telegraph > 0) sawTelegraph = true;
    thug.update(STEP, world);
  }
  assert.ok(sawTelegraph);
  assert.equal(world.attacks[0].move.id, "thug_haymaker");
});

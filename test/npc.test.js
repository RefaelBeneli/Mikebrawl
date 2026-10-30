import { test } from "node:test";
import assert from "node:assert/strict";
import { Npc } from "../src/core/npc.js";
import { npcs } from "../data/registry.js";

const world = (overrides = {}) => ({
  hero: { x: 0, y: 220, alive: true },
  foes: [],
  camX: 0,
  viewWidth: 480,
  ...overrides,
});

const run = (npc, w, seconds) => {
  const sounds = [];
  for (let t = 0; t < seconds; t += 1 / 60) {
    const sound = npc.update(1 / 60, w);
    if (sound) sounds.push(sound);
  }
  return sounds;
};

test("a cat stays idle until Mike gets close, then hisses and runs away from him", () => {
  const cat = new Npc({ def: npcs.get("cat"), x: 200, y: 220 });
  const w = world();
  assert.deepEqual(run(cat, w, 0.5), []);
  assert.equal(cat.state, "idle");
  w.hero.x = 170;
  assert.deepEqual(run(cat, w, 0.1), ["cat_hiss"]);
  assert.equal(cat.state, "flee");
  assert.equal(cat.fleeDir, 1);
  assert.ok(cat.x > 200);
});

test("the scared woman ignores Mike but flees from criminals", () => {
  const woman = new Npc({ def: npcs.get("scared_woman"), x: 300, y: 170 });
  const w = world({ hero: { x: 290, y: 220, alive: true } });
  run(woman, w, 0.5);
  assert.equal(woman.state, "idle");
  w.foes = [{ x: 420, alive: true }];
  assert.deepEqual(run(woman, w, 0.1), ["woman_scream"]);
  assert.equal(woman.fleeDir, -1);
});

test("dead criminals don't scare anyone", () => {
  const oldMan = new Npc({ def: npcs.get("old_man"), x: 300, y: 170 });
  run(oldMan, world({ foes: [{ x: 310, alive: false }] }), 0.5);
  assert.equal(oldMan.state, "idle");
});

test("fleeing NPCs disappear once off screen", () => {
  const rat = new Npc({ def: npcs.get("rat"), x: 460, y: 240 });
  const w = world({ hero: { x: 440, y: 240, alive: true } });
  run(rat, w, 2);
  assert.equal(rat.gone, true);
});

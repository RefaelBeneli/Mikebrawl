import { test } from "node:test";
import assert from "node:assert/strict";
import * as registry from "../data/registry.js";
import { behaviors } from "../src/core/ai.js";
import { stripPoses } from "../data/anims.js";

const fighters = () => [...registry.heroes.values(), ...registry.enemies.values(), ...(registry.bosses?.values() ?? [])];

function movesetIds(def) {
  const { ground = {}, air = {}, skills = {} } = def.moveset;
  return [...Object.values(ground), ...Object.values(air), ...Object.values(skills)];
}

test("every moveset entry points to a move whose animation exists on that fighter", () => {
  fighters().forEach((def) => {
    movesetIds(def).forEach((moveId) => {
      const move = registry.moves.get(moveId);
      assert.ok(move, `${def.id}: missing move ${moveId}`);
      assert.ok(def.sprite.anims[move.anim], `${def.id}: move ${moveId} uses missing anim ${move.anim}`);
      if (move.next) assert.ok(registry.moves.get(move.next), `${moveId}: missing combo move ${move.next}`);
    });
  });
});

test("every AI type exists", () => {
  fighters()
    .filter((def) => def.ai)
    .forEach((def) => assert.ok(behaviors[def.ai.type], `${def.id}: unknown ai ${def.ai.type}`));
});

test("every drop points to an item", () => {
  fighters().forEach((def) =>
    (def.drops ?? []).forEach((drop) => assert.ok(registry.items.get(drop.item), `${def.id}: missing item ${drop.item}`)),
  );
});

test("every level references existing enemies and bosses", () => {
  registry.levels.forEach((level) => {
    level.waves.forEach((wave) =>
      wave.enemies.forEach((id) => assert.ok(registry.enemies.get(id), `${level.id}: missing enemy ${id}`)),
    );
    if (level.boss) assert.ok(registry.bosses.get(level.boss), `${level.id}: missing boss ${level.boss}`);
    (level.npcs ?? []).forEach((npc) => assert.ok(registry.npcs.get(npc.id), `${level.id}: missing npc ${npc.id}`));
  });
});

test("every animation says which drawn pose to show on each of its frames", () => {
  registry.characters().forEach((def) => {
    Object.entries(def.sprite.anims).forEach(([name, anim]) => {
      assert.ok(anim.art?.file, `${def.id}.${name}: missing art file`);
      assert.equal(anim.art.poses.length, anim.frames, `${def.id}.${name}: one pose per frame`);
      assert.ok(anim.art.poses.every((pose) => Number.isInteger(pose) && pose >= 0), `${def.id}.${name}: bad pose index`);
    });
    assert.ok(def.sprite.anims.idle, `${def.id}: needs an idle animation (it sets the character's size)`);
  });
});

test("Mike's strips are the short list the sprite guide promises", () => {
  assert.deepEqual(stripPoses(registry.heroes.get("mike").sprite.anims), { idle: 2, walk: 4, punch: 6, kick: 3, jump: 3, fall: 5, victory: 1 });
  assert.deepEqual(stripPoses(registry.enemies.get("thug").sprite.anims), { idle: 2, walk: 4, attack: 3, fall: 5 });
  assert.deepEqual(stripPoses(registry.bosses.get("viper").sprite.anims), { idle: 2, walk: 4, attack: 3, fall: 5, special: 4, enrage: 2 });
});

test("ids are unique across content types", () => {
  const ids = [...registry.moves.keys(), ...fighters().map((d) => d.id), ...registry.items.keys()];
  assert.equal(new Set(ids).size, ids.length);
});

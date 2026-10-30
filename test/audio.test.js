import { test } from "node:test";
import assert from "node:assert/strict";
import { noteToFrequency, parsePattern } from "../src/engine/chiptune.js";
import sounds from "../data/sounds.js";
import music from "../data/music.js";
import * as registry from "../data/registry.js";

test("note names convert to frequencies", () => {
  assert.equal(noteToFrequency("A4"), 440);
  assert.ok(Math.abs(noteToFrequency("C4") - 261.63) < 0.01);
  assert.equal(noteToFrequency("Bb3"), noteToFrequency("A#3"));
  assert.throws(() => noteToFrequency("H2"));
});

test("every song pattern parses and tracks line up to whole bars", () => {
  Object.entries(music).forEach(([id, { song }]) => {
    Object.entries(song.tracks).forEach(([name, track]) => {
      const steps = parsePattern(track.pattern);
      assert.equal(steps.length % 16, 0, `${id}.${name} has ${steps.length} steps`);
      if (track.wave === "drums") {
        steps.forEach((token) => assert.match(token, /^([ksh]+|\.|-)$/, `${id}.${name}: bad drum "${token}"`));
      } else {
        steps.filter((t) => t !== "." && t !== "-").forEach((note) => noteToFrequency(note));
      }
    });
  });
});

test("every sound id used by content exists", () => {
  const fighters = [...registry.heroes.values(), ...registry.enemies.values(), ...(registry.bosses?.values() ?? [])];
  const npcs = [...(registry.npcs?.values() ?? [])];
  const used = [
    ...fighters.flatMap((def) => Object.values(def.sounds ?? {})),
    ...npcs.flatMap((def) => Object.values(def.sounds ?? {})),
    ...[...registry.moves.values()].map((move) => move.sound).filter(Boolean),
    "hit_light",
    "hit_heavy",
    "whoosh",
    "body_fall",
    "level_up",
  ];
  used.forEach((id) => assert.ok(sounds[id], `missing sound "${id}"`));
});

test("every music id used by levels exists", () => {
  registry.levels.forEach((level) => {
    assert.ok(music[level.music], `${level.id}: missing music ${level.music}`);
    if (level.bossMusic) assert.ok(music[level.bossMusic], `${level.id}: missing boss music ${level.bossMusic}`);
  });
});

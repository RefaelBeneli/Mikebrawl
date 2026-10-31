import { test } from "node:test";
import assert from "node:assert/strict";
import { noteToFrequency, parsePattern, stepNotes, transpose } from "../src/engine/chiptune.js";
import sounds from "../data/sounds.js";
import music from "../data/music.js";
import * as registry from "../data/registry.js";

const STEPS_PER_BAR = 16;
const MIDDLE_EASTERN_NOTES = ["G#", "Ab", "Db", "C#", "Gb"];

test("note names convert to frequencies", () => {
  assert.equal(noteToFrequency("A4"), 440);
  assert.ok(Math.abs(noteToFrequency("C4") - 261.63) < 0.01);
  assert.equal(noteToFrequency("Bb3"), noteToFrequency("A#3"));
  assert.throws(() => noteToFrequency("H2"));
});

test("transpose moves a note by semitones", () => {
  assert.equal(transpose("D2", 12), "D3");
  assert.equal(transpose("B1", 1), "C2");
  assert.equal(noteToFrequency(transpose("Bb1", 12)), noteToFrequency("Bb2"));
});

test("every song pattern parses into whole 16-step bars", () => {
  Object.entries(music).forEach(([id, { song }]) => {
    Object.entries(song.tracks).forEach(([name, track]) => {
      const steps = parsePattern(track.pattern);
      assert.equal(steps.length % STEPS_PER_BAR, 0, `${id}.${name} has ${steps.length} steps`);
      track.pattern.split("|").forEach((bar, index) => {
        assert.equal(parsePattern(bar).length, STEPS_PER_BAR, `${id}.${name} bar ${index + 1}`);
      });
      if (track.wave === "drums") {
        steps.forEach((token) => assert.match(token, /^([ksho]+|\.|-)$/, `${id}.${name}: bad drum "${token}"`));
      } else {
        steps.filter((t) => t !== "." && t !== "-").flatMap(stepNotes).forEach((note) => noteToFrequency(note));
      }
    });
  });
});

test("songs other than the boss avoid the notes that give a Middle Eastern color", () => {
  const plainSongs = Object.entries(music).filter(([id]) => id !== "boss");
  plainSongs.forEach(([id, { song }]) => {
    Object.values(song.tracks)
      .filter((track) => track.wave !== "drums")
      .flatMap((track) => parsePattern(track.pattern).flatMap(stepNotes))
      .filter((note) => note !== "." && note !== "-")
      .forEach((note) => {
        const name = note.replace(/-?\d$/, "");
        assert.ok(!MIDDLE_EASTERN_NOTES.includes(name), `${id} uses ${note}`);
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

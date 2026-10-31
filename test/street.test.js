import { test } from "node:test";
import assert from "node:assert/strict";
import { streetLayout } from "../src/game/streetLayout.js";

const panel = (name, width) => ({ name, width });
const a = panel("a", 100);
const b = panel("b", 50);
const gym = panel("gym", 120);
const home = panel("home", 80);
const names = (pieces) => pieces.map((p) => `${p.img.name}@${p.x}`);

test("panels repeat in order from the left edge", () => {
  assert.deepEqual(names(streetLayout({ panels: [a, b], length: 1000 }, 0, 320)), ["a@0", "b@100", "a@150", "b@250", "a@300"]);
});

test("far along the level the repeat keeps the same order", () => {
  assert.deepEqual(names(streetLayout({ panels: [a, b], length: 1000 }, 610, 760)), ["a@600", "b@700", "a@750"]);
});

test("the start landmark shows once at the beginning, then the panels repeat after it", () => {
  assert.deepEqual(names(streetLayout({ panels: [a, b], start: gym, length: 1000 }, 0, 300)), ["gym@0", "a@120", "b@220", "a@270"]);
  assert.deepEqual(names(streetLayout({ panels: [a, b], start: gym, length: 1000 }, 400, 500)), ["b@370", "a@420"]);
});

test("the end landmark sits flush with the level end", () => {
  const pieces = streetLayout({ panels: [a, b], end: home, length: 1000 }, 850, 1000);
  assert.deepEqual(names(pieces), ["b@850", "a@900", "home@920"]);
  assert.equal(pieces[0].w, 50);
});

test("the panel right before the end landmark is trimmed to the gap", () => {
  const pieces = streetLayout({ panels: [a, b], end: home, length: 1000 }, 905, 1000);
  assert.deepEqual(
    pieces.map((p) => [p.img.name, p.x, p.w]),
    [
      ["a", 900, 20],
      ["home", 920, 80],
    ],
  );
});

test("landmarks alone still show when no repeating panels exist", () => {
  assert.deepEqual(names(streetLayout({ start: gym, end: home, length: 1000 }, 0, 1000)), ["gym@0", "home@920"]);
});

test("nothing outside the view is returned", () => {
  assert.deepEqual(names(streetLayout({ panels: [a], start: gym, end: home, length: 1000 }, 300, 400)), ["a@220", "a@320"]);
});

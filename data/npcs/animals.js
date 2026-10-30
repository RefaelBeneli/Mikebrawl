import { ANIMAL_ANIMS } from "../anims.js";

// Small animals. "flee.from": "hero" = scatter when Mike walks close.
const animal = (id, name, placeholder, flee, sound) => ({
  id,
  name,
  sprite: { cellW: 32, cellH: 32, height: 18, anims: ANIMAL_ANIMS, placeholder },
  body: { w: 16, h: 10 },
  flee,
  sounds: { flee: sound },
});

export default [
  animal("cat", "Cat", "#151515", { from: "hero", radius: 60, speed: 170 }, "cat_hiss"),
  animal("rat", "Rat", "#707070", { from: "hero", radius: 45, speed: 190 }, "rat_squeak"),
];

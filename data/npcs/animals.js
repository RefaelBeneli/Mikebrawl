// Small animals. "flee.from": "hero" = scatter when Mike walks close.
const ANIMAL_ANIMS = {
  idle: { row: 0, frames: 4, fps: 5, loop: true },
  flee: { row: 1, frames: 6, fps: 16, loop: true },
};

const animal = (id, name, placeholder, flee, sound) => ({
  id,
  name,
  sprite: { sheet: `assets/sprites/npcs/${id}.png`, cellW: 32, cellH: 32, anims: ANIMAL_ANIMS, placeholder },
  body: { w: 16, h: 10 },
  flee,
  sounds: { flee: sound },
});

export default [
  animal("cat", "Cat", "#151515", { from: "hero", radius: 60, speed: 170 }, "cat_hiss"),
  animal("rat", "Rat", "#707070", { from: "hero", radius: 45, speed: 190 }, "rat_squeak"),
];

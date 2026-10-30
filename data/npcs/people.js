import { PERSON_ANIMS } from "../anims.js";

// Background people. "flee.from": "enemies" = run when a criminal gets within radius (along the street).
const person = (id, name, placeholder, flee, sound) => ({
  id,
  name,
  sprite: { cellW: 96, cellH: 96, anims: PERSON_ANIMS, placeholder },
  body: { w: 20, h: 66 },
  flee,
  sounds: { flee: sound },
});

export default [
  person("scared_woman", "Scared Woman", "#c8a878", { from: "enemies", radius: 170, speed: 110 }, "woman_scream"),
  person("old_man", "Old Man", "#7a5a3a", { from: "enemies", radius: 120, speed: 35 }, "old_man_grumble"),
  person("homeless_man", "Homeless Man", "#4a5a3a", { from: "enemies", radius: 100, speed: 60 }, "homeless_mutter"),
];

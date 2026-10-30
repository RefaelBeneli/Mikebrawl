import { HUMANOID_ANIMS } from "../anims.js";

export default {
  id: "thug",
  name: "Thug",
  sprite: {
    sheet: "assets/sprites/enemies/thug.png",
    cellW: 96,
    cellH: 96,
    anims: HUMANOID_ANIMS,
    placeholder: "#8a4b2a",
  },
  body: { w: 32, h: 76 },
  stats: { hp: 60, power: 9, defense: 2, atkSpeed: 0.8, speed: 38, crit: 0.05 },
  ai: { type: "brawler", range: 30, windup: 0.45, cooldown: 1.6 },
  moveset: { ground: { punch: "thug_haymaker" } },
  moves: [
    {
      id: "thug_haymaker",
      anim: "attack",
      strength: 1.2,
      activeFrames: [2],
      hitbox: { x: 6, y: 46, w: 32, h: 20 },
      knockback: 30,
      heavy: true,
    },
  ],
  xp: 15,
  drops: [],
  sounds: { taunt: "thug_taunt", hurt: "thug_hurt", ko: "thug_ko" },
};

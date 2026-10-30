import { HUMANOID_ANIMS } from "../anims.js";

export default {
  id: "thug",
  name: "Thug",
  sprite: {
    cellW: 96,
    cellH: 96,
    anims: HUMANOID_ANIMS,
    placeholder: "#8a4b2a",
  },
  body: { w: 32, h: 76 },
  stats: { hp: 60, power: 11, defense: 2, atkSpeed: 0.8, speed: 40, crit: 0.05 },
  ai: { type: "brawler", range: 30, windup: 0.45, cooldown: 1.2 },
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
  drops: [
    { item: "fight_gloves", chance: 0.12 },
    { item: "lucky_tank", chance: 0.08 },
  ],
  sounds: { taunt: "thug_taunt", hurt: "thug_hurt", ko: "thug_ko" },
};

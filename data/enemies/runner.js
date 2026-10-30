import { HUMANOID_ANIMS } from "../anims.js";

export default {
  id: "runner",
  name: "Runner",
  sprite: {
    sheet: "assets/sprites/enemies/runner.png",
    cellW: 96,
    cellH: 96,
    anims: HUMANOID_ANIMS,
    placeholder: "#3f8f4f",
  },
  body: { w: 24, h: 70 },
  stats: { hp: 35, power: 6, defense: 1, atkSpeed: 1.3, speed: 75, crit: 0.08 },
  ai: { type: "rusher", range: 24, windup: 0.28, cooldown: 1, retreat: 0.7 },
  moveset: { ground: { punch: "runner_jab" } },
  moves: [
    {
      id: "runner_jab",
      anim: "attack",
      strength: 0.9,
      activeFrames: [2],
      hitbox: { x: 6, y: 50, w: 24, h: 12 },
      knockback: 10,
    },
  ],
  xp: 10,
  drops: [
    { item: "street_boots", chance: 0.12 },
    { item: "focus_headband", chance: 0.08 },
  ],
  sounds: { taunt: "runner_taunt", hurt: "runner_hurt", ko: "runner_ko" },
};

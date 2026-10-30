import { MIKE_ANIMS } from "../anims.js";

export default {
  id: "mike",
  name: "Mike",
  sprite: {
    cellW: 96,
    cellH: 96,
    anims: MIKE_ANIMS,
    placeholder: "#d9a066",
  },
  body: { w: 28, h: 74 },
  stats: { hp: 120, power: 10, defense: 3, atkSpeed: 1, speed: 85, crit: 0.08 },
  growth: { hp: 14, power: 2, defense: 1 },
  moveset: {
    ground: { punch: "punch1", kick: "kick" },
    air: { punch: "jumpKick", kick: "jumpKick" },
    skills: {},
  },
  gearDrawOrder: ["body", "feet", "hands", "head"],
  sounds: { jump: "mike_jump", hurt: "mike_hurt", ko: "mike_knockdown", victory: "mike_victory" },
};

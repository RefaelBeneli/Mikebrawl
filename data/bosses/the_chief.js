import { BOSS_ANIMS } from "../anims.js";

export default {
  id: "the_chief",
  name: "The Chief",
  boss: true,
  sprite: {
    sheet: "assets/sprites/bosses/the_chief.png",
    cellW: 128,
    cellH: 128,
    anims: BOSS_ANIMS,
    placeholder: "#8a2a2a",
  },
  body: { w: 46, h: 104 },
  stats: { hp: 760, power: 24, defense: 8, atkSpeed: 0.9, speed: 50, crit: 0.08 },
  poise: 4,
  ai: {
    type: "boss",
    range: 40,
    windup: 0.5,
    cooldown: 1.5,
    special: { button: "skill1", every: 6.5, windup: 1, minRange: 0, maxRange: 80 },
    enrage: { at: 0.5, bonus: { speed: 14, atkSpeed: 0.25, power: 3 }, specialEvery: 4 },
  },
  moveset: { ground: { punch: "chief_punch" }, skills: { skill1: "chief_slam", enrage: "chief_enrage" } },
  moves: [
    {
      id: "chief_punch",
      anim: "attack",
      strength: 1.4,
      activeFrames: [2],
      hitbox: { x: 8, y: 50, w: 40, h: 24 },
      knockback: 50,
      heavy: true,
    },
    {
      // Shockwave on both sides along the ground: jump over it.
      id: "chief_slam",
      anim: "special",
      strength: 1.7,
      activeFrames: [3, 4],
      hitbox: { x: -70, y: 0, w: 140, h: 22 },
      knockback: 70,
      knockdown: true,
      heavy: true,
    },
    { id: "chief_enrage", anim: "enrage", strength: 0, activeFrames: [], hitbox: { x: 0, y: 0, w: 0, h: 0 }, sound: "the_chief_enrage" },
  ],
  xp: 300,
  drops: [{ item: "focus_headband", chance: 1 }],
  sounds: { intro: "the_chief_intro", hurt: "the_chief_hurt", ko: "the_chief_ko" },
};

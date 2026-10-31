export default {
  id: "level3",
  name: "Romema",
  length: 1440,
  music: "level3",
  bossMusic: "boss",
  background: {
    landmarks: { end: "home" },
    palette: {
      sky: ["#000008", "#101830"],
      far: "#161c30",
      buildings: ["#4a4a50", "#55555c", "#3e3e44", "#5c5850"],
      window: "#ffb040",
      sidewalk: "#5a5a5e",
      line: "#e0c040",
      street: "#38383c",
    },
  },
  enemyScale: 1.9,
  waves: [
    { at: 240, enemies: ["thug", "runner", "runner"] },
    { at: 540, enemies: ["thug", "thug", "runner", "runner"] },
    { at: 840, enemies: ["runner", "runner", "thug", "runner", "thug"] },
    { at: 1060, enemies: ["thug", "thug", "thug", "runner"] },
  ],
  boss: "the_chief",
  bossMinions: ["thug", "runner"],
  npcs: [
    { id: "old_man", x: 280, y: 166 },
    { id: "cat", x: 600, y: 176 },
    { id: "scared_woman", x: 880, y: 168 },
    { id: "rat", x: 1150, y: 248 },
  ],
};

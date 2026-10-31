export default {
  id: "level2",
  name: "Upper Carmel",
  length: 1440,
  music: "level2",
  bossMusic: "boss",
  background: {
    palette: {
      sky: ["#05081a", "#1a2a4a"],
      far: "#101830",
      buildings: ["#5a2a24", "#4a2420", "#3a2a2a", "#603028"],
      window: "#ff9050",
      sidewalk: "#3a3a40",
      line: "#5a5a64",
      street: "#1e2026",
    },
  },
  enemyScale: 1.4,
  waves: [
    { at: 240, enemies: ["runner", "runner", "thug"] },
    { at: 540, enemies: ["thug", "thug", "runner"] },
    { at: 840, enemies: ["runner", "runner", "runner", "thug"] },
    { at: 1060, enemies: ["thug", "runner", "thug", "runner"] },
  ],
  boss: "viper",
  bossMinions: ["runner"],
  npcs: [
    { id: "rat", x: 120, y: 250 },
    { id: "homeless_man", x: 300, y: 170 },
    { id: "cat", x: 520, y: 176 },
    { id: "rat", x: 800, y: 240 },
    { id: "scared_woman", x: 980, y: 166 },
  ],
};

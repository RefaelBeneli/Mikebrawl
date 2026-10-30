export default {
  id: "level1",
  name: "Gym Street",
  length: 1440,
  music: "level1",
  bossMusic: "boss",
  background: {
    far: "assets/backgrounds/level1_far.png",
    near: "assets/backgrounds/level1_near.png",
    palette: {
      sky: ["#2b1d4a", "#e0784a"],
      far: "#3a2a55",
      buildings: ["#4a3b5e", "#5a4660", "#3e3450", "#6a4a50"],
      window: "#ffd080",
      sidewalk: "#6a6070",
      line: "#8a8090",
      street: "#2e2a36",
    },
  },
  enemyScale: 1,
  waves: [
    { at: 260, enemies: ["runner", "thug"] },
    { at: 640, enemies: ["runner", "runner", "thug"] },
    { at: 1040, enemies: ["thug", "runner", "thug", "runner"] },
  ],
  boss: "big_tony",
  bossMinions: [],
};

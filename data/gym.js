// Permanent upgrades bought with Sweat Points. Each rank adds "amount" to "stat".
// Cost of the next rank = baseCost x costGrowth^currentRank.
export default [
  { id: "cardio", stat: "hp", label: "Cardio", amount: 12, baseCost: 15, costGrowth: 1.6, maxRank: 5 },
  { id: "heavy_bag", stat: "power", label: "Heavy Bag", amount: 1, baseCost: 20, costGrowth: 1.6, maxRank: 5 },
  { id: "sparring", stat: "defense", label: "Sparring", amount: 1, baseCost: 20, costGrowth: 1.6, maxRank: 5 },
  { id: "speed_bag", stat: "atkSpeed", label: "Speed Bag", amount: 0.04, baseCost: 25, costGrowth: 1.6, maxRank: 5 },
  { id: "sprints", stat: "speed", label: "Sprints", amount: 4, baseCost: 15, costGrowth: 1.6, maxRank: 5 },
  { id: "pad_work", stat: "crit", label: "Pad Work", amount: 0.02, baseCost: 25, costGrowth: 1.6, maxRank: 5 },
];

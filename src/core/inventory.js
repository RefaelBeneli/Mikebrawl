import { STAT_KEYS } from "./stats.js";

export function createInventory() {
  return { equipped: {}, bag: [] };
}

export function owns(inventory, itemId) {
  return Object.values(inventory.equipped).includes(itemId) || inventory.bag.includes(itemId);
}

export function pickUp(inventory, item) {
  if (owns(inventory, item.id)) return { inventory, result: "duplicate" };
  if (!inventory.equipped[item.slot]) {
    return { inventory: { ...inventory, equipped: { ...inventory.equipped, [item.slot]: item.id } }, result: "equipped" };
  }
  return { inventory: { ...inventory, bag: [...inventory.bag, item.id] }, result: "bagged" };
}

export function equipFromBag(inventory, item) {
  if (!inventory.bag.includes(item.id)) return inventory;
  const previous = inventory.equipped[item.slot];
  const bag = inventory.bag.filter((id) => id !== item.id);
  return {
    equipped: { ...inventory.equipped, [item.slot]: item.id },
    bag: previous ? [...bag, previous] : bag,
  };
}

export function unequip(inventory, slot) {
  const current = inventory.equipped[slot];
  if (!current) return inventory;
  const { [slot]: _removed, ...equipped } = inventory.equipped;
  return { equipped, bag: [...inventory.bag, current] };
}

export function equippedItems(inventory, items) {
  return Object.values(inventory.equipped).map((id) => items.get(id)).filter(Boolean);
}

export function statDelta(current, candidate) {
  const delta = {};
  STAT_KEYS.forEach((key) => {
    const diff = (candidate?.stats[key] ?? 0) - (current?.stats[key] ?? 0);
    if (diff) delta[key] = Math.round(diff * 100) / 100;
  });
  return delta;
}

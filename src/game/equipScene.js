import { WIDTH, HEIGHT } from "../engine/renderer.js";
import { getImage } from "../engine/assets.js";
import { STAT_KEYS } from "../core/stats.js";
import { equipFromBag, unequip, statDelta } from "../core/inventory.js";
import { heroes, items } from "../../data/registry.js";
import { heroStatsFor } from "./runState.js";
import { drawPanel, drawButton, tappedButton, statLabel, formatStat } from "./ui.js";

const SLOT_LABELS = { head: "HEAD", body: "BODY", hands: "HANDS", feet: "FEET" };
const ROW_H = 20;

function itemIcon(r, item, x, y) {
  const icon = getImage(item.icon);
  if (icon) r.image(icon, x, y, 16, 16);
  else r.rect(x + 2, y + 2, 12, 12, item.placeholder);
}

function describeStats(stats) {
  return Object.entries(stats)
    .map(([key, value]) => `${formatStat(key, value, true)} ${statLabel(key)}`)
    .join("  ");
}

export function createEquipScene(game, { run }) {
  const slots = heroes.get("mike").gearDrawOrder;
  let selected = null;

  function close() {
    game.sfx("ui_tap");
    game.scenes.pop();
  }

  function layout() {
    const slotButtons = slots.map((slot, i) => ({ kind: "slot", slot, x: 16, y: 40 + i * ROW_H, w: 210, h: ROW_H - 2, label: "" }));
    const bagButtons = run.inventory.bag.map((id, i) => ({ kind: "bag", id, x: 250, y: 40 + i * ROW_H, w: 214, h: ROW_H - 2, label: "" }));
    const actions = [{ kind: "close", x: WIDTH - 66, y: HEIGHT - 28, w: 54, h: 18, label: "BACK" }];
    if (selected?.kind === "bag") actions.push({ kind: "equip", x: 250, y: HEIGHT - 28, w: 80, h: 18, label: "EQUIP", color: "#2a6a3a" });
    if (selected?.kind === "slot" && run.inventory.equipped[selected.slot]) {
      actions.push({ kind: "unequip", x: 250, y: HEIGHT - 28, w: 80, h: 18, label: "UNEQUIP", color: "#6a2a2a" });
    }
    return [...slotButtons, ...bagButtons, ...actions];
  }

  function selectedItem() {
    if (!selected) return null;
    return items.get(selected.kind === "bag" ? selected.id : run.inventory.equipped[selected.slot]) ?? null;
  }

  return {
    showControls: false,

    enter() {
      game.input.setControlsVisible(false);
    },

    exit() {
      game.input.setControlsVisible(true);
    },

    update() {
      const { input } = game;
      if (input.pressed("back") || input.pressed("bag")) {
        close();
        return;
      }
      const button = tappedButton(input.consumeTaps(), layout());
      if (!button) return;
      game.sfx("ui_tap");
      if (button.kind === "close") close();
      else if (button.kind === "slot") selected = { kind: "slot", slot: button.slot };
      else if (button.kind === "bag") selected = { kind: "bag", id: button.id };
      else if (button.kind === "equip") {
        run.inventory = equipFromBag(run.inventory, items.get(selected.id));
        selected = null;
        game.sfx("item_pickup");
      } else if (button.kind === "unequip") {
        run.inventory = unequip(run.inventory, selected.slot);
        selected = null;
      }
    },

    render(r) {
      r.rect(0, 0, WIDTH, HEIGHT, "#000", 0.75);
      r.text("GEAR", WIDTH / 2, 8, { align: "center", size: 14, color: "#ffd040" });
      drawPanel(r, 10, 24, 222, 100, "EQUIPPED");
      drawPanel(r, 244, 24, 226, 100, "BAG");

      const buttons = layout();
      buttons.forEach((b) => {
        if (b.kind === "slot") {
          const item = items.get(run.inventory.equipped[b.slot]);
          const isSelected = selected?.kind === "slot" && selected.slot === b.slot;
          if (isSelected) r.rect(b.x, b.y, b.w, b.h, "#ffd040", 0.2);
          r.text(SLOT_LABELS[b.slot], b.x + 4, b.y + 5, { color: "#aaa" });
          if (item) {
            itemIcon(r, item, b.x + 52, b.y);
            r.text(item.name, b.x + 72, b.y + 5);
          } else {
            r.text("-", b.x + 72, b.y + 5, { color: "#666" });
          }
        } else if (b.kind === "bag") {
          const item = items.get(b.id);
          if (selected?.kind === "bag" && selected.id === b.id) r.rect(b.x, b.y, b.w, b.h, "#ffd040", 0.2);
          itemIcon(r, item, b.x + 4, b.y);
          r.text(item.name, b.x + 24, b.y + 5);
        } else {
          drawButton(r, b);
        }
      });
      if (!run.inventory.bag.length) r.text("Empty. Beat criminals to find gear.", 252, 44, { color: "#666" });

      drawPanel(r, 10, 130, 222, 110, "MIKE");
      const stats = heroStatsFor(run);
      STAT_KEYS.forEach((key, i) => {
        r.text(statLabel(key), 18, 146 + i * 14, { color: "#aaa" });
        r.text(formatStat(key, stats[key]), 120, 146 + i * 14);
      });

      const item = selectedItem();
      drawPanel(r, 244, 130, 226, 104, item ? item.name.toUpperCase() : "DETAILS");
      if (!item) {
        r.text("Tap an item to see it.", 252, 148, { color: "#666" });
        return;
      }
      r.text(item.description, 252, 146, { color: "#ccc" });
      r.text(describeStats(item.stats), 252, 162, { color: "#fff" });
      if (selected.kind === "bag") {
        const current = items.get(run.inventory.equipped[item.slot]);
        r.text(current ? `vs ${current.name}:` : "Slot is empty:", 252, 182, { color: "#aaa" });
        Object.entries(statDelta(current, item)).forEach(([key, value], i) => {
          r.text(`${formatStat(key, value, true)} ${statLabel(key)}`, 252 + (i % 2) * 106, 196 + Math.floor(i / 2) * 12, {
            color: value > 0 ? "#60e060" : "#e06060",
          });
        });
      }
    },
  };
}

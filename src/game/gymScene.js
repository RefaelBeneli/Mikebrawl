import { WIDTH, HEIGHT } from "../engine/renderer.js";
import { getImage } from "../engine/assets.js";
import gym from "../../data/gym.js";
import { buyUpgrade, nextUpgradeCost } from "./runState.js";
import { drawPanel, drawButton, tappedButton, statLabel, formatStat } from "./ui.js";

export const GYM_BACKGROUND = "assets/backgrounds/gym.png";

const ROW_H = 26;
const PIP = 6;

export function createGymScene(game) {
  let meta = game.save.loadMeta();

  function layout() {
    const rows = gym.map((upgrade, i) => {
      const cost = nextUpgradeCost(meta, upgrade);
      return {
        kind: "buy",
        upgrade,
        cost,
        x: 372,
        y: 44 + i * ROW_H,
        w: 86,
        h: ROW_H - 6,
        label: cost === null ? "MAX" : `${cost} SWEAT`,
        color: "#2a6a3a",
        disabled: cost === null,
      };
    });
    return [
      ...rows,
      { kind: "back", x: 16, y: HEIGHT - 30, w: 70, h: 20, label: "BACK" },
      { kind: "play", x: WIDTH - 176, y: HEIGHT - 30, w: 160, h: 20, label: "HIT THE STREETS", color: "#8a3a2a" },
    ];
  }

  function buy(upgrade) {
    const result = buyUpgrade(meta, upgrade);
    game.sfx(result.bought ? "ui_buy" : "ui_denied");
    if (!result.bought) return;
    meta = result.meta;
    game.save.saveMeta(meta);
  }

  return {
    enter() {
      game.input.setControlsVisible(false);
      game.music("title");
    },

    exit() {
      game.input.setControlsVisible(true);
    },

    update() {
      const { input } = game;
      if (input.pressed("back")) {
        game.scenes.go("title");
        return;
      }
      if (input.pressed("confirm")) {
        game.flow.startRun();
        return;
      }
      const button = tappedButton(input.consumeTaps(), layout());
      if (!button) return;
      if (button.kind === "buy") buy(button.upgrade);
      else if (button.kind === "back") {
        game.sfx("ui_tap");
        game.scenes.go("title");
      } else {
        game.sfx("ui_tap");
        game.flow.startRun();
      }
    },

    render(r) {
      const background = getImage(GYM_BACKGROUND);
      r.clear("#241a14");
      if (background) {
        const scale = Math.max(WIDTH / background.width, HEIGHT / background.height);
        const w = background.width * scale;
        const h = background.height * scale;
        r.image(background, (WIDTH - w) / 2, (HEIGHT - h) / 2, w, h);
      }
      r.text("THE GYM", WIDTH / 2, 8, { align: "center", size: 14, color: "#ffd040", shadow: true });
      r.text(`SWEAT: ${meta.sweat}`, 16, 12, { color: "#80e0ff" });
      drawPanel(r, 10, 28, WIDTH - 20, gym.length * ROW_H + 16, "PERMANENT UPGRADES");
      layout().forEach((b) => {
        if (b.kind !== "buy") {
          drawButton(r, b);
          return;
        }
        const { upgrade } = b;
        const rank = meta.gym[upgrade.id] ?? 0;
        r.text(upgrade.label, 20, b.y + 6);
        r.text(`${formatStat(upgrade.stat, upgrade.amount, true)} ${statLabel(upgrade.stat)}`, 120, b.y + 6, { color: "#aaa" });
        for (let i = 0; i < upgrade.maxRank; i += 1) {
          r.rect(250 + i * (PIP + 4), b.y + 6, PIP, PIP, i < rank ? "#ffd040" : "#444");
        }
        drawButton(r, { ...b, disabled: b.disabled || meta.sweat < b.cost });
      });
    },
  };
}

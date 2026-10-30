import { WIDTH, HEIGHT } from "../engine/renderer.js";
import { levels } from "../../data/registry.js";
import { drawButton, tappedButton } from "./ui.js";

const BUTTON_W = 160;
const BUTTON_H = 22;

export function createTitleScene(game) {
  const savedRun = game.save.loadRun();
  const meta = game.save.loadMeta();
  let t = 0;

  const x = WIDTH / 2 - BUTTON_W / 2;
  const buttons = [
    savedRun && { kind: "continue", label: `CONTINUE - ${levels[savedRun.levelIndex]?.name ?? "?"}`, color: "#2a6a3a" },
    { kind: "new", label: savedRun ? "NEW RUN" : "START", color: savedRun ? "#3a3a4a" : "#2a6a3a" },
    { kind: "gym", label: `GYM  (${meta.sweat} SWEAT)` },
  ]
    .filter(Boolean)
    .map((b, i) => ({ ...b, x, y: 140 + i * (BUTTON_H + 8), w: BUTTON_W, h: BUTTON_H }));

  function choose(kind) {
    game.sfx("ui_tap");
    if (kind === "continue") game.flow.continueRun();
    else if (kind === "new") game.flow.startRun();
    else game.scenes.go("gym");
  }

  return {
    enter() {
      game.input.setControlsVisible(false);
      game.music("title");
    },

    exit() {
      game.input.setControlsVisible(true);
    },

    update(dt) {
      t += dt;
      if (game.input.pressed("confirm")) {
        choose(buttons[0].kind);
        return;
      }
      const button = tappedButton(game.input.consumeTaps(), buttons);
      if (button) choose(button.kind);
    },

    render(r) {
      r.clear("#140c24");
      for (let i = 0; i < 12; i += 1) r.rect(0, 120 + i * 13, WIDTH, 13, i % 2 ? "#1c1230" : "#180f2a");
      r.text("MIKEBRAWL", WIDTH / 2, 44, { align: "center", size: 32, color: "#ffd040", shadow: true });
      r.text("THE WALK HOME FROM THE GYM", WIDTH / 2, 86, { align: "center", color: "#ff9060" });
      if (Math.floor(t * 2) % 2 === 0) r.text("TAP TO CHOOSE", WIDTH / 2, 118, { align: "center", color: "#aaa" });
      buttons.forEach((b) => drawButton(r, b));
      r.text(`RUNS ${meta.runs}   WINS ${meta.wins}`, WIDTH / 2, HEIGHT - 34, { align: "center", color: "#888" });
      r.text("No sound on iPhone? Turn off silent mode.", WIDTH / 2, HEIGHT - 18, { align: "center", color: "#666" });
    },
  };
}

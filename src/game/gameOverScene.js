import { WIDTH, HEIGHT } from "../engine/renderer.js";
import { levels } from "../../data/registry.js";
import { drawPanel, drawButton, tappedButton } from "./ui.js";

const INPUT_DELAY = 1;

export function createGameOverScene(game, { run, sweat, won }) {
  const meta = game.save.loadMeta();
  let t = 0;
  const buttons = [
    { kind: "gym", x: WIDTH / 2 - 150, y: 210, w: 140, h: 24, label: "GO TO THE GYM", color: "#2a5a6a" },
    { kind: "retry", x: WIDTH / 2 + 10, y: 210, w: 140, h: 24, label: won ? "PLAY AGAIN" : "TRY AGAIN", color: "#8a3a2a" },
  ];
  const lines = [
    ["Reached", won ? "Home!" : levels[run.levelIndex]?.name ?? "?"],
    ["Mike level", `${run.progress.level}`],
    ["Criminals beaten", `${run.kills ?? 0}`],
    ["Sweat earned", `+${sweat}`],
    ["Total sweat", `${meta.sweat}`],
  ];

  function choose(kind) {
    game.sfx("ui_tap");
    if (kind === "gym") game.scenes.go("gym");
    else game.flow.startRun();
  }

  return {
    enter() {
      game.input.setControlsVisible(false);
    },

    exit() {
      game.input.setControlsVisible(true);
    },

    update(dt) {
      t += dt;
      const taps = game.input.consumeTaps();
      if (t < INPUT_DELAY) return;
      if (game.input.pressed("confirm")) {
        choose("gym");
        return;
      }
      const button = tappedButton(taps, buttons);
      if (button) choose(button.kind);
    },

    render(r) {
      r.clear(won ? "#14240f" : "#240c0c");
      const title = won ? "MIKE MADE IT HOME!" : "K.O.";
      r.text(title, WIDTH / 2, 26, { align: "center", size: 24, color: won ? "#ffd040" : "#ff4040", shadow: true });
      if (!won) r.text("Back to the gym. Level and gear are gone, sweat stays.", WIDTH / 2, 62, { align: "center", color: "#aaa" });
      drawPanel(r, WIDTH / 2 - 130, 80, 260, 116, "RUN SUMMARY");
      lines.forEach(([label, value], i) => {
        r.text(label, WIDTH / 2 - 118, 98 + i * 18, { color: "#aaa" });
        r.text(value, WIDTH / 2 + 118, 98 + i * 18, { align: "right", color: i >= 3 ? "#80e0ff" : "#fff" });
      });
      buttons.forEach((b) => drawButton(r, { ...b, disabled: t < INPUT_DELAY }));
    },
  };
}

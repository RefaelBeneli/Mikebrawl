import { createSceneManager } from "../engine/scene.js";
import { loadImages } from "../engine/assets.js";
import { WIDTH, HEIGHT } from "../engine/renderer.js";
import { imageSources, levels } from "../../data/registry.js";
import { createLevelScene } from "./levelScene.js";

function createBootScene(game) {
  let progress = 0;
  loadImages(imageSources(), (value) => (progress = value)).then(() => game.flow.startRun());
  return {
    showControls: false,
    update() {},
    render(r) {
      r.clear("#000");
      r.text("MIKEBRAWL", WIDTH / 2, HEIGHT / 2 - 20, { align: "center", size: 20, color: "#ffd040" });
      r.text(`LOADING ${Math.round(progress * 100)}%`, WIDTH / 2, HEIGHT / 2 + 10, { align: "center" });
    },
  };
}

function newRun() {
  return { levelIndex: 0, progress: { level: 1, xp: 0 }, totalXp: 0, kills: 0, heroHp: null };
}

export function createGame({ renderer, input }) {
  const game = { renderer, input, sfx: () => {}, music: () => {} };
  const scenes = createSceneManager(game);
  game.scenes = scenes;

  game.flow = {
    startRun() {
      scenes.go("level", { run: newRun() });
    },
    levelComplete(run) {
      if (run.levelIndex + 1 >= levels.length) {
        game.flow.startRun();
        return;
      }
      scenes.go("level", { run: { ...run, levelIndex: run.levelIndex + 1 } });
    },
    heroDied() {
      game.flow.startRun();
    },
  };

  scenes.register("boot", createBootScene);
  scenes.register("level", createLevelScene);
  scenes.go("boot");

  return {
    update(dt) {
      scenes.update(dt);
      input.endFrame();
    },
    render() {
      scenes.render(renderer);
      if (scenes.top?.showControls !== false) input.render(renderer);
    },
  };
}

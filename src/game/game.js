import { createSceneManager } from "../engine/scene.js";
import { loadImages } from "../engine/assets.js";
import { createAudio } from "../engine/audio.js";
import sounds from "../../data/sounds.js";
import music from "../../data/music.js";
import { WIDTH, HEIGHT } from "../engine/renderer.js";
import { imageSources, levels } from "../../data/registry.js";
import { createLevelScene } from "./levelScene.js";
import { createEquipScene } from "./equipScene.js";
import { createTitleScene } from "./titleScene.js";
import { createGymScene, GYM_BACKGROUND } from "./gymScene.js";
import { createGameOverScene } from "./gameOverScene.js";
import { createRun, endRun } from "./runState.js";
import { createSave } from "./save.js";

function createBootScene(game) {
  let progress = 0;
  loadImages([...imageSources(), GYM_BACKGROUND], (value) => (progress = value)).then(() => game.scenes.go("title"));
  return {
    enter() {
      game.input.setControlsVisible(false);
    },
    update() {},
    render(r) {
      r.clear("#000");
      r.text("MIKEBRAWL", WIDTH / 2, HEIGHT / 2 - 20, { align: "center", size: 20, color: "#ffd040" });
      r.text(`LOADING ${Math.round(progress * 100)}%`, WIDTH / 2, HEIGHT / 2 + 10, { align: "center" });
    },
  };
}

export function createGame({ renderer, input, storage }) {
  const audio = createAudio({ sounds, music });
  const save = createSave(storage);
  const game = { renderer, input, audio, save, sfx: audio.sfx, music: audio.music };
  const syncMuteLabel = () => input.setButtonLabel("mute", audio.settings.muted ? "OFF" : "SND");
  syncMuteLabel();
  const scenes = createSceneManager(game);
  game.scenes = scenes;

  function playLevel(run) {
    save.saveRun(run);
    scenes.go("level", { run });
  }

  function finishRun(run, won) {
    const levelsCleared = won ? levels.length : run.levelIndex;
    const result = endRun(save.loadMeta(), run, { levelsCleared, won });
    save.saveMeta(result.meta);
    save.clearRun();
    scenes.go("gameover", { run, sweat: result.sweat, won });
  }

  game.flow = {
    startRun() {
      playLevel(createRun(save.loadMeta()));
    },
    continueRun() {
      const run = save.loadRun();
      if (run) scenes.go("level", { run });
      else game.flow.startRun();
    },
    levelComplete(run) {
      if (run.levelIndex + 1 >= levels.length) finishRun(run, true);
      else playLevel({ ...run, levelIndex: run.levelIndex + 1 });
    },
    heroDied(run) {
      finishRun(run, false);
    },
  };

  scenes.register("boot", createBootScene);
  scenes.register("title", createTitleScene);
  scenes.register("gym", createGymScene);
  scenes.register("level", createLevelScene);
  scenes.register("equip", createEquipScene);
  scenes.register("gameover", createGameOverScene);
  scenes.go("boot");

  return {
    update(dt) {
      if (input.pressed("mute")) {
        audio.toggleMute();
        syncMuteLabel();
      }
      scenes.update(dt);
      input.endFrame();
    },
    render() {
      scenes.render(renderer);
      input.render(renderer);
    },
  };
}

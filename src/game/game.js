import { createSceneManager } from "../engine/scene.js";
import { loadImages } from "../engine/assets.js";
import { createAudio } from "../engine/audio.js";
import sounds from "../../data/sounds.js";
import music from "../../data/music.js";
import { WIDTH, HEIGHT } from "../engine/renderer.js";
import { imageSources, levels } from "../../data/registry.js";
import { createLevelScene } from "./levelScene.js";
import { createEquipScene } from "./equipScene.js";

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
  const audio = createAudio({ sounds, music });
  const game = { renderer, input, audio, sfx: audio.sfx, music: audio.music };
  const syncMuteLabel = () => input.setButtonLabel("mute", audio.settings.muted ? "OFF" : "SND");
  syncMuteLabel();
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
  scenes.register("equip", createEquipScene);
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
      if (scenes.top?.showControls !== false) input.render(renderer);
    },
  };
}

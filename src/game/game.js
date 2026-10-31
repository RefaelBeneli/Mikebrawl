import { createSceneManager } from "../engine/scene.js";
import { loadAssets } from "../engine/assets.js";
import { createAudio } from "../engine/audio.js";
import sounds from "../../data/sounds.js";
import music from "../../data/music.js";
import { WIDTH, HEIGHT } from "../engine/renderer.js";
import { heroes, items, levels, fx, characters, spritePath, gearPath, backgroundPath, NEAR_PANELS } from "../../data/registry.js";
import { stripPoses } from "../../data/anims.js";
import { SIDEWALK_TOP } from "./draw.js";
import { createLevelScene } from "./levelScene.js";
import { createEquipScene } from "./equipScene.js";
import { createTitleScene } from "./titleScene.js";
import { createGymScene, GYM_BACKGROUND } from "./gymScene.js";
import { createGameOverScene } from "./gameOverScene.js";
import { createRun, endRun } from "./runState.js";
import { createSave } from "./save.js";

const TARGET_HEIGHT_PER_BODY = 1.1;

// Each character's idle strip sets its size; its other strips match that size; Mike's gear reuses Mike's poses.
function characterJobs(def) {
  const { cellW, cellH, anims } = def.sprite;
  const files = stripPoses(anims);
  const idleSrc = spritePath(def, anims.idle.art.file);
  const base = { kind: "strip", cellW, cellH };
  const targetHeight = def.sprite.height ?? Math.round(def.body.h * TARGET_HEIGHT_PER_BODY);
  return Object.entries(files)
    .map(([file, poses]) => ({ ...base, src: spritePath(def, file), poses }))
    .sort((a, b) => (a.src === idleSrc ? -1 : b.src === idleSrc ? 1 : 0))
    .map((job) => (job.src === idleSrc ? { ...job, targetHeight } : { ...job, scaleFrom: idleSrc }));
}

export function assetJobs() {
  const mike = heroes.get("mike");
  const gear = [...items.values()].flatMap((item) => [
    { kind: "icon", src: item.icon, size: 24 },
    ...Object.keys(stripPoses(mike.sprite.anims)).map((file) => ({
      kind: "strip",
      src: gearPath(item, file),
      ref: spritePath(mike, file),
      cellW: mike.sprite.cellW,
      cellH: mike.sprite.cellH,
    })),
  ]);
  const backgrounds = levels.flatMap((level) => [
    { kind: "layer", src: backgroundPath(level, "far"), height: SIDEWALK_TOP },
    ...[...Array.from({ length: NEAR_PANELS }, (_, i) => `near${i + 1}`), ...Object.values(level.background.landmarks ?? {})].map((file) => ({
      kind: "layer",
      src: backgroundPath(level, file),
      height: SIDEWALK_TOP,
      keyed: true,
    })),
  ]);
  const effects = Object.values(fx).map((effect) => ({ kind: "strip", src: effect.sheet, cellW: effect.cellW, cellH: effect.cellH, poses: effect.frames, align: "center" }));
  return [...characters().flatMap(characterJobs), ...gear, ...backgrounds, ...effects, { src: GYM_BACKGROUND }];
}

function createBootScene(game) {
  let progress = 0;
  loadAssets(assetJobs(), (value) => (progress = value)).then(() => game.scenes.go("title"));
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

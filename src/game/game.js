import { createSceneManager } from "../engine/scene.js";
import { createSandboxScene } from "./sandboxScene.js";

export function createGame({ renderer, input }) {
  const game = { renderer, input };
  const scenes = createSceneManager(game);
  game.scenes = scenes;

  scenes.register("sandbox", createSandboxScene);
  scenes.go("sandbox");

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

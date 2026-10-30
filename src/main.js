import { startLoop } from "./engine/loop.js";
import { createRenderer } from "./engine/renderer.js";
import { createInput } from "./engine/input.js";
import { createGame } from "./game/game.js";

const renderer = createRenderer(document.getElementById("game"));
const input = createInput(renderer);
const game = createGame({ renderer, input });

startLoop(game);

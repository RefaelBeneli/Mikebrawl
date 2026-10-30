import { startLoop } from "./engine/loop.js";
import { createRenderer } from "./engine/renderer.js";
import { createInput } from "./engine/input.js";
import { createGame } from "./game/game.js";

const renderer = createRenderer(document.getElementById("game"));
const input = createInput(renderer);
const game = createGame({ renderer, input });

// Hide the browser bars on phones. Needs a tap; iPhone Safari has no fullscreen API (use Add to Home Screen there).
const isPhone = window.matchMedia("(pointer: coarse)").matches;
const isInstalled = window.matchMedia("(display-mode: fullscreen), (display-mode: standalone)").matches;
let askedFullscreen = false;
input.onFirstGesture(() => {
  if (askedFullscreen || !isPhone || isInstalled || document.fullscreenElement) return;
  askedFullscreen = true;
  document.documentElement
    .requestFullscreen?.({ navigationUI: "hide" })
    .then(() => screen.orientation?.lock?.("landscape"))
    .catch(() => {});
});

startLoop(game);

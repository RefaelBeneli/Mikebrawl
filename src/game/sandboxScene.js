import { WIDTH, HEIGHT } from "../engine/renderer.js";

const STREET_TOP = 180;
const STREET_BOTTOM = 262;
const GRAVITY = 900;

export function createSandboxScene(game) {
  const box = { x: 120, y: 220, z: 0, vz: 0, facing: 1 };
  let lastAction = "";

  return {
    update(dt) {
      const { input } = game;
      const { x, y } = input.axis;
      box.x = Math.max(12, Math.min(WIDTH - 12, box.x + x * 80 * dt));
      box.y = Math.max(STREET_TOP, Math.min(STREET_BOTTOM, box.y + y * 48 * dt));
      if (x) box.facing = Math.sign(x);
      if (input.pressed("jump") && box.z === 0) box.vz = 300;
      box.vz -= GRAVITY * dt;
      box.z = Math.max(0, box.z + box.vz * dt);
      if (box.z === 0) box.vz = 0;
      ["punch", "kick", "jump"].forEach((action) => {
        if (input.pressed(action)) lastAction = action.toUpperCase();
      });
    },

    render(r) {
      r.clear("#2b1d3a");
      r.rect(0, 150, WIDTH, 30, "#55555f");
      r.rect(0, STREET_TOP, WIDTH, HEIGHT - STREET_TOP, "#2e2e36");
      r.ellipse(box.x, box.y, 14, 4, "#000", 0.4);
      r.rect(box.x - 14, box.y - box.z - 74, 28, 74, "#d9a066");
      r.rect(box.x + box.facing * 8 - 3, box.y - box.z - 66, 6, 6, "#000");
      r.text("MIKEBRAWL ENGINE SANDBOX", WIDTH / 2, 10, { align: "center", size: 10 });
      r.text(lastAction, WIDTH / 2, 28, { align: "center", color: "#ffd040" });
    },
  };
}

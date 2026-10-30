// Every animation shows poses from one strip image: assets/sprites/<character id>/<file>.png
// art.poses lists which pose of that strip to show on each animation frame (length = frames),
// so game timing (frames/fps, attack active frames) never depends on how many poses were drawn.
// Keep these in sync with docs/sprites/prompts.md.
const art = (file, ...poses) => ({ file, poses });

export const MIKE_ANIMS = {
  idle: { frames: 2, fps: 3, loop: true, art: art("idle", 0, 1) },
  walk: { frames: 4, fps: 7, loop: true, art: art("walk", 0, 1, 2, 3) },
  punch1: { frames: 3, fps: 14, art: art("punch", 0, 1, 0) },
  punch2: { frames: 3, fps: 14, art: art("punch", 2, 3, 2) },
  punch3: { frames: 3, fps: 12, art: art("punch", 4, 5, 5) },
  kick: { frames: 4, fps: 12, art: art("kick", 0, 1, 1, 2) },
  jump: { frames: 3, fps: 4, art: art("jump", 0, 1, 1) },
  jumpKick: { frames: 2, fps: 8, art: art("jump", 2, 2) },
  hurt: { frames: 2, fps: 10, art: art("fall", 0, 0) },
  down: { frames: 3, fps: 8, art: art("fall", 1, 2, 2) },
  getup: { frames: 3, fps: 8, art: art("fall", 3, 4, 4) },
  victory: { frames: 2, fps: 3, loop: true, art: art("victory", 0, 0) },
};

export const HUMANOID_ANIMS = {
  idle: { frames: 2, fps: 3, loop: true, art: art("idle", 0, 1) },
  walk: { frames: 4, fps: 7, loop: true, art: art("walk", 0, 1, 2, 3) },
  attack: { frames: 4, fps: 8, art: art("attack", 0, 0, 1, 2) },
  hurt: { frames: 2, fps: 10, art: art("fall", 0, 0) },
  down: { frames: 3, fps: 8, art: art("fall", 1, 2, 2) },
  getup: { frames: 3, fps: 8, art: art("fall", 3, 4, 4) },
};

export const BOSS_ANIMS = {
  ...HUMANOID_ANIMS,
  special: { frames: 6, fps: 10, art: art("special", 0, 1, 2, 2, 2, 3) },
  enrage: { frames: 6, fps: 8, art: art("enrage", 0, 1, 0, 1, 0, 1) },
};

export const PERSON_ANIMS = {
  idle: { frames: 2, fps: 3, loop: true, art: art("idle", 0, 1) },
  flee: { frames: 4, fps: 10, loop: true, art: art("flee", 0, 1, 2, 3) },
};

export const ANIMAL_ANIMS = {
  idle: { frames: 2, fps: 3, loop: true, art: art("idle", 0, 1) },
  flee: { frames: 4, fps: 14, loop: true, art: art("flee", 0, 1, 2, 3) },
};

// How many poses each strip image must contain, e.g. { idle: 2, walk: 4, punch: 6 }.
export function stripPoses(anims) {
  const poses = {};
  Object.values(anims).forEach(({ art: { file, poses: list } }) => {
    poses[file] = Math.max(poses[file] ?? 0, ...list.map((pose) => pose + 1));
  });
  return poses;
}

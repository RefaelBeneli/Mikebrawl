// Animation layouts shared by sprite sheets. Each row in a sheet is one animation; "start" is the first column.
// Keep these in sync with docs/sprites/prompts.md.

export const MIKE_ANIMS = {
  idle: { row: 0, frames: 4, fps: 6, loop: true },
  walk: { row: 1, frames: 6, fps: 10, loop: true },
  punch1: { row: 2, start: 0, frames: 3, fps: 14 },
  punch2: { row: 2, start: 3, frames: 3, fps: 14 },
  punch3: { row: 2, start: 6, frames: 3, fps: 12 },
  kick: { row: 3, frames: 4, fps: 12 },
  jump: { row: 4, frames: 3, fps: 4 },
  jumpKick: { row: 5, frames: 2, fps: 8 },
  hurt: { row: 6, frames: 2, fps: 10 },
  down: { row: 7, frames: 3, fps: 8 },
  getup: { row: 8, frames: 3, fps: 8 },
  victory: { row: 9, frames: 2, fps: 3, loop: true },
};

export const HUMANOID_ANIMS = {
  idle: { row: 0, frames: 4, fps: 6, loop: true },
  walk: { row: 1, frames: 6, fps: 10, loop: true },
  attack: { row: 2, frames: 4, fps: 8 },
  hurt: { row: 3, frames: 2, fps: 10 },
  down: { row: 4, frames: 3, fps: 8 },
  getup: { row: 5, frames: 3, fps: 8 },
};

export const BOSS_ANIMS = {
  ...HUMANOID_ANIMS,
  special: { row: 6, frames: 6, fps: 10 },
  enrage: { row: 7, frames: 6, fps: 8 },
};

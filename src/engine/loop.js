export const STEP = 1 / 60;
const MAX_FRAME_SECONDS = 0.25;

export function startLoop({ update, render }) {
  let last = performance.now();
  let accumulator = 0;

  function frame(now) {
    accumulator += Math.min((now - last) / 1000, MAX_FRAME_SECONDS);
    last = now;
    while (accumulator >= STEP) {
      update(STEP);
      accumulator -= STEP;
    }
    render();
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

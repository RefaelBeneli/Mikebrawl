export class Animator {
  constructor(anims) {
    this.anims = anims;
    this.play(Object.keys(anims)[0]);
  }

  play(name, { restart = false, speed = 1 } = {}) {
    if (!this.anims[name]) throw new Error(`Unknown animation "${name}"`);
    this.speed = speed;
    if (this.name === name && !restart) return;
    this.name = name;
    this.time = 0;
    this.frame = 0;
    this.done = false;
    this.frameChanged = true;
  }

  get current() {
    return this.anims[this.name];
  }

  update(dt) {
    const anim = this.current;
    this.time += dt * this.speed;
    const index = Math.floor(this.time * anim.fps);
    const frame = anim.loop ? index % anim.frames : Math.min(index, anim.frames - 1);
    this.frameChanged = frame !== this.frame;
    this.frame = frame;
    this.done = !anim.loop && index >= anim.frames;
  }

  // Which strip image and which pose in it to draw right now.
  get pose() {
    const { art } = this.current;
    return { file: art.file, index: art.poses[this.frame] ?? 0 };
  }
}

import { Animator } from "./animation.js";

const DESPAWN_MARGIN = 80;
const DEPTH_WEIGHT = 2;

function nearestThreat(npc, world) {
  const { from, radius } = npc.def.flee;
  if (from === "hero") {
    const hero = world.hero;
    const distance = Math.hypot(hero.x - npc.x, (hero.y - npc.y) / DEPTH_WEIGHT);
    return hero.alive && distance <= radius ? hero : null;
  }
  return world.foes.find((foe) => foe.alive && Math.abs(foe.x - npc.x) <= radius) ?? null;
}

export class Npc {
  constructor({ def, x, y }) {
    this.def = def;
    this.x = x;
    this.y = y;
    this.z = 0;
    this.facing = x % 2 ? 1 : -1;
    this.state = "idle";
    this.fleeDir = 0;
    this.animator = new Animator(def.sprite.anims);
  }

  get gone() {
    return this.state === "gone";
  }

  // Returns a sound id when the NPC starts fleeing, otherwise null.
  update(dt, world) {
    this.animator.update(dt);
    if (this.state === "idle") {
      const threat = nearestThreat(this, world);
      if (!threat) return null;
      this.state = "flee";
      this.fleeDir = Math.sign(this.x - threat.x) || 1;
      this.facing = this.fleeDir;
      this.animator.play("flee");
      return this.def.sounds?.flee ?? null;
    }
    if (this.state === "flee") {
      this.x += this.fleeDir * this.def.flee.speed * dt;
      const offscreen = this.x < world.camX - DESPAWN_MARGIN || this.x > world.camX + world.viewWidth + DESPAWN_MARGIN;
      if (offscreen) this.state = "gone";
    }
    return null;
  }
}

import { DEPTH_BAND } from "./combat.js";

const ALIGN_TOLERANCE_X = 6;
const ALIGN_TOLERANCE_Y = DEPTH_BAND - 3;
const STRAFE_CHANGE_SECONDS = 2;

const clampUnit = (value) => Math.max(-1, Math.min(1, value));

function steer(intent, dx, dy, pace = 1) {
  intent.x = clampUnit(dx / 10) * pace;
  intent.y = clampUnit(dy / 6) * pace;
}

function sideOf(self, hero) {
  return Math.sign(self.x - hero.x) || 1;
}

function lookAt(self, hero, intent) {
  intent.face = Math.sign(hero.x - self.x) || self.facing;
  self.facing = intent.face;
}

function waitNearby(self, hero, mem, intent, distance, dt) {
  mem.strafeTime -= dt;
  if (mem.strafeTime <= 0) {
    mem.strafe = Math.random() * 2 - 1;
    mem.strafeTime = STRAFE_CHANGE_SECONDS;
  }
  const targetX = hero.x + sideOf(self, hero) * distance;
  const targetY = hero.y + mem.strafe * 24;
  steer(intent, targetX - self.x, targetY - self.y, 0.5);
  lookAt(self, hero, intent);
}

function windUp(self, mem, intent, dt, world, onRelease) {
  mem.windup -= dt;
  self.telegraph = Math.max(mem.windup, 0.01);
  if (mem.windup > 0) return;
  self.telegraph = 0;
  intent.attack = mem.button;
  onRelease?.();
  world.releaseToken(self);
}

function engage(self, hero, world, dt, mem, intent, cfg) {
  if (mem.windup > 0) {
    lookAt(self, hero, intent);
    windUp(self, mem, intent, dt, world, () => {
      mem.cooldown = cfg.cooldown / self.stats.atkSpeed;
      if (cfg.retreat) mem.retreatTime = cfg.retreat;
    });
    return;
  }
  if (!world.requestToken(self)) {
    waitNearby(self, hero, mem, intent, cfg.waitDistance ?? 100, dt);
    return;
  }
  const targetX = hero.x + sideOf(self, hero) * cfg.range;
  const dx = targetX - self.x;
  const dy = hero.y - self.y;
  steer(intent, dx, dy);
  lookAt(self, hero, intent);
  const aligned = Math.abs(dx) < ALIGN_TOLERANCE_X && Math.abs(dy) < ALIGN_TOLERANCE_Y;
  if (aligned && mem.cooldown <= 0) {
    mem.windup = cfg.windup;
    mem.button = "punch";
  }
}

function retreating(self, hero, mem, intent, dt) {
  if (mem.retreatTime <= 0) return false;
  mem.retreatTime -= dt;
  steer(intent, sideOf(self, hero) * 40, 0);
  lookAt(self, hero, intent);
  return true;
}

export const behaviors = {
  brawler(self, world, dt, mem, cfg, intent) {
    engage(self, world.hero, world, dt, mem, intent, cfg);
  },

  rusher(self, world, dt, mem, cfg, intent) {
    if (retreating(self, world.hero, mem, intent, dt)) {
      world.releaseToken(self);
      return;
    }
    engage(self, world.hero, world, dt, mem, intent, cfg);
  },
};

export function createBrain(cfg) {
  const behavior = behaviors[cfg.type];
  if (!behavior) throw new Error(`Unknown AI behavior "${cfg.type}"`);
  const mem = {
    cooldown: 0.5 + Math.random(),
    windup: 0,
    button: null,
    strafe: Math.random() * 2 - 1,
    strafeTime: STRAFE_CHANGE_SECONDS,
    retreatTime: 0,
  };

  return function think(self, world, dt) {
    const intent = { x: 0, y: 0, attack: null, jump: false, face: 0 };
    self.intent = intent;
    mem.cooldown -= dt;
    const hero = world.hero;
    if (!self.canAct) {
      mem.windup = 0;
      self.telegraph = 0;
      return;
    }
    if (!hero?.alive || !hero.vulnerable) {
      world.releaseToken(self);
      if (hero) waitNearby(self, hero, mem, intent, 110, dt);
      return;
    }
    behavior(self, world, dt, mem, cfg, intent);
  };
}

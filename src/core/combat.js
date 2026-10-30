export const DEPTH_BAND = 10;
export const CRIT_MULTIPLIER = 1.5;

export function calcDamage({ attacker, defender, strength, rng = Math.random }) {
  const crit = rng() < attacker.crit;
  const raw = attacker.power * strength * (crit ? CRIT_MULTIPLIER : 1) - defender.defense;
  return { damage: Math.max(1, Math.round(raw)), crit };
}

export function attackBox(fighter, hitbox) {
  const x = fighter.facing >= 0 ? fighter.x + hitbox.x : fighter.x - hitbox.x - hitbox.w;
  return { x, bottom: fighter.z + hitbox.y, w: hitbox.w, h: hitbox.h };
}

export function hurtBox(fighter) {
  const { w, h } = fighter.def.body;
  return { x: fighter.x - w / 2, bottom: fighter.z, w, h };
}

export function boxesOverlap(a, b) {
  return a.x < b.x + b.w && b.x < a.x + a.w && a.bottom < b.bottom + b.h && b.bottom < a.bottom + a.h;
}

export function canHit(attacker, target, hitbox) {
  return Math.abs(attacker.y - target.y) <= DEPTH_BAND && boxesOverlap(attackBox(attacker, hitbox), hurtBox(target));
}

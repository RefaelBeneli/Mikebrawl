import { WIDTH, HEIGHT } from "../engine/renderer.js";
import { getImage } from "../engine/assets.js";
import { attackBox } from "../core/combat.js";
import { createRng } from "../core/progression.js";

export const SIDEWALK_TOP = 150;
export const STREET_TOP = 180;
export const STREET_BOTTOM = 262;
const FAR_PARALLAX = 0.5;
const SKY_BANDS = 10;

const sceneryCache = new Map();

function hashString(value) {
  return [...value].reduce((hash, char) => (Math.imul(hash, 31) + char.charCodeAt(0)) >>> 0, 7);
}

function mixColor(a, b, t) {
  const parse = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const [ca, cb] = [parse(a), parse(b)];
  return `#${ca.map((c, i) => Math.round(c + (cb[i] - c) * t).toString(16).padStart(2, "0")).join("")}`;
}

function buildScenery(level) {
  const rng = createRng(hashString(level.id));
  const { palette } = level.background;
  const skyline = [];
  for (let x = 0; x < level.length * FAR_PARALLAX + WIDTH; x += 20 + rng() * 30) {
    skyline.push({ x, w: 24 + rng() * 40, h: 40 + rng() * 70 });
  }
  const buildings = [];
  for (let x = 0; x < level.length; ) {
    const w = 70 + Math.floor(rng() * 60);
    buildings.push({ x, w, h: 90 + Math.floor(rng() * 50), color: palette.buildings[Math.floor(rng() * palette.buildings.length)], lit: rng() });
    x += w + 2;
  }
  return { skyline, buildings };
}

export function drawBackground(r, level, camX) {
  const { palette, far, near } = level.background;
  const farImage = getImage(far);
  const nearImage = getImage(near);
  if (!sceneryCache.has(level.id)) sceneryCache.set(level.id, buildScenery(level));
  const scenery = sceneryCache.get(level.id);

  if (farImage) {
    r.image(farImage, -camX * FAR_PARALLAX, 0);
  } else {
    const bandHeight = SIDEWALK_TOP / SKY_BANDS;
    for (let i = 0; i < SKY_BANDS; i += 1) {
      r.rect(0, i * bandHeight, WIDTH, bandHeight + 1, mixColor(palette.sky[0], palette.sky[1], i / (SKY_BANDS - 1)));
    }
    scenery.skyline.forEach((b) => {
      const x = b.x - camX * FAR_PARALLAX;
      if (x + b.w > 0 && x < WIDTH) r.rect(x, SIDEWALK_TOP - b.h, b.w, b.h, palette.far);
    });
  }

  if (nearImage) {
    r.image(nearImage, -camX, 0);
    return;
  }
  scenery.buildings.forEach((b) => {
    const x = b.x - camX;
    if (x + b.w < 0 || x > WIDTH) return;
    const top = SIDEWALK_TOP - b.h;
    r.rect(x, top, b.w, b.h, b.color);
    for (let wy = top + 10; wy < SIDEWALK_TOP - 24; wy += 18) {
      for (let wx = x + 8; wx < x + b.w - 12; wx += 16) {
        const lit = (Math.floor(wx + wy + b.lit * 100) % 3) === 0;
        r.rect(wx, wy, 8, 10, lit ? palette.window : "#00000055");
      }
    }
    r.rect(x + b.w / 2 - 9, SIDEWALK_TOP - 26, 18, 26, "#00000066");
  });
  r.rect(0, SIDEWALK_TOP, WIDTH, STREET_TOP - SIDEWALK_TOP, palette.sidewalk);
  r.rect(0, STREET_TOP - 3, WIDTH, 3, palette.line);
  r.rect(0, STREET_TOP, WIDTH, HEIGHT - STREET_TOP, palette.street);
  for (let x = -((camX * 1) % 60); x < WIDTH; x += 60) r.rect(x, 226, 26, 2, palette.line);
  for (let x = -(camX % 240) + 40; x < WIDTH + 20; x += 240) {
    r.rect(x, 70, 3, SIDEWALK_TOP + 10 - 70, "#222");
    r.rect(x - 4, 66, 12, 5, palette.window);
  }
}

export function drawShadow(r, entity, camX, width = 14) {
  const shrink = Math.max(0.4, 1 - entity.z / 120);
  r.ellipse(entity.x - camX, entity.y, width * shrink, 3.5 * shrink, "#000", 0.35);
}

function placeholderFighter(r, f, sx, sy, gearColors) {
  const { w, h } = f.def.body;
  const flash = f.hitFlash > 0;
  const color = flash ? "#ffffff" : gearColors.body ?? f.def.sprite.placeholder;
  const skin = flash ? "#ffffff" : "#e0b090";
  const fist = flash ? "#ffffff" : gearColors.hands ?? skin;
  const lying = (f.state === "down" || f.state === "dead") && f.stateTime > 0.12;
  if (lying) {
    r.rect(sx - h / 2, sy - 12, h - 14, 12, color);
    r.rect(sx - h / 2 + (f.facing > 0 ? -14 : h - 14), sy - 13, 14, 13, skin);
    return;
  }
  const lean = f.state === "hurt" ? -f.facing * 4 : 0;
  const stride = f.state === "walk" ? Math.sin(f.stateTime * 14) * 4 : 0;
  const top = sy - h;
  const legH = h * 0.45;
  const legW = w / 2 - 3;
  const legs = [sx - w / 2 + 2 + stride, sx + 1 - stride];
  legs.forEach((x, i) => {
    r.rect(x, sy - legH, legW, legH, i ? "#2a2a2a" : "#222");
    if (gearColors.feet) r.rect(x - 1, sy - 7, legW + 2, 7, gearColors.feet);
  });
  r.rect(sx - w / 2 + lean, top + 14, w, h * 0.55 - 14, color);
  r.rect(sx - 7 + lean, top, 14, 14, skin);
  r.rect(sx + f.facing * 4 - 1 + lean, top + 4, 2, 2, "#000");
  if (gearColors.head) r.rect(sx - 8 + lean, top + 1, 16, 3, gearColors.head);
  if (f.state === "attack" && f.move) {
    const { hitbox } = f.move;
    const box = attackBox(f, hitbox);
    const active = f.move.activeFrames.includes(f.animator.frame);
    const reach = (f.facing > 0 ? box.x + box.w - f.x : f.x - box.x) * (active ? 1 : 0.5);
    const limbX = f.facing > 0 ? sx : sx - reach;
    const limbY = sy - hitbox.y - hitbox.h / 2 - 3;
    r.rect(limbX, limbY, reach, 6, active ? skin : color);
    r.rect(f.facing > 0 ? limbX + reach - 7 : limbX, limbY - 1, 7, 8, fist);
  } else {
    r.rect(sx + f.facing * (w / 2 - 2) - 3 + lean, top + 20, 7, 7, fist);
  }
}

function gearPlaceholderColors(gear) {
  return Object.fromEntries(gear.filter((item) => !getImage(item.layer)).map((item) => [item.slot, item.placeholder]));
}

function sortedGear(f) {
  const order = f.def.gearDrawOrder ?? [];
  return (f.gear ?? []).slice().sort((a, b) => order.indexOf(a.slot) - order.indexOf(b.slot));
}

export function drawFighter(r, f, camX) {
  if (f.state === "dead" && Math.floor(f.stateTime * 10) % 2 === 0) return;
  if (f.invuln > 0 && Math.floor(f.invuln * 12) % 2 === 0) return;
  const sprite = f.def.sprite;
  const img = getImage(sprite.sheet);
  const sx = Math.round(f.x - camX);
  const sy = Math.round(f.y - f.z);
  const gear = sortedGear(f);
  if (img) {
    const { col, row } = f.animator.cell;
    const x = sx - sprite.cellW / 2;
    const y = sy - sprite.cellH;
    r.cell(img, sprite.cellW, sprite.cellH, col, row, x, y, { flip: f.facing < 0 });
    gear.forEach((item) => {
      const layer = getImage(item.layer);
      if (layer) r.cell(layer, sprite.cellW, sprite.cellH, col, row, x, y, { flip: f.facing < 0 });
    });
  } else {
    placeholderFighter(r, f, sx, sy, gearPlaceholderColors(gear));
  }
  if (f.telegraph > 0 && Math.floor(f.telegraph * 16) % 2 === 0) {
    r.text("!", sx, sy - f.def.body.h - 14, { align: "center", color: "#ff3030", size: 12 });
  }
  if (f.team !== "hero" && f.alive && f.hp < f.stats.hp && !f.def.boss) {
    r.rect(sx - 12, sy - f.def.body.h - 6, 24, 3, "#000");
    r.rect(sx - 12, sy - f.def.body.h - 6, (24 * f.hp) / f.stats.hp, 3, "#e04040");
  }
}

export function drawPickup(r, pickup, camX) {
  const x = Math.round(pickup.x - camX);
  const bob = Math.round(Math.sin(pickup.t * 5) * 2);
  const y = pickup.y - 18 + bob;
  r.ellipse(x, pickup.y, 7, 2, "#000", 0.35);
  if (Math.floor(pickup.t * 4) % 2 === 0) r.circle(x, y + 6, 12, "#fff6a0", 0.25);
  const icon = getImage(pickup.item.icon);
  if (icon) {
    r.image(icon, x - 12, y - 6, 24, 24);
  } else {
    r.rect(x - 8, y - 2, 16, 16, "#000");
    r.rect(x - 7, y - 1, 14, 14, pickup.item.placeholder);
    r.text(pickup.item.slot[0].toUpperCase(), x, y + 2, { align: "center", color: "#fff" });
  }
}

export function drawEffect(r, effect, camX, fx) {
  const x = effect.x - camX;
  const y = effect.y - effect.h;
  if (effect.kind === "spark") {
    const img = getImage(fx.hitSpark.sheet);
    const frame = Math.min(fx.hitSpark.frames - 1, Math.floor(effect.t * fx.hitSpark.fps));
    if (img) {
      r.cell(img, fx.hitSpark.cellW, fx.hitSpark.cellH, frame, 0, x - 16, y - 16);
    } else {
      const size = effect.heavy ? 12 : 8;
      r.rect(x - size / 2, y - 1, size, 3, "#fff6a0");
      r.rect(x - 1, y - size / 2, 3, size, "#fff6a0");
    }
  } else if (effect.kind === "text") {
    const rise = effect.t * 30;
    r.text(effect.text, x, y - rise, { align: "center", color: effect.color, size: effect.size ?? 8, alpha: 1 - effect.t / effect.life });
  }
}

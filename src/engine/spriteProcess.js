// Turns a raw AI-generated pose strip (poses side by side on a flat background) into clean frame boxes.
// Pure functions on { width, height, data } (ImageData-like) so they run in node tests too.

const CORNER = 6;
const FRINGE_FACTOR = 1.6;
const MIN_FIGURE_AREA = 0.04;

const offset = (img, x, y) => (y * img.width + x) * 4;

function colorDistance(data, i, bg) {
  return Math.hypot(data[i] - bg.r, data[i + 1] - bg.g, data[i + 2] - bg.b);
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)] ?? 0;
}

function patchColor(img, cx, cy, size) {
  const sum = { r: 0, g: 0, b: 0, a: 0 };
  for (let y = cy; y < cy + size; y += 1) {
    for (let x = cx; x < cx + size; x += 1) {
      const i = offset(img, x, y);
      sum.r += img.data[i];
      sum.g += img.data[i + 1];
      sum.b += img.data[i + 2];
      sum.a += img.data[i + 3];
    }
  }
  const n = size * size;
  return { r: sum.r / n, g: sum.g / n, b: sum.b / n, transparent: sum.a / n < 128 };
}

// The corner colour most corners agree on (top corners win ties, since a sky or backdrop is on top).
// See-through corners mean the image already has transparency.
export function backgroundColor(img, tolerance = 40) {
  const size = Math.min(CORNER, img.width, img.height);
  const corners = [
    [0, 0],
    [img.width - size, 0],
    [0, img.height - size],
    [img.width - size, img.height - size],
  ].map(([x, y]) => patchColor(img, x, y, size));
  const close = (a, b) => a.transparent === b.transparent && (a.transparent || Math.hypot(a.r - b.r, a.g - b.g, a.b - b.b) <= tolerance);
  const votes = corners.map((a) => corners.filter((b) => close(a, b)).length);
  return corners[votes.indexOf(Math.max(...votes))];
}

// 1 = part of the drawing, 0 = background. Also trims the one-pixel halo of background-tinted edge pixels.
export function foregroundMask(img, bg = backgroundColor(img), tolerance = 80) {
  const { width, height, data } = img;
  const mask = new Uint8Array(width * height);
  for (let p = 0; p < mask.length; p += 1) {
    const i = p * 4;
    mask[p] = data[i + 3] >= 128 && (bg.transparent || colorDistance(data, i, bg) > tolerance) ? 1 : 0;
  }
  if (!bg.transparent) {
    const halo = mask.slice();
    for (let y = 1; y < height - 1; y += 1) {
      for (let x = 1; x < width - 1; x += 1) {
        const p = y * width + x;
        if (!halo[p]) continue;
        const touchesBackground = !halo[p - 1] || !halo[p + 1] || !halo[p - width] || !halo[p + width];
        if (touchesBackground && colorDistance(data, p * 4, bg) < tolerance * FRINGE_FACTOR) mask[p] = 0;
      }
    }
  }
  return removeSpecks(mask, width, height);
}

// Drops lone pixels (compression noise) that would otherwise stretch a pose's box.
function removeSpecks(mask, width, height) {
  const clean = mask.slice();
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const p = y * width + x;
      if (!mask[p]) continue;
      let neighbours = 0;
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          const nx = x + dx;
          const ny = y + dy;
          if ((dx || dy) && nx >= 0 && ny >= 0 && nx < width && ny < height) neighbours += mask[ny * width + nx];
        }
      }
      if (neighbours < 2) clean[p] = 0;
    }
  }
  return clean;
}

// Labels 8-connected shapes: returns per-pixel shape ids (1..n, 0 = background) and each shape's box.
function connectedShapes(mask, width, height) {
  const ids = new Int32Array(mask.length);
  const shapes = [];
  const stack = [];
  for (let start = 0; start < mask.length; start += 1) {
    if (!mask[start] || ids[start]) continue;
    const shape = { id: shapes.length + 1, x0: width, x1: -1, y0: height, y1: -1, area: 0 };
    shapes.push(shape);
    ids[start] = shape.id;
    stack.push(start);
    while (stack.length) {
      const p = stack.pop();
      const x = p % width;
      const y = (p - x) / width;
      shape.area += 1;
      shape.x0 = Math.min(shape.x0, x);
      shape.x1 = Math.max(shape.x1, x);
      shape.y0 = Math.min(shape.y0, y);
      shape.y1 = Math.max(shape.y1, y);
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const q = ny * width + nx;
          if (mask[q] && !ids[q]) {
            ids[q] = shape.id;
            stack.push(q);
          }
        }
      }
    }
  }
  return { ids, shapes };
}

const boxGap = (a, b) => Math.hypot(Math.max(0, a.x0 - b.x1, b.x0 - a.x1), Math.max(0, a.y0 - b.y1, b.y0 - a.y1));

function joinBoxes(a, b) {
  return { x0: Math.min(a.x0, b.x0), x1: Math.max(a.x1, b.x1), y0: Math.min(a.y0, b.y0), y1: Math.max(a.y1, b.y1), area: a.area + b.area };
}

// A pose = a set of shapes, optionally limited to a column range (when touching poses were split apart).
function group(shape) {
  return { ...shape, shapes: new Set([shape.id]), lo: -Infinity, hi: Infinity };
}

function mergeGroups(a, b) {
  return { ...joinBoxes(a, b), shapes: new Set([...a.shapes, ...b.shapes]), lo: Math.min(a.lo, b.lo), hi: Math.max(a.hi, b.hi) };
}

// Too many pieces: the smallest one joins its nearest neighbour (overlapping poses have no gap,
// so "closest pair" would wrongly glue two real poses together).
function mergeSmallest(groups) {
  const smallest = groups.reduce((best, g) => (g.area < best.area ? g : best));
  const others = groups.filter((g) => g !== smallest);
  const nearest = others.reduce((best, g) => (boxGap(g, smallest) < boxGap(best, smallest) ? g : best));
  groups.splice(groups.indexOf(smallest), 1);
  groups.splice(groups.indexOf(nearest), 1, mergeGroups(nearest, smallest));
}

// Leftover specks grouped by nearness, biggest group first: a frame drawn as scattered sparks.
function speckClouds(pieces, gap) {
  const clouds = [];
  [...pieces]
    .sort((a, b) => a.x0 - b.x0)
    .forEach((piece) => {
      const last = clouds.at(-1);
      if (last && piece.x0 - last.x1 <= gap) clouds.splice(-1, 1, mergeGroups(last, piece));
      else clouds.push(piece);
    });
  return clouds.sort((a, b) => b.area - a.area);
}

function owns(g, ids, width, p) {
  const x = p % width;
  return g.shapes.has(ids[p]) && x >= g.lo && x <= g.hi;
}

// Splits the widest pose at its thinnest column (middle half only), for poses that touch.
function splitWidest(groups, ids, width) {
  const widest = groups.reduce((best, g) => (g.x1 - g.x0 > best.x1 - best.x0 ? g : best));
  const counts = new Array(widest.x1 - widest.x0 + 1).fill(0);
  for (let y = widest.y0; y <= widest.y1; y += 1) {
    for (let x = widest.x0; x <= widest.x1; x += 1) if (owns(widest, ids, width, y * width + x)) counts[x - widest.x0] += 1;
  }
  const span = widest.x1 - widest.x0;
  let cut = Math.floor(span / 2);
  for (let i = Math.floor(span * 0.25); i <= Math.ceil(span * 0.75); i += 1) if (counts[i] < counts[cut]) cut = i;
  const at = widest.x0 + cut;
  const left = { ...widest, x1: at, hi: Math.min(widest.hi, at) };
  const right = { ...widest, x0: at + 1, lo: Math.max(widest.lo, at + 1) };
  groups.splice(groups.indexOf(widest), 1, left, right);
}

function measureGroup(g, ids, width, owner, label) {
  const box = { id: label, x0: Infinity, x1: -1, y0: Infinity, y1: -1, area: 0 };
  for (let y = g.y0; y <= g.y1; y += 1) {
    for (let x = g.x0; x <= g.x1; x += 1) {
      const p = y * width + x;
      if (!owns(g, ids, width, p)) continue;
      owner[p] = label;
      box.area += 1;
      box.x0 = Math.min(box.x0, x);
      box.x1 = Math.max(box.x1, x);
      box.y0 = Math.min(box.y0, y);
      box.y1 = Math.max(box.y1, y);
    }
  }
  return box;
}

// Finds each pose as a connected shape (so an arm reaching over a neighbour's column stays with its body),
// keeps small nearby pieces (a detached fist) with the closest pose, drops far specks, then forces the
// count to `expected` by merging the closest poses or splitting the widest one.
// Returns boxes left to right ({ id, x0, x1, y0, y1, area }) and `owner`: the pose id of every pixel (0 = none).
export function segmentFigures(mask, width, height, expected) {
  const { ids, shapes } = connectedShapes(mask, width, height);
  const biggest = Math.max(0, ...shapes.map((s) => s.area));
  const big = shapes.filter((s) => s.area >= biggest * MIN_FIGURE_AREA).map(group);
  const tallest = Math.max(0, ...big.map((g) => g.y1 - g.y0 + 1));
  const attachGap = Math.max(4, tallest * 0.08);
  const dropped = [];
  shapes
    .filter((s) => s.area < biggest * MIN_FIGURE_AREA)
    .forEach((piece) => {
      const nearest = big.reduce((best, g) => (!best || boxGap(g, piece) < boxGap(best, piece) ? g : best), null);
      if (nearest && boxGap(nearest, piece) <= attachGap) big.splice(big.indexOf(nearest), 1, mergeGroups(nearest, group(piece)));
      else dropped.push(group(piece));
    });
  const groups = big;
  if (expected && groups.length) {
    while (groups.length > expected) mergeSmallest(groups);
    const clouds = speckClouds(dropped, attachGap * 2).filter((c) => !groups.some((g) => c.x0 <= g.x1 && g.x0 <= c.x1));
    while (groups.length < expected && clouds.length) groups.push(clouds.shift());
    while (groups.length < expected) splitWidest(groups, ids, width);
  }
  groups.sort((a, b) => a.x0 + a.x1 - (b.x0 + b.x1));
  const owner = new Int32Array(mask.length);
  const boxes = groups.map((g, i) => measureGroup(g, ids, width, owner, i + 1)).filter((box) => box.area > 0);
  return { boxes, owner };
}

export function findFigures(mask, width, height, expected) {
  return segmentFigures(mask, width, height, expected).boxes;
}

// Gives gear pixels to the pose they sit on: each pose's pixels spread outward up to `radius`
// (closest pose wins), so a glove drawn just past the hand still belongs to that hand's pose.
export function growOwner(owner, width, height, radius) {
  const grown = owner.slice();
  let frontier = [];
  for (let p = 0; p < owner.length; p += 1) if (owner[p]) frontier.push(p);
  for (let step = 0; step < radius && frontier.length; step += 1) {
    const next = [];
    for (const p of frontier) {
      const x = p % width;
      const y = (p - x) / width;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
        const q = ny * width + nx;
        if (grown[q]) continue;
        grown[q] = grown[p];
        next.push(q);
      }
    }
    frontier = next;
  }
  return grown;
}

// Horizontal centre of the feet (bottom fifth of the pose), so punches and kicks don't shift the body.
export function footAnchor(owner, width, box) {
  const top = box.y1 - Math.max(1, Math.round((box.y1 - box.y0 + 1) * 0.2));
  let sum = 0;
  let count = 0;
  for (let y = top; y <= box.y1; y += 1) {
    for (let x = box.x0; x <= box.x1; x += 1) {
      if (owner[y * width + x] === box.id) {
        sum += x;
        count += 1;
      }
    }
  }
  return count ? sum / count : (box.x0 + box.x1) / 2;
}

const boxHeight = (box) => box.y1 - box.y0 + 1;
const boxWidth = (box) => box.x1 - box.x0 + 1;

// Same body, same pixel area: lying down or punching keeps roughly the area of standing,
// so area (not height) keeps every strip the same character size.
export function stripScale(boxes, { targetHeight, referenceArea }) {
  if (referenceArea) return Math.sqrt(referenceArea / median(boxes.map((b) => b.area)));
  return targetHeight / median(boxes.map(boxHeight));
}

export function fitScale(boxes, cellW, cellH, scale) {
  const limit = Math.min(...boxes.map((b) => Math.min(cellW / boxWidth(b), (cellH - 1) / boxHeight(b))));
  return Math.min(scale, limit);
}

export function frameLayout(box, { anchorX, scale, cellW, cellH, align = "feet" }) {
  const dw = boxWidth(box) * scale;
  const dh = boxHeight(box) * scale;
  if (align === "center") return { dx: (cellW - dw) / 2, dy: (cellH - dh) / 2, dw, dh };
  return { dx: cellW / 2 - (anchorX - box.x0) * scale, dy: cellH - 1 - dh, dw, dh };
}

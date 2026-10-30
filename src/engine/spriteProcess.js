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

// Average of the four corner patches. Corners that are see-through mean the image already has transparency.
export function backgroundColor(img) {
  const sum = { r: 0, g: 0, b: 0, a: 0, n: 0 };
  const size = Math.min(CORNER, img.width, img.height);
  [
    [0, 0],
    [img.width - size, 0],
    [0, img.height - size],
    [img.width - size, img.height - size],
  ].forEach(([cx, cy]) => {
    for (let y = cy; y < cy + size; y += 1) {
      for (let x = cx; x < cx + size; x += 1) {
        const i = offset(img, x, y);
        sum.r += img.data[i];
        sum.g += img.data[i + 1];
        sum.b += img.data[i + 2];
        sum.a += img.data[i + 3];
        sum.n += 1;
      }
    }
  });
  return { r: sum.r / sum.n, g: sum.g / sum.n, b: sum.b / sum.n, transparent: sum.a / sum.n < 128 };
}

// 1 = part of the drawing, 0 = background. Also trims the one-pixel halo of background-tinted edge pixels.
export function foregroundMask(img, bg = backgroundColor(img), tolerance = 80) {
  const { width, height, data } = img;
  const mask = new Uint8Array(width * height);
  for (let p = 0; p < mask.length; p += 1) {
    const i = p * 4;
    mask[p] = data[i + 3] >= 128 && (bg.transparent || colorDistance(data, i, bg) > tolerance) ? 1 : 0;
  }
  if (bg.transparent) return mask;
  const trimmed = mask.slice();
  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const p = y * width + x;
      if (!mask[p]) continue;
      const touchesBackground = !mask[p - 1] || !mask[p + 1] || !mask[p - width] || !mask[p + width];
      if (touchesBackground && colorDistance(data, p * 4, bg) < tolerance * FRINGE_FACTOR) trimmed[p] = 0;
    }
  }
  return trimmed;
}

function columnCounts(mask, width, height, x0 = 0, x1 = width - 1) {
  const counts = new Array(x1 - x0 + 1).fill(0);
  for (let y = 0; y < height; y += 1) {
    for (let x = x0; x <= x1; x += 1) counts[x - x0] += mask[y * width + x];
  }
  return counts;
}

function measure(mask, width, height, x0, x1) {
  let y0 = height;
  let y1 = -1;
  let area = 0;
  for (let y = 0; y < height; y += 1) {
    for (let x = x0; x <= x1; x += 1) {
      if (!mask[y * width + x]) continue;
      area += 1;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }
  return { x0, x1, y0, y1, area };
}

function splitWidest(runs, counts) {
  const widest = runs.reduce((best, run) => (run.x1 - run.x0 > best.x1 - best.x0 ? run : best));
  const from = widest.x0 + Math.floor((widest.x1 - widest.x0) * 0.25);
  const to = widest.x0 + Math.ceil((widest.x1 - widest.x0) * 0.75);
  let cut = Math.floor((widest.x0 + widest.x1) / 2);
  for (let x = from; x <= to; x += 1) if (counts[x] < counts[cut]) cut = x;
  const index = runs.indexOf(widest);
  runs.splice(index, 1, { x0: widest.x0, x1: cut }, { x0: cut + 1, x1: widest.x1 });
}

function mergeClosest(runs) {
  let best = 0;
  for (let i = 1; i < runs.length - 1; i += 1) {
    if (runs[i + 1].x0 - runs[i].x1 < runs[best + 1].x0 - runs[best].x1) best = i;
  }
  runs.splice(best, 2, { x0: runs[best].x0, x1: runs[best + 1].x1 });
}

// Finds each pose as a run of columns with drawing in it, then forces the count to `expected`
// (merges the closest neighbours, or splits the widest pose at its thinnest column).
export function findFigures(mask, width, height, expected) {
  const counts = columnCounts(mask, width, height);
  const minGap = Math.max(2, Math.round(width * 0.004));
  let runs = [];
  counts.forEach((count, x) => {
    if (!count) return;
    const last = runs.at(-1);
    if (last && x - last.x1 <= minGap) last.x1 = x;
    else runs.push({ x0: x, x1: x });
  });
  const areaOf = (run) => counts.slice(run.x0, run.x1 + 1).reduce((a, b) => a + b, 0);
  const biggest = Math.max(0, ...runs.map(areaOf));
  const isSmall = (run) => areaOf(run) < biggest * MIN_FIGURE_AREA;
  const attachGap = Math.max(minGap * 4, Math.round(width * 0.02));
  runs = runs.reduce((kept, run) => {
    const last = kept.at(-1);
    if (last && run.x0 - last.x1 <= attachGap && (isSmall(run) || isSmall(last))) last.x1 = run.x1;
    else kept.push({ ...run });
    return kept;
  }, []);
  runs = runs.filter((run) => !isSmall(run));
  if (expected && runs.length) {
    while (runs.length > expected) mergeClosest(runs);
    while (runs.length < expected) splitWidest(runs, counts);
  }
  return runs.map((run) => measure(mask, width, height, run.x0, run.x1)).filter((box) => box.area > 0);
}

// Horizontal centre of the feet (bottom fifth of the pose), so punches and kicks don't shift the body.
export function footAnchor(mask, width, box) {
  const top = box.y1 - Math.max(1, Math.round((box.y1 - box.y0 + 1) * 0.2));
  let sum = 0;
  let count = 0;
  for (let y = top; y <= box.y1; y += 1) {
    for (let x = box.x0; x <= box.x1; x += 1) {
      if (mask[y * width + x]) {
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

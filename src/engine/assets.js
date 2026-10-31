import { foregroundMask, segmentFigures, growOwner, footAnchor, stripScale, fitScale, frameLayout } from "./spriteProcess.js";

const ALPHA_CUTOFF = 128;
// How far (share of pose height) gear may stick out past Mike's body and still belong to that pose.
const GEAR_REACH = 0.06;
const images = new Map();
const stripInfo = new Map();

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function canvas(width, height) {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(width));
  c.height = Math.max(1, Math.round(height));
  return c;
}

function pixels(img, width = img.width, height = img.height) {
  const c = canvas(width, height);
  const ctx = c.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, c.width, c.height);
  return ctx.getImageData(0, 0, c.width, c.height);
}

// Copies one box of the raw image, keeping only the pixels owned by `id`.
function cutout(raw, owner, box, id = 1) {
  const w = box.x1 - box.x0 + 1;
  const h = box.y1 - box.y0 + 1;
  const piece = canvas(w, h);
  const ctx = piece.getContext("2d");
  const out = ctx.createImageData(w, h);
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const p = (box.y0 + y) * raw.width + box.x0 + x;
      if (owner[p] !== id) continue;
      out.data.set(raw.data.subarray(p * 4, p * 4 + 4), (y * w + x) * 4);
    }
  }
  ctx.putImageData(out, 0, 0);
  return piece;
}

// Smooth downscale, then hard alpha edges so the result reads as pixel art.
function hardenAlpha(target) {
  const ctx = target.getContext("2d", { willReadFrequently: true });
  const data = ctx.getImageData(0, 0, target.width, target.height);
  for (let i = 3; i < data.data.length; i += 4) data.data[i] = data.data[i] >= ALPHA_CUTOFF ? 255 : 0;
  ctx.putImageData(data, 0, 0);
  return target;
}

function drawScaled(ctx, piece, x, y, w, h) {
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(piece, Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h)));
}

// A pose strip becomes a row of same-size cells. `ref` reuses another strip's boxes and scale
// (gear drawn on top of Mike); `scaleFrom` matches the character size of an earlier strip.
function processStrip(img, job) {
  const reference = job.ref && stripInfo.get(job.ref);
  if (job.ref && !reference) return null;
  const raw = reference ? pixels(img, reference.width, reference.height) : pixels(img);
  const mask = foregroundMask(raw);
  let boxes;
  let scale;
  let anchors;
  let owner;
  if (reference) {
    ({ boxes, scale, anchors } = reference);
    const reach = Math.round(Math.max(...boxes.map((b) => b.y1 - b.y0 + 1)) * GEAR_REACH);
    const grown = growOwner(reference.owner, raw.width, raw.height, reach);
    owner = mask.map((on, p) => (on ? grown[p] : 0));
  } else {
    ({ boxes, owner } = segmentFigures(mask, raw.width, raw.height, job.poses));
    if (!boxes.length) return null;
    const base = job.scaleFrom && stripInfo.get(job.scaleFrom);
    const wanted = stripScale(boxes, base ? { referenceArea: base.area } : { targetHeight: job.targetHeight ?? job.cellH });
    scale = fitScale(boxes, job.cellW, job.cellH, wanted);
    anchors = boxes.map((box) => footAnchor(owner, raw.width, box));
    const areas = boxes.map((b) => b.area).sort((a, b) => a - b);
    stripInfo.set(job.src, { width: raw.width, height: raw.height, boxes, owner, scale, anchors, area: areas[Math.floor(areas.length / 2)] * scale ** 2 });
  }
  const sheet = canvas(job.cellW * boxes.length, job.cellH);
  const ctx = sheet.getContext("2d");
  boxes.forEach((box, i) => {
    const { dx, dy, dw, dh } = frameLayout(box, { anchorX: anchors[i], scale, cellW: job.cellW, cellH: job.cellH, align: job.align });
    ctx.save();
    ctx.beginPath();
    ctx.rect(i * job.cellW, 0, job.cellW, job.cellH);
    ctx.clip();
    drawScaled(ctx, cutout(raw, owner, box, box.id), i * job.cellW + dx, dy, dw, dh);
    ctx.restore();
  });
  return hardenAlpha(sheet);
}

function processIcon(img, job) {
  const raw = pixels(img);
  const mask = foregroundMask(raw);
  const { boxes: [box], owner } = segmentFigures(mask, raw.width, raw.height, 1);
  if (!box) return null;
  const icon = canvas(job.size, job.size);
  const scale = fitScale([box], job.size, job.size + 1, Infinity);
  const { dx, dy, dw, dh } = frameLayout(box, { anchorX: 0, scale, cellW: job.size, cellH: job.size, align: "center" });
  drawScaled(icon.getContext("2d"), cutout(raw, owner, box, box.id), dx, dy, dw, dh);
  return hardenAlpha(icon);
}

// Backgrounds: scaled to a fixed height; `keyed` removes a flat sky colour so the far layer shows through.
function processLayer(img, job) {
  const width = (img.width * job.height) / img.height;
  if (!job.keyed) {
    const layer = canvas(width, job.height);
    drawScaled(layer.getContext("2d"), img, 0, 0, layer.width, layer.height);
    return layer;
  }
  const raw = pixels(img);
  const mask = foregroundMask(raw);
  const full = { x0: 0, y0: 0, x1: raw.width - 1, y1: raw.height - 1 };
  const layer = canvas(width, job.height);
  drawScaled(layer.getContext("2d"), cutout(raw, mask, full), 0, 0, layer.width, layer.height);
  return hardenAlpha(layer);
}

const processors = { strip: processStrip, icon: processIcon, layer: processLayer, image: (img) => img };

// Jobs: { kind: "image" | "strip" | "icon" | "layer", src, ...options }. Missing files resolve to null,
// so the game falls back to its coded placeholders. Jobs run in order (strips can depend on earlier ones).
export async function loadAssets(jobs, onProgress = () => {}) {
  const pending = jobs.filter((job) => !images.has(job.src));
  const raws = new Map();
  let done = 0;
  const step = () => onProgress(++done / (pending.length * 2 || 1));
  await Promise.all(
    [...new Set(pending.map((job) => job.src))].map(async (src) => {
      raws.set(src, await loadImage(src));
      pending.filter((job) => job.src === src).forEach(step);
    }),
  );
  for (const job of pending) {
    const raw = raws.get(job.src);
    let result = null;
    try {
      result = raw ? processors[job.kind ?? "image"](raw, job) : null;
    } catch (error) {
      console.warn(`Could not process ${job.src}`, error);
    }
    images.set(job.src, result);
    step();
    await new Promise((resolve) => setTimeout(resolve));
  }
}

export function loadImages(sources, onProgress) {
  return loadAssets(sources.map((src) => ({ src })), onProgress);
}

export function getImage(src) {
  return src ? images.get(src) ?? null : null;
}

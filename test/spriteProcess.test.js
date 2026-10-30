import { test } from "node:test";
import assert from "node:assert/strict";
import { backgroundColor, foregroundMask, findFigures, footAnchor, stripScale, fitScale, frameLayout } from "../src/engine/spriteProcess.js";

const PINK = [255, 0, 255, 255];
const SKIN = [200, 150, 110, 255];

function image(width, height, fill = PINK) {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < data.length; i += 4) data.set(fill, i);
  return { width, height, data };
}

function paint(img, x0, y0, w, h, color = SKIN) {
  for (let y = y0; y < y0 + h; y += 1) for (let x = x0; x < x0 + w; x += 1) img.data.set(color, (y * img.width + x) * 4);
}

const figures = (img, expected) => findFigures(foregroundMask(img), img.width, img.height, expected);

test("the flat background colour is read from the corners, transparency is detected", () => {
  const bg = backgroundColor(image(40, 20));
  assert.deepEqual([Math.round(bg.r), Math.round(bg.g), Math.round(bg.b), bg.transparent], [255, 0, 255, false]);
  assert.equal(backgroundColor(image(40, 20, [0, 0, 0, 0])).transparent, true);
});

test("poses on a pink strip are found left to right with tight boxes", () => {
  const img = image(300, 100);
  paint(img, 20, 30, 40, 60);
  paint(img, 120, 20, 40, 70);
  paint(img, 220, 40, 50, 50);
  const boxes = figures(img, 3);
  assert.deepEqual(
    boxes.map(({ x0, x1, y0, y1 }) => [x0, x1, y0, y1]),
    [
      [20, 59, 30, 89],
      [120, 159, 20, 89],
      [220, 269, 40, 89],
    ],
  );
});

test("near-pink edge pixels (the halo AI images leave) are not part of the pose", () => {
  const img = image(60, 40);
  paint(img, 10, 10, 20, 20);
  paint(img, 9, 10, 1, 20, [235, 60, 225, 255]);
  const [box] = figures(img, 1);
  assert.equal(box.x0, 10);
});

test("tiny specks are ignored and a detached fist stays with its pose", () => {
  const img = image(300, 100);
  paint(img, 20, 30, 40, 60);
  paint(img, 62, 50, 6, 6);
  paint(img, 150, 5, 2, 2);
  paint(img, 200, 30, 40, 60);
  const boxes = figures(img, 2);
  assert.equal(boxes.length, 2);
  assert.equal(boxes[0].x1, 67);
});

test("touching poses are split at the thinnest column when fewer poses than expected are found", () => {
  const img = image(200, 100);
  paint(img, 20, 20, 60, 70);
  paint(img, 80, 60, 10, 4);
  paint(img, 90, 20, 60, 70);
  const boxes = figures(img, 2);
  assert.equal(boxes.length, 2);
  assert.ok(boxes[0].x1 >= 79 && boxes[0].x1 <= 89, `cut at ${boxes[0].x1}`);
});

test("extra pieces are merged into the closest pose when more poses than expected are found", () => {
  const img = image(300, 100);
  paint(img, 20, 20, 40, 70);
  paint(img, 70, 20, 30, 70);
  paint(img, 200, 20, 40, 70);
  assert.equal(figures(img, 2).length, 2);
});

test("the feet anchor ignores an extended arm", () => {
  const img = image(200, 100);
  paint(img, 40, 10, 20, 80);
  paint(img, 60, 30, 60, 8);
  const mask = foregroundMask(img);
  const [box] = findFigures(mask, img.width, img.height, 1);
  assert.equal(footAnchor(mask, img.width, box), 49.5);
});

test("strips are scaled by height for the reference pose and by area for the rest", () => {
  const standing = [{ x0: 0, x1: 39, y0: 0, y1: 159, area: 4000 }];
  const scale = stripScale(standing, { targetHeight: 80 });
  assert.equal(scale, 0.5);
  const lyingDouble = [{ x0: 0, x1: 319, y0: 0, y1: 79, area: 16000 }];
  assert.equal(stripScale(lyingDouble, { referenceArea: 4000 * scale ** 2 }), 0.25);
});

test("scale shrinks so the biggest pose fits its cell", () => {
  const boxes = [{ x0: 0, x1: 199, y0: 0, y1: 99, area: 1 }];
  assert.equal(fitScale(boxes, 96, 96, 1), 0.48);
});

test("frames stand on the cell floor with the feet centred, or sit in the middle", () => {
  const box = { x0: 100, x1: 139, y0: 0, y1: 79 };
  assert.deepEqual(frameLayout(box, { anchorX: 110, scale: 1, cellW: 96, cellH: 96 }), { dx: 38, dy: 15, dw: 40, dh: 80 });
  assert.deepEqual(frameLayout(box, { anchorX: 110, scale: 0.5, cellW: 32, cellH: 32, align: "center" }), { dx: 6, dy: -4, dw: 20, dh: 40 });
});

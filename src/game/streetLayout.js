// Places the building panels along a level: an optional `start` landmark at x 0, an optional `end`
// landmark flush with the level's end, and the repeating `panels` in between.
// Returns the pieces that overlap world x range [from, to): { img, x, w } where w may cut a panel short.
export function streetLayout({ panels = [], start = null, end = null, length }, from, to) {
  const placed = [];
  const stop = end ? length - end.width : Infinity;
  if (start) placed.push({ img: start, x: 0, w: Math.min(start.width, stop) });
  const total = panels.reduce((sum, img) => sum + img.width, 0);
  if (total > 0) {
    let x = start ? start.width : 0;
    if (from > x) x += Math.floor((from - x) / total) * total;
    const limit = Math.min(to, stop);
    while (x < limit) {
      for (const img of panels) {
        if (x >= limit) break;
        placed.push({ img, x, w: Math.min(img.width, stop - x) });
        x += img.width;
      }
    }
  }
  if (end) placed.push({ img: end, x: stop, w: end.width });
  return placed.filter((piece) => piece.w > 0 && piece.x + piece.w > from && piece.x < to);
}

import { WIDTH } from "../engine/renderer.js";
import { xpToNext } from "../core/progression.js";

function bar(r, x, y, w, h, ratio, color, back = "#300") {
  r.rect(x - 1, y - 1, w + 2, h + 2, "#000");
  r.rect(x, y, w, h, back);
  r.rect(x, y, Math.max(0, w * Math.min(1, ratio)), h, color);
}

export function drawHud(r, { hero, progress, boss, levelName }) {
  r.text(`MIKE  LV ${progress.level}`, 8, 6, { color: "#ffd040" });
  bar(r, 8, 17, 110, 6, hero.hp / hero.stats.hp, hero.hp / hero.stats.hp > 0.3 ? "#40d060" : "#e04040");
  bar(r, 8, 26, 110, 2, progress.xp / xpToNext(progress.level), "#ffd040", "#332");
  r.text(levelName, WIDTH / 2, 6, { align: "center", color: "#ccc" });

  if (boss) {
    const width = 200;
    const x = (WIDTH - width) / 2;
    r.text(boss.def.name.toUpperCase(), x, 18, { color: "#ff6060" });
    bar(r, x, 28, width, 6, boss.hp / boss.stats.hp, boss.enraged ? "#ff3030" : "#e08030");
  }
}

export function drawBanner(r, text, t, color = "#ffd040") {
  const alpha = Math.min(1, t * 3);
  r.rect(0, 112, WIDTH, 40, "#000", 0.5 * alpha);
  r.text(text, WIDTH / 2, 122, { align: "center", size: 20, color, alpha });
}

export function drawGoArrow(r, t) {
  if (Math.floor(t * 3) % 2) return;
  r.text("GO >>", WIDTH - 60, 60, { size: 14, color: "#ffd040" });
}

export function drawPanel(r, x, y, w, h, title) {
  r.rect(x, y, w, h, "#000", 0.6);
  r.strokeRect(x, y, w, h, "#ffd040");
  if (title) r.text(title, x + 6, y + 5, { color: "#ffd040" });
}

export function drawButton(r, { x, y, w, h, label, color = "#3a3a4a", disabled = false, selected = false }) {
  r.rect(x, y, w, h, disabled ? "#222" : color);
  r.strokeRect(x, y, w, h, selected ? "#ffd040" : "#888");
  r.text(label, x + w / 2, y + h / 2 - 4, { align: "center", color: disabled ? "#666" : "#fff" });
}

export function tappedButton(taps, buttons) {
  return buttons.find((b) => !b.disabled && taps.some((t) => t.x >= b.x && t.x <= b.x + b.w && t.y >= b.y && t.y <= b.y + b.h)) ?? null;
}

const STAT_LABELS = {
  hp: ["HP", (v) => `${Math.round(v)}`],
  power: ["POWER", (v) => `${Math.round(v)}`],
  defense: ["DEFENSE", (v) => `${Math.round(v)}`],
  atkSpeed: ["ATK SPEED", (v) => `${Math.round(v * 100)}%`],
  speed: ["SPEED", (v) => `${Math.round(v)}`],
  crit: ["CRIT", (v) => `${Math.round(v * 100)}%`],
};

export function statLabel(key) {
  return STAT_LABELS[key][0];
}

export function formatStat(key, value, signed = false) {
  const text = STAT_LABELS[key][1](Math.abs(value));
  if (!signed) return STAT_LABELS[key][1](value);
  return `${value < 0 ? "-" : "+"}${text}`;
}

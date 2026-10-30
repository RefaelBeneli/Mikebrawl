// The one list of all game content. To add content: create its data file, import it here, add it to a list.
import heroMoves from "./moves.js";
import mike from "./heroes/mike.js";
import thug from "./enemies/thug.js";
import runner from "./enemies/runner.js";
import bigTony from "./bosses/big_tony.js";
import viper from "./bosses/viper.js";
import theChief from "./bosses/the_chief.js";
import level1 from "./levels/level1.js";
import level2 from "./levels/level2.js";
import level3 from "./levels/level3.js";
import fightGloves from "./items/fight_gloves.js";
import streetBoots from "./items/street_boots.js";
import luckyTank from "./items/lucky_tank.js";
import focusHeadband from "./items/focus_headband.js";

const indexById = (list) => new Map(list.map((entry) => [entry.id, entry]));

export const heroes = indexById([mike]);
export const enemies = indexById([thug, runner]);
export const bosses = indexById([bigTony, viper, theChief]);
export const levels = [level1, level2, level3];
export const items = indexById([fightGloves, streetBoots, luckyTank, focusHeadband]);

const opponents = [...enemies.values(), ...bosses.values()];
export const moves = indexById([...heroMoves, ...opponents.flatMap((def) => def.moves ?? [])]);

export const fx = {
  hitSpark: { sheet: "assets/sprites/fx/hit_spark.png", cellW: 32, cellH: 32, frames: 3, fps: 20 },
};

export function imageSources() {
  const sheets = [...heroes.values(), ...opponents].map((def) => def.sprite.sheet);
  const itemArt = [...items.values()].flatMap((item) => [item.icon, item.layer]);
  const backgrounds = levels.flatMap((level) => [level.background?.far, level.background?.near]);
  return [...sheets, ...itemArt, ...backgrounds, ...Object.values(fx).map((effect) => effect.sheet)].filter(Boolean);
}

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
import people from "./npcs/people.js";
import animals from "./npcs/animals.js";

const indexById = (list) => new Map(list.map((entry) => [entry.id, entry]));

export const heroes = indexById([mike]);
export const enemies = indexById([thug, runner]);
export const bosses = indexById([bigTony, viper, theChief]);
export const levels = [level1, level2, level3];
export const items = indexById([fightGloves, streetBoots, luckyTank, focusHeadband]);
export const npcs = indexById([...people, ...animals]);

const opponents = [...enemies.values(), ...bosses.values()];
export const moves = indexById([...heroMoves, ...opponents.flatMap((def) => def.moves ?? [])]);

export const fx = {
  hitSpark: { sheet: "assets/sprites/fx/hit_spark.png", cellW: 32, cellH: 32, frames: 3, fps: 20 },
};

// Art lives at fixed paths, named after ids, so adding content never needs a path typed by hand.
export const characters = () => [...heroes.values(), ...opponents, ...npcs.values()];
export const spritePath = (def, file) => `assets/sprites/${def.id}/${file}.png`;
export const gearPath = (item, file) => `assets/sprites/gear/${item.id}/${file}.png`;
export const backgroundPath = (level, file) => `assets/backgrounds/${level.id}/${file}.png`;
export const NEAR_PANELS = 4;

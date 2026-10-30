# Mikebrawl - Phase One Design

Mike is a martial artist. On his way home from the gym, criminals block the street. He fights through 3 levels, each ending with a boss, to get home. Mike never uses weapons.

## Locked decisions

| Topic | Decision |
|---|---|
| Genre | 2D side-scrolling brawler with street depth (Golden Axe style). Mike walks right, enemies come at him. |
| Platform | Mobile-first browser game (iOS Safari, Android Chrome), landscape. Desktop keyboard works too. |
| Controls | Floating thumb joystick on the left. Punch, Kick, Jump buttons on the right. 2 hidden skill buttons reserved for phase 2. |
| Code | Plain JavaScript ES modules. No build tools, no npm dependencies. Tests use Node's built-in `node --test`. |
| Art | Pixel art in the style of the existing Mike sheet. Missing art falls back to coded placeholders, so code never waits on art. |
| Gear | Visible on Mike. Each item has its own layer sheet on the exact same frame grid as base Mike. Phase one: 1 item per slot (4 items). |
| Content | 3 levels, 2 normal enemy types (Thug, Runner), 3 bosses, reactive background NPCs (scared woman, old man, homeless man, cat, rat). |
| Death | Roguelite. Death restarts the run at level 1. Mike's level and gear reset. |
| Meta progress | Each run earns Sweat Points. Mike spends them at the gym on small permanent stat boosts. |
| Publish | itch.io (zip upload) plus GitHub Pages. Installable PWA ("Add to Home Screen"), works offline. |

## 1. Code structure

The engine never knows about specific levels or enemies. All content is data, looked up by id in `data/registry.js`. Adding a level means adding a data file and one line in the registry.

```
index.html              canvas + rotate-phone overlay, loads src/main.js
manifest.json, sw.js    PWA install + offline cache
src/
  engine/   loop (fixed 60 Hz step), renderer (480x270, sharp scaling), input (joystick + buttons + keyboard), assets, audio, scene stack
  core/     stats, combat (hitboxes, damage), progression (XP, drops, rng), animation, fighter, AI behaviors, inventory, npc
  game/     scenes (title, level, equip, gym, game over), run state, save, HUD, drawing
data/
  heroes/ enemies/ bosses/ items/ levels/ npcs/   one file per thing
  moves.js   Mike's moves (punch combo, kick, jump kick)
  gym.js     gym upgrade definitions
  registry.js the one list of all content
assets/     sprites, backgrounds (see docs/sprites/prompts.md)
test/       node --test unit tests
```

Rules:

- The game draws on a 480x270 pixel screen, scaled up with `image-rendering: pixelated`.
- World coordinates: `x` = along the street, `y` = depth on the street (bigger = closer to the camera), `z` = height off the ground (jumps). Draw order is sorted by `y`.
- Fixed time step (1/60 s), so fights behave the same on slow and fast phones.
- Data files never touch the DOM, so all game rules are unit-testable in Node.

## 2. Stats, combat, progression

Stats (same set for Mike, enemies, bosses): `hp`, `power`, `defense`, `atkSpeed` (1.0 = normal), `speed` (pixels/second), `crit` (0..1 chance).

- Final stats: `computeStats({ base, growth, level, gear, gym })` = base + growth x (level - 1) + gear + gym. Adding a stat = add it to `STAT_KEYS`.
- Damage: `power x move strength (x1.5 on crit) - defense`, minimum 1.
  Example: power 10, kick strength 1.5, defense 3, no crit = 12.
- Moves are data: `anim`, `strength`, `activeFrames`, `hitbox`, `knockback`, `knockdown`, `cooldown`, optional `next` (combo), `dash`, `leap`.
- Mike: punch x3 combo (3rd hit knocks down), kick (pushes back), jump + punch/kick = jump kick.
- A hit only lands when both fighters are within `DEPTH_BAND` (10 px) on the street. Stepping up/down dodges.
- Fairness: max 2 enemies attack at once (attack tokens), every enemy attack shows a wind-up warning, Mike is invulnerable for 1 s after getting up.
- XP: `xpToNext(level) = round(40 x level^1.5)`. Leveling raises stats by Mike's `growth` and heals 30%.
- Drops: each enemy has a drop table `{ item, chance }`. Bosses have chance 1 entries. Duplicates become bonus XP.
- Bosses: ~8x a thug's HP, `poise` (needs several hits before flinching), a special move, and an enrage below 50% HP (faster, specials more often).
- Gym: Sweat Points = total run XP / 10 (+ bonus for winning). Each upgrade rank costs more (`baseCost x costGrowth^rank`).

## 3. Sprites

All sheets: PNG, transparent background, fixed grid, one animation per row, characters face right, feet on the bottom line of every cell, horizontally centered. Full prompts and file paths: [docs/sprites/prompts.md](../../sprites/prompts.md).

| Sheet | Cell | Rows (frames) |
|---|---|---|
| Mike base | 96x96 | idle 4, walk 6, punch combo 9, kick 4, jump 3, jump kick 2, hurt 2, knocked down 3, get up 3, victory 2 |
| Gear layer (x4) | 96x96 | exact same grid as Mike base, only the item drawn |
| Thug, Runner | 96x96 | idle 4, walk 6, attack 4, hurt 2, knocked down 3, get up 3 |
| Boss (x3) | 128x128 | same 6 rows + special 6, enrage 6 |
| People NPCs (x3) | 96x96 | idle 4, flee 6 |
| Cat, Rat | 32x32 | idle 4, flee 6 |
| Item icons (x4) | 24x24 | single image |
| Hit spark | 32x32 | 3 frames |
| Level backgrounds (x3) | far 960x270, near 1440x270 | single image each |
| Gym background | 480x270 | single image |

The joystick, buttons, bars and menus are drawn in code.

## 4. Future-proofing, publishing, testing

- Skills (phase 2): a skill is a new move in `data/moves.js` plus `moveset.skills.skill1 = "moveId"` and an `unlock` rule. The input layer already has hidden `skill1` / `skill2` buttons.
- Gear with unique art: item `layer` points to its own sheet; the renderer stacks layers in `gearDrawOrder`.
- New level: add `data/levels/levelN.js`, add it to `levels` in the registry. New enemy: add a file in `data/enemies/`, register it, reference it from a level's waves. The registry test fails if any id reference is broken.
- Publishing: GitHub Pages (repo must be public or on a paid GitHub plan) and an itch.io HTML5 zip built by `scripts/build-itch.sh`.
- Testing: `npm test` (runs `node --test`, no installs) for stats, damage, XP, drops, inventory, fighter states, run state, registry integrity. Manual check on iPhone Safari and Android Chrome.

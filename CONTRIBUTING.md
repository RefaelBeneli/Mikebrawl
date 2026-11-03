# Contributing to Mikebrawl

Everything a contributor (or their coding agent) needs to change the game: how it works, how to add content, art and sound, and how to ship.
Read sections 1–4 once. After that, jump to the recipe you need in section 5.

---

## 1. The 2-minute overview

- **What it is:** a mobile-first, side-scrolling beat 'em up in the browser. Mike walks home from the gym through Haifa (Hadar → Upper Carmel → Romema) and fights criminals and bosses on the way.
- **Tech:** plain JavaScript ES modules, an HTML canvas, WebAudio. **No build step. No npm dependencies. Do not add any.**
- **Content is data.** Levels, enemies, bosses, NPCs, items, moves, sounds and music are plain objects in `data/`. The engine reads them. Most contributions never touch `src/`.
- **Art and sound are optional files.** Every sprite and sound has a placeholder made in code. Drop a file at the right path and the game uses it; delete it and the placeholder comes back. Nothing crashes on a missing file.
- **Live site:** <https://refaelbeneli.github.io/Mikebrawl/>. Every push to `main` runs the tests and deploys.

## 2. Setup and daily commands

You need: Node 22+ (tests only), Python 3 (local web server), a browser. Nothing to install.

```sh
npm start     # serves the game on http://localhost:8080 (python3 -m http.server 8080)
npm test      # runs every test in test/ (node --test)
```

| Page | What it is for |
|---|---|
| <http://localhost:8080> | The game. Desktop keys: WASD / arrows move, J punch, K kick, Space jump, B bag, M mute, Enter confirm, Esc back. |
| <http://localhost:8080/tools/sprite-check.html> | Checks every sprite/background file: ok, missing, or a warning such as "found 5 poses, needs 6". Shows the processed result with a yellow floor line. |

Test on a phone: same Wi-Fi, open `http://<your computer's IP>:8080`, hold the phone sideways.

**After any change:** run `npm test` and play the part you changed. Tests check that every reference between data files is valid, so a typo in an id fails fast.

## 3. Project map

```text
index.html, manifest.json, icon.svg   page shell + installable app (PWA)
sw.js                                  offline cache (bump CACHE on every release!)
src/main.js                            boots the game
src/engine/   generic engine: renderer, input (touch + keys), loop, scenes,
              assets.js + spriteProcess.js (turns raw art into frames),
              audio.js (sound player), chiptune.js (code-made music)
src/core/     game rules, no drawing: fighter, combat, ai, stats, progression, inventory, npc, animation
src/game/     scenes and drawing: title, gym, level, equip, game over, HUD, draw.js, save.js, runState.js
data/         ALL content (see section 4)
assets/       art and audio files (all optional)
docs/         guides: sprites/GUIDE.md, sprites/prompts.md, audio/*, design spec
tools/        sprite-check.html
test/         node --test suites
scripts/      build-itch.sh (builds dist/ for itch.io and GitHub Pages)
```

### How a run works

1. **Title** → **Gym** (spend Sweat Points on permanent upgrades) → **Level 1 → 2 → 3** → **Game over / win**.
2. In a level, Mike walks right. When he reaches a wave's `at` position, the camera locks and that wave's enemies spawn (one every 0.7 s). Beat them all and the camera unlocks.
3. After the last wave, walking to 380 px before the level end starts the boss fight (boss music, banner, optional minions).
4. Beat the boss → "STAGE CLEAR" → heal 25% → next level. Lose all HP → run ends.
5. XP levels Mike up during the run. Enemies drop items (gear) that change stats. At the end of a run, XP turns into Sweat Points (`floor(totalXp / 10)` + 10 per level cleared + 40 for a win) for the gym.
6. Progress saves in `localStorage`: `mikebrawl.meta.v1` (sweat, gym ranks, runs, wins) and `mikebrawl.run.v1` (the run as it was at the start of the current level; "Continue" restarts that level).

### World coordinates (needed for placing things)

- The screen is **270 px tall** and 480–720 px wide (it adapts to the device).
- `x` = distance along the street from the level start (0 → `level.length`).
- `y` = depth on screen. Buildings end at **150** (`SIDEWALK_TOP`). Sidewalk is 150–180. Fighters walk on the street, **180–262** (`STREET_TOP`–`STREET_BOTTOM`).
- Fighters only hit each other when their `y` is within 10 px (`DEPTH_BAND`).

### Combat math (for balancing)

- Damage = `attacker.power × move.strength × (1.5 if crit) − defender.defense`, at least 1.
- Stats: `hp`, `power`, `defense`, `atkSpeed` (1 = normal; cooldowns divide by it; min 0.3), `speed` (px/s), `crit` (chance 0–1, max 0.75).
- XP to next level = `round(40 × level^1.5)`. Mike gains `growth` stats each level.
- Levels can scale enemies: `enemyScale` multiplies enemy `hp`, `power`, `defense` (bosses are not scaled).

## 4. Data model reference

**`data/registry.js` is the one list of all content.** To add anything: create its file, import it in the registry, add it to the right list. Ids must be unique (lowercase, `snake_case`); the id is also the folder name for its art.

### 4.1 Fighters (hero, enemies, bosses)

```js
{
  id: "thug",                       // unique; art lives in assets/sprites/thug/
  name: "Thug",                     // shown in banners
  boss: true,                       // bosses only: hides the small health bar (bosses get the big one)
  sprite: {
    cellW: 96, cellH: 96,           // frame box in game pixels. 96 for people, 128 for bosses, 32 for animals
    anims: HUMANOID_ANIMS,          // animation set from data/anims.js (see 4.4)
    placeholder: "#8a4b2a",         // colour of the placeholder figure when art is missing
    height: 18,                     // optional: force drawn height in px (else body.h × 1.1)
  },
  body: { w: 32, h: 76 },           // hurt box in px; also sets drawn size (height ≈ body.h × 1.1)
  stats: { hp: 60, power: 11, defense: 2, atkSpeed: 0.8, speed: 40, crit: 0.05 },
  poise: 3,                         // optional: hits needed before it flinches (default 1). Bosses use 2–3
  ai: { ... },                      // enemies/bosses only (see below)
  moveset: { ground: { punch: "thug_haymaker" } },   // button -> move id
  moves: [ ... ],                   // enemy/boss moves live in the same file (see 4.3)
  xp: 15,                           // XP given to Mike on KO
  drops: [{ item: "fight_gloves", chance: 0.12 }],   // each rolls independently
  sounds: { taunt: "thug_taunt", hurt: "thug_hurt", ko: "thug_ko" },  // sound ids from data/sounds.js
}
```

**Sound hooks the game calls** (all optional): hero `jump`, `hurt`, `ko`, `victory`; enemy `taunt` (50% chance on spawn), `hurt`, `ko`; boss `intro` (fight start), `hurt`, `ko`. A boss's enrage sound is the `sound` field on its enrage move.

**AI types** (`src/core/ai.js`):

| `ai.type` | Behaviour | Fields |
|---|---|---|
| `brawler` | Walks into range, winds up (flashes), attacks, waits `cooldown`. Max 2 enemies attack at once; the rest circle. | `range`, `windup`, `cooldown`, optional `waitDistance` |
| `rusher` | Like brawler, then backs off for `retreat` seconds after each attack. | + `retreat` |
| `boss` | Brawler that never waits its turn, plus a special move every `special.every` s, and an enrage below `enrage.at` HP. | `special: { button, every, windup, minRange, maxRange }`, `enrage: { at, bonus: {stats}, specialEvery }` |

Bosses map their special and enrage in `moveset.skills`, e.g. `skills: { skill1: "tony_charge", enrage: "tony_enrage" }`. The enrage move is an animation-only move (`strength: 0, activeFrames: []`).

A new AI type = a new function in `behaviors` in `src/core/ai.js` (the registry test fails if a fighter names an unknown type).

**The hero.** Only Mike is playable (`data/heroes/mike.js`). He also has `growth` (stats per level) and `gearDrawOrder` (gear slots, drawn in that order). Adding a second playable hero needs engine work (hero selection, gear art per hero), not just data.

### 4.2 Levels (`data/levels/levelN.js`)

```js
{
  id: "level1",                     // art folder: assets/backgrounds/level1/
  name: "Hadar",
  length: 1440,                     // street length in px (screen is 480–720 wide)
  music: "level1",                  // song id from data/music.js
  bossMusic: "boss",
  background: {
    landmarks: { start: "gym" },    // optional one-off panels: start (shown once at x=0), end (flush with level end)
    palette: { sky: [top, bottom], far, buildings: [4 colours], window, sidewalk, line, street },  // placeholder art colours
  },
  enemyScale: 1,                    // multiplies enemy hp/power/defense (1, 1.4, 1.9 across the 3 levels)
  waves: [{ at: 260, enemies: ["runner", "thug"] }],   // at = Mike's x that starts the wave; ids from enemies
  boss: "big_tony",                 // boss id (omit for no boss: the level ends after the last wave)
  bossMinions: ["thug"],            // enemies that join the boss fight
  npcs: [{ id: "cat", x: 150, y: 176 }],               // background NPCs: x along the street, y depth (see 3)
}
```

Rules: waves in increasing `at`, all before `length − 380` (where the boss starts). Levels play in the order of the `levels` list in the registry.

### 4.3 Moves

Mike's moves are in `data/moves.js`; enemy/boss moves are in their own file's `moves`. A move:

| Field | Meaning |
|---|---|
| `id` | unique across all content |
| `anim` | animation name on that fighter (`attack`, `special`, `punch1`…) |
| `strength` | damage multiplier |
| `activeFrames` | animation frames (0-based) where the hit box is live |
| `hitbox` | `{ x, y, w, h }` relative to the attacker's feet, facing right: `x` forward, `y` height above ground |
| `knockback` | push distance |
| `knockdown` | true = knocks the target down |
| `heavy` | true = heavy hit sound, bigger spark, longer hit-pause |
| `next` | combo: the next move if the same button is pressed again in time |
| `cooldown` | seconds before the next attack (divided by `atkSpeed`) |
| `aerial` | can be used while jumping |
| `dash` | slides forward at this speed during the move |
| `leap` | `{ vz, vx }` jumps forward during the move |
| `sound` | sound id played when the move starts |

Every swing also plays `whoosh`; every hit plays `hit_light` or `hit_heavy`.

### 4.4 Animations (`data/anims.js`)

Animations are shared sets: `MIKE_ANIMS`, `HUMANOID_ANIMS` (enemies), `BOSS_ANIMS` (= humanoid + `special` + `enrage`), `PERSON_ANIMS`, `ANIMAL_ANIMS`.

```js
attack: { frames: 4, fps: 8, art: art("attack", 0, 0, 1, 2) },
```

- `frames`/`fps` set game timing. `art("attack", 0, 0, 1, 2)` = use the strip `attack.png` and show pose 0, 0, 1, 2 on frames 0–3.
- The number of poses a strip must contain = highest pose index + 1. **That's the number of poses the artist draws.**
- Every character needs an `idle` animation: its idle strip sets the character's size; all its other strips are scaled to match.
- If you change an anim set, update `docs/sprites/GUIDE.md`, `docs/sprites/prompts.md`, and the strip-count test in `test/registry.test.js`.

### 4.5 NPCs (`data/npcs/people.js`, `animals.js`)

Background characters that cannot be hit. They idle and run away:

- People: `flee: { from: "enemies", radius, speed }` — run when an enemy comes within `radius`.
- Animals: `flee: { from: "hero", radius, speed }` — scatter when Mike walks close.
- `sounds: { flee: "<sound id>" }` plays when they start fleeing.

Use the helpers in those files: `person(id, name, placeholderColour, flee, sound)` / `animal(...)`.

### 4.6 Items (gear) (`data/items/<id>.js`)

```js
{ id: "fight_gloves", name: "Fight Gloves", slot: "hands", description: "Red MMA gloves. Hit harder.",
  stats: { power: 4, crit: 0.04 }, icon: "assets/sprites/items/fight_gloves_icon.png", placeholder: "#d02020" }
```

Slots: `head`, `body`, `hands`, `feet` (one item each). Picking up an item equips it if the slot is empty, else it goes to the bag (B). A duplicate gives 20 XP instead. Items only drop from enemies' `drops`.

### 4.7 Gym upgrades (`data/gym.js`)

`{ id, stat, label, amount, baseCost, costGrowth, maxRank }`. Each rank adds `amount` to `stat`. Next rank costs `baseCost × costGrowth^rank` Sweat Points.

## 5. Recipes

Each recipe lists every file to touch. Do them in order. Finish with `npm test` and play it.

### 5.1 Add a level

1. Copy `data/levels/level3.js` to `data/levels/level4.js`. Change `id`, `name`, `waves`, `boss`, `npcs`, `palette`, `enemyScale`, `music`.
2. In `data/registry.js`: `import level4 from "./levels/level4.js";` and add it to `levels`.
3. Music: add a song for `music` (see 5.8), or reuse an existing id.
4. Art (optional): `assets/backgrounds/level4/` with `far.png`, `near1.png`…`near4.png`, plus any landmark files you named (see 6.4).
5. `npm test`, then play to it (or temporarily put it first in `levels` while testing, and put it back after).

**Note:** "Win" means clearing every level in the list, so adding a level makes runs longer.

### 5.2 Add an enemy

1. Copy `data/enemies/thug.js` to `data/enemies/<id>.js`. Set `id`, `name`, `placeholder`, `body`, `stats`, `ai`, `moves` (rename move ids, e.g. `<id>_jab`), `xp`, `drops`, `sounds`.
2. Registry: import it and add it to `enemies`.
3. Use it in a level's `waves` (and/or `bossMinions`).
4. Sounds: add `<id>_taunt`, `<id>_hurt`, `<id>_ko` to `data/sounds.js` (see 5.7), or point `sounds` at existing ids.
5. Art: `assets/sprites/<id>/idle.png` (2 poses), `walk` (4), `attack` (3), `fall` (5). See section 6.
6. `npm test`, check `tools/sprite-check.html`, play.

### 5.3 Add a boss

1. Copy `data/bosses/big_tony.js` to `data/bosses/<id>.js`. Keep `boss: true` and `anims: BOSS_ANIMS`. Rename the 3 moves (`<id>_attack`, `<id>_special`, `<id>_enrage`) and update `moveset` to match.
2. Tune: roughly 8× a thug's HP, `poise` 2–3, `special.every` 6–7 s, `enrage.at: 0.5`. Give it a guaranteed drop (`chance: 1`).
3. Registry: import it and add it to `bosses`.
4. Set `boss: "<id>"` in a level.
5. Sounds: `<id>_intro`, `<id>_hurt`, `<id>_enrage` (on the enrage move's `sound`), `<id>_ko`.
6. Art: `idle` (2), `walk` (4), `attack` (3), `fall` (5), `special` (4), `enrage` (2).

### 5.4 Add an NPC

1. Add one line to `data/npcs/people.js` (flees from enemies) or `data/npcs/animals.js` (flees from Mike), using the helper.
2. Place it in a level's `npcs`: `{ id, x, y }`. People stand on the sidewalk, `y` ≈ 164–172. Cats ≈ 176. Rats can be on the street, ≈ 240–250.
3. Add its flee sound (5.7) or reuse one.
4. Art: `assets/sprites/<id>/idle.png` (2 poses), `flee.png` (4).

### 5.5 Add an item

1. Copy `data/items/fight_gloves.js`. Set `id`, `name`, `slot`, `description`, `stats`, `icon`, `placeholder`.
2. Registry: import it and add it to `items`.
3. Add it to one or more enemies' `drops`.
4. Art: the icon `assets/sprites/items/<id>_icon.png`, and gear strips `assets/sprites/gear/<id>/` with the **same 7 file names as Mike** (`idle`, `walk`, `punch`, `kick`, `jump`, `fall`, `victory`), each with the item only, in the same pose positions as Mike's strip.

### 5.6 Add a move or skill for Mike

1. Add the move to `data/moves.js`.
2. Map it in `data/heroes/mike.js` `moveset` (`ground`, `air` or `skills`).
3. If it needs a new animation, add it to `MIKE_ANIMS` and draw the poses (update the sprite guide and the strip test).
4. For a new on-screen button (skills), show it with `input.setButtonVisible("skill1", true)`.

### 5.7 Add a sound effect

All in `data/sounds.js`:

1. **Always** add a code-made fallback to `defs` (the game plays it when no file exists, so it is required):
   ```js
   ninja_hurt: { synth: voice(380, 260, 0.13), jitter: 0.08 },
   ```
   Helpers: `tone(wave, fromHz, toHz, dur, vol, delay, extra)`, `noise(dur, vol, freqHz, filterType, delay, extra)`, `notes(wave, [[hz, dur], …], vol)`, `voice(fromHz, toHz, dur, vol, delay)`, `impact(thumpHz, vol)`, `whoosh(dur, vol)`. `jitter` randomizes pitch per play (0.05–0.1 is good).
2. **Optional real file:** put WAV files in `assets/audio/sfx/` and list them in `recorded`:
   ```js
   ninja_hurt: { files: variants("ninja_hurt", 2), volume: 0.35 },   // ninja_hurt_1.wav, ninja_hurt_2.wav
   ```
   Several files = one plays at random. Voice lines go in the `voices(...)` block, which sets the shared voice volume.
3. Point the content at it (`sounds: { hurt: "ninja_hurt" }` or a move's `sound`).
4. The test fails if a used id has no entry, or if a listed file is missing.

### 5.8 Add or change music

All in `data/music.js`:

1. **Always** add a code-made song to `songs` (the fallback):
   ```js
   level4: { bpm: 130, tracks: { lead: lead(bars("C5 - E5 - G5 - - - …")), bass: bass(bars(...)), drums: drums(beat(...)) } },
   ```
   - Patterns are 16th-note steps. A token is a note (`A4`, `F#5`, `Bb3`), a chord (`C4+E4+G4`), `.` (rest) or `-` (hold). `|` separates bars; **every bar is exactly 16 steps** (the test checks).
   - Drums: `k` kick, `s` snare, `h` closed hat, `o` open hat (combine: `ks`).
   - Helpers: `lead`, `chords`, `pad`, `arp`, `bass`, `drums`, `bars`, `beat(main, fill, totalBars)`, bass shapes `pump`/`funk`/`drive`/`gallop(root)`, `walk(a,b,c,d)`, `hold(chord)`, `stabs(chord)`, `upDown(chord)`.
   - `loop: false` for one-shot jingles.
2. **Optional MP3:** save it as `assets/audio/music/<id>.mp3`. Then add a line to `files` to match loudness and loop cleanly:
   ```js
   level4: { volume: 0.5, loopStart: 4.0, loopEnd: 92.5 },   // seconds
   ```
   - `volume`: pick so the song sits about as loud as the others (current range 0.28–0.94).
   - `loopStart`/`loopEnd`: the game plays from 0 once, then repeats `loopStart`→`loopEnd`. Set `loopStart` after any fade-in, `loopEnd` before any fade-out or trailing silence (find them in a free editor like Audacity, or ask your agent to measure them).
3. Use the id in a level (`music` / `bossMusic`).

**Music style (decided, don't change without the owner):** 16-bit 1990s arcade beat 'em up. Western harmony only: major, natural minor, dorian. **No Middle Eastern or Arabic styles or scales** (no harmonic minor, no Phrygian). The test blocks the notes G#, Ab, Db, C# and Gb in every song except `boss`.

## 6. Art (sprites and backgrounds)

Full walkthrough: [`docs/sprites/GUIDE.md`](docs/sprites/GUIDE.md). Ready prompts: [`docs/sprites/prompts.md`](docs/sprites/prompts.md). Short version:

### 6.1 The format (the one rule that matters)

- Every sprite file is **one PNG with one row of poses on flat pink `#FF00FF`**.
- Poses can be any size and spacing, but **must not touch each other**.
- The game does the rest at load time: removes the pink, finds each pose, sizes it, lines up the feet, and cuts it into frames.
- File path: `assets/sprites/<character id>/<strip name>.png`, lowercase, exactly the names from the anim set (4.4).
- Size: about **320 px tall** is plenty (big files slow down loading). Backgrounds about 300 px tall; the gym 400.
- No pink or purple on the character itself (it would be cut out).

### 6.2 Strip names and pose counts

| Who | Files (poses) |
|---|---|
| Mike | idle (2), walk (4), punch (6), kick (3), jump (3), fall (5), victory (1) |
| Enemies | idle (2), walk (4), attack (3), fall (5) |
| Bosses | idle (2), walk (4), attack (3), fall (5), special (4), enrage (2) |
| People / animals | idle (2), flee (4) |
| Gear | the same 7 names as Mike, item only, same positions as Mike's poses |
| Item icon | `assets/sprites/items/<item>_icon.png`, one item |
| Hit spark | `assets/sprites/fx/hit_spark.png`, 3 bursts |

Fall poses in order: 1 hurt (flinch), 2 falling, 3 lying on the ground, 4–5 getting up. If a pose is drawn above another, the upper one counts first.

### 6.3 Making it with an AI image tool (Gemini / Nano Banana)

1. Make one **anchor** image per character (one clean full-body picture). Attach it to every prompt so all poses look like the same person.
2. For each strip: new chat, attach the anchor, paste the prompt, check the pose count, gaps, whole body, pink background.
3. Each boss needs its own idle/walk/fall strips made from that boss's anchor.
4. Gear: attach Mike's finished strip and ask to keep only the item in the same place (two steps if needed: put it on, then remove everything else).

### 6.4 Backgrounds (`assets/backgrounds/<level id>/`)

- `far.png`: a wide skyline that repeats left to right (no pink needed).
- `near1.png` … `near4.png`: one building front each, with a **pink sky** (it is removed so the skyline shows behind). They repeat in order along the street.
- Landmarks: one-off panels named in `background.landmarks` (`start` shows once at the start, `end` sits flush with the level end), pink sky like the near panels. Today: `level1/gym.png` and `level3/home.png`.
- `assets/backgrounds/gym.png`: the gym menu screen (a normal picture).
- Setting: real Haifa streets (Hadar = downtown, Upper Carmel = green and leafy, Romema = residential, near Mike's home).

### 6.5 Check it

Open `tools/sprite-check.html`. Every file must say **ok**. Fix warnings like "found 5 poses, needs 6" (two poses touch → regenerate with wider gaps). Feet must touch the yellow line; gear must sit on Mike.

## 7. Audio files

| Kind | Format | Where | Source used today |
|---|---|---|---|
| Music | MP3, any length | `assets/audio/music/<id>.mp3` | Generated with Gemini "Create music" ([guide](docs/audio/gemini.html)) |
| Hits, menus, items | WAV (16-bit, mono, 44.1 kHz) | `assets/audio/sfx/<id>_<n>.wav` | [Kenney Impact Sounds](https://kenney.nl/assets/impact-sounds) + [Interface Sounds](https://kenney.nl/assets/interface-sounds) (CC0) |
| Voices | WAV (same) | `assets/audio/sfx/<id>_<n>.wav` | Recorded on a phone ([guide](docs/audio/voice-memos.html)) |

- **Licences:** only use sounds you made yourself or that are **CC0** (Kenney, Freesound with the CC0 filter, OpenGameArt CC0, Pixabay). Note the source in your PR.
- **Why WAV for effects:** they start with no delay (compressed formats add a short silence at the start) and play in every browser. Short effects stay small (~30 KB each).
- **Cutting a recording:** record each character as one clip with ~2 s of silence between sounds, then cut at the silences (Audacity "Label sounds" → "Export multiple", or ask your agent). Trim the record/stop taps. Export each piece as WAV.
- **Converting:** Audacity (any OS) exports WAV. On macOS: `afconvert -f WAVE -d LEI16@44100 -c 1 in.ogg out.wav` (reads OGG, M4A, MP3).
- **Loudness:** normalize files to a peak around −1 dB. Shouts that hit the maximum sound crunchy; record a bit further from the mic. Then set `volume` in `data/sounds.js` so they sit with the others (hits 0.55–0.65, voices 0.35, menus 0.4–0.9).
- Sounds with no good file stay code-made: today `whoosh`, `mike_jump`, `level_up`, `boss_warning`, `mike_victory`, `cat_hiss`, `rat_squeak`.

## 8. Code conventions

- ES modules, 2-space indent, double quotes, semicolons, trailing commas, lines up to ~160 characters.
- Small pure functions in `src/core/` (no DOM, no canvas): they are what the tests cover. Drawing and scenes live in `src/game/`.
- Prefer data over code: if something can be a field in `data/`, make it one.
- Named constants instead of magic numbers (see the top of `levelScene.js`).
- Comments only for things the code can't say (a rule, a unit, a gotcha).
- **No new dependencies** (no npm packages, no CDN scripts). **No network calls** to outside services from the game. No `eval`.
- Add or update tests in `test/` for rule changes. Tests use `node:test` and `node:assert/strict`.

## 9. Shipping a change

1. Branch from `main`: `git switch -c feat/<short-name>` (or `fix/…`, `docs/…`).
2. Make the change. Run `npm test`. Play it locally (and on a phone if it touches controls or layout).
3. **Bump `CACHE` in `sw.js`** (`mikebrawl-vN` → `vN+1`) if you changed any file players download. Installed copies only update when it changes, and files under `assets/` are served from the cache until it changes.
4. Commit with a short conventional message: `feat(level): add Bat Galim level`, `fix(audio): …`, `docs: …`.
   Use your GitHub no-reply email (Settings → Emails), not a personal one: the repo is public.
5. Open a PR to `main`. Keep it focused: one topic per PR, and no more than about 8–9 changed code files (art/audio files don't count, list them in the description). In the description, say what changed, how you tested, and the source/licence of any new art or audio.
6. When merged, GitHub Actions runs the tests, builds `dist/site/` (`scripts/build-itch.sh`), and deploys to GitHub Pages in about a minute. Check the live site.

itch.io build: `bash scripts/build-itch.sh` → upload `dist/mikebrawl-itch.zip` (see README).

## 10. Checklist before you open a PR

- [ ] `npm test` passes.
- [ ] New ids are unique, lowercase `snake_case`, and registered in `data/registry.js`.
- [ ] Every new sound id has a code-made `synth` fallback; every new song has a code-made pattern.
- [ ] New art passes `tools/sprite-check.html` (all **ok**).
- [ ] New audio is yours or CC0; source noted in the PR.
- [ ] Music follows the style rule (no Middle Eastern scales).
- [ ] `CACHE` in `sw.js` bumped if players get new files.
- [ ] Docs updated if you changed a format (anim sets → sprite guide + prompts; new folders → this file).
- [ ] Played it: the new content shows up and nothing else broke.

## 11. Troubleshooting

| Problem | Cause / fix |
|---|---|
| Test: `missing move …` / `missing enemy …` / `missing sound …` | An id is misspelled or not registered in `data/registry.js` / `data/sounds.js`. |
| Test: `bar N` has the wrong step count | A music bar isn't exactly 16 tokens. Count rests and holds too. |
| Placeholder still shows after adding art | Wrong path or name (case matters), or the browser cached the old file: hard-reload, or bump `CACHE` in `sw.js`. |
| "found 5 poses, needs 6" | Two poses touch. Regenerate with wider gaps. |
| Pink fringe around a character | The character has pink/purple in it. Regenerate with "no pink or purple on the character". |
| Character too big/small | Only the `idle` strip sets size, from `body.h`. Change `body.h` (or `sprite.height`), not the image. |
| No sound at all | Browsers start audio only after the first tap or key press. Check M (mute) and the volume sliders. |
| Song jumps or goes silent when it loops | Adjust `loopStart` / `loopEnd` in `data/music.js`. |
| Live site shows the old version | Close the app fully and reopen. If it persists, `CACHE` in `sw.js` wasn't bumped. |

## 12. More reading

- Design spec: [`docs/superpowers/specs/2026-10-30-mikebrawl-design.md`](docs/superpowers/specs/2026-10-30-mikebrawl-design.md)
- Sprites: [`docs/sprites/GUIDE.md`](docs/sprites/GUIDE.md), [`docs/sprites/prompts.md`](docs/sprites/prompts.md)
- Audio: [`docs/audio/gemini.html`](docs/audio/gemini.html) (music with Gemini), [`docs/audio/voice-memos.html`](docs/audio/voice-memos.html) (record voices), [`docs/audio/prompts.md`](docs/audio/prompts.md) (free sound sources)

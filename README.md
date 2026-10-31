# Mikebrawl

Mike walks home from the gym. Criminals block the street. A mobile-first, Golden Axe-style beat 'em up that runs in the browser (iOS Safari, Android Chrome, desktop).

Plain JavaScript modules. No build step, no npm dependencies.

## Run it

```sh
npm start            # serves on http://localhost:8080
```

Open the URL on your computer, or on your phone (same Wi-Fi, use your computer's IP). Hold the phone sideways.

Desktop keys: WASD / arrows move, J punch, K kick, Space jump, B bag, M mute, Enter confirm, Esc back.

## Test it

```sh
npm test             # node --test
```

## Add content

Everything is data in `data/`, wired together in `data/registry.js`. The registry test checks every reference.

| Add a... | Do this |
|---|---|
| Level | Copy `data/levels/level1.js`, change waves/boss/npcs/palette, add it to `levels` in the registry. |
| Enemy | Copy `data/enemies/thug.js`, pick an AI behavior (`brawler`, `rusher`), register it. |
| Boss | Copy `data/bosses/big_tony.js` (special move, enrage, poise), register it, set `boss` in a level. |
| Item | Copy `data/items/fight_gloves.js` (one item per slot: head, body, hands, feet), register it, add it to an enemy's `drops`. |
| NPC | Add an entry in `data/npcs/people.js` or `animals.js`, then place it in a level's `npcs`. |
| Gym upgrade | Add a row in `data/gym.js`. |
| Skill (phase 2) | Add a move in `data/moves.js` and map it in Mike's `moveset.skills`; show the button with `input.setButtonVisible("skill1", true)`. |

## Art and sound

Every sprite and sound has a placeholder drawn or synthesized in code. Drop real files at the paths below and they are used automatically:

- Sprites: walkthrough in `docs/sprites/GUIDE.md`, Nano Banana prompts in `docs/sprites/prompts.md`. Each file is a row of poses on flat pink; the game cuts, sizes and aligns them. Check them at `tools/sprite-check.html`.
- Audio: built-in code-made music and sounds; optional free MP3 walkthrough in `docs/audio/prompts.md` (MP3 files go in `assets/audio/music/` and `assets/audio/sfx/`).

## Publish

```sh
bash scripts/build-itch.sh   # creates dist/mikebrawl-itch.zip and dist/site/
```

- **itch.io:** new project, kind "HTML", upload `dist/mikebrawl-itch.zip`, tick "This file will be played in the browser", set the viewport to 960 x 540 and enable "Mobile friendly" (landscape) and the fullscreen button.
- **GitHub Pages:** `.github/workflows/pages.yml` runs the tests and deploys on every push to `main`. In repo Settings > Pages, set the source to "GitHub Actions". Pages on a private repo needs a paid GitHub plan; otherwise make the repo public.
- **Install on a phone:** open the site, then "Add to Home Screen" (iOS Share menu, or the Android Chrome menu). It works offline after the first visit. iOS needs a PNG home-screen icon to look sharp: add `icon-180.png` and point the `apple-touch-icon` link in `index.html` at it.

When you ship an update, bump `CACHE` in `sw.js` so installed copies pick it up.

Design doc: `docs/superpowers/specs/2026-10-30-mikebrawl-design.md`.

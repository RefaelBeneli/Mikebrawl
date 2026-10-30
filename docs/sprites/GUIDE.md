# Sprite guide (Nano Banana)

You make the pictures. The game does the rest: it removes the pink background, finds each pose, sizes it, and lines up the feet.

Prompts for every file: [prompts.md](prompts.md).

## How it works

- Every image is **one row of poses on a flat pink (#FF00FF) background**.
- Example: `mike/walk.png` is 4 walking poses side by side. The game cuts it into 4 frames.
- Poses don't need to be the same size or evenly spaced. They just must **not touch each other**.
- Any missing file is fine: the game draws a placeholder until you add it.

## 1. Make the anchor images (once per character)

An anchor is one clean picture of the character. You attach it to every prompt so all poses look like the same person.

1. Open Gemini and pick image generation (Nano Banana).
2. For Mike, do two steps. First make a big face portrait from his photos. Then make the full body from that portrait. A small full-body figure loses the face.
3. Regenerate until you love it. Save it on your computer (not in the game folder), e.g. `anchors/mike.png`.
4. Do the same for each enemy, boss and NPC (their anchor prompts need no photos).

## 2. Make the pose strips

For each file in [prompts.md](prompts.md):

1. Start a new chat. Attach the character's anchor image.
2. Paste the prompt.
3. Check the result: right number of poses, gaps between them, whole body visible, pink background.
4. Download it, rename it exactly as listed, and put it in the listed folder.

Example: the Mike walk prompt → save as `assets/sprites/mike/walk.png`.

## 3. Make the gear (items Mike wears)

Gear is drawn on top of Mike, so it needs one image per Mike strip (7 per item).

1. Attach the finished Mike strip, e.g. `assets/sprites/mike/punch.png`.
2. Paste the gear prompt for that item.
3. The result must keep **only the item, in the exact same place**, on pink.
4. Save as `assets/sprites/gear/<item>/<same file name>.png`, e.g. `gear/fight_gloves/punch.png`.

If it moves things around, do it in two steps: first "put the gloves on him", then "remove everything except the gloves".

## 4. Backgrounds, icons, effects

- **Far layer:** a wide skyline that loops left to right. No pink needed.
- **Near panels (4 per level):** one building front each, with a **pink sky**. The game removes the sky so the skyline shows behind.
- **Icons:** one item on pink. **Hit spark:** 3 bursts on pink. **Gym:** a normal picture.

## 5. Check your files

1. In the project folder run: `python3 -m http.server 8080`
2. Open <http://localhost:8080/tools/sprite-check.html>
3. Each file shows **ok**, **missing**, or an orange warning (for example "found 5 poses, needs 6").
4. Look at the pictures: feet should touch the yellow line, gear should sit on Mike.
5. Then play: <http://localhost:8080>

## 6. Put it in the live game

Tell me "publish the sprites". I'll commit the files, update the offline cache, and push. The site updates in about a minute.

## Fixing common problems

| Problem | Fix |
| --- | --- |
| "found 5 poses, needs 6" | Two poses touch. Regenerate and add "with wide empty gaps between poses". |
| Pink edges around the character | Character has pink or purple in it. Add "no pink or purple on the character". |
| A pose is cut off | Add "whole body visible, nothing cut off at the edges". |
| Character too small or big | Only the idle image sets the size. Other strips match it automatically. |
| Gear in the wrong place | Use the two-step gear method above. |
| Gemini sparkle mark in the corner | Usually ignored. If the check page shows it, crop it out. |

## Every file the game looks for

| Folder | Files |
| --- | --- |
| `assets/sprites/mike/` | idle (2 poses), walk (4), punch (6), kick (3), jump (3), fall (5), victory (1) |
| `assets/sprites/thug/`, `runner/` | idle (2), walk (4), attack (3), fall (5) |
| `assets/sprites/big_tony/`, `viper/`, `the_chief/` | idle (2), walk (4), attack (3), fall (5), special (4), enrage (2) |
| `assets/sprites/scared_woman/`, `old_man/`, `homeless_man/`, `cat/`, `rat/` | idle (2), flee (4) |
| `assets/sprites/gear/fight_gloves/`, `street_boots/`, `lucky_tank/`, `focus_headband/` | the same 7 names as Mike |
| `assets/sprites/items/` | fight_gloves_icon, street_boots_icon, lucky_tank_icon, focus_headband_icon |
| `assets/sprites/fx/` | hit_spark (3) |
| `assets/backgrounds/level1/`, `level2/`, `level3/` | far, near1, near2, near3, near4 |
| `assets/backgrounds/` | gym |

All files are `.png`. Names are lowercase, exactly as shown.

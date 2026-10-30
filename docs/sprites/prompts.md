# Sprite prompts

One copy-paste prompt per sheet. Save each result at the listed path. The game loads it automatically; until then it draws a placeholder.

## Rules for every sheet

1. **Transparent background** (PNG with alpha). If the generator can't, use one flat color and remove it after.
2. **Fixed grid.** Every frame sits in a same-size cell. One animation per row, frames left to right. Empty cells at the end of short rows stay transparent.
3. **Face right.** The game mirrors for left.
4. **Feet on the bottom line** of every cell and the character horizontally centered. Same character size in every frame.
5. **Real pixel size.** Generators usually output huge "fake pixel" images. Shrink to the exact sheet size with **nearest-neighbor** resizing (no blur), e.g. in Aseprite, Photoshop (Image Size, "Nearest Neighbor"), or `magick in.png -filter point -resize 864x960! out.png`.
6. If a generator can't do a whole sheet, generate one row at a time with the same prompt, then paste rows into the grid.
7. **Mike's likeness:** attach 1-3 photos of the real Mike as a reference image on every Mike and gear prompt. The text description is a backup.

Shared style line (already included in each prompt):
`16-bit retro beat 'em up pixel art like Golden Axe and Streets of Rage, side view, crisp hard pixel edges, limited palette, dark outline, no anti-aliasing, no blur, no text, no watermark, transparent background`

---

## Mike

### Mike base body
- File: `assets/sprites/mike/base.png`
- Sheet: 864x960 (9 columns x 10 rows of 96x96)

```
Pixel art sprite sheet of a single character, Mike, a muscular real-life martial artist. Match the face, hair and beard of the attached reference photo exactly. Short dark messy wavy hair, short full dark beard, thick dark eyebrows, tan olive skin, athletic muscular build. Outfit: shirtless, black jogger pants with a drawstring, plain dark grey sneakers with light soles, bare hands with no wraps and no gloves, no headband. Character faces right. Grid of 96x96 pixel cells, 9 columns, 10 rows, one animation per row, frames left to right, feet on the bottom edge of every cell, character centered and the same size in every frame. Row 1: idle fighting stance breathing, 4 frames. Row 2: walk cycle in guard, 6 frames. Row 3: 3-hit punch combo, 9 frames (jab 3 frames, cross 3 frames, strong uppercut 3 frames). Row 4: front kick, 4 frames (chamber, extend, full extension, retract). Row 5: jump, 3 frames (crouch takeoff, in air knees tucked, landing). Row 6: flying jump kick in mid air, 2 frames. Row 7: getting hit, 2 frames (head snaps back, recoil). Row 8: knocked down, 3 frames (falling backward, hitting the ground, lying flat on back). Row 9: getting up, 3 frames (on one knee, rising, back in stance). Row 10: victory pose fist raised, 2 frames. 16-bit retro beat 'em up pixel art like Golden Axe and Streets of Rage, side view, crisp hard pixel edges, limited palette, dark outline, no anti-aliasing, no blur, no text, no watermark, transparent background.
```

### Gear layers (draw ONLY the item, on Mike's exact grid)

Tip: generate with the Mike base sheet attached as the reference, then erase everything except the item. The item must line up pixel-perfect with Mike's body in every frame.

#### Fight Gloves (hands)
- File: `assets/sprites/gear/fight_gloves.png` - Sheet: 864x960 (same grid as Mike base)

```
Pixel art overlay sprite sheet containing ONLY a pair of red fingerless MMA fight gloves with black wrist straps, positioned exactly on the hands of the attached Mike sprite sheet in every frame. Everything else fully transparent: no body, no face, no clothes, no background. Same grid as the reference: 96x96 cells, 9 columns, 10 rows, same poses frame by frame (idle 4, walk 6, punch combo 9, kick 4, jump 3, jump kick 2, hit 2, knocked down 3, get up 3, victory 2). Character faces right. 16-bit retro beat 'em up pixel art, crisp hard pixel edges, dark outline, no anti-aliasing, no blur, no text, transparent background.
```

#### Street Boots (feet)
- File: `assets/sprites/gear/street_boots.png` - Sheet: 864x960

```
Pixel art overlay sprite sheet containing ONLY a pair of black leather combat boots with dark red laces, covering the feet and ankles exactly where the feet are in the attached Mike sprite sheet, in every frame. Everything else fully transparent: no legs, no body, no background. Same grid as the reference: 96x96 cells, 9 columns, 10 rows, same poses frame by frame (idle 4, walk 6, punch combo 9, kick 4, jump 3, jump kick 2, hit 2, knocked down 3, get up 3, victory 2). Character faces right. 16-bit retro beat 'em up pixel art, crisp hard pixel edges, dark outline, no anti-aliasing, no blur, no text, transparent background.
```

#### Lucky Tank Top (body)
- File: `assets/sprites/gear/lucky_tank.png` - Sheet: 864x960

```
Pixel art overlay sprite sheet containing ONLY a fitted heather grey sleeveless tank top, worn on the torso exactly where the torso is in the attached Mike sprite sheet, stretching and folding with each pose. Arms, head, pants and background fully transparent. Same grid as the reference: 96x96 cells, 9 columns, 10 rows, same poses frame by frame (idle 4, walk 6, punch combo 9, kick 4, jump 3, jump kick 2, hit 2, knocked down 3, get up 3, victory 2). Character faces right. 16-bit retro beat 'em up pixel art, crisp hard pixel edges, dark outline, no anti-aliasing, no blur, no text, transparent background.
```

#### Focus Headband (head)
- File: `assets/sprites/gear/focus_headband.png` - Sheet: 864x960

```
Pixel art overlay sprite sheet containing ONLY a red cloth martial arts headband tied around the forehead with two short tails flowing behind the head, placed exactly on the head of the attached Mike sprite sheet in every frame, tails reacting to movement. Face, hair, body and background fully transparent. Same grid as the reference: 96x96 cells, 9 columns, 10 rows, same poses frame by frame (idle 4, walk 6, punch combo 9, kick 4, jump 3, jump kick 2, hit 2, knocked down 3, get up 3, victory 2). Character faces right. 16-bit retro beat 'em up pixel art, crisp hard pixel edges, dark outline, no anti-aliasing, no blur, no text, transparent background.
```

### Item icons
- Files: `assets/sprites/items/fight_gloves_icon.png`, `street_boots_icon.png`, `lucky_tank_icon.png`, `focus_headband_icon.png`
- Each 24x24. Generate at 192x192 and shrink with nearest-neighbor.

```
Single pixel art inventory icon of [ITEM], centered, slight 3/4 view, bold dark outline, bright readable colors, 24x24 pixel game icon style, 16-bit retro RPG item icon, crisp hard pixel edges, no anti-aliasing, no text, transparent background.
```

Replace `[ITEM]` with: `red fingerless MMA fight gloves with black wrist straps` / `black leather combat boots with dark red laces` / `folded heather grey tank top` / `red cloth martial arts headband with two tails`.

---

## Enemies

### Thug (slow, hits hard)
- File: `assets/sprites/enemies/thug.png` - Sheet: 576x576 (6 columns x 6 rows of 96x96)

```
Pixel art sprite sheet of a single street thug enemy: big heavy-set bald man, thick neck, stubble, black leather jacket over a white t-shirt, dark jeans, brown work boots, unarmed, angry face. Character faces right. Grid of 96x96 pixel cells, 6 columns, 6 rows, one animation per row, feet on the bottom edge of every cell, character centered and the same size in every frame. Row 1: idle menacing stance, 4 frames. Row 2: heavy walk, 6 frames. Row 3: slow wide haymaker punch, 4 frames (wind up far back, swing, impact, recover). Row 4: getting hit, 2 frames. Row 5: knocked down, 3 frames (falling backward, hitting the ground, lying flat). Row 6: getting up, 3 frames. 16-bit retro beat 'em up pixel art like Golden Axe and Streets of Rage, side view, crisp hard pixel edges, limited palette, dark outline, no anti-aliasing, no blur, no text, no watermark, transparent background.
```

### Runner (fast, weak)
- File: `assets/sprites/enemies/runner.png` - Sheet: 576x576

```
Pixel art sprite sheet of a single fast street punk enemy: skinny young man, green zip hoodie with the hood down, short bleached spiky hair, ripped grey jeans, white sneakers, unarmed, cocky grin. Character faces right. Grid of 96x96 pixel cells, 6 columns, 6 rows, one animation per row, feet on the bottom edge of every cell, character centered and the same size in every frame. Row 1: bouncy idle stance, 4 frames. Row 2: fast run, 6 frames. Row 3: quick jab, 4 frames (lean in, jab, impact, pull back). Row 4: getting hit, 2 frames. Row 5: knocked down, 3 frames (falling backward, hitting the ground, lying flat). Row 6: getting up, 3 frames. 16-bit retro beat 'em up pixel art like Golden Axe and Streets of Rage, side view, crisp hard pixel edges, limited palette, dark outline, no anti-aliasing, no blur, no text, no watermark, transparent background.
```

---

## Bosses (128x128 cells, 6 columns x 8 rows = 768x1024)

### Level 1 boss: Big Tony
- File: `assets/sprites/bosses/big_tony.png`

```
Pixel art sprite sheet of a single boss character, Big Tony: a huge towering gang enforcer, shaved head, thick black goatee, gold chain, tight black tank top, giant arms with tattoos, grey cargo pants, black boots, unarmed. Much bigger than a normal man. Character faces right. Grid of 128x128 pixel cells, 6 columns, 8 rows, one animation per row, feet on the bottom edge of every cell, character centered and the same size in every frame. Row 1: idle stance cracking knuckles, 4 frames. Row 2: heavy stomping walk, 6 frames. Row 3: double-fist hammer punch, 4 frames. Row 4: getting hit, 2 frames. Row 5: knocked down, 3 frames. Row 6: getting up, 3 frames. Row 7: special attack, a running shoulder charge, 6 frames (lower shoulder, start running, charging, charging, impact, stop). Row 8: enrage, 6 frames (roars and flexes, red angry face, steam). 16-bit retro beat 'em up pixel art like Golden Axe and Streets of Rage, side view, crisp hard pixel edges, limited palette, dark outline, no anti-aliasing, no blur, no text, no watermark, transparent background.
```

### Level 2 boss: Viper
- File: `assets/sprites/bosses/viper.png`

```
Pixel art sprite sheet of a single boss character, Viper: a lean fast kickboxer gang leader, red bandana on the head, long black ponytail, green snake tattoo winding up one arm, black sleeveless shirt, red Thai boxing shorts over black leggings, bare feet with wraps, unarmed. Slightly taller than a normal man. Character faces right. Grid of 128x128 pixel cells, 6 columns, 8 rows, one animation per row, feet on the bottom edge of every cell, character centered and the same size in every frame. Row 1: bouncing kickboxing stance, 4 frames. Row 2: quick shuffle walk, 6 frames. Row 3: fast roundhouse kick, 4 frames. Row 4: getting hit, 2 frames. Row 5: knocked down, 3 frames. Row 6: getting up, 3 frames. Row 7: special attack, leaping flying knee across the screen, 6 frames (crouch, jump, flying knee, flying knee, landing, recover). Row 8: enrage, 6 frames (wipes blood from lip, snake-like glare, hisses, stance). 16-bit retro beat 'em up pixel art like Golden Axe and Streets of Rage, side view, crisp hard pixel edges, limited palette, dark outline, no anti-aliasing, no blur, no text, no watermark, transparent background.
```

### Level 3 boss: The Chief
- File: `assets/sprites/bosses/the_chief.png`

```
Pixel art sprite sheet of a single final boss character, The Chief: a massive crime boss, slicked-back grey hair, scarred face, thick grey mustache, torn white dress shirt with rolled-up sleeves, loose red tie, black suit pants, polished shoes, giant fists, unarmed. Much bigger than a normal man. Character faces right. Grid of 128x128 pixel cells, 6 columns, 8 rows, one animation per row, feet on the bottom edge of every cell, character centered and the same size in every frame. Row 1: idle stance adjusting tie, 4 frames. Row 2: slow confident walk, 6 frames. Row 3: heavy straight punch, 4 frames. Row 4: getting hit, 2 frames. Row 5: knocked down, 3 frames. Row 6: getting up, 3 frames. Row 7: special attack, jumps and slams both fists into the ground making a shockwave, 6 frames (crouch, jump up, fists raised, slam, shockwave dust, recover). Row 8: enrage, 6 frames (rips shirt sleeves, veins bulging, roars). 16-bit retro beat 'em up pixel art like Golden Axe and Streets of Rage, side view, crisp hard pixel edges, limited palette, dark outline, no anti-aliasing, no blur, no text, no watermark, transparent background.
```

---

## Background characters (NPCs)

People: 96x96 cells, 6 columns x 2 rows = 576x192. Animals: 32x32 cells, 6 columns x 2 rows = 192x64.

### Scared woman
- File: `assets/sprites/npcs/scared_woman.png`

```
Pixel art sprite sheet of a single background character: a young woman in a beige trench coat holding a handbag, shoulder-length brown hair, worried expression. Character faces right. Grid of 96x96 pixel cells, 6 columns, 2 rows, feet on the bottom edge of every cell, centered, same size in every frame. Row 1: idle, nervously looking around and clutching her bag, 4 frames. Row 2: running away scared, hands up, 6 frames. 16-bit retro beat 'em up pixel art like Golden Axe and Streets of Rage, side view, crisp hard pixel edges, limited palette, dark outline, no anti-aliasing, no blur, no text, no watermark, transparent background.
```

### Old man
- File: `assets/sprites/npcs/old_man.png`

```
Pixel art sprite sheet of a single background character: a hunched old man with white hair and a flat cap, brown cardigan, grey trousers, walking cane. Character faces right. Grid of 96x96 pixel cells, 6 columns, 2 rows, feet on the bottom edge of every cell, centered, same size in every frame. Row 1: idle, leaning on his cane and shaking his head, 4 frames. Row 2: hobbling away as fast as he can, waving the cane, 6 frames. 16-bit retro beat 'em up pixel art like Golden Axe and Streets of Rage, side view, crisp hard pixel edges, limited palette, dark outline, no anti-aliasing, no blur, no text, no watermark, transparent background.
```

### Homeless man
- File: `assets/sprites/npcs/homeless_man.png`

```
Pixel art sprite sheet of a single background character: a homeless man with a long scruffy beard, beanie hat, worn green army jacket, fingerless gloves, carrying a rolled blanket. Character faces right. Grid of 96x96 pixel cells, 6 columns, 2 rows, feet on the bottom edge of every cell, centered, same size in every frame. Row 1: idle, standing and warming his hands, 4 frames. Row 2: shuffling away quickly with his blanket, 6 frames. 16-bit retro beat 'em up pixel art like Golden Axe and Streets of Rage, side view, crisp hard pixel edges, limited palette, dark outline, no anti-aliasing, no blur, no text, no watermark, transparent background.
```

### Cat
- File: `assets/sprites/npcs/cat.png`

```
Pixel art sprite sheet of a small black alley cat with yellow eyes. Faces right. Grid of 32x32 pixel cells, 6 columns, 2 rows, paws on the bottom edge of every cell, centered, same size in every frame. Row 1: idle, sitting and licking its paw, tail swishing, 4 frames. Row 2: running away fast, 6 frames. 16-bit retro pixel art, side view, crisp hard pixel edges, dark outline, no anti-aliasing, no blur, no text, transparent background.
```

### Rat
- File: `assets/sprites/npcs/rat.png`

```
Pixel art sprite sheet of a small grey street rat with a long pink tail. Faces right. Grid of 32x32 pixel cells, 6 columns, 2 rows, feet on the bottom edge of every cell, centered, same size in every frame. Row 1: idle, sniffing the ground, whiskers twitching, 4 frames. Row 2: scurrying away fast, 6 frames. 16-bit retro pixel art, side view, crisp hard pixel edges, dark outline, no anti-aliasing, no blur, no text, transparent background.
```

---

## Effects

### Hit spark
- File: `assets/sprites/fx/hit_spark.png` - Sheet: 96x32 (3 frames of 32x32)

```
Pixel art animation strip of a punch impact spark effect, white and yellow starburst with orange edges, 3 frames left to right in 32x32 pixel cells: small flash, big starburst, fading sparks. 16-bit retro beat 'em up effect, crisp hard pixel edges, no anti-aliasing, no text, transparent background.
```

---

## Backgrounds

Two layers per level. The **far** layer scrolls at half speed. The **near** layer scrolls with the street. The near layer: buildings/walls from the top down to y=150, sidewalk from y=150 to y=180, street/ground from y=180 to the bottom (270). Opaque, no transparency needed except the far layer can be fully opaque too.

### Level 1: Gym Street (evening)
- `assets/backgrounds/level1_far.png` (960x270)

```
Pixel art side-scrolling game background, far layer, wide panorama 960x270: city skyline at sunset, purple and orange sky, distant apartment towers and a water tower, a few lit windows, soft clouds. 16-bit retro beat 'em up background like Streets of Rage, crisp hard pixel edges, limited palette, no characters, no text.
```

- `assets/backgrounds/level1_near.png` (1440x270)

```
Pixel art side-scrolling beat 'em up street level, wide panorama 1440x270, side view: at the far left a boxing gym storefront with a big neon "GYM" sign shape and glass doors, then a row of small shops with metal shutters, brick walls with graffiti, street lamps just turning on. Sidewalk band from y=150 to y=180, asphalt street with a curb from y=180 to the bottom. Evening light, purple and orange tones. 16-bit retro style like Streets of Rage, crisp hard pixel edges, limited palette, no characters, no readable text.
```

### Level 2: Dark Alley (night)
- `assets/backgrounds/level2_far.png` (960x270)

```
Pixel art side-scrolling game background, far layer, wide panorama 960x270: night city seen between tall buildings, dark blue sky with a full moon, fire escapes and rooftops silhouetted, distant red neon glow. 16-bit retro beat 'em up background like Streets of Rage, crisp hard pixel edges, limited palette, no characters, no text.
```

- `assets/backgrounds/level2_near.png` (1440x270)

```
Pixel art side-scrolling beat 'em up back alley level, wide panorama 1440x270, side view: wet red brick walls, metal fire escapes, overflowing dumpsters, steam vents, a flickering wall lamp, chain link fence, puddles reflecting light. Narrow sidewalk band from y=150 to y=180, cracked wet asphalt alley ground from y=180 to the bottom. Night, dark blue and teal with warm lamp light. 16-bit retro style like Streets of Rage, crisp hard pixel edges, limited palette, no characters, no readable text.
```

### Level 3: Parking Lot (late night, Mike's home in sight)
- `assets/backgrounds/level3_far.png` (960x270)

```
Pixel art side-scrolling game background, far layer, wide panorama 960x270: quiet residential apartment blocks at night, black and deep blue sky with stars, a few warm lit windows, distant highway lights. 16-bit retro beat 'em up background like Streets of Rage, crisp hard pixel edges, limited palette, no characters, no text.
```

- `assets/backgrounds/level3_near.png` (1440x270)

```
Pixel art side-scrolling beat 'em up level, wide panorama 1440x270, side view: an empty multi-storey parking lot ground floor, concrete pillars, parked old cars, orange sodium lights, painted parking lines, and at the far right end the entrance of a small apartment building with a warm lit doorway. Sidewalk band from y=150 to y=180, concrete ground from y=180 to the bottom. Late night, orange and dark grey tones. 16-bit retro style like Streets of Rage, crisp hard pixel edges, limited palette, no characters, no readable text.
```

### Gym (between runs)
- `assets/backgrounds/gym.png` (480x270)

```
Pixel art game menu background 480x270: inside a gritty old boxing gym, heavy punching bags hanging on chains, a boxing ring in the back, dumbbell racks, brick walls with old fight posters, warm overhead lights. 16-bit retro beat 'em up style, crisp hard pixel edges, limited palette, no characters, no readable text.
```

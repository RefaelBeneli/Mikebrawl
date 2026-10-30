# Nano Banana prompts

Walkthrough first: [GUIDE.md](GUIDE.md). Every prompt below is complete: copy it, paste it, attach what it says.

- **Anchor prompts** make one clean picture of a character. Save it on your computer.
- **Strip prompts** need that anchor attached. Save the result at the listed path.

Keep this file in sync with `data/anims.js` (pose counts).

---

## Mike

### Anchor (attach 2-3 photos of Mike)

```
Turn the person in the attached photos into one full-body pixel art video game character named Mike. Match his face, hair and beard exactly: short dark messy wavy hair, short full dark beard, thick dark eyebrows, tan olive skin, athletic muscular martial artist build. Outfit: shirtless, black jogger pants with a drawstring, plain dark grey sneakers with light soles, bare hands, no headband. Standing in a fighting stance, fists up, facing right. 16-bit retro beat 'em up pixel art like Streets of Rage, side view, crisp pixels, dark outline, limited palette. Solid flat magenta #FF00FF background, no floor, no shadow, no text. No pink or purple on the character.
```

### `assets/sprites/mike/idle.png` (2 poses)

```
Using the attached character, Mike, exactly as he looks, draw one horizontal row of 2 poses, left to right: 1) fighting stance, fists up; 2) the same stance breathing, shoulders slightly lower. Wide empty gaps between poses, poses never touch, whole body visible in every pose, same character and same size in every pose, facing right. 16-bit retro beat 'em up pixel art like Streets of Rage, side view, crisp pixels, dark outline, limited palette. Solid flat magenta #FF00FF background, no floor, no shadow, no gradient, no text. No pink or purple on the character. Wide 16:9 image.
```

### `assets/sprites/mike/walk.png` (4 poses)

```
Using the attached character, Mike, exactly as he looks, draw one horizontal row of 4 poses, left to right: a 4-step walk cycle walking forward with fists up in guard (1 left foot forward, 2 legs passing, 3 right foot forward, 4 legs passing). Wide empty gaps between poses, poses never touch, whole body visible in every pose, same character and same size in every pose, facing right. 16-bit retro beat 'em up pixel art like Streets of Rage, side view, crisp pixels, dark outline, limited palette. Solid flat magenta #FF00FF background, no floor, no shadow, no gradient, no text. No pink or purple on the character. Wide 16:9 image.
```

### `assets/sprites/mike/punch.png` (6 poses)

```
Using the attached character, Mike, exactly as he looks, draw one horizontal row of 6 poses, left to right: 1) guard stance ready to jab; 2) left jab, arm fully extended forward; 3) shoulders turning, loading a right cross; 4) right cross, arm fully extended forward; 5) crouched low, loading an uppercut; 6) powerful uppercut, fist fully extended upward. Feet stay in place. Wide empty gaps between poses, poses never touch, whole body visible in every pose, same character and same size in every pose, facing right. 16-bit retro beat 'em up pixel art like Streets of Rage, side view, crisp pixels, dark outline, limited palette. Solid flat magenta #FF00FF background, no floor, no shadow, no gradient, no text. No pink or purple on the character. Wide 21:9 image.
```

### `assets/sprites/mike/kick.png` (3 poses)

```
Using the attached character, Mike, exactly as he looks, draw one horizontal row of 3 poses, left to right: 1) knee raised high, chambering a front kick; 2) front kick, leg fully extended forward at stomach height; 3) kicking leg coming back down. Wide empty gaps between poses, poses never touch, whole body visible in every pose, same character and same size in every pose, facing right. 16-bit retro beat 'em up pixel art like Streets of Rage, side view, crisp pixels, dark outline, limited palette. Solid flat magenta #FF00FF background, no floor, no shadow, no gradient, no text. No pink or purple on the character. Wide 16:9 image.
```

### `assets/sprites/mike/jump.png` (3 poses)

```
Using the attached character, Mike, exactly as he looks, draw one horizontal row of 3 poses, left to right: 1) crouching, about to jump; 2) in the air with knees tucked up; 3) flying side kick in mid air, one leg fully extended forward. Wide empty gaps between poses, poses never touch, whole body visible in every pose, same character and same size in every pose, facing right. 16-bit retro beat 'em up pixel art like Streets of Rage, side view, crisp pixels, dark outline, limited palette. Solid flat magenta #FF00FF background, no floor, no shadow, no gradient, no text. No pink or purple on the character. Wide 16:9 image.
```

### `assets/sprites/mike/fall.png` (5 poses)

```
Using the attached character, Mike, exactly as he looks, draw one horizontal row of 5 poses, left to right: 1) getting hit, head snapped back, body recoiling; 2) falling backward; 3) lying flat on his back on the ground; 4) on one knee, pushing himself up; 5) almost standing, rising back into his guard. Wide empty gaps between poses, poses never touch, whole body visible in every pose, same character and same size in every pose, facing right. 16-bit retro beat 'em up pixel art like Streets of Rage, side view, crisp pixels, dark outline, limited palette. Solid flat magenta #FF00FF background, no floor, no shadow, no gradient, no text. No pink or purple on the character. Wide 21:9 image.
```

### `assets/sprites/mike/victory.png` (1 pose)

```
Using the attached character, Mike, exactly as he looks, draw him in one victory pose: standing tall, one fist raised high in the air, proud smile, facing right. Whole body visible. 16-bit retro beat 'em up pixel art like Streets of Rage, side view, crisp pixels, dark outline, limited palette. Solid flat magenta #FF00FF background, no floor, no shadow, no gradient, no text. No pink or purple on the character. Square 1:1 image.
```

---

## Gear (worn by Mike)

Make 7 images per item: attach each finished Mike strip (`idle`, `walk`, `punch`, `kick`, `jump`, `fall`, `victory`) one at a time and paste the item's prompt. Save with the same file name in the item's folder, e.g. attach `mike/kick.png` → save `gear/street_boots/kick.png`.

### `assets/sprites/gear/fight_gloves/<file>.png`

```
Edit the attached image. Put red fingerless MMA fight gloves with black wrist straps on the man's hands in every pose. Then remove the man completely and keep ONLY the gloves, in exactly the same position, size and angle, on the same solid flat magenta #FF00FF background. Do not move, resize or crop anything. Same image size. Pixel art, crisp pixels, dark outline.
```

### `assets/sprites/gear/street_boots/<file>.png`

```
Edit the attached image. Put black leather combat boots with dark red laces on the man's feet in every pose. Then remove the man completely and keep ONLY the boots, in exactly the same position, size and angle, on the same solid flat magenta #FF00FF background. Do not move, resize or crop anything. Same image size. Pixel art, crisp pixels, dark outline.
```

### `assets/sprites/gear/lucky_tank/<file>.png`

```
Edit the attached image. Dress the man in a fitted heather grey sleeveless tank top in every pose, following his body as it twists and bends. Then remove the man completely and keep ONLY the tank top, in exactly the same position, size and angle, on the same solid flat magenta #FF00FF background. Do not move, resize or crop anything. Same image size. Pixel art, crisp pixels, dark outline.
```

### `assets/sprites/gear/focus_headband/<file>.png`

```
Edit the attached image. Tie a red cloth martial arts headband around the man's forehead in every pose, with two short tails flowing behind his head. Then remove the man completely and keep ONLY the headband, in exactly the same position, size and angle, on the same solid flat magenta #FF00FF background. Do not move, resize or crop anything. Same image size. Pixel art, crisp pixels, dark outline.
```

If the edit moves things, split it in two: send the first sentence, then in the same chat send "Now remove the man and everything else, keep only the [item] exactly where it is, on solid flat magenta #FF00FF."

### Item icons: `assets/sprites/items/<item>_icon.png`

```
One pixel art inventory icon of [ITEM], centered, slight 3/4 view, bold dark outline, bright readable colors, 16-bit retro game item icon, crisp pixels. Solid flat magenta #FF00FF background, no shadow, no text. No pink or purple on the item. Square 1:1 image.
```

| File | Replace `[ITEM]` with |
| --- | --- |
| `fight_gloves_icon.png` | red fingerless MMA fight gloves with black wrist straps |
| `street_boots_icon.png` | black leather combat boots with dark red laces |
| `lucky_tank_icon.png` | a folded heather grey tank top |
| `focus_headband_icon.png` | a red cloth martial arts headband with two tails |

---

## Enemies, bosses and NPCs

Each character: first its anchor (no attachment), then its strips with the anchor attached.

### Character descriptions

Use these in the anchor template below.

| Folder | Description |
| --- | --- |
| `thug` | a big heavy-set bald street thug, thick neck, stubble, black leather jacket over a white t-shirt, dark jeans, brown work boots, unarmed, angry face |
| `runner` | a skinny fast street punk, green zip hoodie with the hood down, short bleached spiky hair, ripped grey jeans, white sneakers, unarmed, cocky grin |
| `big_tony` | Big Tony, a huge towering gang enforcer, much bigger than a normal man, shaved head, thick black goatee, gold chain, tight black tank top, giant tattooed arms, grey cargo pants, black boots, unarmed |
| `viper` | Viper, a lean fast kickboxer gang leader, slightly taller than a normal man, red bandana, long black ponytail, green snake tattoo up one arm, black sleeveless shirt, red Thai boxing shorts over black leggings, wrapped bare feet, unarmed |
| `the_chief` | The Chief, a massive crime boss, much bigger than a normal man, slicked-back grey hair, scarred face, thick grey mustache, torn white dress shirt with rolled-up sleeves, loose red tie, black suit pants, polished shoes, giant fists |
| `scared_woman` | a young woman in a beige trench coat holding a handbag, shoulder-length brown hair, worried face |
| `old_man` | a hunched old man with white hair and a flat cap, brown cardigan, grey trousers, walking cane |
| `homeless_man` | a homeless man with a long scruffy beard, beanie hat, worn green army jacket, fingerless gloves, carrying a rolled blanket |
| `cat` | a small black alley cat with yellow eyes |
| `rat` | a small grey street rat with a long pink tail (the tail is the only pink allowed: make it a dull grey-pink) |

### Anchor template

```
One full-body pixel art video game character: [DESCRIPTION]. Standing, facing right. 16-bit retro beat 'em up pixel art like Streets of Rage, side view, crisp pixels, dark outline, limited palette. Solid flat magenta #FF00FF background, no floor, no shadow, no text. No pink or purple on the character.
```

### Strip template

Attach the anchor, then paste this with `[N]` and `[POSES]` from the tables below.

```
Using the attached character exactly as it looks, draw one horizontal row of [N] poses, left to right: [POSES]. Wide empty gaps between poses, poses never touch, whole body visible in every pose, same character and same size in every pose, facing right. 16-bit retro beat 'em up pixel art like Streets of Rage, side view, crisp pixels, dark outline, limited palette. Solid flat magenta #FF00FF background, no floor, no shadow, no gradient, no text. No pink or purple on the character. Wide 16:9 image.
```

### Thug and Runner: `assets/sprites/thug/…`, `assets/sprites/runner/…`

| File | N | POSES |
| --- | --- | --- |
| `idle.png` | 2 | 1) menacing fighting stance; 2) the same stance breathing, shoulders slightly lower |
| `walk.png` | 4 | a 4-step walk cycle walking forward (1 left foot forward, 2 legs passing, 3 right foot forward, 4 legs passing) |
| `attack.png` | 3 | thug: 1) winding up a wide haymaker far back; 2) haymaker punch fully extended; 3) recovering. runner: 1) leaning in; 2) quick jab fully extended; 3) pulling back |
| `fall.png` | 5 | 1) getting hit, head snapped back; 2) falling backward; 3) lying flat on the back on the ground; 4) on one knee pushing up; 5) almost standing |

### Bosses: `assets/sprites/big_tony/…`, `viper/…`, `the_chief/…`

Same `idle`, `walk` and `fall` as the thug, plus:

| File | N | POSES |
| --- | --- | --- |
| `attack.png` | 3 | Big Tony: 1) both fists raised overhead; 2) double-fist hammer punch slamming forward; 3) recovering. Viper: 1) chambering a roundhouse; 2) roundhouse kick fully extended at head height; 3) leg returning. The Chief: 1) pulling a fist back; 2) heavy straight punch fully extended; 3) recovering |
| `special.png` | 4 | Big Tony: 1) lowering his shoulder; 2) starting to run; 3) full-speed shoulder charge; 4) stopping. Viper: 1) crouching; 2) leaping; 3) flying knee in mid air; 4) landing. The Chief: 1) crouching; 2) jumping with both fists raised; 3) slamming both fists into the ground with a dust shockwave; 4) standing back up |
| `enrage.png` | 2 | 1) roaring with fists clenched, angry red face; 2) flexing, veins bulging, steam rising |

### NPCs: `assets/sprites/scared_woman/…`, `old_man/…`, `homeless_man/…`, `cat/…`, `rat/…`

| File | N | POSES |
| --- | --- | --- |
| `idle.png` | 2 | woman: nervously clutching her bag, looking around. old man: leaning on his cane, shaking his head. homeless man: warming his hands. cat: sitting, tail up, then tail down. rat: sniffing the ground, nose up then down |
| `flee.png` | 4 | a 4-step running cycle, running away scared (people: hands up in panic) |

---

## Effects

### `assets/sprites/fx/hit_spark.png` (3 poses)

```
Pixel art punch impact effect, one horizontal row of 3 separate frames, left to right: 1) small white flash; 2) big white and yellow starburst with orange edges; 3) fading orange sparks. Wide empty gaps between frames, frames never touch. 16-bit retro beat 'em up effect, crisp pixels. Solid flat magenta #FF00FF background, no text. Wide 16:9 image.
```

---

## Backgrounds

Each level has a **far** skyline and 4 **near** building panels. The game puts them above the sidewalk (it draws the sidewalk and street itself).

### Far skyline: `assets/backgrounds/<level>/far.png`

```
Pixel art side-scrolling game background, a wide city skyline panorama that loops seamlessly left to right: [SCENE]. No ground, no street, no characters, no text. 16-bit retro beat 'em up background like Streets of Rage, crisp pixels, limited palette. Wide 21:9 image.
```

### Near panels: `assets/backgrounds/<level>/near1.png` … `near4.png`

Make 4 different panels per level, one per prompt. The bottom of the image is where the sidewalk starts.

```
Pixel art side view of [PANEL], seen straight from the front, filling the image from the bottom edge up. The bottom edge is the ground line. The sky behind it is solid flat magenta #FF00FF. No sidewalk, no street, no characters, no readable text. [MOOD]. 16-bit retro beat 'em up background like Streets of Rage, crisp pixels, limited palette. Wide 4:3 image.
```

| Level | `[SCENE]` (far) | `[MOOD]` | `[PANEL]` near1 / near2 / near3 / near4 |
| --- | --- | --- | --- |
| `level1` Gym Street | city skyline at sunset, purple and orange sky, distant apartment towers, a water tower, a few lit windows | evening light, purple and orange tones | a boxing gym storefront with a neon glove sign and glass doors / a small shop with a metal shutter / a brick wall with graffiti and a street lamp / a corner deli with an awning |
| `level2` Dark Alley | night city between tall buildings, dark blue sky with a full moon, rooftops and fire escapes, distant red neon glow | night, dark blue and teal with warm lamp light | a wet red brick wall with a metal fire escape / overflowing dumpsters against a wall with a steam vent / a chain link fence with a flickering wall lamp / a back door with stacked crates |
| `level3` Parking Lot | quiet apartment blocks at night, black and deep blue sky with stars, a few warm lit windows, distant highway lights | late night, orange sodium light and dark grey | a concrete parking garage wall with pillars / an old parked car in front of a concrete wall / a parking pay machine and a pillar with painted numbers / the entrance of a small apartment building with a warm lit doorway |

### Gym: `assets/backgrounds/gym.png`

```
Pixel art game menu background: inside a gritty old boxing gym, heavy punching bags hanging on chains, a boxing ring in the back, dumbbell racks, brick walls with old fight posters, warm overhead lights. Keep the middle calm and a bit dark (menu text goes there). 16-bit retro beat 'em up style, crisp pixels, limited palette, no characters, no readable text. Wide 16:9 image.
```

# Nano Banana prompts

Walkthrough first: [GUIDE.md](GUIDE.md). Every prompt below is complete: copy it, paste it, attach what it says.

- **Anchor prompts** make one clean picture of a character. Save it on your computer.
- **Strip prompts** need that anchor attached. Save the result at the listed path.

Keep this file in sync with `data/anims.js` (pose counts).

---

## Mike

### Anchor, step 1: face portrait (attach 1-2 photos of Mike)

Use clear, well-lit photos where his face is big and looking at the camera. Skip sunglasses, hats, and group shots. A full-body character is too small for the AI to keep his face, so lock the face first in a big portrait.

```
Redraw the man in the attached photo as a detailed 16-bit pixel art portrait, head and shoulders, three-quarter view facing right. This is the same real person: keep his exact identity. Copy his face from the photo feature by feature: face shape, jawline, nose shape and size, eye shape and spacing, eyebrow shape, mouth and lips, ears, hairline, hairstyle, beard shape and length, and skin tone. Do not make him more handsome, younger, or generic, and do not change his proportions. Only change the drawing style to pixel art. Crisp pixels, dark outline, rich shading. Solid flat magenta #FF00FF background, no text.
```

Regenerate until people who know Mike say "that's him". If one feature is off, say so in the same chat, for example "make the nose wider like in the photo, keep everything else".

### Anchor, step 2: full body (attach the portrait from step 1 and the same photos)

```
Using the attached pixel art portrait and photos of the same man, draw him as one full-body pixel art video game character named Mike. His head and face must match the attached portrait exactly: same face, hair, beard and skin tone. Body: athletic muscular martial artist build. Outfit: shirtless, black jogger pants with a drawstring, plain dark grey sneakers with light soles, bare hands, no headband. Standing in a fighting stance, fists up, facing right. Make the head big and clear, like a 16-bit beat 'em up hero. 16-bit retro beat 'em up pixel art like Streets of Rage, side view, crisp pixels, dark outline, limited palette. Solid flat magenta #FF00FF background, no floor, no shadow, no text. No pink or purple on the character.
```

For every Mike strip below, attach this full-body anchor and the portrait.

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

## Backgrounds: Haifa

Mike walks home from his gym in Hadar, up to the Carmel, to his home in Romema.

| Level | Area | Time | Feel |
| --- | --- | --- | --- |
| `level1` | Hadar HaCarmel | sunset | old downtown: 1930s Bauhaus buildings, the market, busy shops |
| `level2` | Upper Carmel (Merkaz HaCarmel) | night | cafés, hotels, pine trees, the bay lights far below |
| `level3` | Romema | late night | quiet 1960s apartment blocks on the slope, Mike's home at the end |

Each level has one **far** skyline (loops left to right) and 4 **near** panels. The near panels sit on the sidewalk line; the game draws the sidewalk and road.

**Signs:** AI draws broken Hebrew letters. Every prompt asks for sign shapes and icons only, no letters.

**Things in every Haifa level:** flat roofs with solar water heater tanks (dud shemesh), rolling window shutters (trisim), small balconies with metal railings, AC units on walls, tall pine trees, and the slope of Mount Carmel behind.

### Level 1: Hadar

#### `assets/backgrounds/level1/far.png`

```
Pixel art side-scrolling game background, a wide panorama that loops seamlessly left to right: the city of Haifa, Israel at sunset seen from Hadar HaCarmel. In the distance the port of Haifa with big container cranes, the blue Mediterranean bay, the tall Sail Tower office building and the Haifa Bay oil refinery chimneys on the far shore. Behind and above, the green slope of Mount Carmel with white houses, and the golden dome of the Bahai Shrine among terraced gardens. Orange and purple sunset sky. No ground, no street, no characters, no text. 16-bit retro beat 'em up background like Streets of Rage, crisp pixels, limited palette. Wide 21:9 image.
```

#### `assets/backgrounds/level1/near1.png`: Mike's gym

```
Pixel art side view, seen straight from the front: an old 1930s Bauhaus-style building in Hadar HaCarmel, Haifa, Israel, with a boxing gym on the ground floor. Big glass gym windows showing punching bags inside, a sign with only a red boxing glove icon. Above it, two floors of white plastered apartments with rounded corner balconies, metal railings, rolling shutters, AC units, and solar water heater tanks on the flat roof. The building fills the image from the bottom edge up; the bottom edge is the ground line. The sky behind it is solid flat magenta #FF00FF. Sunset light, orange and purple tones. No sidewalk, no street, no characters, no letters or readable text. 16-bit retro beat 'em up background like Streets of Rage, crisp pixels, limited palette. Wide 4:3 image.
```

#### `assets/backgrounds/level1/near2.png`: Talpiot Market

```
Pixel art side view, seen straight from the front: the Talpiot Market building in Hadar HaCarmel, Haifa, Israel, a 1940 Bauhaus market hall with a curved semicircular front and long narrow horizontal strip windows. On the ground floor, open market stalls with crates of oranges, tomatoes, watermelons and sacks of spices under striped awnings. The building fills the image from the bottom edge up; the bottom edge is the ground line. The sky behind it is solid flat magenta #FF00FF. Sunset light, orange and purple tones. No sidewalk, no street, no characters, no letters or readable text. 16-bit retro beat 'em up background like Streets of Rage, crisp pixels, limited palette. Wide 4:3 image.
```

#### `assets/backgrounds/level1/near3.png`: Herzl Street shops

```
Pixel art side view, seen straight from the front: a busy shopping street in Hadar HaCarmel, Haifa, Israel. A 3-floor old building with small shops on the ground floor: a falafel and shawarma stand, a phone repair shop, a kiosk with snacks and newspapers, half-closed metal roll-down shutters with graffiti. Upstairs, worn plastered apartments with balconies, laundry hanging, rolling shutters, AC units, solar water heater tanks on the roof. Sign boards show only food and phone icons. The building fills the image from the bottom edge up; the bottom edge is the ground line. The sky behind it is solid flat magenta #FF00FF. Sunset light, orange and purple tones. No sidewalk, no street, no characters, no letters or readable text. 16-bit retro beat 'em up background like Streets of Rage, crisp pixels, limited palette. Wide 4:3 image.
```

#### `assets/backgrounds/level1/near4.png`: Carmelit station and stairs

```
Pixel art side view, seen straight from the front: an entrance to the Carmelit, Haifa's small underground funicular subway, in Hadar HaCarmel, Haifa, Israel. A simple station entrance with stairs going down and a round metro sign with only a train icon, next to a steep public stone staircase climbing up the hill between old Bauhaus apartment buildings, pine trees and a bus stop shelter. The scene fills the image from the bottom edge up; the bottom edge is the ground line. The sky behind it is solid flat magenta #FF00FF. Sunset light, orange and purple tones. No sidewalk, no street, no characters, no letters or readable text. 16-bit retro beat 'em up background like Streets of Rage, crisp pixels, limited palette. Wide 4:3 image.
```

### Level 2: Upper Carmel

#### `assets/backgrounds/level2/far.png`

```
Pixel art side-scrolling game background, a wide panorama that loops seamlessly left to right: the view at night from the top of Mount Carmel in Haifa, Israel. Far below, Haifa Bay full of glowing city lights, the lit port cranes, ships on the dark Mediterranean sea, the curving coastline toward Akko, and the lit golden dome of the Bahai Shrine on the slope below. Dark blue night sky with stars and a crescent moon, dark pine tree tops in front. No ground, no street, no characters, no text. 16-bit retro beat 'em up background like Streets of Rage, crisp pixels, limited palette. Wide 21:9 image.
```

#### `assets/backgrounds/level2/near1.png`: café street

```
Pixel art side view, seen straight from the front: a café on Moriah Avenue in Merkaz HaCarmel, Haifa, Israel, at night. A modern 2-floor stone building with a big glass café front glowing warm yellow, outdoor tables and chairs under an awning, string lights, potted plants, a coffee cup icon sign. Pine trees beside it. The scene fills the image from the bottom edge up; the bottom edge is the ground line. The sky behind it is solid flat magenta #FF00FF. Night, dark blue and teal with warm café light. No sidewalk, no street, no characters, no letters or readable text. 16-bit retro beat 'em up background like Streets of Rage, crisp pixels, limited palette. Wide 4:3 image.
```

#### `assets/backgrounds/level2/near2.png`: Louis Promenade

```
Pixel art side view, seen straight from the front: the Louis Promenade on the top of Mount Carmel, Haifa, Israel, at night. A low stone wall with a metal railing at the edge of the cliff, old-fashioned lamp posts, a wooden bench, a pergola, and a small old stone obelisk monument, with tall pine trees. The scene fills the image from the bottom edge up; the bottom edge is the ground line. The sky behind it is solid flat magenta #FF00FF. Night, dark blue and teal with warm lamp light. No sidewalk, no street, no characters, no letters or readable text. 16-bit retro beat 'em up background like Streets of Rage, crisp pixels, limited palette. Wide 4:3 image.
```

#### `assets/backgrounds/level2/near3.png`: hotel and park

```
Pixel art side view, seen straight from the front: a tall 1960s hotel on Mount Carmel, Haifa, Israel, at night, with rows of lit balconies and a glowing glass lobby, next to the stone entrance gate and dark pine trees of an old city park. The scene fills the image from the bottom edge up; the bottom edge is the ground line. The sky behind it is solid flat magenta #FF00FF. Night, dark blue and teal with warm window light. No sidewalk, no street, no characters, no letters or readable text. 16-bit retro beat 'em up background like Streets of Rage, crisp pixels, limited palette. Wide 4:3 image.
```

#### `assets/backgrounds/level2/near4.png`: Carmel apartments

```
Pixel art side view, seen straight from the front: an upscale Carmel apartment building in Haifa, Israel, at night, made of light Carmel stone, with wide balconies, large windows with rolling shutters, solar water heater tanks on the flat roof, a stone wall with bougainvillea flowers, a parked scooter and pine trees. The scene fills the image from the bottom edge up; the bottom edge is the ground line. The sky behind it is solid flat magenta #FF00FF. Night, dark blue and teal with warm window light. No sidewalk, no street, no characters, no letters or readable text. 16-bit retro beat 'em up background like Streets of Rage, crisp pixels, limited palette. Wide 4:3 image.
```

### Level 3: Romema

#### `assets/backgrounds/level3/far.png`

```
Pixel art side-scrolling game background, a wide panorama that loops seamlessly left to right: late night view from Romema on the slope of Mount Carmel, Haifa, Israel. A deep dark green wooded valley (wadi) below, the lights of the Haifa Bay suburbs and the oil refinery towers with small red lights on the far shore, and tall white apartment towers on the next hill with a few lit windows. Black and deep blue sky with many stars. No ground, no street, no characters, no text. 16-bit retro beat 'em up background like Streets of Rage, crisp pixels, limited palette. Wide 21:9 image.
```

#### `assets/backgrounds/level3/near1.png`: 1960s housing block

```
Pixel art side view, seen straight from the front: a tall 1960s Israeli apartment block (shikun) in Romema, Haifa, Israel, at late night, standing on concrete pillars with an open parking area underneath, long rows of small balconies with rolling shutters, AC units, laundry, and solar water heater tanks on the roof. A few warm lit windows. The scene fills the image from the bottom edge up; the bottom edge is the ground line. The sky behind it is solid flat magenta #FF00FF. Late night, orange street light and dark grey-blue. No sidewalk, no street, no characters, no letters or readable text. 16-bit retro beat 'em up background like Streets of Rage, crisp pixels, limited palette. Wide 4:3 image.
```

#### `assets/backgrounds/level3/near2.png`: sports arena

```
Pixel art side view, seen straight from the front: the side of the Romema sports arena in Haifa, Israel, at late night, a big indoor basketball hall with a curved roof and green walls, a closed entrance with glass doors, a basketball icon on the wall, and a few parked cars under orange street lamps. The scene fills the image from the bottom edge up; the bottom edge is the ground line. The sky behind it is solid flat magenta #FF00FF. Late night, orange street light and dark grey-blue. No sidewalk, no street, no characters, no letters or readable text. 16-bit retro beat 'em up background like Streets of Rage, crisp pixels, limited palette. Wide 4:3 image.
```

#### `assets/backgrounds/level3/near3.png`: neighborhood corner

```
Pixel art side view, seen straight from the front: a quiet neighborhood corner in Romema, Haifa, Israel, at late night. A small closed corner grocery (makolet) with a metal roll-down shutter, a lit 24-hour kiosk window, green and orange recycling bins, an old olive tree, and outdoor stone steps climbing up the slope between low apartment buildings with pine trees. The scene fills the image from the bottom edge up; the bottom edge is the ground line. The sky behind it is solid flat magenta #FF00FF. Late night, orange street light and dark grey-blue. No sidewalk, no street, no characters, no letters or readable text. 16-bit retro beat 'em up background like Streets of Rage, crisp pixels, limited palette. Wide 4:3 image.
```

#### `assets/backgrounds/level3/near4.png`: Mike's home

```
Pixel art side view, seen straight from the front: Mike's home, a 4-floor apartment building in Romema, Haifa, Israel, at late night, with light stone walls, balconies with rolling shutters and plants, solar water heater tanks on the roof, a front garden with a low stone wall, mailboxes, and a warm lit glass entrance door that feels welcoming. Pine and olive trees around it. The scene fills the image from the bottom edge up; the bottom edge is the ground line. The sky behind it is solid flat magenta #FF00FF. Late night, orange street light and dark grey-blue, warm light from the doorway. No sidewalk, no street, no characters, no letters or readable text. 16-bit retro beat 'em up background like Streets of Rage, crisp pixels, limited palette. Wide 4:3 image.
```

### Gym: `assets/backgrounds/gym.png`

```
Pixel art game menu background: inside Mike's gritty old martial arts gym in an old Bauhaus building in Hadar HaCarmel, Haifa, Israel. Heavy punching bags hanging on chains, a boxing ring in the back, mats, dumbbell racks, peeling plaster walls, tall old windows showing the sunset over the Haifa port cranes and the bay, warm overhead lights. Keep the middle calm and a bit dark (menu text goes there). 16-bit retro beat 'em up style, crisp pixels, limited palette, no characters, no letters or readable text. Wide 16:9 image.
```

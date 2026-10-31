# Audio walkthrough

Make the game's music and sounds step by step. Every sound is optional: anything you skip keeps the game's built-in 8-bit sound.

You need: a **Suno** account (music) and an **ElevenLabs** account (voices and effects). About 1-2 hours total.

---

## Step 1: Set up a folder

1. Create a folder: `~/Downloads/audio`.
2. Save every file you download there.
3. Names don't matter much, but naming them as shown below (e.g. `level1.mp3`) saves time.

---

## Step 2: Make the music (5 songs in Suno, 2 jingles in ElevenLabs)

### How to make one track

1. Open Suno and choose **Custom**.
2. Turn on **Instrumental**.
3. Paste the track's prompt into **Style of Music**.
4. Paste this into **Exclude styles** (every track):

```
Middle Eastern, Arabic, oud, darbuka, belly dance, ethnic, world music, vocals
```

5. Press **Create**. Suno makes 2 versions. Listen to both.
6. Download the better one as **MP3** and name it as shown.

All tracks share one style: 90s Japanese arcade music, like Streets of Rage: electronic synths, funky bass, house and breakbeat drums. Songs of 2-3 minutes are fine; the game loops the whole file.

### 2.1 Title screen → `title.mp3`

Plays on the title and gym screens.

```
16-bit Sega Genesis FM synth instrumental, 90s Japanese arcade video game music by Yuzo Koshiro, retro beat 'em up title theme like Streets of Rage, confident heroic synth lead melody, punchy slap FM bass, 90s breakbeat drums, gritty urban arcade feel, 118 BPM, seamless loop, instrumental, no vocals
```

### 2.2 Level 1, Hadar at sunset → `level1.mp3`

```
16-bit Sega Genesis FM synth instrumental, 90s Japanese arcade video game music by Yuzo Koshiro, beat 'em up stage 1 theme like Streets of Rage, upbeat funky city groove, driving slap bass, catchy bright synth lead, 90s house piano stabs, warm sunset downtown street energy, 128 BPM, seamless loop, instrumental, no vocals
```

### 2.3 Level 2, Upper Carmel at night → `level2.mp3`

```
16-bit Sega Genesis FM synth instrumental, 90s Japanese arcade video game music by Yuzo Koshiro, beat 'em up night stage theme like Streets of Rage 2, cool smooth late night city vibe, jazzy electric piano chords, deep rolling bass, crisp breakbeat, glittering arpeggios like city lights far below, smooth 90s Japanese city pop chords, 112 BPM, seamless loop, instrumental, no vocals
```

### 2.4 Level 3, Romema, almost home → `level3.mp3`

```
16-bit Sega Genesis FM synth instrumental, 90s Japanese arcade video game music by Yuzo Koshiro, final stage theme of a retro beat 'em up, tense and determined but hopeful, fast arpeggiated synth bass, soaring heroic lead, building energy, quiet sleeping neighborhood at 2am, almost home feeling, 140 BPM, seamless loop, instrumental, no vocals
```

### 2.5 Boss fights → `boss.mp3`

```
16-bit Sega Genesis FM synth instrumental, 90s Japanese arcade video game music by Yuzo Koshiro, intense boss battle theme like Streets of Rage, aggressive distorted FM bass, alarm-like synth stabs, heavy techno drums, high energy danger, 155 BPM, seamless loop, instrumental, no vocals
```

### 2.6 Level clear → `victory.mp3`

A short jingle. Make it in **ElevenLabs Sound Effects** (see Step 3), duration 8 seconds. Suno can't make songs this short.

```
16-bit Sega Genesis FM synth, 90s Japanese arcade video game jingle, short victory fanfare jingle, triumphant rising synth brass melody, ends on a strong major chord, 8 seconds, no loop, instrumental, no vocals
```

### 2.7 Game over → `gameover.mp3`

A short jingle. Make it in **ElevenLabs Sound Effects**, duration 6 seconds.

```
16-bit Sega Genesis FM synth, 90s Japanese arcade video game jingle, short game over jingle, sad slow descending synth melody, ends softly, 6 seconds, no loop, instrumental, no vocals
```

---

## Step 3: Make the sounds in ElevenLabs (40 sounds)

### How to make one sound

1. Open ElevenLabs → **Sound Effects**.
2. Paste the prompt.
3. Set **Duration** to the seconds in the prompt.
4. Generate, listen, and regenerate if it's wrong (for example, real words when you wanted a grunt, or silence before the sound starts).
5. Download as **MP3** and name it as shown.

Voices are wordless grunts and shouts. Keep them short: hits must feel instant.

### 3.1 Mike (6)

- `mike_punch.mp3`: `Short sharp male martial artist exhale grunt "hah!" while throwing a punch, close mic, dry, 0.3 seconds`
- `mike_kick.mp3`: `Short strong male martial arts kiai shout "hyah!" while kicking, close mic, dry, 0.4 seconds`
- `mike_jump.mp3`: `Short male effort grunt "hup" as he jumps, quiet, dry, 0.3 seconds`
- `mike_hurt.mp3`: `Male fighter gets punched, short pained grunt "ugh", dry, 0.4 seconds`
- `mike_knockdown.mp3`: `Male fighter knocked down, pained groan "aargh" as he falls, 0.8 seconds`
- `mike_victory.mp3`: `Confident male fighter short victory shout "yeah!", 0.6 seconds`

### 3.2 Hits and game sounds (8)

- `hit_light.mp3`: `Retro arcade punch impact sound, fast fleshy slap thump, beat 'em up hit, 0.2 seconds`
- `hit_heavy.mp3`: `Heavy retro arcade kick impact, deep punchy thud with crunch, beat 'em up hit, 0.3 seconds`
- `whoosh.mp3`: `Fast air swish of a missed punch, short whoosh, 0.25 seconds`
- `body_fall.mp3`: `Body falling on a city sidewalk, heavy dull thud, 0.4 seconds`
- `item_drop.mp3`: `Retro 8-bit item appears sparkle chime, short, 0.4 seconds`
- `item_pickup.mp3`: `Retro 8-bit item pickup sound, quick rising coin-like blip, 0.3 seconds`
- `level_up.mp3`: `Retro 8-bit level up jingle, fast rising arpeggio, bright, 1 second`
- `boss_warning.mp3`: `Retro 8-bit warning alarm, two-tone siren beeps, danger, 1.5 seconds`

### 3.3 Thug and Runner (6)

- `thug_taunt.mp3`: `Big tough street thug, deep voice, short threatening laugh "heh heh", 0.8 seconds`
- `thug_hurt.mp3`: `Big heavy man gets punched, deep short grunt "oof", 0.3 seconds`
- `thug_ko.mp3`: `Big heavy man knocked out, long deep groan falling, 0.8 seconds`
- `runner_taunt.mp3`: `Young cocky street punk, short mocking whistle and "yo!", 0.7 seconds`
- `runner_hurt.mp3`: `Skinny young man gets hit, short high yelp "ah!", 0.3 seconds`
- `runner_ko.mp3`: `Skinny young man knocked out, whiny cry "aaaah" falling, 0.7 seconds`

### 3.4 Bosses (12)

Big Tony:
- `big_tony_intro.mp3`: `Huge gang enforcer, very deep booming voice, menacing laugh "ha ha ha", 1.5 seconds`
- `big_tony_hurt.mp3`: `Huge man grunts in anger after being hit, very deep "hngh", 0.4 seconds`
- `big_tony_enrage.mp3`: `Huge man furious roar, very deep, like a bull, 1.5 seconds`
- `big_tony_ko.mp3`: `Huge man defeated, long deep falling groan, 1.2 seconds`

Viper:
- `viper_intro.mp3`: `Lean fast fighter, sharp voice, short hiss then cold laugh, 1.2 seconds`
- `viper_hurt.mp3`: `Fast fighter gets hit, short sharp grunt "tch", 0.3 seconds`
- `viper_enrage.mp3`: `Fighter angry snake-like hiss then shout "hyaaa!", 1.2 seconds`
- `viper_ko.mp3`: `Fighter defeated, breathless pained cry falling, 1 second`

The Chief:
- `the_chief_intro.mp3`: `Old crime boss, gravelly deep voice, slow evil chuckle, 1.5 seconds`
- `the_chief_hurt.mp3`: `Old heavy man hit, gravelly deep grunt, 0.4 seconds`
- `the_chief_enrage.mp3`: `Old crime boss furious gravelly roar, 1.5 seconds`
- `the_chief_ko.mp3`: `Old heavy man defeated, long gravelly groan collapsing, 1.5 seconds`

### 3.5 People and animals on the street (5)

- `woman_scream.mp3`: `Young woman short frightened scream "ah!" and gasp, 0.8 seconds`
- `old_man_grumble.mp3`: `Old man annoyed wordless grumble "hrmph" and mumbling, 1.2 seconds`
- `homeless_mutter.mp3`: `Raspy old homeless man startled mutter "whoa whoa", 0.8 seconds`
- `cat_hiss.mp3`: `Angry alley cat hiss and short yowl, 0.7 seconds`
- `rat_squeak.mp3`: `Small rat fast squeaks while scurrying, 0.5 seconds`

### 3.6 Menu buttons (3)

- `ui_tap.mp3`: `Retro 8-bit menu button click blip, very short, 0.1 seconds`
- `ui_buy.mp3`: `Retro 8-bit purchase confirm sound, two quick rising notes, 0.4 seconds`
- `ui_denied.mp3`: `Retro 8-bit error buzz, short low two-note, 0.3 seconds`

---

## Step 4: Hand them to me

Tell me "the sounds are in ~/Downloads/audio". I will:

- rename and place them (`assets/audio/music/` and `assets/audio/sfx/`)
- check that each file plays, and list any that are missing, too long, or start with silence (so you can regenerate just those)

---

## Step 5: Listen in the game

1. In the project folder run: `python3 -m http.server 8080`
2. Open <http://localhost:8080> and tap once (browsers only play sound after a tap).
3. Play a bit of each level. Anything too loud, too long, or wrong? Tell me the file name.

## Step 6: Put it live

Tell me "publish the sounds". I'll commit, push, and the site updates in about a minute.

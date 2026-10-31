# Audio prompts

One copy-paste prompt per sound. Every sound is optional: until a file exists, the game plays its own code-made 8-bit sound.

## Walkthrough

1. **Music: Suno** (or Udio)
   - Pick *Custom*, turn on *Instrumental*.
   - Paste the prompt into *Style of Music*.
   - Paste the "Exclude" line into *Exclude styles* (so it doesn't drift to a Middle Eastern sound).
   - Make 2 versions, keep the one you like, download as MP3.
2. **Voices and effects: ElevenLabs Sound Effects**
   - Paste the prompt, set the length to the seconds listed, download as MP3.
3. **Name and save:** rename to the file name in the table, save into `assets/audio/music/` or `assets/audio/sfx/`.
   - Or drop everything in one folder (e.g. `~/Downloads/audio`) and tell me. I'll rename, check and place them.
4. **Test:** run `python3 -m http.server 8080` in the project folder, open <http://localhost:8080>, tap once to turn sound on.

Example: the Hadar music → `assets/audio/music/level1.mp3`. Mike's punch grunt → `assets/audio/sfx/mike_punch.mp3`.

## Rules

1. **MP3**, 44.1 kHz. Music stereo 128-192 kbps; sound effects mono 96-128 kbps.
2. **Trim silence** at the start of every sound effect, so hits feel instant.
3. **Short sounds.** Voices and hits under 1 second unless noted.
4. **Music must loop seamlessly**: the end flows straight back into the start. Ask for "seamless loop" and cut at a bar line.
5. **Even loudness.** Normalize everything to roughly the same volume (about -14 LUFS for music, peaks around -1 dB for effects).
6. All voices are wordless grunts and shouts, or 1-2 words at most. No long dialogue.

---

## Music (`assets/audio/music/`)

| File | Use | Length |
|---|---|---|
| `title.mp3` | title + gym screens | 60-90 s loop |
| `level1.mp3` | Hadar (sunset) | 60-90 s loop |
| `level2.mp3` | Upper Carmel (night) | 60-90 s loop |
| `level3.mp3` | Romema (late night, almost home) | 60-90 s loop |
| `boss.mp3` | every boss fight | 45-60 s loop |
| `victory.mp3` | stage clear / made it home | 6-10 s, no loop |
| `gameover.mp3` | K.O. screen | 5-8 s, no loop |

Style: 16-bit Sega Genesis arcade music, like Streets of Rage (Yuzo Koshiro): FM synth, funky basslines, 90s house and breakbeat drums.

**Exclude styles** (paste for every track):
```
Middle Eastern, Arabic, oud, darbuka, belly dance, ethnic, world music, vocals
```

**title.mp3**
```
16-bit Sega Genesis FM synth instrumental, retro beat 'em up title theme like Streets of Rage, confident heroic synth lead melody, punchy slap FM bass, 90s breakbeat drums, gritty urban arcade feel, 118 BPM, seamless loop, instrumental, no vocals
```

**level1.mp3** (Hadar, sunset downtown)
```
16-bit Sega Genesis FM synth instrumental, beat 'em up stage 1 theme like Streets of Rage, upbeat funky city groove, driving slap bass, catchy bright synth lead, 90s house piano stabs, warm sunset downtown street energy, 128 BPM, seamless loop, instrumental, no vocals
```

**level2.mp3** (Upper Carmel, night)
```
16-bit Sega Genesis FM synth instrumental, beat 'em up night stage theme like Streets of Rage 2, cool smooth late night city vibe, jazzy electric piano chords, deep rolling bass, crisp breakbeat, glittering arpeggios like city lights far below, minor key, 112 BPM, seamless loop, instrumental, no vocals
```

**level3.mp3** (Romema, late night, almost home)
```
16-bit Sega Genesis FM synth instrumental, final stage theme of a retro beat 'em up, tense and determined but hopeful, fast arpeggiated synth bass, soaring heroic lead, building energy, quiet sleeping neighborhood at 2am, almost home feeling, 140 BPM, seamless loop, instrumental, no vocals
```

**boss.mp3**
```
16-bit Sega Genesis FM synth instrumental, intense boss battle theme like Streets of Rage, aggressive distorted FM bass, alarm-like synth stabs, heavy techno drums, high energy danger, 155 BPM, seamless loop, instrumental, no vocals
```

**victory.mp3**
```
16-bit Sega Genesis FM synth short victory fanfare jingle, triumphant rising synth brass melody, ends on a strong major chord, 8 seconds, no loop, instrumental, no vocals
```

**gameover.mp3**
```
16-bit Sega Genesis FM synth short game over jingle, sad slow descending synth melody, ends softly, 6 seconds, no loop, instrumental, no vocals
```

Suno songs are often 2-3 minutes; that's fine, the game loops the whole file. Short jingles: if Suno makes them long, tell me and I'll trim.

---

## Mike (`assets/audio/sfx/`)

| File | Prompt |
|---|---|
| `mike_punch.mp3` | `Short sharp male martial artist exhale grunt "hah!" while throwing a punch, close mic, dry, 0.3 seconds` |
| `mike_kick.mp3` | `Short strong male martial arts kiai shout "hyah!" while kicking, close mic, dry, 0.4 seconds` |
| `mike_jump.mp3` | `Short male effort grunt "hup" as he jumps, quiet, dry, 0.3 seconds` |
| `mike_hurt.mp3` | `Male fighter gets punched, short pained grunt "ugh", dry, 0.4 seconds` |
| `mike_knockdown.mp3` | `Male fighter knocked down, pained groan "aargh" as he falls, 0.8 seconds` |
| `mike_victory.mp3` | `Confident male fighter short victory shout "yeah!", 0.6 seconds` |

## Hits and actions

| File | Prompt |
|---|---|
| `hit_light.mp3` | `Retro arcade punch impact sound, fast fleshy slap thump, beat 'em up hit, 0.2 seconds` |
| `hit_heavy.mp3` | `Heavy retro arcade kick impact, deep punchy thud with crunch, beat 'em up hit, 0.3 seconds` |
| `whoosh.mp3` | `Fast air swish of a missed punch, short whoosh, 0.25 seconds` |
| `body_fall.mp3` | `Body falling on a city sidewalk, heavy dull thud, 0.4 seconds` |
| `item_drop.mp3` | `Retro 8-bit item appears sparkle chime, short, 0.4 seconds` |
| `item_pickup.mp3` | `Retro 8-bit item pickup sound, quick rising coin-like blip, 0.3 seconds` |
| `level_up.mp3` | `Retro 8-bit level up jingle, fast rising arpeggio, bright, 1 second` |
| `boss_warning.mp3` | `Retro 8-bit warning alarm, two-tone siren beeps, danger, 1.5 seconds` |

## Criminals

| File | Prompt |
|---|---|
| `thug_taunt.mp3` | `Big tough street thug, deep voice, short threatening laugh "heh heh", 0.8 seconds` |
| `thug_hurt.mp3` | `Big heavy man gets punched, deep short grunt "oof", 0.3 seconds` |
| `thug_ko.mp3` | `Big heavy man knocked out, long deep groan falling, 0.8 seconds` |
| `runner_taunt.mp3` | `Young cocky street punk, short mocking whistle and "yo!", 0.7 seconds` |
| `runner_hurt.mp3` | `Skinny young man gets hit, short high yelp "ah!", 0.3 seconds` |
| `runner_ko.mp3` | `Skinny young man knocked out, whiny cry "aaaah" falling, 0.7 seconds` |

## Bosses

| File | Prompt |
|---|---|
| `big_tony_intro.mp3` | `Huge gang enforcer, very deep booming voice, menacing laugh "ha ha ha", 1.5 seconds` |
| `big_tony_hurt.mp3` | `Huge man grunts in anger after being hit, very deep "hngh", 0.4 seconds` |
| `big_tony_enrage.mp3` | `Huge man furious roar, very deep, like a bull, 1.5 seconds` |
| `big_tony_ko.mp3` | `Huge man defeated, long deep falling groan, 1.2 seconds` |
| `viper_intro.mp3` | `Lean fast fighter, sharp voice, short hiss then cold laugh, 1.2 seconds` |
| `viper_hurt.mp3` | `Fast fighter gets hit, short sharp grunt "tch", 0.3 seconds` |
| `viper_enrage.mp3` | `Fighter angry snake-like hiss then shout "hyaaa!", 1.2 seconds` |
| `viper_ko.mp3` | `Fighter defeated, breathless pained cry falling, 1 second` |
| `the_chief_intro.mp3` | `Old crime boss, gravelly deep voice, slow evil chuckle, 1.5 seconds` |
| `the_chief_hurt.mp3` | `Old heavy man hit, gravelly deep grunt, 0.4 seconds` |
| `the_chief_enrage.mp3` | `Old crime boss furious gravelly roar, 1.5 seconds` |
| `the_chief_ko.mp3` | `Old heavy man defeated, long gravelly groan collapsing, 1.5 seconds` |

## Background characters

| File | Prompt |
|---|---|
| `woman_scream.mp3` | `Young woman short frightened scream "ah!" and gasp, 0.8 seconds` |
| `old_man_grumble.mp3` | `Old man annoyed wordless grumble "hrmph" and mumbling, 1.2 seconds` |
| `homeless_mutter.mp3` | `Raspy old homeless man startled mutter "whoa whoa", 0.8 seconds` |
| `cat_hiss.mp3` | `Angry alley cat hiss and short yowl, 0.7 seconds` |
| `rat_squeak.mp3` | `Small rat fast squeaks while scurrying, 0.5 seconds` |

## Menus

| File | Prompt |
|---|---|
| `ui_tap.mp3` | `Retro 8-bit menu button click blip, very short, 0.1 seconds` |
| `ui_buy.mp3` | `Retro 8-bit purchase confirm sound, two quick rising notes, 0.4 seconds` |
| `ui_denied.mp3` | `Retro 8-bit error buzz, short low two-note, 0.3 seconds` |

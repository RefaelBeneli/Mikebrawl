// Sound effects: id -> MP3 file (optional, see docs/audio/prompts.md) + code-made fallback.
// Layer fields: wave ("noise" or an oscillator type), from/to Hz, dur, vol, delay, attack, detune (cents),
// filter { type, freq, to (sweep target), q }.
const tone = (wave, from, to, dur, vol = 0.2, delay = 0, extra = {}) => ({ wave, from, to, dur, vol, delay, ...extra });
const noise = (dur, vol, freq, type = "lowpass", delay = 0, extra = {}) => ({ wave: "noise", dur, vol, delay, ...extra, filter: { type, freq, ...extra.filter } });
const notes = (wave, list, vol = 0.15) => {
  let delay = 0;
  return list.map(([freq, dur]) => {
    const layer = tone(wave, freq, null, dur, vol, delay, { filter: { type: "lowpass", freq: 5000 } });
    delay += dur;
    return layer;
  });
};

// A grunt: two slightly mistuned saws through a closing low-pass, plus a breathy "mouth" band of noise.
const voice = (from, to, dur, vol = 0.18, delay = 0) => {
  const throat = (detune) => tone("sawtooth", from, to, dur, vol * 0.55, delay, { attack: 0.012, detune, filter: { type: "lowpass", freq: from * 7, to: to * 3, q: 3 } });
  return [
    throat(-14),
    throat(14),
    noise(dur * 0.8, vol * 0.5, from * 5, "bandpass", delay, { attack: 0.01, filter: { to: to * 4, q: 5 } }),
    noise(0.05, vol * 0.25, 3000, "highpass", delay),
  ];
};

// Impacts: a sharp click, a falling thump, and a crunch of filtered noise.
const impact = (thump, vol) => [
  noise(0.025, vol, 3500, "highpass"),
  tone("sine", thump * 1.8, thump * 0.5, 0.16, vol * 1.1),
  noise(0.14, vol * 0.8, 1800, "lowpass", 0, { filter: { to: 300 } }),
];

const whoosh = (dur = 0.16, vol = 0.16) => [noise(dur, vol, 700, "bandpass", 0, { attack: dur * 0.4, filter: { to: 3500, q: 2 } })];

const defs = {
  mike_punch: { synth: [...voice(220, 140, 0.13), ...whoosh(0.1, 0.08)], jitter: 0.08 },
  mike_kick: { synth: [...voice(250, 150, 0.18), ...whoosh(0.16, 0.1)], jitter: 0.08 },
  mike_jump: { synth: [tone("square", 220, 520, 0.12, 0.07, 0, { filter: { type: "lowpass", freq: 2500 } }), ...whoosh(0.12, 0.06)], jitter: 0.05 },
  mike_hurt: { synth: voice(340, 160, 0.22, 0.2), jitter: 0.08 },
  mike_knockdown: { synth: [...voice(300, 90, 0.5, 0.2), tone("sine", 110, 35, 0.3, 0.4, 0.35)] },
  mike_victory: { synth: notes("square", [[523, 0.1], [659, 0.1], [784, 0.1], [1047, 0.3]], 0.12) },

  hit_light: { synth: impact(130, 0.32), jitter: 0.1 },
  hit_heavy: { synth: [...impact(85, 0.42), tone("square", 90, 40, 0.12, 0.08, 0, { filter: { type: "lowpass", freq: 600 } })], jitter: 0.08 },
  whoosh: { synth: whoosh(), jitter: 0.15 },
  body_fall: {
    synth: [
      tone("sine", 110, 35, 0.3, 0.45),
      noise(0.25, 0.3, 600, "lowpass", 0, { filter: { to: 150 } }),
      tone("sine", 80, 35, 0.15, 0.2, 0.14),
      noise(0.12, 0.12, 500, "lowpass", 0.14),
    ],
  },
  item_drop: { synth: notes("triangle", [[880, 0.06], [1175, 0.06], [1568, 0.14]], 0.16) },
  item_pickup: { synth: [tone("square", 660, 1320, 0.1, 0.08), tone("square", 990, 1980, 0.12, 0.06, 0.08)] },
  level_up: { synth: notes("square", [[523, 0.08], [659, 0.08], [784, 0.08], [1047, 0.08], [1319, 0.3]], 0.11) },
  boss_warning: { synth: notes("square", [[880, 0.18], [660, 0.18], [880, 0.18], [660, 0.18]], 0.11) },

  thug_taunt: { synth: [...voice(120, 95, 0.25), ...voice(110, 85, 0.3, 0.18, 0.28)], jitter: 0.05 },
  thug_hurt: { synth: voice(150, 95, 0.16), jitter: 0.1 },
  thug_ko: { synth: [...voice(140, 55, 0.6), tone("sine", 100, 35, 0.25, 0.3, 0.45)] },
  runner_taunt: { synth: [tone("sine", 1200, 1800, 0.12, 0.12), tone("sine", 1800, 1100, 0.18, 0.12, 0.14)] },
  runner_hurt: { synth: voice(440, 270, 0.12), jitter: 0.1 },
  runner_ko: { synth: voice(460, 130, 0.5) },

  big_tony_intro: { synth: [...voice(95, 75, 0.5, 0.24), ...voice(85, 65, 0.6, 0.22, 0.5)] },
  big_tony_hurt: { synth: voice(105, 72, 0.22, 0.22), jitter: 0.05 },
  big_tony_enrage: { synth: voice(70, 120, 1.2, 0.26) },
  big_tony_ko: { synth: [...voice(105, 35, 1, 0.24), tone("sine", 90, 30, 0.4, 0.45, 0.8)] },
  viper_intro: { synth: [noise(0.5, 0.15, 6000, "highpass", 0, { attack: 0.2 }), ...voice(320, 270, 0.4, 0.17, 0.45)] },
  viper_hurt: { synth: voice(360, 250, 0.13), jitter: 0.08 },
  viper_enrage: { synth: [noise(0.4, 0.18, 6000, "highpass", 0, { attack: 0.15 }), ...voice(280, 430, 0.5, 0.18, 0.4)] },
  viper_ko: { synth: voice(380, 120, 0.8) },
  the_chief_intro: { synth: [...voice(105, 90, 0.5, 0.2), ...voice(95, 80, 0.6, 0.2, 0.55)] },
  the_chief_hurt: { synth: voice(120, 82, 0.22, 0.2), jitter: 0.05 },
  the_chief_enrage: { synth: voice(80, 125, 1.3, 0.26) },
  the_chief_ko: { synth: [...voice(115, 30, 1.3, 0.22), tone("sine", 90, 30, 0.4, 0.45, 1.1)] },

  woman_scream: { synth: voice(900, 1250, 0.45, 0.12) },
  old_man_grumble: { synth: [...voice(130, 115, 0.3, 0.13), ...voice(120, 100, 0.35, 0.13, 0.32)] },
  homeless_mutter: { synth: [...voice(170, 150, 0.2, 0.11), ...voice(160, 140, 0.25, 0.11, 0.25)] },
  cat_hiss: { synth: [noise(0.45, 0.2, 4500, "highpass", 0, { attack: 0.05 }), ...voice(700, 420, 0.3, 0.07, 0.4)] },
  rat_squeak: { synth: notes("square", [[2200, 0.05], [2600, 0.05], [2300, 0.06]], 0.06), jitter: 0.1 },

  ui_tap: { synth: [tone("square", 800, null, 0.04, 0.07, 0, { filter: { type: "lowpass", freq: 3000 } })] },
  ui_buy: { synth: notes("square", [[660, 0.07], [990, 0.14]], 0.1) },
  ui_denied: { synth: [tone("square", 200, 150, 0.2, 0.09, 0, { filter: { type: "lowpass", freq: 1200 } })] },
};

// Recorded files: hits/menus from Kenney.nl packs (CC0), voices recorded for the game.
// One variant plays at random; volume matches them to the code-made sounds.
// Ids not listed here use the code-made sound.
const sfx = (name) => `assets/audio/sfx/${name}.wav`;
const variants = (id, count) => Array.from({ length: count }, (_, i) => sfx(`${id}_${i + 1}`));
// The voice recordings peak near full scale, so they play well below 1.
const VOICE_VOLUME = 0.35;
const voices = (volume, counts) =>
  Object.fromEntries(Object.entries(counts).map(([id, count]) => [id, { files: variants(id, count), volume }]));
const recorded = {
  hit_light: { files: variants("hit_light", 5), volume: 0.6 },
  hit_heavy: { files: variants("hit_heavy", 5), volume: 0.65 },
  body_fall: { files: variants("body_fall", 5), volume: 0.55 },
  ui_tap: { files: [sfx("ui_tap")], volume: 0.8 },
  ui_buy: { files: [sfx("ui_buy")], volume: 0.4 },
  ui_denied: { files: [sfx("ui_denied")], volume: 0.45 },
  item_drop: { files: [sfx("item_drop")], volume: 0.9 },
  item_pickup: { files: [sfx("item_pickup")], volume: 0.45 },
  ...voices(VOICE_VOLUME, {
    mike_punch: 2,
    mike_kick: 2,
    mike_hurt: 2,
    mike_knockdown: 1,
    thug_taunt: 1,
    thug_hurt: 2,
    thug_ko: 1,
    runner_taunt: 1,
    runner_hurt: 2,
    runner_ko: 1,
    big_tony_intro: 1,
    big_tony_hurt: 1,
    big_tony_enrage: 1,
    big_tony_ko: 1,
    viper_intro: 1,
    viper_hurt: 1,
    viper_enrage: 1,
    viper_ko: 1,
    the_chief_intro: 1,
    the_chief_hurt: 1,
    the_chief_enrage: 1,
    the_chief_ko: 1,
    woman_scream: 1,
    old_man_grumble: 1,
    homeless_mutter: 1,
  }),
};

export default Object.fromEntries(Object.entries(defs).map(([id, def]) => [id, { files: [], ...recorded[id], ...def }]));

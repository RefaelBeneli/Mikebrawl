// Sound effects: id -> MP3 file (optional, see docs/audio/prompts.md) + code-made fallback.
const tone = (wave, from, to, dur, vol = 0.2, delay = 0) => ({ wave, from, to, dur, vol, delay });
const noise = (dur, vol, freq, type = "lowpass", delay = 0) => ({ wave: "noise", dur, vol, filter: { type, freq }, delay });
const notes = (wave, list, vol = 0.15) => {
  let delay = 0;
  return list.map(([freq, dur]) => {
    const layer = tone(wave, freq, null, dur, vol, delay);
    delay += dur;
    return layer;
  });
};

const voice = (from, to, dur, vol = 0.18) => [tone("sawtooth", from, to, dur, vol), noise(dur * 0.6, vol * 0.4, from * 4)];

const defs = {
  mike_punch: { synth: voice(200, 120, 0.12), jitter: 0.08 },
  mike_kick: { synth: voice(240, 140, 0.18), jitter: 0.08 },
  mike_jump: { synth: [tone("square", 220, 420, 0.12, 0.08)], jitter: 0.05 },
  mike_hurt: { synth: voice(320, 150, 0.2), jitter: 0.08 },
  mike_knockdown: { synth: voice(280, 80, 0.5) },
  mike_victory: { synth: notes("square", [[523, 0.1], [659, 0.1], [784, 0.25]]) },

  hit_light: { synth: [noise(0.08, 0.35, 1400), tone("sine", 180, 80, 0.08, 0.25)], jitter: 0.1 },
  hit_heavy: { synth: [noise(0.15, 0.45, 700), tone("sine", 130, 45, 0.18, 0.4)], jitter: 0.08 },
  whoosh: { synth: [noise(0.12, 0.08, 2500, "bandpass")], jitter: 0.15 },
  body_fall: { synth: [tone("sine", 90, 40, 0.25, 0.35), noise(0.2, 0.2, 400)] },
  item_drop: { synth: notes("triangle", [[880, 0.06], [1175, 0.06], [1568, 0.12]], 0.15) },
  item_pickup: { synth: [tone("square", 660, 1320, 0.12, 0.1)] },
  level_up: { synth: notes("square", [[523, 0.08], [659, 0.08], [784, 0.08], [1047, 0.3]], 0.12) },
  boss_warning: { synth: notes("square", [[880, 0.18], [660, 0.18], [880, 0.18], [660, 0.18]], 0.12) },

  thug_taunt: { synth: voice(110, 90, 0.4), jitter: 0.05 },
  thug_hurt: { synth: voice(140, 90, 0.15), jitter: 0.1 },
  thug_ko: { synth: voice(130, 50, 0.6) },
  runner_taunt: { synth: [tone("sine", 1200, 1800, 0.12, 0.12), tone("sine", 1800, 1100, 0.18, 0.12, 0.14)] },
  runner_hurt: { synth: voice(420, 260, 0.12), jitter: 0.1 },
  runner_ko: { synth: voice(440, 120, 0.5) },

  big_tony_intro: { synth: voice(90, 70, 0.8, 0.22) },
  big_tony_hurt: { synth: voice(100, 70, 0.2), jitter: 0.05 },
  big_tony_enrage: { synth: voice(70, 110, 1.2, 0.25) },
  big_tony_ko: { synth: voice(100, 35, 1) },
  viper_intro: { synth: [noise(0.5, 0.15, 6000, "highpass"), ...voice(300, 260, 0.4)] },
  viper_hurt: { synth: voice(340, 240, 0.12), jitter: 0.08 },
  viper_enrage: { synth: [noise(0.4, 0.18, 6000, "highpass"), tone("sawtooth", 280, 420, 0.5, 0.18, 0.4)] },
  viper_ko: { synth: voice(360, 120, 0.8) },
  the_chief_intro: { synth: voice(100, 85, 1, 0.2) },
  the_chief_hurt: { synth: voice(115, 80, 0.2), jitter: 0.05 },
  the_chief_enrage: { synth: voice(80, 120, 1.3, 0.25) },
  the_chief_ko: { synth: voice(110, 30, 1.3) },

  woman_scream: { synth: [tone("sawtooth", 900, 1250, 0.4, 0.1), tone("sine", 1250, 1000, 0.2, 0.08, 0.4)] },
  old_man_grumble: { synth: [tone("sawtooth", 130, 115, 0.3, 0.12), tone("sawtooth", 120, 100, 0.35, 0.12, 0.32)] },
  homeless_mutter: { synth: [tone("sawtooth", 170, 150, 0.2, 0.1), tone("sawtooth", 160, 140, 0.25, 0.1, 0.25)] },
  cat_hiss: { synth: [noise(0.45, 0.2, 4500, "highpass"), tone("sawtooth", 700, 400, 0.3, 0.06, 0.4)] },
  rat_squeak: { synth: notes("square", [[2200, 0.05], [2600, 0.05], [2300, 0.06]], 0.06), jitter: 0.1 },

  ui_tap: { synth: [tone("square", 800, null, 0.04, 0.08)] },
  ui_buy: { synth: notes("square", [[660, 0.07], [990, 0.14]], 0.1) },
  ui_denied: { synth: [tone("square", 200, 150, 0.2, 0.1)] },
};

export default Object.fromEntries(Object.entries(defs).map(([id, def]) => [id, { file: `assets/audio/sfx/${id}.mp3`, ...def }]));

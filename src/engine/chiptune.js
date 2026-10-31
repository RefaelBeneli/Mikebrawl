// Tiny step sequencer for code-made 8-bit music. Song format: see data/music.js.
const LOOKAHEAD_SECONDS = 0.12;
const TICK_MS = 25;
const NOTE_INDEX = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const NOTE_NAMES = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];
const PULSE_HARMONICS = 64;
const PAD_ATTACK = 0.04;
const PAD_RELEASE = 0.08;
const VIBRATO_DELAY = 0.12;

export function noteToMidi(note) {
  const match = /^([A-G])(#|b)?(-?\d)$/.exec(note);
  if (!match) throw new Error(`Bad note "${note}"`);
  const [, letter, accidental, octave] = match;
  const semitone = NOTE_INDEX[letter] + (accidental === "#" ? 1 : accidental === "b" ? -1 : 0);
  return (Number(octave) + 1) * 12 + semitone;
}

export function noteToFrequency(note) {
  return 440 * 2 ** ((noteToMidi(note) - 69) / 12);
}

export function transpose(note, semitones) {
  const midi = noteToMidi(note) + semitones;
  return `${NOTE_NAMES[((midi % 12) + 12) % 12]}${Math.floor(midi / 12) - 1}`;
}

export function parsePattern(pattern) {
  return pattern.trim().split(/\s+/).filter((token) => token !== "|");
}

// "C4+E4+G4" plays a chord.
export const stepNotes = (token) => token.split("+");

// Pulse waves with a narrow duty cycle: the thin, nasal NES lead sound.
const pulseCache = new WeakMap();
function pulseWave(ctx, duty) {
  const waves = pulseCache.get(ctx) ?? new Map();
  pulseCache.set(ctx, waves);
  if (!waves.has(duty)) {
    const real = new Float32Array(PULSE_HARMONICS);
    const imag = new Float32Array(PULSE_HARMONICS);
    for (let n = 1; n < PULSE_HARMONICS; n += 1) real[n] = (2 / (n * Math.PI)) * Math.sin(n * Math.PI * duty);
    waves.set(duty, ctx.createPeriodicWave(real, imag));
  }
  return waves.get(duty);
}

const PULSES = { pulse25: 0.25, pulse12: 0.125 };

function playTone(ctx, destination, { wave, frequency, start, duration, volume, pad, vibrato }) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  if (PULSES[wave]) osc.setPeriodicWave(pulseWave(ctx, PULSES[wave]));
  else osc.type = wave;
  osc.frequency.setValueAtTime(frequency, start);
  if (pad) {
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(volume, start + PAD_ATTACK);
    gain.gain.setValueAtTime(volume, Math.max(start + PAD_ATTACK, start + duration - PAD_RELEASE));
    gain.gain.linearRampToValueAtTime(0.0001, start + duration);
  } else {
    gain.gain.setValueAtTime(volume, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  }
  if (vibrato && duration > VIBRATO_DELAY * 2) {
    const lfo = ctx.createOscillator();
    const depth = ctx.createGain();
    lfo.frequency.value = vibrato.rate;
    depth.gain.setValueAtTime(0, start);
    depth.gain.linearRampToValueAtTime(vibrato.cents, start + VIBRATO_DELAY * 2);
    lfo.connect(depth).connect(osc.detune);
    lfo.start(start + VIBRATO_DELAY);
    lfo.stop(start + duration + 0.02);
  }
  osc.connect(gain).connect(destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

function playNoise(ctx, destination, noise, { start, duration, volume, filter, freq }) {
  const source = ctx.createBufferSource();
  const bandpass = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  source.buffer = noise;
  bandpass.type = filter;
  bandpass.frequency.value = freq;
  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  source.connect(bandpass).connect(gain).connect(destination);
  source.start(start);
  source.stop(start + duration + 0.02);
}

// k = kick, s = snare, h = closed hi-hat, o = open hi-hat.
function playDrum(ctx, destination, noise, kind, start, volume) {
  if (kind === "k") {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.setValueAtTime(160, start);
    osc.frequency.exponentialRampToValueAtTime(42, start + 0.1);
    gain.gain.setValueAtTime(volume * 1.1, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.18);
    osc.connect(gain).connect(destination);
    osc.start(start);
    osc.stop(start + 0.2);
    playNoise(ctx, destination, noise, { start, duration: 0.015, volume: volume * 0.3, filter: "lowpass", freq: 3000 });
    return;
  }
  if (kind === "s") {
    playNoise(ctx, destination, noise, { start, duration: 0.14, volume: volume * 0.75, filter: "highpass", freq: 1400 });
    playTone(ctx, destination, { wave: "triangle", frequency: 190, start, duration: 0.07, volume: volume * 0.5 });
    return;
  }
  const open = kind === "o";
  playNoise(ctx, destination, noise, { start, duration: open ? 0.22 : 0.035, volume: volume * 0.3, filter: "highpass", freq: 7000 });
}

// A feedback delay: notes repeat softly, which makes thin waves sound bigger.
function trackOutput(ctx, destination, track, stepSeconds) {
  const out = ctx.createGain();
  out.connect(destination);
  if (!track.echo) return out;
  const delay = ctx.createDelay(2);
  const feedback = ctx.createGain();
  const wet = ctx.createGain();
  delay.delayTime.value = track.echo.steps * stepSeconds;
  feedback.gain.value = track.echo.feedback;
  wet.gain.value = track.echo.mix;
  out.connect(delay).connect(feedback).connect(delay);
  delay.connect(wet).connect(destination);
  return out;
}

function holdLength(steps, index) {
  let hold = 1;
  while (steps[(index + hold) % steps.length] === "-" && hold < steps.length) hold += 1;
  return hold;
}

// Schedules every note of one 16th-note step (all tracks) at `time`.
function playStep(ctx, noise, tracks, step, time, stepSeconds) {
  tracks.forEach((track) => {
    const index = step % track.steps.length;
    const token = track.steps[index];
    if (token === "." || token === "-") return;
    if (track.wave === "drums") {
      [...token].forEach((kind) => playDrum(ctx, track.out, noise, kind, time, track.volume));
      return;
    }
    const duration = holdLength(track.steps, index) * stepSeconds * (track.gate ?? 0.9);
    const notes = stepNotes(token);
    const volume = track.volume / Math.sqrt(notes.length);
    notes.forEach((note) => {
      playTone(ctx, track.out, { wave: track.wave, frequency: noteToFrequency(note), start: time, duration, volume, pad: track.pad, vibrato: track.vibrato });
    });
  });
}

function prepare(ctx, destination, song) {
  const stepSeconds = 60 / song.bpm / 4;
  const tracks = Object.values(song.tracks).map((track) => ({
    ...track,
    steps: parsePattern(track.pattern),
    out: trackOutput(ctx, destination, track, stepSeconds),
  }));
  return { stepSeconds, tracks, length: Math.max(...tracks.map((track) => track.steps.length)) };
}

// Schedules a whole song at once, for offline rendering (checks and tests).
export function renderSong(ctx, destination, noise, song, steps) {
  const { stepSeconds, tracks } = prepare(ctx, destination, song);
  for (let step = 0; step < steps; step += 1) playStep(ctx, noise, tracks, step, step * stepSeconds, stepSeconds);
}

export function playSong(ctx, destination, noise, song, { loop = true } = {}) {
  const { stepSeconds, tracks, length } = prepare(ctx, destination, song);
  let step = 0;
  let nextTime = ctx.currentTime + 0.05;
  let stopped = false;
  let timer = null;

  function schedule() {
    if (stopped) return;
    while (nextTime < ctx.currentTime + LOOKAHEAD_SECONDS) {
      if (!loop && step >= length) {
        stopped = true;
        clearInterval(timer);
        return;
      }
      playStep(ctx, noise, tracks, step, nextTime, stepSeconds);
      step += 1;
      nextTime += stepSeconds;
    }
  }

  timer = setInterval(schedule, TICK_MS);
  schedule();
  return {
    stop() {
      stopped = true;
      clearInterval(timer);
    },
  };
}

// Tiny step sequencer for code-made 8-bit music. Song format: see data/music.js.
const LOOKAHEAD_SECONDS = 0.12;
const TICK_MS = 25;
const NOTE_INDEX = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

export function noteToFrequency(note) {
  const match = /^([A-G])(#|b)?(-?\d)$/.exec(note);
  if (!match) throw new Error(`Bad note "${note}"`);
  const [, letter, accidental, octave] = match;
  const semitone = NOTE_INDEX[letter] + (accidental === "#" ? 1 : accidental === "b" ? -1 : 0);
  const midi = (Number(octave) + 1) * 12 + semitone;
  return 440 * 2 ** ((midi - 69) / 12);
}

export function parsePattern(pattern) {
  return pattern.trim().split(/\s+/).filter((token) => token !== "|");
}

function playTone(ctx, destination, { wave, frequency, start, duration, volume }) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = wave;
  osc.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain).connect(destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

function playDrum(ctx, destination, noise, kind, start, volume) {
  if (kind === "k") {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.setValueAtTime(150, start);
    osc.frequency.exponentialRampToValueAtTime(40, start + 0.12);
    gain.gain.setValueAtTime(volume, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.15);
    osc.connect(gain).connect(destination);
    osc.start(start);
    osc.stop(start + 0.16);
    return;
  }
  const source = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  const duration = kind === "s" ? 0.12 : 0.04;
  source.buffer = noise;
  filter.type = "highpass";
  filter.frequency.value = kind === "s" ? 1500 : 6000;
  gain.gain.setValueAtTime(volume * (kind === "s" ? 0.8 : 0.35), start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  source.connect(filter).connect(gain).connect(destination);
  source.start(start);
  source.stop(start + duration + 0.02);
}

export function playSong(ctx, destination, noise, song, { loop = true } = {}) {
  const stepSeconds = 60 / song.bpm / 4;
  const tracks = Object.values(song.tracks).map((track) => ({ ...track, steps: parsePattern(track.pattern) }));
  const length = Math.max(...tracks.map((track) => track.steps.length));
  let step = 0;
  let nextTime = ctx.currentTime + 0.05;
  let stopped = false;
  let timer = null;

  function holdLength(steps, index) {
    let hold = 1;
    while (steps[(index + hold) % steps.length] === "-" && hold < steps.length) hold += 1;
    return hold;
  }

  function schedule() {
    if (stopped) return;
    while (nextTime < ctx.currentTime + LOOKAHEAD_SECONDS) {
      if (!loop && step >= length) {
        stopped = true;
        clearInterval(timer);
        return;
      }
      tracks.forEach((track) => {
        const index = step % track.steps.length;
        const token = track.steps[index];
        if (token === "." || token === "-") return;
        if (track.wave === "drums") {
          [...token].forEach((kind) => playDrum(ctx, destination, noise, kind, nextTime, track.volume));
          return;
        }
        const duration = holdLength(track.steps, index) * stepSeconds * (track.gate ?? 0.9);
        playTone(ctx, destination, { wave: track.wave, frequency: noteToFrequency(token), start: nextTime, duration, volume: track.volume });
      });
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

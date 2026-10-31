// Music: id -> MP3 file (optional, see docs/audio/prompts.md) + code-made chiptune fallback.
// Patterns are 16th-note steps: a note ("A4"), a chord ("C4+E4+G4"), "." = rest, "-" = hold previous note.
// "|" is a bar line: every bar must be exactly 16 steps.
// Drum tokens: k = kick, s = snare, h = closed hi-hat, o = open hi-hat (combine like "ks").
// Harmony is plain major/minor/dorian on purpose: no harmonic-minor or Phrygian colors.
import { transpose } from "../src/engine/chiptune.js";

const ECHO = { steps: 3, feedback: 0.3, mix: 0.25 };
const VIBRATO = { rate: 5.5, cents: 18 };

const lead = (pattern, volume = 0.06) => ({ wave: "pulse25", volume, pattern, vibrato: VIBRATO, echo: ECHO });
const chords = (pattern, volume = 0.035, wave = "pulse12") => ({ wave, volume, pattern, gate: 0.6 });
const pad = (pattern, volume = 0.05) => ({ wave: "triangle", volume, pattern, pad: true, gate: 1 });
const arp = (pattern, volume = 0.03) => ({ wave: "pulse12", volume, pattern, gate: 0.5, echo: ECHO });
const bass = (pattern, volume = 0.22) => ({ wave: "triangle", volume, pattern, gate: 0.8 });
const drums = (pattern, volume = 0.3) => ({ wave: "drums", volume, pattern });

const bars = (...list) => list.join(" | ");
const beat = (main, fill, total) => bars(...Array(total - 1).fill(main), fill);
const fillSteps = (tokens, map) => tokens.map(map).join(" ");

// One bar of bass from a root note; "R" = root, "O" = root an octave up.
const shape = (tokens) => (root) => fillSteps(tokens.split(" "), (t) => (t === "R" ? root : t === "O" ? transpose(root, 12) : t));
const pump = shape("R . O . R . O . R . O . R . O .");
const funk = shape("R . O . . R . O R . . O . R O .");
const drive = shape("R . R O . R O . R . R O . R O .");
const gallop = shape("R R O R R O R O R R O R R O R O");
const walk = (a, b, c, d) => `${a} - - - ${b} - - - ${c} - - - ${d} - - -`;

// Chord bars: a held pad, or short stabs on the off-beats.
const hold = (chord) => `${chord}${" -".repeat(15)}`;
const stabs = (chord) => `. . ${chord} . . . ${chord} . . . ${chord} . . . ${chord} .`;
const upDown = (chord, octave = 12) => {
  const notes = chord.split("+").map((note) => transpose(note, octave));
  const order = [...notes, ...notes.slice(1, -1).reverse()];
  return fillSteps([...Array(16).keys()], (i) => order[i % order.length]);
};

const C = "C4+E4+G4";
const Am = "A3+C4+E4";
const F = "A3+C4+F4";
const G = "B3+D4+G4";
const Dm = "D4+F4+A4";
const Bb = "Bb3+D4+F4";
const Em = "G3+B3+E4";
const D = "F#3+A3+D4";
const Cm = "G3+C4+Eb4";
const Ab = "Ab3+C4+Eb4";
const Fmaj7 = "F3+A3+C4+E4";
const Em7 = "E3+G3+B3+D4";
const Dm7 = "D3+F3+A3+C4";
const Cmaj7 = "C3+E3+G3+B3";
const G7 = "G3+B3+D4+F4";

const songs = {
  title: {
    bpm: 120,
    tracks: {
      lead: lead(
        bars(
          "E5 - - - G5 - - - C6 - - - B5 - A5 -",
          "G5 - - - E5 - - - A5 - - - - - . .",
          "F5 - - - A5 - - - C6 - - - D6 - C6 -",
          "B5 - - - - - - - G5 - A5 - B5 - D6 -",
          "E6 - - - D6 - C6 - G5 - - - E5 - G5 -",
          "A5 - - - - - G5 - A5 - C6 - E6 - - -",
          "F6 - - - E6 - D6 - C6 - - - A5 - C6 -",
          "D6 - - - - - - - B5 - - - G5 - - -",
        ),
        0.05,
      ),
      pad: pad(bars(...[C, Am, F, G, C, Am, F, G].map(hold))),
      bass: bass(bars(...["C2", "A1", "F1", "G1", "C2", "A1", "F1", "G1"].map(pump))),
      drums: drums(beat("k . h . s . h . k . h k s . h .", "k . h . s . h . k . s . s s s s", 8)),
    },
  },
  level1: {
    bpm: 128,
    tracks: {
      lead: lead(
        bars(
          "D5 - F5 - A5 - G5 - F5 - D5 - . . C5 -",
          "D5 - - - B4 - - - G4 - A4 - B4 - D5 -",
          "F5 - - - E5 - D5 - A5 - - - G5 - F5 -",
          "G5 - - - - - - - . . B4 - D5 - G5 -",
          "F5 - - - D5 - - - Bb4 - - - D5 - F5 -",
          "G5 - - - E5 - - - C5 - - - E5 - G5 -",
          "A5 - - - G5 - F5 - E5 - D5 - C5 - D5 -",
          "D5 - - - - - - - . . . . . . . .",
        ),
      ),
      chords: chords(bars(...[Dm, G, Dm, G, Bb, C, Dm, Dm].map(stabs))),
      bass: bass(bars(...["D2", "G1", "D2", "G1", "Bb1", "C2", "D2", "D2"].map(funk))),
      drums: drums(beat("k . h k s . h . . k h . s . o .", "k . h k s . h . s . s s s . s s", 4)),
    },
  },
  level2: {
    bpm: 112,
    tracks: {
      lead: lead(
        bars(
          "E5 - - - - - C5 - A4 - - - C5 - E5 -",
          "D5 - - - - - B4 - G4 - - - . . . .",
          "C5 - - - D5 - F5 - A5 - - - G5 - F5 -",
          "E5 - - - - - - - - - - - . . . .",
          "A5 - - - G5 - A5 - C6 - - - A5 - G5 -",
          "G5 - - - E5 - - - B4 - - - D5 - E5 -",
          "F5 - - - E5 - D5 - C5 - - - A4 - C5 -",
          "D5 - - - - - - - B4 - - - . . . .",
        ),
        0.05,
      ),
      pad: pad(bars(...[Fmaj7, Em7, Dm7, Cmaj7, Fmaj7, Em7, Dm7, G7].map(hold)), 0.06),
      bass: bass(
        bars(
          walk("F2", "A2", "C3", "E2"),
          walk("E2", "G2", "B2", "D2"),
          walk("D2", "F2", "A2", "B1"),
          walk("C2", "E2", "G2", "E2"),
          walk("F2", "A2", "C3", "E2"),
          walk("E2", "G2", "B2", "D2"),
          walk("D2", "F2", "A2", "F2"),
          walk("G2", "B2", "D2", "G1"),
        ),
        0.2,
      ),
      drums: drums(beat("k . . h s . . h k . h . s . . h", "k . . h s . . h k . s . s . s s", 4), 0.24),
    },
  },
  level3: {
    bpm: 140,
    tracks: {
      lead: lead(
        bars(
          "B4 - E5 - G5 - B5 - A5 - G5 - F#5 - E5 -",
          "G5 - - - E5 - - - C5 - E5 - G5 - - -",
          "D5 - G5 - B5 - D6 - C6 - B5 - A5 - G5 -",
          "A5 - - - - - - - F#5 - - - D5 - - -",
          "E6 - - - D6 - B5 - G5 - - - B5 - E6 -",
          "E6 - - - C6 - - - G5 - - - C6 - E6 -",
          "F#6 - - - E6 - D6 - A5 - - - D6 - F#6 -",
          "D6 - - - - - - - . . . . . . . .",
        ),
        0.05,
      ),
      arp: arp(bars(...[Em, C, G, D, Em, C, D, D].map((chord) => upDown(chord)))),
      bass: bass(bars(...["E2", "C2", "G1", "D2", "E2", "C2", "D2", "D2"].map(drive))),
      drums: drums(beat("k . h . s . h k k . h . s . o .", "k . h . s . h k s s . s s s s s", 4)),
    },
  },
  boss: {
    bpm: 155,
    tracks: {
      lead: lead(
        bars(
          "C5 . C5 . Eb5 . G5 . C6 - - - Bb5 - G5 -",
          "Ab5 - - - G5 - Eb5 - C5 - - - Eb5 - - -",
          "D5 . D5 . F5 . Bb5 . D6 - - - C6 - Bb5 -",
          "C6 - - - - - - - G5 - Eb5 - C5 - - -",
        ),
        0.06,
      ),
      chords: chords(bars(...[Cm, Ab, Bb, Cm].map(stabs)), 0.04),
      bass: bass(bars(...["C2", "Ab1", "Bb1", "C2"].map(gallop))),
      drums: drums(beat("k h s h k h s h k k s h k h s o", "k h s h k h s h k s s s ks s ks s", 4), 0.34),
    },
  },
  victory: {
    bpm: 150,
    loop: false,
    tracks: {
      lead: lead(bars("G4 C5 E5 G5 - - E5 G5 - - - - C6 - - -", "- - - - - - - - . . . . . . . ."), 0.07),
      pad: pad(bars(hold(C), "- - - - - - - - . . . . . . . .")),
      bass: bass(bars("C3 - - - - - G2 - - - - - C2 - - -", "- - - - - - - - . . . . . . . .")),
      drums: drums(bars("k . . . k . . . s . . . ks . . .", "o . . . . . . . . . . . . . . .")),
    },
  },
  gameover: {
    bpm: 100,
    loop: false,
    tracks: {
      lead: lead(bars("E5 - - D5 - - C5 - - B4 - - A4 - - -", "- ".repeat(16).trim()), 0.08),
      pad: pad(bars("A3+C4+E4 - - - - - - - F3+A3+C4 - - - - - - -", hold(Am))),
      bass: bass(bars("A2 - - - - - - - F2 - - - - - - -", hold("A1"))),
    },
  },
};

export default Object.fromEntries(
  Object.entries(songs).map(([id, song]) => [id, { file: `assets/audio/music/${id}.mp3`, loop: song.loop !== false, song }]),
);

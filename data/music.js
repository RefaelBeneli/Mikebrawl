// Music: id -> MP3 file (optional, see docs/audio/prompts.md) + code-made chiptune fallback.
// Patterns are 16th-note steps: a note ("A4"), "." = rest, "-" = hold previous note. "|" is only a visual bar line.
// Drum tokens: k = kick, s = snare, h = hi-hat (combine like "ks").

const lead = (pattern, volume = 0.07) => ({ wave: "square", volume, pattern });
const bass = (pattern, volume = 0.22) => ({ wave: "triangle", volume, pattern, gate: 0.8 });
const drums = (pattern, volume = 0.3) => ({ wave: "drums", volume, pattern });

const songs = {
  title: {
    bpm: 120,
    tracks: {
      lead: lead("C5 - - - E5 - G5 - | A5 - - - G5 - E5 - | F5 - - - A5 - C6 - | B5 - - - G5 - D5 -"),
      bass: bass("C3 . G2 . C3 . G2 . | A2 . E2 . A2 . E2 . | F2 . C3 . F2 . C3 . | G2 . D3 . G2 . B2 ."),
      drums: drums("k . h . s . h . k . h k s . h ."),
    },
  },
  level1: {
    bpm: 140,
    tracks: {
      lead: lead(
        "A4 - - C5 - - E5 - D5 - C5 - B4 - C5 - | A4 - - - - - . . F4 - A4 - C5 - A4 - | " +
          "B4 - - D5 - - G5 - F5 - E5 - D5 - B4 - | E5 - - - D5 - C5 - B4 - - - G#4 - - -",
      ),
      bass: bass(
        "A2 . A3 . A2 . A3 . A2 . A3 . A2 . A3 . | F2 . F3 . F2 . F3 . F2 . F3 . F2 . F3 . | " +
          "G2 . G3 . G2 . G3 . G2 . G3 . G2 . G3 . | E2 . E3 . E2 . E3 . G#2 . G#3 . B2 . B3 .",
      ),
      drums: drums("k . h . s . h . k k h . s . h ."),
    },
  },
  level2: {
    bpm: 130,
    tracks: {
      lead: lead(
        "D5 - - - . . F5 - E5 - D5 - . . A4 - | Bb4 - - - . . D5 - C5 - Bb4 - . . F4 - | " +
          "C5 - - - . . E5 - G5 - E5 - . . C5 - | A4 - - - C#5 - - - E5 - - - . . . .",
      ),
      bass: bass(
        "D2 F2 A2 D3 A2 F2 D2 F2 A2 D3 A2 F2 D2 F2 A2 F2 | Bb1 D2 F2 Bb2 F2 D2 Bb1 D2 F2 Bb2 F2 D2 Bb1 D2 F2 D2 | " +
          "C2 E2 G2 C3 G2 E2 C2 E2 G2 C3 G2 E2 C2 E2 G2 E2 | A1 C#2 E2 A2 E2 C#2 A1 C#2 E2 A2 E2 C#2 A1 C#2 E2 C#2",
        0.18,
      ),
      drums: drums("k . . h s . . h k . k h s . . h"),
    },
  },
  level3: {
    bpm: 150,
    tracks: {
      lead: lead(
        "E5 - G5 - B5 - - - A5 - G5 - F#5 - G5 - | E5 - - - C5 - E5 - G5 - - - E5 - - - | " +
          "F#5 - A5 - D6 - - - C6 - B5 - A5 - F#5 - | B5 - - - A5 - - - G5 - - - F#5 - - -",
      ),
      bass: bass(
        "E2 . E2 E3 . E2 E3 . E2 . E2 E3 . E2 E3 . | C2 . C2 C3 . C2 C3 . C2 . C2 C3 . C2 C3 . | " +
          "D2 . D2 D3 . D2 D3 . D2 . D2 D3 . D2 D3 . | B1 . B1 B2 . B1 B2 . B1 . B1 B2 . B1 B2 .",
      ),
      drums: drums("k . h k s . h . k . h k s . h h"),
    },
  },
  boss: {
    bpm: 160,
    tracks: {
      lead: lead("C5 . C5 . Eb5 . C5 . Gb5 - F5 - Eb5 - Db5 - | C5 . C5 . Eb5 . G5 . B5 - - - G5 - - -", 0.08),
      bass: bass("C2 C2 C3 C2 C2 C3 C2 C3 | Db2 Db2 Db3 Db2 Db2 Db3 Db2 Db3 | C2 C2 C3 C2 C2 C3 C2 C3 | B1 B1 B2 B1 G1 G1 G2 G1"),
      drums: drums("k h s h k h s h k k s h k h s s", 0.35),
    },
  },
  victory: {
    bpm: 150,
    loop: false,
    tracks: {
      lead: lead("C5 E5 G5 C6 - - G5 C6 - - - - - - - -", 0.09),
      bass: bass("C3 - - - - - G2 C3 - - - - - - - -"),
      drums: drums("k . . . k . . . s . . . . . . ."),
    },
  },
  gameover: {
    bpm: 100,
    loop: false,
    tracks: {
      lead: lead("G4 - - F#4 - - F4 - - E4 - - - - - -", 0.08),
      bass: bass("C3 - - - B2 - - - Bb2 - - - A2 - - -"),
    },
  },
};

export default Object.fromEntries(
  Object.entries(songs).map(([id, song]) => [id, { file: `assets/audio/music/${id}.mp3`, loop: song.loop !== false, song }]),
);

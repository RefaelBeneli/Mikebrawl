import { playSong } from "./chiptune.js";

const SETTINGS_KEY = "mikebrawl.audio.v1";
const DEFAULT_SETTINGS = { muted: false, music: 0.5, sfx: 0.8 };
const MUSIC_FADE_SECONDS = 0.4;
const MAX_SFX_PER_ID_PER_SECOND = 12;

function loadSettings() {
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? "{}") };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function makeNoise(ctx) {
  const buffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  return buffer;
}

async function loadBuffer(ctx, url) {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const bytes = await response.arrayBuffer();
    return await new Promise((resolve) => ctx.decodeAudioData(bytes, resolve, () => resolve(null)));
  } catch {
    return null;
  }
}

export function createAudio({ sounds, music }) {
  const settings = loadSettings();
  const buffers = new Map();
  const lastPlayed = new Map();
  let ctx = null;
  let buses = null;
  let noise = null;
  let wantedTrack = null;
  let current = null;

  function saveSettings() {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // Storage can be unavailable (private mode); settings then last for the session only.
    }
  }

  function applyVolumes() {
    if (!buses) return;
    buses.master.gain.value = settings.muted ? 0 : 1;
    buses.music.gain.value = settings.music;
    buses.sfx.gain.value = settings.sfx;
  }

  function loadFiles() {
    const entries = [...Object.entries(sounds), ...Object.entries(music).map(([id, def]) => [`music:${id}`, def])];
    entries.forEach(async ([key, def]) => {
      if (!def.file) return;
      const buffer = await loadBuffer(ctx, def.file);
      if (buffer) buffers.set(key, buffer);
      if (buffer && key === `music:${wantedTrack}` && current?.synth) startTrack(wantedTrack);
    });
  }

  function unlock() {
    if (!ctx) {
      const AudioContextClass = window.AudioContext ?? window.webkitAudioContext;
      if (!AudioContextClass) return;
      ctx = new AudioContextClass();
      buses = { master: ctx.createGain(), music: ctx.createGain(), sfx: ctx.createGain() };
      buses.music.connect(buses.master);
      buses.sfx.connect(buses.master);
      buses.master.connect(ctx.destination);
      noise = makeNoise(ctx);
      applyVolumes();
      loadFiles();
      const silence = ctx.createBufferSource();
      silence.buffer = ctx.createBuffer(1, 1, 22050);
      silence.connect(ctx.destination);
      silence.start(0);
    }
    if (ctx.state === "suspended") ctx.resume();
    if (wantedTrack && !current) startTrack(wantedTrack);
  }

  ["touchend", "pointerdown", "click", "keydown"].forEach((type) => window.addEventListener(type, unlock, { passive: true }));
  document.addEventListener("visibilitychange", () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend();
    else ctx.resume();
  });

  function synthLayer(layer, destination, start, rate) {
    const duration = layer.dur;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(layer.vol ?? 0.3, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    let source;
    if (layer.wave === "noise") {
      source = ctx.createBufferSource();
      source.buffer = noise;
      source.playbackRate.value = rate;
    } else {
      source = ctx.createOscillator();
      source.type = layer.wave;
      source.frequency.setValueAtTime(layer.from * rate, start);
      if (layer.to) source.frequency.exponentialRampToValueAtTime(layer.to * rate, start + duration);
    }
    let node = source;
    if (layer.filter) {
      const filter = ctx.createBiquadFilter();
      filter.type = layer.filter.type ?? "lowpass";
      filter.frequency.value = layer.filter.freq;
      node = node.connect(filter);
    }
    node.connect(gain).connect(destination);
    source.start(start);
    source.stop(start + duration + 0.02);
  }

  function playSynth(synth, rate) {
    const start = ctx.currentTime;
    synth.forEach((layer) => synthLayer(layer, buses.sfx, start + (layer.delay ?? 0), rate));
  }

  function sfx(id) {
    if (!id || !ctx || settings.muted) return;
    const def = sounds[id];
    if (!def) return;
    const now = ctx.currentTime;
    if (now - (lastPlayed.get(id) ?? -1) < 1 / MAX_SFX_PER_ID_PER_SECOND) return;
    lastPlayed.set(id, now);
    const rate = 1 + (Math.random() * 2 - 1) * (def.jitter ?? 0);
    const buffer = buffers.get(id);
    if (!buffer) {
      playSynth(def.synth, rate);
      return;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = rate;
    source.connect(buses.sfx);
    source.start();
  }

  function stopCurrent() {
    if (!current) return;
    const { gain, stop } = current;
    gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + MUSIC_FADE_SECONDS);
    setTimeout(stop, MUSIC_FADE_SECONDS * 1000 + 50);
    current = null;
  }

  function startTrack(id) {
    stopCurrent();
    const def = music[id];
    if (!def) return;
    const gain = ctx.createGain();
    gain.connect(buses.music);
    const loop = def.loop !== false;
    const buffer = buffers.get(`music:${id}`);
    if (buffer) {
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = loop;
      source.connect(gain);
      source.start();
      current = { id, gain, synth: false, stop: () => source.stop() };
    } else {
      const song = playSong(ctx, gain, noise, def.song, { loop });
      current = { id, gain, synth: true, stop: () => song.stop() };
    }
  }

  function playMusic(id) {
    wantedTrack = id;
    if (!ctx || current?.id === id) return;
    startTrack(id);
  }

  return {
    sfx,
    music: playMusic,
    get settings() {
      return { ...settings };
    },
    toggleMute() {
      settings.muted = !settings.muted;
      applyVolumes();
      saveSettings();
      return settings.muted;
    },
    setVolume(kind, value) {
      settings[kind] = Math.max(0, Math.min(1, value));
      applyVolumes();
      saveSettings();
    },
  };
}

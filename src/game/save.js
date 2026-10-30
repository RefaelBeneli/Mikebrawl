import { emptyMeta } from "./runState.js";

const META_KEY = "mikebrawl.meta.v1";
const RUN_KEY = "mikebrawl.run.v1";

function read(storage, key) {
  try {
    const raw = storage?.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function write(storage, key, value) {
  try {
    if (value === null) storage?.removeItem(key);
    else storage?.setItem(key, JSON.stringify(value));
  } catch {
    // Private mode or full storage: progress just won't persist.
  }
}

// A saved run is the run as it was at the start of a level, so Continue restarts that level.
export function createSave(storage = globalThis.localStorage) {
  return {
    loadMeta: () => ({ ...emptyMeta(), ...read(storage, META_KEY) }),
    saveMeta: (meta) => write(storage, META_KEY, meta),
    loadRun: () => read(storage, RUN_KEY),
    saveRun: (run) => write(storage, RUN_KEY, run),
    clearRun: () => write(storage, RUN_KEY, null),
  };
}

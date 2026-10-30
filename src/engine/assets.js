const images = new Map();

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export async function loadImages(sources, onProgress = () => {}) {
  const unique = [...new Set(sources)].filter((src) => !images.has(src));
  let done = 0;
  await Promise.all(
    unique.map(async (src) => {
      images.set(src, await loadImage(src));
      done += 1;
      onProgress(done / unique.length);
    }),
  );
}

export function getImage(src) {
  return src ? images.get(src) ?? null : null;
}

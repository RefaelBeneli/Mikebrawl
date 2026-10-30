// Offline support. Bump CACHE when shipping a new version so old files are dropped.
const CACHE = "mikebrawl-v1";

const sameOrigin = (url) => new URL(url, self.location.href).origin === self.location.origin;

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

// The page sends the files it already loaded, so the very first visit works offline next time.
self.addEventListener("message", (event) => {
  if (event.data?.type !== "cache") return;
  const urls = event.data.urls.filter(sameOrigin);
  event.waitUntil(caches.open(CACHE).then((cache) => Promise.all(urls.map((url) => cache.add(url).catch(() => null)))));
});

// Serve from cache right away, refresh the cached copy in the background.
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET" || !sameOrigin(request.url)) return;
  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(request, { ignoreSearch: true });
      const network = fetch(request)
        .then((response) => {
          if (response.ok) cache.put(request, response.clone());
          return response;
        })
        .catch(() => cached ?? Response.error());
      if (!cached) return network;
      event.waitUntil(network);
      return cached;
    }),
  );
});

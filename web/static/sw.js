/* OS dashboard service worker — local-first PWA.
 * Static assets are cached for fast loads and basic offline shell;
 * API calls and navigations always go to the network (live data only).
 */
const CACHE = "os-static-v1";
const PRECACHE = [
  "/",
  "/static/styles.css",
  "/static/app.js",
  "/static/logo.png",
  "/static/icon-192.png",
  "/static/icon-512.png",
  "/static/manifest.webmanifest",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  // Live data: never serve API from cache.
  if (url.pathname.startsWith("/api/")) return;
  e.respondWith(
    caches.match(e.request).then((hit) => {
      const net = fetch(e.request).then((res) => {
        if (res.ok && url.origin === self.location.origin) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
});

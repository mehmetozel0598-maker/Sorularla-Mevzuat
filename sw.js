const PREFIX = "sbvmy7c41-soru-bankasi-";
const CACHE = PREFIX + "v9";
const FILES = ["./", "index.html", "manifest.json", "icon-192.png", "icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith(PREFIX) && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function withTimeout(promise, ms) {
  return new Promise((resolve) => {
    const t = setTimeout(() => resolve(null), ms);
    promise.then((r) => { clearTimeout(t); resolve(r); }).catch(() => { clearTimeout(t); resolve(null); });
  });
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;
  const isPage = req.mode === "navigate" || url.pathname.endsWith("/") || url.pathname.endsWith("index.html");

  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      if (isPage) {
        const res = await withTimeout(fetch(req, { cache: "no-store" }), 4000);
        if (res && res.ok) {
          cache.put("index.html", res.clone());
          return res;
        }
        const shell = (await cache.match(req, { ignoreSearch: true })) || (await cache.match("index.html"));
        if (shell) return shell;
        return res || new Response("Çevrimdışı", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } });
      }
      const cached = await cache.match(req, { ignoreSearch: true });
      const fresh = fetch(req)
        .then((r) => { if (r && r.ok) cache.put(req, r.clone()); return r; })
        .catch(() => null);
      if (cached) { e.waitUntil(fresh); return cached; }
      const r = await fresh;
      return r || new Response("Çevrimdışı", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } });
    })
  );
});

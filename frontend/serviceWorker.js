const VERSION = "v1";
// eslint-disable-next-line no-unused-vars
const CACHE_NAME = `period-tracker-${VERSION}`;
// eslint-disable-next-line no-unused-vars
const APP_STATIC_RESOURCES = ["/api/auth/me", "/", "/api/posts/all"];

// install service worker

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      cache.addAll(APP_STATIC_RESOURCES);
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();

      await Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
      // eslint-disable-next-line no-undef
      await clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  if (!navigator.onLine) {
    // You might want to handle offline logic here (e.g., serving a cached response)
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cacheRes = await cache.match(event.request);

        if (cacheRes) {
          return cacheRes;
        }
      })
    );
  } else {
    event.respondWith(
      fetch(event.request)
        .then(async (res) => {
          if (event.request.method === "GET") {
            const cache = await caches.open(CACHE_NAME);
            const cacheResponse = await cache.match(event.request);

            if (cacheResponse) {
              return cacheResponse && fetch(event.request); // Return cached response
            } else {
              // Clone the response before caching, as the response can only be used once
              cache.put(event.request, res.clone());
              return res; // Return the fetched response
            }
          } else {
            return res;

            // Return response for other methods
          }
        })
        .catch((err) => {
          console.log("I am online error", err);
          // Handle fetch error (optional)
        })
    );
  }
});

const VERSION = "v1";
// eslint-disable-next-line no-unused-vars
const CACHE_NAME = `period-tracker-${VERSION}`;
// eslint-disable-next-line no-unused-vars
const APP_STATIC_RESOURCES = [];

// install service worker 

self.addEventListener("install", (event) => {
    event.waitUntil(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        cache.addAll(APP_STATIC_RESOURCES);
      })(),
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
          }),
        );
        // eslint-disable-next-line no-undef
        await clients.claim();
      })(),
    );
  });



  async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      return Response.error();
    }
  }
  
  self.addEventListener("fetch", (event) => {
    // eslint-disable-next-line no-undef

      event.respondWith(cacheFirst(event.request));
    
  });

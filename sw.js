const CACHE_NAME = "applied-pwa-cache-v1"; // Increment cache version on changes
const urlsToCache = [
  // IMPORTANT CHANGE HERE: Match your manifest's start_url
  "https://andrasapplied.netlify.app/", // The exact start_url from your manifest
  "/index.html", // Keep this as a fallback/redundancy, or if accessed directly
  "/src/assets/styles.css",
  "/src/theme.ts",
  "/src/main.ts",
  "/favicon.ico",
  "/manifest.json",
  "/fonts/inter-400.woff2",
  "/fonts/inter-700.woff2",
  "/fonts/inter-900.woff2",
  "/icons/icon-72x72.png",
  "/icons/icon-96x96.png",
  "/icons/icon-128x128.png",
  "/icons/icon-144x144.png",
  "/icons/icon-152x152.png",
  "/icons/icon-192x192.png",
  "/icons/icon-384x384.png",
  "/icons/icon-512x512.png",
  // Add any other static assets your app loads (e.g., other images, JSON data)
];

// Install Event: Caches specified assets
self.addEventListener("install", (event) => {
  console.log("Service Worker: Install event received.");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Caching App Shell assets.");
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error(
          "Service Worker: Cache addAll failed during install!",
          error
        );
      })
  );
});

// Fetch Event: Serves content from cache first, then network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request)
        .then((networkResponse) => {
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type !== "basic"
          ) {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        })
        .catch((error) => {
          console.error(
            "Service Worker: Fetch failed for:",
            event.request.url,
            error
          );
          // If the request is for the start_url and it fails, you might want to return a cached version
          // This ensures that if the app is launched while offline, it still shows something.
          if (event.request.url === "https://andrasapplied.netlify.app/") {
            return caches.match("https://andrasapplied.netlify.app/"); // Try to return the cached start_url
          }
          // For other requests, the browser will report a network error if not in cache
          throw error;
        });
    })
  );
});

// Activate Event: Cleans up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activate event received.");
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log("Service Worker: Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Optional: Intercept message events if you need communication between page and SW
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

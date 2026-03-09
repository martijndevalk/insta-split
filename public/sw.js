// Insta-Split Service Worker
// Required for PWA installability criteria

const CACHE_NAME = 'insta-split-v1';

// Trusted external origins (fonts only)
const TRUSTED_ORIGINS = [
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Clean up old caches
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Only allow same-origin or trusted external origins
  const isSameOrigin = url.origin === self.location.origin;
  const isTrusted = TRUSTED_ORIGINS.some((o) => url.origin === o);

  if (!isSameOrigin && !isTrusted) {
    event.respondWith(new Response('Blocked by service worker', { status: 403 }));
    return;
  }

  event.respondWith(fetch(event.request));
});

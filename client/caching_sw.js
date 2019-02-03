const cacheName = 'v1';

const cacheAssets = [
  'index.html',
  'client.js',
  'bootstrap-grid.min.css',
  'style.css',
  'drawEvents.js'
];

// Call install event
self.addEventListener('install', e => {
  console.log('Service worker installed...');

  e.waitUntil(
    caches
      .open(cacheName)
      .then(cache => {
        console.log('Service worker: Caching files');
        cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting())
  );
});

// Call activate event
self.addEventListener('activate', e => {
  console.log('Service worker activated...');
  //Remove unvanted caches
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== cacheName) {
            console.log('Service worker: Clearing old cache...');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', e => {
  console.log('Service worker fetching...');
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
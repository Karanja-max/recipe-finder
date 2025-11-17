//  This is the ENTIRE sw.js file 

const CACHE_NAME = 'recipe-finder-v1';
const ASSETS_TO_CACHE = [
    '/', // This caches the root (index.html)
    '/index.html',
    '/favorites.html',
    '/style.css',
    '/script.js',
    '/favorites.js',
    '/config.js'
    // We could also cache a placeholder image here
];

// 1. Install event: Cache all our assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Caching assets...');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// 2. Activate event: Clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== CACHE_NAME)
                .map(key => caches.delete(key))
            );
        })
    );
});

// 3. Fetch event: Serve from cache first, then network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return from cache if found
                if (response) {
                    return response;
                }

                // Otherwise, fetch from network
                return fetch(event.request);
            })
    );
});
// Service Worker for Dick Harper is a Tool PWA
const CACHE_NAME = 'dick-harper-v1.1.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles/styles.css',
    '/styles/bulma.min.css',
    '/javascript/script.js',
    '/images/favicon.png',
    '/images/social.png',
    '/video.mp4',
    'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap'
];

// Install event - cache resources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
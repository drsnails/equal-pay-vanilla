console.log('Service Worker Registered!');

let CACHE_NAME = 'equal-pay-v3';  // Update the version when you want to push new content

const urlsToCache = [
    'https://drsnails.github.io/equal-pay-vanilla/',
    'https://drsnails.github.io/equal-pay-vanilla/index.html',
    'https://drsnails.github.io/equal-pay-vanilla/manifest.json',
    'https://drsnails.github.io/equal-pay-vanilla/sw.js',
    'https://drsnails.github.io/equal-pay-vanilla/main.js',
    'https://drsnails.github.io/equal-pay-vanilla/services/utils.js',
    'https://drsnails.github.io/equal-pay-vanilla/services/storage.service.js',
    'https://drsnails.github.io/equal-pay-vanilla/services/transaction.service.js',
    'https://drsnails.github.io/equal-pay-vanilla/css/style.css',
    'https://drsnails.github.io/equal-pay-vanilla/right-arrow.svg',
    'https://drsnails.github.io/equal-pay-vanilla/img/logo-152.png',
]

self.addEventListener('install', event => {
    console.log('Installing service worker...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                // console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (CACHE_NAME !== cacheName && cacheName.startsWith('equal-pay')) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    if (event.request.url.startsWith('chrome-extension')) {
        return; // Don't handle chrome-extension:// URLs
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    console.log(event.request.url, 'FOUND IN CACHE');
                    return response;
                }
                console.log(event.request.url, '- NOT IN CACHE, FETCHED FROM NETWORK!');
                return fetch(event.request).then(response => {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    let responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    return response;
                });
            })
    );
});

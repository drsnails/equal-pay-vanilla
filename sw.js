
console.log('Service Worker Registered!');
// console.log('self!:', self)

// This function build an array of urls,
// fetch them, and store the responses in the cache,
// example: key: 'main.js' value: 'alert(3)'
self.addEventListener('install', event => {

    console.log('Installing service worker...');


    const urlsToCache = [
        // 'http://127.0.0.1:5500/',
        'https://drsnails.github.io/equal-pay-vanilla/',
        // 'http://127.0.0.1:5500/index.html',
        'https://drsnails.github.io/equal-pay-vanilla/index.html',
        // 'index.html',
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
    event.waitUntil(
        caches.open('my-cache1').then(cache => {
            return cache.addAll(urlsToCache)
        })
    )

})

self.addEventListener('fetch', event => {
    console.log('Fetch of: ', event.request.url)

    event.respondWith(
        // the response is resolved to null if there is no match 
        caches.match(event.request)
            .then(response => {
                var res = response

                if (!res) {
                    console.log(event.request.url, '- NOT IN CACHE, FETCHED FROM NETWORK!')
                    res = fetch(event.request)
                } else {
                    console.log(event.request.url, 'FOUND IN CACHE')
                }
                return res
            })
    )
})
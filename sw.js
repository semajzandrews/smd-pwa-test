var CACHE_SITE = 'smd-pwa-site-v.1.1.1.1';
var urlsToCache = [
'/index.html',
'/offline.html',
'/sample-pwa-shortcut-1.html',
'/sample-pwa-shortcut-2.html',
'/smd-pwa-test/css/pwa.css',
'/smd-pwa-test/js/pwa-controller.js',
'/manifest.json',
'/smd-pwa-test/img/favicon/logo.svg',
'/smd-pwa-test/img/favicon/favicon.ico',
'/smd-pwa-test/img/pwa/pwa.svg',
'/smd-pwa-test/img/pwa/512.png',
'/smd-pwa-test/img/pwa/maskable_icon.png',
'/smd-pwa-test/img/pwa/desc-1.png',
'/smd-pwa-test/img/pwa/desc-2.png',
'/smd-pwa-test/img/pwa/desc-3.png'
];
self.addEventListener('install', function(event) {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_SITE)
        .then(function(cache) {
            return cache.addAll(urlsToCache, {cache: 'reload'});
        })
        );
});
self.addEventListener('activate', event => {
    var cacheKeeplist = [CACHE_SITE];
    self.clients.claim();
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (cacheKeeplist.indexOf(key) === -1) {
                    console.log('SW: Updated.');
                    return caches.delete(key);
                }
            }));
        })

        );
});
self.addEventListener("fetch", (event) => {
    if ((event.request.method != 'POST')) { 
        event.respondWith(
            (async () => {
                try {
                    const networkResponse = await fetch(event.request);
                    return networkResponse;
                } catch (error) {
                    const cacheResponse = await caches.match(event.request);
                    if (cacheResponse) {
                        return cacheResponse;
                    }
                    const fallbackResponse = await caches.match('/sample-pwa/offline.html');
                    if (fallbackResponse) {
                        return fallbackResponse;
                    }
                }
            })()
            );
    }
});
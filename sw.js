var CACHE_SITE = 'smd-pwa-site-v.1.1.1.1';
var urlsToCache = [
'/new-index.html',
'/offline.html',
'/sample-pwa-shortcut-1.html',
'/sample-pwa-shortcut-2.html',
'/css/pwa.css',
'/js/pwa-controller.js',
'/manifest.json',
'/img/favicon/logo.svg',
'/img/favicon/favicon.ico',
'/img/pwa/pwa.svg',
'/img/pwa/512.png',
'/img/pwa/maskable_icon.png',
'/img/pwa/desc-1.png',
'/img/pwa/desc-2.png',
'/img/pwa/desc-3.png'
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
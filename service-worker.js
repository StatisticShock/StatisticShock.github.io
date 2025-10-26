self.addEventListener('install', (ev) => {
	ev.waitUntil(
		caches.open('index-cache').then((cache) => {
			return cache.addAll(['/', '/index.html', '/style.css', '/src/script.js', '/util/functions.js']);
		})
	);
});

self.addEventListener('fetch', (ev) => {
	const req = ev.request;

	if (req.url.endsWith('.webp')) {
		ev.respondWith(
			fetch(req).then(res => {
				const clone = res.clone();
				caches.open(index_cache).then(c => c.put(req, clone));
				return res;
			}).catch(() => caches.match(req))
		);
	} else {
		ev.respondWith(caches.match(req).then(cached => cached || fetch(req)));
	}
});
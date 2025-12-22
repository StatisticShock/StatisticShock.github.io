const cacheName = 'v2';
const cacheAssets = [
	'./index.html',
	'./404.html',
	'./update.html',
	'./src/script.js',
	'./src/shared.js',
	'./util/functions.js',
];
const cacheMaxTime = 15 * 60 * 1000; 	// 15 minutes
const isExpired = async (cache) => {
	const currentCache = await caches.open(cache);
	const meta = await currentCache.match('meta');

	if (!meta) return false;
	const { time } = await meta.json().catch(() => ({ time: 0 }));
	return (Date.now() - time) > cacheMaxTime;
};

const updateMeta = async () => {
	const cache = await caches.open(cacheName);
	await cache.put('meta', new Response(JSON.stringify({ time: Date.now() })));
};

self.addEventListener('install', (ev) => {
	console.info(`Service Worker ${cacheName}: installed.`);

	ev.waitUntil(
		caches
			.open(cacheName)
			.then(async (cache) => {
				console.info(`Service Worker ${cacheName}: caching files.`);
				await cache.addAll(cacheAssets);
				await cache.put('meta', new Response(JSON.stringify({ time: Date.now() })));
			})
			.then(() => self.skipWaiting())
	);
});

self.addEventListener('activate', (ev) => {
	console.info(`Service Worker ${cacheName}: activated.`);

	ev.waitUntil(
		caches.keys()
			.then((cacheNames) => {
				return Promise.all(
					cacheNames.map((cache) => {
						if (cache !== cacheName) {
							console.info(`Service Worker ${cacheName}: clearing old cache ${cache}`);
							return caches.delete(cache);
						};
					})
				);
			})
			.then(() => self.clients.claim())
	);

	caches.open(cacheName).then((cache) => cache.put('meta', new Response(JSON.stringify({ time: Date.now() }))));
});

self.addEventListener('fetch', (ev) => {
	if (ev.request.method !== 'GET') return;

	ev.respondWith(
		(async () => {
			const res = await caches.match(ev.request);
			const expired = await isExpired(cacheName);

			if (res && (!expired || ev.request.url.endsWith('.webp') || ev.request.url.endsWith('.jpg') || ev.request.url.endsWith('.jpeg') || ev.request.url.endsWith('.png'))) {
				console.log(expired, ev.request.url);
				return res;
			}

			const networkRes = await fetch(ev.request);
			if (!networkRes || networkRes.status !== 200) { //If it is broken, won't cache it
				return networkRes;
			}

			const clone = networkRes.clone();
			const cache = await caches.open(cacheName);
			cache.put(ev.request, clone);
			updateMeta();

			return networkRes;
		})()
	);
});
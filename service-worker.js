const CACHE_NAME = "v3";

const CACHE_ASSETS = [
	"./",
	"./index.html",
	"./404.html",
	"./pages/comprinhas/index.html",
	"./stylesheets/style.css",
	"./stylesheets/comprinhas.css",
	"./src/fixImages.js",
	"./src/script.js",
	"./src/shared.js",
	"./util/functions.js",
	"./util/server-url.js",
];

self.addEventListener("install", event => {
	event.waitUntil(
		caches.open(CACHE_NAME).then(cache => {
			return cache.addAll(CACHE_ASSETS);
		})
	);

	self.skipWaiting();
});

self.addEventListener("activate", event => {
	event.waitUntil(
		(async () => {
			const keys = await caches.keys();

			await Promise.all(
				keys
					.filter(key => key !== CACHE_NAME)
					.map(key => caches.delete(key))
			);

			await self.clients.claim();
		})()
	);
});

self.addEventListener("fetch", event => {
	const request = event.request;

	if (request.method !== "GET") return;

	event.respondWith(
		(async () => {
			const cached = await caches.match(request);

			if (cached) {
				event.waitUntil(updateCache(request));
				return cached;
			}

			return updateCache(request);
		})()
	);
});

async function updateCache(request) {
	try {
		const response = await fetch(request);

		if (response.ok) {
			const cache = await caches.open(CACHE_NAME);
			await cache.put(request, response.clone());
		}

		return response;
	} catch (error) {
		const cached = await caches.match(request);

		if (cached) return cached;

		throw error;
	}
};
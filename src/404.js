const baseImgUrl = 'https://storage.googleapis.com/statisticshock_github_io_public/pageImages/404/';

const endpoints = [
	'pope_francis\n.webp',
];

window.addEventListener('load', (ev) => {
	history.replaceState('', '', window.location.origin + '/not-found');
	
	for(let i = 1; i <= 3; i++) {
		endpoints.forEach((endpoint) => {
			const img = document.createElement('img');
			img.src = baseImgUrl + endpoint.replace('\n', i);
		});
	};
});

let count = 0;
setInterval(() => {
	if (count === endpoints.length) count = 0;
	document.querySelectorAll('img').forEach((imgTag, i) => {
		imgTag.src = baseImgUrl + endpoints[count].replace('\n', i + 1);
	});
	count++
}, 1500);
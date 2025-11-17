function fixImage (img: HTMLImageElement) {
	if (img.complete) {
		if (img.naturalWidth === 0) {
			img.outerHTML = `
				<svg original-src="${img.src}" version="1.0" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 9800 7360" preserveAspectRatio="xMidYMid meet">
					<g fill="var(--contrast-color-4)" stroke="none" mask="url(#eraser)">
						<path d="M920 7343 c-431 -76 -769 -384 -887 -808 l-28 -100 0 -2755 0 -2755 27 -98 c74 -268 239 -497 466 -645 155 -101 310 -154 506 -172 76 -8 1335 -10 3976 -8 l3865 3 90 22 c414 97 716 387 832 798 l28 100 3 2700 c2 1926 0 2723 -8 2780 -17 122 -46 220 -100 331 -139 289 -385 492 -708 586 l-77 23 -3980 1 c-2189 1 -3991 -1 -4005 -3z m7949 -420 c273 -64 425 -211 493 -478 l23 -90 0 -2675 0 -2675 -23 -90 c-68 -267 -220 -414 -493 -478 l-94 -22 -3795 -3 c-2592 -2 -3830 0 -3906 8 -333 31 -529 165 -614 418 -52 156 -50 59 -50 2842 0 2783 -2 2686 50 2842 67 198 215 333 428 388 45 12 119 25 164 29 46 5 1802 8 3903 7 l3820 -1 94 -22z"/>
						<circle cx="1775" cy="2085" r="750"/>
						<path d="M5405 2453 c-739 627 -1325 1115 -1331 1112 -6 -4 -234 -186 -507 -405 -273 -220 -501 -397 -508 -395 -6 2 -467 368 -1025 813 l-1013 810 2 920 2 920 3875 0 3875 0 3 -1531 2 -1532 -1015 -913 c-558 -503 -1021 -915 -1028 -916 -6 -1 -606 502 -1332 1117z"/>
					</g>
					<mask id="eraser">
						<rect width="100%" height="100%" fill="white"/>
						<line x1="9800" y1="0" x2="0" y2="7360" stroke="black" stroke-width="2100"/>
					</mask>
					<line x1="9800" y1="0" x2="0" y2="7360" stroke="var(--contrast-color-4)" stroke-width="350"/>
				</svg>
			`
		};
	} else {
		setTimeout(() => fixImage(img), 100)
	}
};

document.addEventListener('DOMContentLoaded', (ev) => {
	(document.querySelectorAll('img') as NodeListOf<HTMLImageElement>).forEach((img) => fixImage(img));
});

const observer: MutationObserver = new MutationObserver((mutations) => {
	for (const mutation of mutations) {
		if (mutation.type === 'childList') {
			for (const node of Array.from(mutation.addedNodes)) {
				if (node.nodeType !== 1) continue;
				if ((node as HTMLElement).tagName === 'IMG') {
					fixImage(node as HTMLImageElement);
				} else {
					((node as HTMLElement).querySelectorAll('img') as NodeListOf<HTMLImageElement>).forEach(fixImage)
				};
			};
		};
	};
});

observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["src"] });

setTimeout(() => observer.disconnect(), 30 * 1000);
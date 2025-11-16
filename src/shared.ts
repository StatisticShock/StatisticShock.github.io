export default class SharedDomFunctions {
	static createLoaders(counter: number): void {	// NO NEED OF RESPONSIVENESS
		let loaders: NodeListOf<HTMLDivElement> = document.querySelectorAll('.loader');

		loaders.forEach(loader => {
			for (let i = 0; i < counter; i++) {
				const div: HTMLDivElement = document.createElement('div');

				div.setAttribute('class', 'loading');
				div.setAttribute('style', `--translation: 150; --index: ${i + 1}; --count: ${counter}`);

				loader.appendChild(div);
			};
		});
	};

	static formatPopUps(): void { // NO NEED OF RESPONSIVENESS
		type popUpInterface = { button: HTMLAnchorElement | HTMLButtonElement, popUpContainer: HTMLFormElement }
		const popUpShortcuts: Array<popUpInterface> = [];

		(document.querySelectorAll('form.pop-up') as NodeListOf<HTMLFormElement>).forEach((form) => {
			if (form.classList.length < 2) return;

			const otherClass: string = Array.from(form.classList).filter((className) => className !== 'pop-up')[0];

			const openBttn = Array.from(document.querySelectorAll(`.${otherClass}`)).filter((element) => element.classList.contains('pop-up-open'))[0] as HTMLAnchorElement | HTMLButtonElement;

			popUpShortcuts.push({ button: openBttn, popUpContainer: form });
		});

		popUpShortcuts.forEach((object) => {
			let popUpClass = document.querySelectorAll('.pop-up') as NodeListOf<HTMLElement>;
			let floatingLabelElement = object.popUpContainer.querySelectorAll('.floating-label') as NodeListOf<HTMLElement>;

			object.button.onclick = () => {
				let display: string = object.popUpContainer.style.display;

				if ((display == '') || (display == 'none')) {
					object.popUpContainer.style.display = 'block';
				} else if (!(object.popUpContainer.classList.contains('create-shortcut') && object.button.classList.contains('create-shortcut') && !(object.button.id.replace('-button', '-item') === object.popUpContainer.getAttribute('x')))) {
					object.popUpContainer.style.display = 'none';
				};

				popUpClass.forEach((element) => {
					if (element != object.popUpContainer) {
						element.style.display = 'none'
					};
				});

				setTimeout(() => {
					floatingLabelElement.forEach((label) => {
						const parent = label.parentElement as HTMLElement;
						const siblings = Array.from(parent.children) as Array<HTMLElement>;
						const input = siblings[siblings.indexOf(label) - 1] as HTMLInputElement;
						const rect = object.popUpContainer.getBoundingClientRect();
						const inputRect = input.getBoundingClientRect();

						const left = inputRect.left - rect.left;
						label.style.left = Math.max(left, 5) + 'px';

						if (input.placeholder) input.placeholder = input.placeholder;
						else input.placeholder = ' ';

						console.log(left)
					});
				}, 10);
			}

			object.popUpContainer.addEventListener('keydown', function (e) {
				if (e.key === 'Enter') {
					e.preventDefault();
					let okButton = object.popUpContainer.querySelector('.ok-button') as HTMLButtonElement;
					okButton.click();
				}
			});
		});
	};

	static createBrokenImageFallback () {
		document.querySelectorAll('object').forEach((object) => {
			object.innerHTML = `<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 980 736" preserveAspectRatio="xMidYMid meet">
				<title>broken image</title>
				<g transform="translate(0,736) scale(0.100000,-0.100000)" fill="var(--contrast-color-3)" stroke="none">
					<path d="M920 7343 c-431 -76 -769 -384 -887 -808 l-28 -100 0 -2755 0 -2755 27 -98 c74 -268 239 -497 466 -645 155 -101 310 -154 506 -172 76 -8 1335 -10 3976 -8 l3865 3 90 22 c414 97 716 387 832 798 l28 100 3 2700 c2 1926 0 2723 -8 2780 -17 122 -46 220 -100 331 -139 289 -385 492 -708 586 l-77 23 -3980 1 c-2189 1 -3991 -1 -4005 -3z m7949 -420 c273 -64 425 -211 493 -478 l23 -90 0 -2675 0 -2675 -23 -90 c-68 -267 -220 -414 -493 -478 l-94 -22 -3795 -3 c-2592 -2 -3830 0 -3906 8 -333 31 -529 165 -614 418 -52 156 -50 59 -50 2842 0 2783 -2 2686 50 2842 67 198 215 333 428 388 45 12 119 25 164 29 46 5 1802 8 3903 7 l3820 -1 94 -22z"/>
					<path d="M1681 6319 c-242 -47 -461 -214 -570 -434 -66 -132 -86 -218 -85 -370 1 -157 22 -244 89 -373 104 -200 289 -351 511 -414 105 -30 304 -32 409 -4 302 80 529 313 600 616 19 82 19 264 1 351 -64 300 -306 547 -609 619 -88 21 -262 26 -346 9z"/>
					<path d="M5405 4800 c-739 -627 -1325 -1115 -1331 -1112 -6 4 -234 186 -507 405 -273 220 -501 397 -508 395 -6 -2 -467 -368 -1025 -813 l-1013 -810 2 -920 2 -920 3875 0 3875 0 3 1531 2 1532 -1015 913 c-558 503 -1021 915 -1028 916 -6 1 -606 -502 -1332 -1117z"/>
				</g>
			</svg>`;
		});
	};
}

export class TemplateConstructor {
	html: string;

	constructor (template: DocumentFragment, data: Array<object>) {
		const element: HTMLElement = document.createElement('element');
		// x
		function createNestedTagInThisLevel (currentData: Array<object> = data, currentElement: HTMLElement = element, fragment: DocumentFragment = template, prefix: string = ''): string {
			const cloneElement: HTMLElement = document.importNode(currentElement);
			
			for (const item of currentData) {
				const elementToBePushed: DocumentFragment = document.importNode(fragment, true);
				cloneElement.appendChild(elementToBePushed);
				
				for (const key in item) {
					const keyToLookUp: string = prefix === '' ? key : `${prefix}-${key}`;

					if (item[keyToLookUp] instanceof Array) {
						const templateChildElements: NodeListOf<HTMLElement> = cloneElement.querySelectorAll('.' + keyToLookUp + '-template');

						item[keyToLookUp].forEach((child) => {
							templateChildElements.forEach((el, i) => {
								const newTemplate: HTMLTemplateElement = document.createElement('template');
								const newFragment: DocumentFragment = newTemplate.content;

								newFragment.appendChild(document.importNode(el, true));

								const newElementToBePushedString: string = createNestedTagInThisLevel([child], document.importNode(el, true) as HTMLElement, newFragment, keyToLookUp);
								const newElementToBePushed: HTMLElement = document.createElement(el.tagName.toLowerCase());

								el.parentElement!.insertBefore(newElementToBePushed, el);
								newElementToBePushed.outerHTML = newElementToBePushedString.replaceAll(keyToLookUp + '-template', ''); // Removing this line breaks the whole page due to StackOverflow.
 							});
						});

						templateChildElements.forEach((el) => el.remove());

						cloneElement.innerHTML = cloneElement.innerHTML.replaceAll(`{{${keyToLookUp}}}`, JSON.stringify(item[key]));

						for (const attr of Array.from(cloneElement.attributes)) {
							attr.value = attr.value.replaceAll(`{{${keyToLookUp}}}`, JSON.stringify(item[key]));
						};
					} else {
						cloneElement.innerHTML = cloneElement.innerHTML.replaceAll(`{{${keyToLookUp}}}`, item[key]);

						for (const attr of Array.from(cloneElement.attributes)) {
							attr.value = attr.value.replaceAll(`{{${keyToLookUp}}}`, item[key]);
						};
					};
				};
				const regEx: RegExp = /\{\{[a-zA-Z\-\ \.]+\}\}/g;

				cloneElement.innerHTML = cloneElement.innerHTML.replace(regEx, '');
				for (const attr of Array.from(cloneElement.attributes)) {
					attr.value = attr.value.replace(regEx, '');
				};
			};

			return cloneElement.innerHTML;
		};

		element.innerHTML = createNestedTagInThisLevel();

		this.html = element.innerHTML;
	};

	insert (destination: HTMLElement, position?: 'after'|'before', relative?: HTMLElement): void {
		if (relative) {
			if (relative.parentElement !== destination) {
				throw new Error('"relative" should be a childNode of "destination".');
			};
		};

		if (!position) {
			destination.innerHTML = this.html;
		} else {
		const element: HTMLElement = document.createElement('element');
			element.innerHTML = this.html;

			if (position === 'before') {

				for (const child of Array.from(element.childNodes)) {
					destination.insertBefore(child, relative as HTMLElement);
				};
			} else if (position === 'after') {
				if (relative?.nextElementSibling) {
					const nextSibling = relative.nextSibling as HTMLElement;

					for (const child of Array.from(element.childNodes)) {
						destination.insertBefore(child, nextSibling);
					};
				} else {
					for (const child of Array.from(element.childNodes)) {
						destination.appendChild(child);
					};
				}
			};
		};
	};
};

const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
const mobile = /android|iphone|ipad|ipod|iemobile|blackberry|bada/i.test(ua.toLowerCase());
if (!mobile) document.querySelector('body')!.classList.add('has-hover');

switch (localStorage.getItem('darkOrLightTheme')) {
	case 'light':
		document.documentElement.setAttribute('data-theme', 'light');
		break;
	case 'dark':
		document.documentElement.setAttribute('data-theme', 'dark');
		break;
	default:
		break;
};

if ('serviceWorker' in navigator) {
	navigator.serviceWorker
		.register('../service-worker.js')
		.then((reg) => console.log('Service Worker registered with scope:', reg.scope))
		.catch((error) => console.error('Service Worker registration failed:', error));
};
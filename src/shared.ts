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

	static createPageLoadAwaiter () {
		
	}
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
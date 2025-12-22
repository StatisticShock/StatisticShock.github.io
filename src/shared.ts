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
};

export class TemplateConstructor {
	html: DocumentFragment;

	constructor (template: HTMLTemplateElement, data: Array<object>) {
		function fillTempate (templateToFill: HTMLTemplateElement, dataToFill: Array<object> = data): DocumentFragment {
			type Binding = {
				key: string,
				node: Text | Attr,
			};

			const newFragment = document.createDocumentFragment();

			for (const item of dataToFill) {
				const tpt = templateToFill.content.cloneNode(true) as HTMLElement;
				const walker = document.createTreeWalker(tpt);
				const bindings: Array<Binding> = [];

				while (walker.nextNode()) {
					const node = walker.currentNode;
					
					if (node.nodeType === Node.ELEMENT_NODE) {
						for (const attr of Array.from((node as Element).attributes)) {
							const matches = attr.textContent?.match(/\{\{(\S+?)\}\}/g);
							if (!matches) continue;

							for (const key of matches) {
								bindings.push({
									key: key.replace(/[\{\}]/g, ''),
									node: attr as Text|Attr,
								});
							};
						};
					} else {
						const matches = node.textContent?.match(/\{\{(\S+?)\}\}/g);
						if (!matches) continue;

						for (const key of matches) {
							bindings.push({
								key: key.replace(/[\{\}]/g, ''),
								node: node as Text|Attr,
							});
						};
					};
				};
				
				for (const binding of bindings.sort((a, b) => a.key.split('-').length - b.key.split('-').length)) {
					if (Array.isArray(item[binding.key])) {
						const newTemplate = tpt.querySelector('#' + binding.key) as HTMLTemplateElement;

						const [el] = Array.from(tpt.querySelectorAll('element')).filter((el) => el.textContent === `{{${binding.key}}}`);
						el.parentElement!.insertBefore(fillTempate(newTemplate, item[binding.key]).cloneNode(true), el);
						el.remove();
					} else {
						binding.node.textContent = binding.node.textContent!.replace(binding.key, item[binding.key] || '').replace(/[\{\}]/g, '');
					};
				}

				newFragment.appendChild(tpt);
			};

			return newFragment;
		};

		this.html = fillTempate(template);
	};

	insert (destination: HTMLElement, position?: 'after'|'before', relative?: HTMLElement) {
		if (relative) {
			if (relative.parentElement !== destination) {
				throw new Error('"relative" should be a childNode of "destination".');
			};
		};

		if (!position) {
			destination.innerHTML = '';
			destination.appendChild(this.html.cloneNode(true));
		} else {
		const element: HTMLElement = document.createElement('element');
			element.appendChild(this.html.cloneNode(true));

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

		return this
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
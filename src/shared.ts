import CustomFunctions from '../util/functions.js';

class PageBehaviour {
	static stopImageDrag(): void { // NO NEED OF RESPONSIVENESS
		let images: HTMLCollectionOf<HTMLImageElement> = document.getElementsByTagName('img');

		Array.from(images).forEach((img) => {
			img.setAttribute('draggable', 'false')
		});
	};

	static openLinksInNewTab(): void { // RESPONSIVE
		const shortcuts: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('.shortcut-item');
		for (const element of Array.from(shortcuts)) {
			if (!element.href) continue;
			if (element.href.match(/docs\.google\.com/) == null || mobile) {
				element.target = '_blank';
			}
		};

		const gamecards: NodeListOf<HTMLDivElement> = document.querySelectorAll('.gamecard')!;
		gamecards.forEach((element) => {
			let child = element.firstElementChild as HTMLAnchorElement;

			if (child.href.match(/docs\.google\.com/) == null || mobile) {
				child.target = '_blank';
			}
		});
	};

	static async nightModeToggle(): Promise<void> { // RESPONSIVE
		const darkOrLightTheme: string = 'darkOrLightTheme';
		const svg: HTMLInputElement = document.querySelector('switch svg#theme-toggle')!;

		if (localStorage.getItem(darkOrLightTheme) !== null) {
			switch (localStorage.getItem(darkOrLightTheme)) {
				case 'light':
					document.documentElement.setAttribute('data-theme', 'light');
					break;
				case 'dark':
					document.documentElement.setAttribute('data-theme', 'dark');
					svg.querySelector('g')!.classList.toggle('dark');
					break;
			}
		} else {
			if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
				localStorage.setItem(darkOrLightTheme, 'dark');
				document.documentElement.setAttribute('data-theme', 'dark');
				svg.querySelector('g')!.classList.toggle('dark');
			} else {
				localStorage.setItem(darkOrLightTheme, 'light');
				document.documentElement.setAttribute('data-theme', 'light');
			};
		};

		svg.onclick = function (ev: MouseEvent|TouchEvent) {
			const currentTheme = document.documentElement.getAttribute('data-theme') as 'dark'|'light';
			svg.querySelector('g')!.classList.toggle('dark');

			switch (currentTheme) {
				case 'light':
					document.documentElement.setAttribute('data-theme', 'dark');
					localStorage.setItem(darkOrLightTheme, 'dark')
					break;
				case 'dark':
					document.documentElement.setAttribute('data-theme', 'light');
					localStorage.setItem(darkOrLightTheme, 'light')
					break;
			};
		};
	};

	static collapseHeader (): void { // NO NEED OF RESPONSIVENESS
		const navbar: HTMLElement = document.querySelector('nav.menu')!;
		const svg: HTMLElement = navbar.querySelector('svg#expand-retract-header')!;
		const header: HTMLElement = document.querySelector('header')!;

		svg.addEventListener('click', async (ev) => {
			navbar.classList.toggle('animated');
			header.classList.toggle('hidden');
		});
	};

	static makeSwitchesSlide(): void { // NO NEED OF RESPONSIVENES
		const switches: NodeListOf<HTMLLabelElement> = document.querySelectorAll('.switch');
		switches.forEach((switchElement) => {
			const input: HTMLInputElement = document.createElement('input');
			const slider: HTMLDivElement = document.createElement('div');
			input.setAttribute('type', 'checkbox');
			slider.classList.add('slider');

			switchElement.appendChild(input);
			switchElement.appendChild(slider);

			switchElement.style.borderRadius = (parseFloat(getComputedStyle(switchElement).height) / 2) + 'px'
		});

		const sliders: NodeListOf<HTMLElement> = document.querySelectorAll('.switch > .slider');
		sliders.forEach((slider) => {
			let parent = slider.parentElement as HTMLElement;
			let input = parent.querySelector('input') as HTMLInputElement;

			let uncheckedPosition = getComputedStyle(slider, '::before').left;
			let checkedPosition = parent.offsetWidth - parseFloat(uncheckedPosition) * 4 - parseFloat(getComputedStyle(slider, '::before').width) + 'px';

			slider.style.setProperty('--total-transition', checkedPosition);
			input.style.setProperty('--total-transition', checkedPosition);
		})
	};

	static dragPopUps(): void {	// RESPONSIVE
		const popUps: NodeListOf<HTMLElement> = document.querySelectorAll('.pop-up');
		let isDragging: boolean = false;
		let offsetX: number, offsetY: number;

		popUps.forEach((popUp) => {
			popUp.addEventListener('mousedown', startDragging);
			popUp.addEventListener('touchstart', startDragging);
			popUp.addEventListener('mousemove', drag);
			popUp.addEventListener('touchmove', drag);
			document.addEventListener('mouseup', stopDragging);
			document.addEventListener('touchend', stopDragging);
		})
		function startDragging(this: HTMLElement, event: MouseEvent | TouchEvent): void {
			let e: MouseEvent | Touch;

			if (event instanceof MouseEvent) {
				e = event;
			} else {
				e = event.touches[0];
			};

			let target = e.target as HTMLElement;

			if ((target === this || CustomFunctions.isParent(target, this.querySelector('.pop-up-header')!)) &&
				!(target instanceof HTMLImageElement) &&
				!(target instanceof HTMLParagraphElement) &&
				!(target instanceof HTMLSpanElement) &&
				!(target instanceof HTMLInputElement)) {
				isDragging = true;
				offsetX = e.clientX - this.offsetLeft;
				offsetY = e.clientY - this.offsetTop;
			}
		}; function drag(this: HTMLElement, event: MouseEvent | TouchEvent): void {
			let e: MouseEvent | Touch;

			if (event instanceof MouseEvent) {
				e = event;
			} else {
				e = event.touches[0];
			};

			if (isDragging) {
				let x: number = e.clientX - offsetX;
				let y: number = e.clientY - offsetY;

				this.style.left = x + 'px';
				this.style.top = y + 'px';
			}
			event.preventDefault();
		}; function stopDragging(): void {
			isDragging = false;
		}
	};

	static changeHomeView (): void { // NO NEED OF RESPONSIVENESS
		const navBttns: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('nav a');

		navBttns.forEach((bttn) => {
			bttn.onclick = (ev: MouseEvent|TouchEvent) => {
				ev.preventDefault();
				const target = (ev as MouseEvent).target || (ev as TouchEvent).touches[0].target;
				const anchor = (target as HTMLElement).closest('a');
				
				document.querySelectorAll('.flex-container > section').forEach((section) => {
					(section as HTMLElement).style.display = section.id === anchor!.href.split('/').pop() ? '' : 'none';
				})
			}
		})
	};

	static async refreshData (): Promise<void> { // NO NEED OF RESPONSIVENESS
		const button = document.querySelector('button#refresh-button') as HTMLButtonElement;
		
		button.onclick = async (ev) => {
			await caches.delete('v1');
			window.location.reload();
		};
	};

	static async putVersionOnFooter (): Promise<void> {
		const version = await fetch('https://raw.githubusercontent.com/StatisticShock/StatisticShock.github.io/refs/heads/main/package.json')
			.then((res) => res.json())
			.then((data) => data.version);
		
		const footer: HTMLElement = document.querySelector('footer')!;

		footer.innerHTML += `<p><small>ver. ${version}</small></p>`;
	};

	static deleteSkeletons (prefixes: Array<string>): void {
		for (const prefix of prefixes) {
			const skeletons: NodeListOf<HTMLElement> = document.querySelectorAll(prefix + '.skeleton-container');

			skeletons.forEach((skeleton) => {
				skeleton.remove();
			});
		};
	};
};

export default class SharedDomFunctions extends PageBehaviour {
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

		function observer (form: HTMLFormElement): void {
			const _observer = new MutationObserver((mutations) => {
				mutations.forEach((mutation) => {
					if (mutation.attributeName === 'style') {
						setTimeout(() => {
							const floatingLabelElement = form.querySelectorAll('.floating-label') as NodeListOf<HTMLElement>;
							floatingLabelElement.forEach((label) => {
								const parent = label.parentElement as HTMLElement;
								const siblings = Array.from(parent.children) as Array<HTMLElement>;
								const input = siblings[siblings.indexOf(label) - 1] as HTMLInputElement;
								const rect = form.getBoundingClientRect();
								const inputRect = input.getBoundingClientRect();

								const left = inputRect.left - rect.left;
								label.style.left = Math.max(left, 5) + 'px';

								if (input.placeholder) input.placeholder = input.placeholder;
								else input.placeholder = ' ';
							});
						}, 10);
					}
				})
			});

			_observer.observe(form, {attributeFilter: ['style']});
		};

		(document.querySelectorAll('form.pop-up') as NodeListOf<HTMLFormElement>).forEach((form) => {
			observer(form);
			
			if (form.classList.length < 2) return;

			const otherClass: string = Array.from(form.classList).filter((className) => className !== 'pop-up')[0];

			const openBttn = Array.from(document.querySelectorAll(`.${otherClass}`)).filter((element) => element.classList.contains('pop-up-open'))[0] as HTMLAnchorElement | HTMLButtonElement;

			popUpShortcuts.push({ button: openBttn, popUpContainer: form });
		});

		popUpShortcuts.forEach((object) => {
			let popUpClass = document.querySelectorAll('.pop-up') as NodeListOf<HTMLElement>;

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
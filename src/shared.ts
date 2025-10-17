export default class SharedDomFunctions {
	html: string;

	constructor (template: DocumentFragment, data: object) {
		const element: HTMLSpanElement = document.createElement('span');

		function createNestedTagInThisLevel (currentElement: HTMLElement = element, currentData: object = data, prefix: string = ''): string {
			let string: string = '';
			
			for (const key in currentData) {
				if (currentData[key] instanceof Array) {
					
				} else {
					
				}
			};

			return string
		};

		element.outerHTML = createNestedTagInThisLevel()

		this.html = element.outerHTML;
	};

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
}
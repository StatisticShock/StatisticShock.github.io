import PageBuilding, { TemplateConstructor } from './shared.js';
import CustomFunctions from '../util/functions.js';
import * as MyTypes from '../util/types.js';
import { server } from '../util/server-url.js';

class HistoryState {
	static routes = [
		{	
			type: 'shortcuts',
			title: 'Atualização de atalho',
		},
		{
			type: 'gamecards',
			title: 'Atualização de atalho gaming',
		},
		{
			type: 'mfc',
			title: 'MyFigureCollection'
		},
		{
			type: 'headers',
			title: 'Atualização de headers'
		}
	];

	static data = {
		page: '',
		id: '',
	}
	
	static path (): void {
		const params: URLSearchParams = new URLSearchParams(window.location.search);
		const page: string = params.get('page')!;
		const id: string = params.get('id')!;

		this.data.id = id;
		this.data.page = page;
	};

	static updateContent({page, id}): void {
		// history.replaceState('', '', `update/${page}/${Number(id) > 0 ? id : ''}`)

		const route = this.routes.filter((route) => route.type === page)[0] || { title: '404', type: 'Not Found'};
		if (route.title === '404') {
			window.location.href = window.location.origin + '/404.html';
		} else {
			document.getElementById('title')!.textContent = route.title;
		}
	};

	static async load ({page, id}): Promise<void> {
		// x
		const content: HTMLDivElement = document.querySelector('#content')!;
		const json: Promise<Partial<MyTypes.PageContent>> = fetch(`${server}contents/${page}`).then((res) => res.json());

		const upload = document.importNode((document.getElementById('upload-template') as HTMLTemplateElement).content, true);

		switch (page) {
			case 'shortcuts':
				json.then((res) => {
					const shortcutFolders: Array<MyTypes.Shortcut> = res[page];
					
					new TemplateConstructor(document.querySelector('#shortcuts-template') as HTMLTemplateElement, shortcutFolders).insert(content);

					for (const folder of shortcutFolders) {
						for (const shortcut of folder.children) {
							(document.querySelector('#' + folder.id + ' #' + shortcut.id + ' input') as HTMLInputElement).checked = shortcut.showOnMobile;
						}
					};
				});

				break;
			case 'gamecards':
			case 'headers':
				json.then((res) => {
					const headers: Array<MyTypes.Headers> = res[page];
					const headerContainer: HTMLDivElement = document.createElement('div');
					headerContainer.classList.add('headers')

					for (const header of headers) {
						const tpt = document.getElementById('header-template') as HTMLTemplateElement;
						const div = tpt.content.querySelector('div') as HTMLDivElement;
						const img = div.querySelector('img') as HTMLImageElement;
						const box = div.querySelector('input') as HTMLInputElement;
						const prg = div.querySelector('p') as HTMLParagraphElement;
						
						img.src = header.href;
						box.checked = header.active;
						prg.textContent = header.name;

						const node = document.importNode(tpt.content, true);
						headerContainer.appendChild(node);
					};

					content.appendChild(headerContainer);

					(content.querySelectorAll('div.headers img') as NodeListOf<HTMLImageElement>).forEach((img: HTMLImageElement) => {
						img.onclick = function (ev) {
							img.parentElement!.classList.toggle('hidden');
						}
					});

					headerContainer.appendChild(upload);
				});

				break;
			default:
				content.innerHTML = 'Page Not Found';
		}
	};
};

window.addEventListener('load', onLoadFunctions); async function onLoadFunctions (): Promise<void> {
	PageBuilding.createLoaders(12);
	
	HistoryState.path();
	HistoryState.updateContent(HistoryState.data);
	await HistoryState.load(HistoryState.data);
};
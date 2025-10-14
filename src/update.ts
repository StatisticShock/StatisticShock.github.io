import PageBuilding from './shared.js';
import CustomFunctions from '../util/functions.js';
import * as MyTypes from '../util/types.js';
import { server } from './server-url.js';
import { title } from 'process';

class HistoryState {
	static routes = {
		shortcuts: {
			title: 'Atualização de atalho',
			content: 'Here are your shortcut updates.',
			self: 'shortcuts'
		},
		gaming: {
			title: 'Atualização de atalho gaming',
			content: 'Latest gaming updates go here.',
			self: 'gaming'
		},
		mfc: {
			title: 'Atualização de figure'
		}
	};

	static updateContent(path: string): void {
		const route = this.routes[path] || { title: '404', content: 'Page not found.' };
		document.getElementById('title')!.textContent = route.title;
		document.getElementById('content')!.textContent = route.content;
	};
};

window.addEventListener('load', onLoadFunctions); function onLoadFunctions (): void {
	HistoryState.updateContent(window.location.pathname);
};

window.addEventListener('popstate', onPopStateFunctions); function onPopStateFunctions (): void {
	HistoryState.updateContent(window.location.pathname);
};

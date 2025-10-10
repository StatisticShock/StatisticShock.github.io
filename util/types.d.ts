//MAL
export type AnimeList = {
	data: Array<{
		node: {
			id: number;
			title: string;
			main_picture: {
				medium: string;
				large: string;
			};
			genres: Array<{
				id: number;
				name: string;
			}>;
			num_episodes: number;
			nsfw: string;
			rank: number;
		},
		list_status: {
			status: string;
			score: number;
			num_episodes_watched: number;
			is_rewatching: boolean;
			updated_at: string;
			start_date?: string;
			finish_date?: string;
		}
	}>;
	paging: {
		next: string
	}
};
export type MangaList = {
	data: Array<{
		node: {
			id: number;
			title: string;
			main_picture: {
				medium: string;
				large: string;
			};
			genres: Array<{
				id: number;
				name: string;
			}>;
			num_chapters: number;
			nsfw: string;
			rank: number;
		};
		list_status: {
			status: string;
			is_rereading: boolean;
			num_volumes_read: number;
			num_chapters_read: number;
			score: number;
			updated_at: string;
			start_date?: string;
			finish_date?: string;
		};
	}>;
	paging: {
		next: string;
	};
};

//PAGE CONTENT
export type MFC = {
	[k: string]: string;

	id: string,
	href: string,
	img: string,
	icon: string,
	character: string,
	characterJap: string,
	source: string,
	sourceJap: string,
	classification: string,
	category: string,
	type: string,
	title: string,
};
export type Shortcut = {
	id: string,
	index: number,
	title: string,
	children: Array<{
		id: string,
		alt: string,
		index: number,
		href: string,
		img: string,
		showOnMobile: boolean,
	}>
};
export type Gamecard = {
	label: string,
	id: string,
	position: number,
	children: Array<{
		id: string,
		label: string,
		position: number,
		href: string,
		img: string,
		img_css: Array<{
			attribute: string,
			value: string
		}>
	}>
};
export type Headers = {
	href: string,
	name: string,
	active: boolean
};
export type PageContent = {
	updated: boolean,
	shortcuts: Array<Shortcut>,
	gamecards: Array<Gamecard>,
	headers: Array<Headers>,
	mfc: Array<MFC>
};
export type UploadShortcutResponse = {
	newImgPath: string,
};
export type NewShortcutData = {
	folder: string,
	title: string,
	url: string
};
export type ShortcutsUpdateData = {
	shortcuts: Array<Shortcut>
}

//RETROACHIEVEMENTS
export type RetroAchievementsAward = {
	"awardedAt": string,
	"awardType": string,
	"awardData": number,
	"awardDataExtra": number,
	"displayOrder": number,
	"title": string,
	"consoleId": number,
	"consoleName": string,
	"flags": any,
	"imageIcon": string
};
export type RetroAchievementsAwardsResponse = {
	"totalAwardsCount": number,
	"hiddenAwardsCount": number,
	"masteryAwardsCount": number,
	"completionAwardsCount": number,
	"beatenHardcoreAwardsCount": number,
	"beatenSoftcoreAwardsCount": number,
	"eventAwardsCount": number,
	"siteAwardsCount": number,
	"visibleUserAwards": Array<RetroAchievementsAward>
};
export type RetroAchievementsFormattedAward = {
	"awardData": number,
	"awardDataExtra": number,
	"title": string,
	"consoleId": number,
	"consoleName": string,
	"flags": any,
	"imageIcon": string,
	"allData": Array<{
		"awardType": string,
		"awardedAt": string,
		"displayOrder": number,
	}>
};
export type RetroAchievementsConsole = {
	"active": boolean,
	"iconUrl": string,
	"id": number,
	"isGameSystem": boolean,
	"name": string,
};
export type RetroAchievementsOutput = {
	"awards": Array<RetroAchievementsFormattedAward>,
	"consoles": Array<RetroAchievementsConsole>,
};

//SERVER INTERACTION
export type ErrorJson = {
	message: string
};
export type Version = {
	page: string,
	server: string,
};
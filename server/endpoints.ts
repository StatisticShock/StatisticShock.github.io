type BaseEndpoint = {
	id,
	route,
	descriptionEnUs: Array<string>, descriptionPtBr: Array<string>,
	parameters?: Array<[string, string]>,
	examples?: Array<[string, string]>,
};
type Endpoint = BaseEndpoint & {
	optional?: Array<BaseEndpoint>;
};
type AllStrings<T> = {[Key in keyof T]: T[Key] extends any ? (unknown extends T[Key] ? string : T[Key]) : T[Key]};
type Methods = {
	method: string,
	descriptionEnUs: string,
	descriptionPtBr: string,
	endpoints: Array<AllStrings<Endpoint>>,
}
const cb = function (string: string): string {return `<span class="codeblock">${string}</span>`};
const tb = function (string: string): string {return `&lt;${string}&gt;`};

export const typeOfEndpoints: Array<Methods> = [
	{ // GET
		method: 'GET',
		descriptionEnUs: 'These methods only <b>get</b> data from the database.\nThis database is in a ' + cb('Google Sheets') + ' file.',
		descriptionPtBr: '',
		endpoints: [
			{ // myanimelist
				id: 'myanimelist',
				route: "/myanimelist/<type>/?username&offset",
				descriptionEnUs: [
					`Returns a list of 100 last updated anime watched/manga readed.`,
				],
				descriptionPtBr: [
					'',
				],
				parameters: [
					['type', 'Obligatory. Needs to be either ' + cb('animelist') + ' or ' + cb('mangalist') + '.\nDefines what will be returned'],
					['username', 'Obligatory.\nGets the user which data will be returned.'],
					['offset', 'Optional. Must be an integer.\nShifts the data by the number.']
				],
				examples: [
					[
						'/myanimelist/animelist?username=HikariMontgomery',
						JSON.stringify(JSON.parse(`{"data":[{"node":{"id":62516,"title":"Dandadan 3rd Season","main_picture":{"medium":"https://cdn.myanimelist.net/images/anime/1444/152105.jpg","large":"https://cdn.myanimelist.net/images/anime/1444/152105l.jpg"},"genres":[{"id":1,"name":"Action"},{"id":4,"name":"Comedy"},{"id":27,"name":"Shounen"},{"id":37,"name":"Supernatural"}],"num_episodes":0,"nsfw":"white"},"list_status":{"status":"plan_to_watch","score":0,"num_episodes_watched":0,"is_rewatching":false,"updated_at":"2025-10-08T13:25:24+00:00"}}]}`), null, 2)
					],
					[
						'/myanimelist/mangalist?username=HikariMontgomery',
						JSON.stringify(JSON.parse(`{"data":[{"node":{"id":148054,"title":"Ruri Dragon","main_picture":{"medium":"https://cdn.myanimelist.net/images/manga/2/269401.jpg","large":"https://cdn.myanimelist.net/images/manga/2/269401l.jpg"},"genres":[{"id":23,"name":"School"},{"id":27,"name":"Shounen"},{"id":36,"name":"Slice of Life"},{"id":37,"name":"Supernatural"}],"num_chapters":0,"nsfw":"white","rank":1815},"list_status":{"status":"reading","is_rereading":false,"num_volumes_read":0,"num_chapters_read":6,"score":0,"updated_at":"2025-10-08T16:37:34+00:00","start_date":"2025-09-10"}}]}`), null, 2)
					]
				],
			},
			{ // contents
				id: 'contents',
				route: "/contents/update?",
				descriptionEnUs: [
					`This endpoint returns a JSON that contains <b>shortcut</b> data, <b>headers</b> links,` +
					` <b>MyFigureCollection</b> figure data and <b>gamecards</b> data.`,
				],
				descriptionPtBr: [
					'',
				],
				parameters: [
					['update', 'Optional.\nUpdates the headers of the CSVs that store the data.']
				],
				examples: [
					['/contents/', JSON.stringify({"shortcuts":{"id":"redes-sociais","index":1,"title":"Redes Sociais","children":[{"id":"reddit","alt":"Reddit","index":1,"href":"https://www.reddit.com/","img":"https://storage.googleapis.com/statisticshock_github_io_public/icons/dynamic/reddit.webp","showOnMobile":false},{"id":"facebook","alt":"Facebook","index":2,"href":"https://www.facebook.com/","img":"https://storage.googleapis.com/statisticshock_github_io_public/icons/dynamic/fb.webp","showOnMobile":false},{"id":"instagram","alt":"Instagram","index":3,"href":"https://www.instagram.com/","img":"https://storage.googleapis.com/statisticshock_github_io_public/icons/dynamic/insta.webp","showOnMobile":false},{"id":"x-twitter","alt":"X (Twitter)","index":4,"href":"https://x.com/home","img":"https://storage.googleapis.com/statisticshock_github_io_public/icons/dynamic/x.webp","showOnMobile":false},{"id":"tiktok","alt":"TikTok","index":5,"href":"https://www.tiktok.com/","img":"https://storage.googleapis.com/statisticshock_github_io_public/icons/dynamic/tiktok.webp","showOnMobile":false},{"id":"discord","alt":"Discord","index":6,"href":"https://discord.com/app","img":"https://storage.googleapis.com/statisticshock_github_io_public/icons/dynamic/discord.webp","showOnMobile":false}]},"gamecards":{"label":"Links","id":"links","position":1,"children":[{"id":"retroachievements","label":"RetroAchievements","position":1,"href":"https://retroachievements.org/user/assdeper","img":"https://storage.googleapis.com/statisticshock_github_io_public/pageImages/ra-ps.webp","img_css":[{"attribute":"background-size","value":"contain"}]},{"id":"rroms-megathread","label":"r/Roms Megathread","position":2,"href":"https://r-roms.github.io/","img":"https://storage.googleapis.com/statisticshock_github_io_public/pageImages/rroms.webp","img_css":[]},{"id":"fitgirl-repacks","label":"FitGirl Repacks","position":3,"href":"https://fitgirl-repacks.site/","img":"https://storage.googleapis.com/statisticshock_github_io_public/pageImages/fitgirl-ps.webp","img_css":[]},{"id":"pkmds-for-web","label":"PKMDS for Web","position":4,"href":"https://pkmds.app/","img":"https://storage.googleapis.com/statisticshock_github_io_public/pageImages/pokemon.webp","img_css":[{"attribute":"background-size","value":"contain"}]}]},"headers":{"href":"https://storage.googleapis.com/statisticshock_github_io_public/headers/arthur_sword_ruan.webp","name":"arthur_sword_ruan","active":true},"mfc":{"id":"16888","href":"https://pt.myfigurecollection.net/item/16888","img":"https://storage.googleapis.com/statisticshock_github_io_public/mfc/main_images/16888.webp","icon":"https://storage.googleapis.com/statisticshock_github_io_public/mfc/icons/16888.webp","character":"Sarugaki Hiyori","characterJap":"猿柿 ひよ里","sourceJap":"ブリーチ","category":"Prepainted","type":"Wished","title":"Bleach - Sarugaki Hiyori - 1/8 (Alpha x Omega)"}}, null, 2)]
				],
			},
			{ // retroAchievements
				id: 'retro-achievements',
				route: '/retroAchievements/<language>/',
				descriptionEnUs: [],
				descriptionPtBr: [],
				parameters: [
					['language', 'The language of display.\nAccepts both ' + cb('pt-BR') + ' and ' + cb('en-US') + '.']
				],
				examples: [],
			},
			{ // Version
				id: 'version',
				route: '/version/',
				descriptionEnUs: [
					'Gets up-to-date version of the <a href="https://statisticshock.github.io/" target="_blank">webpage</a> and this API.'
				],
				descriptionPtBr: [],
				examples: [
					['/server/', JSON.stringify({page: '1.3.0', server: '2.1.0'}, null, 2)]
				]
			}
		]
	},
	{ // POST
		method: 'POST',
		descriptionEnUs: 'These methods can both <b>get</b> and <b>create</b> data in the database.\nThis database is in a ' + cb('Google Sheets') + ' file.',
		descriptionPtBr: '',
		endpoints: [
			{
				id: 'shortcuts',
				route: "/shortcuts/",
				descriptionEnUs: [
					`This endpoint is not ready yet`
				],
				descriptionPtBr: [
					'',
				],
			}
		]
	},
	{ // PUT
		method: 'PUT',
		descriptionEnUs: 'These methods should be used to <b>change</b> data in the database.\nThis database is in a ' + cb('Google Sheets') + ' file.',
		descriptionPtBr: '',
		endpoints: [
			{
				id: 'shortcuts',
				route: "/shortcuts/",
				descriptionEnUs: [
					`This endpoint is not ready yet`
				],
				descriptionPtBr: [
					'',
				],
			}
		]
	},
	{ // DELETE
		method: 'DELETE',
		descriptionEnUs: 'These methods should be used to <b>delete</b> data in the database.\nThis database is in a ' + cb('Google Sheets') + ' file.',
		descriptionPtBr: '',
		endpoints: [
			{
				id: 'shortcuts',
				route: "/shortcuts/",
				descriptionEnUs: [
					`This endpoint is not ready yet`
				],
				descriptionPtBr: [
					'',
				]
			}
		]
	}
]
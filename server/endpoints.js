const cb = function (string) { return `<span class="codeblock">${string}</span>`; };
const tb = function (string) { return `&lt;${string}&gt;`; };
export const typeOfEndpoints = [
    {
        method: 'GET',
        description: [
            'These methods only <b>get</b> data from the database.',
            'Esses métodos apenas <b>obtém</b> dados da base de dados.'
        ],
        endpoints: [
            {
                id: 'myanimelist',
                route: "/myanimelist/<type>/?username&offset",
                description: [
                    `Returns a list of 100 last updated anime/manga.`,
                    'Retorna uma lista dos 100 últimos animes/mangá atualizados.'
                ],
                parameters: [
                    ['type', 'Obligatory. Needs to be either ' + cb('animelist') + ' or ' + cb('mangalist') + '.\nDefines what will be returned'],
                    ['username', 'Obligatory.\nGets the user which data will be returned.'],
                    ['offset', 'Optional. Must be an integer.\nShifts the data by the number.']
                ],
                examples: [
                    [
                        '/myanimelist/animelist?username=HikariMontgomery',
                        JSON.stringify(JSON.parse(`{"data":[{"node":{"id":62516,"title":"Dandadan 3rd Season","main_picture":{"medium":"https://cdn.myanimelist.net/images/anime/1444/152105.jpg","large":"https://cdn.myanimelist.net/images/anime/1444/152105l.jpg"},"genres":[{"id":1,"name":"Action"},{"id":4,"name":"Comedy"},{"id":27,"name":"Shounen"},{"id":37,"name":"Supernatural"}],"num_episodes":0,"nsfw":"white"},"list_status":{"status":"plan_to_watch","score":0,"num_episodes_watched":0,"is_rewatching":false,"updated_at":"2025-10-08T13:25:24+00:00"}}]}`), null, 4)
                    ],
                    [
                        '/myanimelist/mangalist?username=HikariMontgomery',
                        JSON.stringify(JSON.parse(`{"data":[{"node":{"id":148054,"title":"Ruri Dragon","main_picture":{"medium":"https://cdn.myanimelist.net/images/manga/2/269401.jpg","large":"https://cdn.myanimelist.net/images/manga/2/269401l.jpg"},"genres":[{"id":23,"name":"School"},{"id":27,"name":"Shounen"},{"id":36,"name":"Slice of Life"},{"id":37,"name":"Supernatural"}],"num_chapters":0,"nsfw":"white","rank":1815},"list_status":{"status":"reading","is_rereading":false,"num_volumes_read":0,"num_chapters_read":6,"score":0,"updated_at":"2025-10-08T16:37:34+00:00","start_date":"2025-09-10"}}]}`), null, 4)
                    ]
                ],
            },
            {
                id: 'contents',
                route: "/contents/<type>?",
                description: [
                    `This endpoint returns a JSON that contains <b>shortcut</b> data, <b>headers</b> links, <b>MyFigureCollection</b> figure data and <b>gamecards</b> data.`,
                    `Este endpoint retorna um JSON que contém dados de <b>shortcut</b>, links de <b>headers</b>, dados de figura de <b>MyFigureCollection</b> e dados de <b>gamecards</b>.`
                ],
                parameters: [
                    ['type', 'Optional. Accepts ' + cb('shortcuts') + ', ' + cb('headers') + ', ' + cb('mfc') + ' and ' + cb('gamecards') + '.\nSelects which type of data will be colected.']
                ],
                examples: [
                    ['/contents/', JSON.stringify({ "shortcuts": { "id": "redes-sociais", "index": 1, "title": "Redes Sociais", "children": [{ "id": "reddit", "alt": "Reddit", "index": 1, "href": "https://www.reddit.com/", "img": "https://storage.googleapis.com/statisticshock_github_io_public/icons/dynamic/reddit.webp", "showOnMobile": false }, { "id": "facebook", "alt": "Facebook", "index": 2, "href": "https://www.facebook.com/", "img": "https://storage.googleapis.com/statisticshock_github_io_public/icons/dynamic/fb.webp", "showOnMobile": false }, { "id": "instagram", "alt": "Instagram", "index": 3, "href": "https://www.instagram.com/", "img": "https://storage.googleapis.com/statisticshock_github_io_public/icons/dynamic/insta.webp", "showOnMobile": false }, { "id": "x-twitter", "alt": "X (Twitter)", "index": 4, "href": "https://x.com/home", "img": "https://storage.googleapis.com/statisticshock_github_io_public/icons/dynamic/x.webp", "showOnMobile": false }, { "id": "tiktok", "alt": "TikTok", "index": 5, "href": "https://www.tiktok.com/", "img": "https://storage.googleapis.com/statisticshock_github_io_public/icons/dynamic/tiktok.webp", "showOnMobile": false }, { "id": "discord", "alt": "Discord", "index": 6, "href": "https://discord.com/app", "img": "https://storage.googleapis.com/statisticshock_github_io_public/icons/dynamic/discord.webp", "showOnMobile": false }] }, "gamecards": { "label": "Links", "id": "links", "position": 1, "children": [{ "id": "retroachievements", "label": "RetroAchievements", "position": 1, "href": "https://retroachievements.org/user/assdeper", "img": "https://storage.googleapis.com/statisticshock_github_io_public/pageImages/ra-ps.webp", "img_css": [{ "attribute": "background-size", "value": "contain" }] }, { "id": "rroms-megathread", "label": "r/Roms Megathread", "position": 2, "href": "https://r-roms.github.io/", "img": "https://storage.googleapis.com/statisticshock_github_io_public/pageImages/rroms.webp", "img_css": [] }, { "id": "fitgirl-repacks", "label": "FitGirl Repacks", "position": 3, "href": "https://fitgirl-repacks.site/", "img": "https://storage.googleapis.com/statisticshock_github_io_public/pageImages/fitgirl-ps.webp", "img_css": [] }, { "id": "pkmds-for-web", "label": "PKMDS for Web", "position": 4, "href": "https://pkmds.app/", "img": "https://storage.googleapis.com/statisticshock_github_io_public/pageImages/pokemon.webp", "img_css": [{ "attribute": "background-size", "value": "contain" }] }] }, "headers": { "href": "https://storage.googleapis.com/statisticshock_github_io_public/headers/arthur_sword_ruan.webp", "name": "arthur_sword_ruan", "active": true }, "mfc": { "id": "16888", "href": "https://pt.myfigurecollection.net/item/16888", "img": "https://storage.googleapis.com/statisticshock_github_io_public/mfc/main_images/16888.webp", "icon": "https://storage.googleapis.com/statisticshock_github_io_public/mfc/icons/16888.webp", "character": "Sarugaki Hiyori", "characterJap": "猿柿 ひよ里", "sourceJap": "ブリーチ", "category": "Prepainted", "type": "Wished", "title": "Bleach - Sarugaki Hiyori - 1/8 (Alpha x Omega)" } }, null, 4)],
                    ['/contents/shortcuts/', JSON.stringify({ "shortcuts": { "id": "redes-sociais", "index": 1, "title": "Redes Sociais", "children": [{ "id": "reddit", "alt": "Reddit", "index": 1, "href": "https://www.reddit.com/", "img": "https://storage.googleapis.com/statisticshock_github_io_public/icons/dynamic/reddit.webp", "showOnMobile": false }, { "id": "facebook", "alt": "Facebook", "index": 2, "href": "https://www.facebook.com/", "img": "https://storage.googleapis.com/statisticshock_github_io_public/icons/dynamic/fb.webp", "showOnMobile": false }, { "id": "instagram", "alt": "Instagram", "index": 3, "href": "https://www.instagram.com/", "img": "https://storage.googleapis.com/statisticshock_github_io_public/icons/dynamic/insta.webp", "showOnMobile": false }, { "id": "x-twitter", "alt": "X (Twitter)", "index": 4, "href": "https://x.com/home", "img": "https://storage.googleapis.com/statisticshock_github_io_public/icons/dynamic/x.webp", "showOnMobile": false }, { "id": "tiktok", "alt": "TikTok", "index": 5, "href": "https://www.tiktok.com/", "img": "https://storage.googleapis.com/statisticshock_github_io_public/icons/dynamic/tiktok.webp", "showOnMobile": false }, { "id": "discord", "alt": "Discord", "index": 6, "href": "https://discord.com/app", "img": "https://storage.googleapis.com/statisticshock_github_io_public/icons/dynamic/discord.webp", "showOnMobile": false }] } }, null, 4)],
                ],
            },
            {
                id: 'retro-achievements',
                route: '/retroAchievements/<language>/',
                description: [
                    '',
                    ''
                ],
                parameters: [
                    ['language', 'The language of display.\nAccepts both ' + cb('pt-BR') + ' and ' + cb('en-US') + '.']
                ],
                examples: [
                    ['/retroAchievements/pt-BR/', JSON.stringify({ "awards": [{ "awardData": 5371, "awardDataExtra": 1, "title": "The Legend of Zelda: Link's Awakening DX", "consoleId": 6, "consoleName": "Game Boy Color", "flags": 0, "imageIcon": "https://retroachievements.org/Images/046977.png", "allData": [{ "awardType": "Platinado • Zerado", "awardedAt": "2024-03-11T02:43:46+00:00", "displayOrder": 2 }] }] }, null, 4)]
                ],
            },
            {
                id: 'version',
                route: '/version/',
                description: [
                    'Gets up-to-date version of the <a href="https://statisticshock.github.io/" target="_blank">webpage</a> and this API.',
                    'Obtém a versão atualizada da <a href="https://statisticshock.github.io/" target="_blank">página da web</a> e desta API.'
                ],
                examples: [
                    ['/version/', JSON.stringify({ page: '1.3.0', server: '2.1.0' }, null, 4)]
                ]
            }
        ]
    },
    {
        method: 'POST',
        description: [
            'These methods both <b>get</b> and <b>create</b> data from the database.',
            'Esses métodos tanto <b>obtém</b> quanto <b>criar</b> dados da base de dados.'
        ],
        endpoints: [
            {
                id: 'mfc',
                route: "/mfc/",
                description: [
                    'This endpoint is not ready yet',
                    'Este endpoint não está pronto ainda.'
                ],
            }
        ]
    },
    {
        method: 'PUT',
        description: [
            'These methods should be used to <b>change</b> data in the database.',
            'Esses métodos devem ser utilizados para <b>mudar</b> dados da base de dados.'
        ],
        endpoints: [
            {
                id: 'mfc',
                route: "/mfc/",
                description: [
                    'This endpoint is not ready yet',
                    'Este endpoint não está pronto ainda.'
                ],
            }
        ]
    },
    {
        method: 'DELETE',
        description: [
            'These methods should be used to <b>delete</b> data in the database.',
            'Esses métodos devem ser utilizados para <b>deletar</b> dados da base de dados.'
        ],
        endpoints: [
            {
                id: 'mfc',
                route: "/mfc/",
                description: [
                    'This endpoint is not ready yet',
                    'Este endpoint não está pronto ainda.'
                ],
            }
        ]
    }
];

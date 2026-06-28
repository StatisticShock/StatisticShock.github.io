const cb = function (string) { return `<span class=\"codeblock\">${string}</span>`; };
const tb = function (tag, string = "") { return `&lt;${tag}&gt;${string}&lt;/${tag}&gt;`; };
const contentFolders = ["shortcuts", "gamecards", "headers", "mfc", "my_beloved_headers", "my_beloved_shop"];
const contentString = function (preposition) { return contentFolders.slice(0, -1).map((folder) => cb(folder)).join(", ") + " " + preposition.trim() + " " + cb(contentFolders[contentFolders.length - 1]); };
export const typeOfEndpoints = [
    {
        method: "GET",
        description: {
            en: "These methods only <b>get</b> data from the database.",
            pt: "Esses métodos apenas <b>obtém</b> dados da base de dados."
        },
        endpoints: [
            {
                id: "myanimelist",
                route: "/myanimelist/<type>/?username&offset",
                description: {
                    en: "Returns a list of up to 100 last updated anime/manga.",
                    pt: "Retorna uma lista de até 100 últimos animes/mangá atualizados."
                },
                parameters: [
                    [
                        "type",
                        {
                            en: "Obligatory. Needs to be either " + cb("animelist") + " or " + cb("mangalist") + ".\nDefines what will be returned.",
                            pt: "Obrigatório. Precisa ser ou " + cb("animelist") + " ou " + cb("mangalist") + ".\nDefine o que vai ser retornado."
                        }
                    ],
                    [
                        "username",
                        {
                            en: "Obligatory.\nGets the user which data will be returned.",
                            pt: "Obrigatório.\nObtém o usuário o qual os dadow serão retornados."
                        }
                    ],
                    [
                        "offset",
                        {
                            en: "Optional.\nMust be an integer.\nShifts the data by the number.",
                            pt: "Opcional.\nDeve ser um número inteiro.\nDesloca os dados pelo número."
                        }
                    ],
                    [
                        "limit",
                        {
                            en: "Optional.\nMust be an integer equal or less than 100.\nSets the output size.",
                            pt: "Opcional.\nDeve ser um inteiro igual ou inferior a 100.\nDefine o tamanho do output."
                        }
                    ],
                    [
                        "nsfw",
                        {
                            en: "Optional.\nMust be true or false.\n\"true\" returns every entry, \"false\" filters \"gray\" and \"black\" entries.",
                            pt: "Opcional.\nDeve ser verdadeiro ou falso.\n\"true\" retorna todas as entradas, \"false\" filtra as entradas \"gray\" e \"black\"."
                        }
                    ]
                ],
                examples: [
                    [
                        "/myanimelist/animelist?username=HikariMontgomery",
                        JSON.stringify({ "data": [{ "node": { "id": 62516, "title": "Dandadan 3rd Season", "main_picture": { "medium": "https://cdn.myanimelist.net/images/anime/1444/152105.jpg", "large": "https://cdn.myanimelist.net/images/anime/1444/152105l.jpg" }, "genres": [{ "id": 1, "name": "Action" }, { "id": 4, "name": "Comedy" }, { "id": 27, "name": "Shounen" }, { "id": 37, "name": "Supernatural" }], "num_episodes": 0, "nsfw": "white" }, "list_status": { "status": "plan_to_watch", "score": 0, "num_episodes_watched": 0, "is_rewatching": false, "updated_at": "2025-10-08T13:25:24+00:00" } }] }, null, "\t")
                    ],
                    [
                        "/myanimelist/mangalist?username=HikariMontgomery",
                        JSON.stringify({ "data": [{ "node": { "id": 148054, "title": "Ruri Dragon", "main_picture": { "medium": "https://cdn.myanimelist.net/images/manga/2/269401.jpg", "large": "https://cdn.myanimelist.net/images/manga/2/269401l.jpg" }, "genres": [{ "id": 23, "name": "School" }, { "id": 27, "name": "Shounen" }, { "id": 36, "name": "Slice of Life" }, { "id": 37, "name": "Supernatural" }], "num_chapters": 0, "nsfw": "white", "rank": 1815 }, "list_status": { "status": "reading", "is_rereading": false, "num_volumes_read": 0, "num_chapters_read": 6, "score": 0, "updated_at": "2025-10-08T16:37:34+00:00", "start_date": "2025-09-10" } }] }, null, "\t")
                    ]
                ]
            },
            {
                id: "contents",
                route: "/contents/<type>?",
                description: {
                    en: "This endpoint returns a JSON that contains <b>shortcut</b> data, <b>headers</b> links, <b>MyFigureCollection</b> figure data and <b>gamecards</b> data.",
                    pt: "Este endpoint retorna um JSON que contém dados de <b>shortcut</b>, links de <b>headers</b>, dados de figura de <b>MyFigureCollection</b> e dados de <b>gamecards</b>."
                },
                parameters: [
                    [
                        "type",
                        {
                            en: "Optional. Accepts " + contentString("and") + ".\nSelects which type of data will be colected.",
                            pt: "Opcional. Aceita " + contentString("e") + ".\nSeleciona qual tipo de dados serão coletados."
                        }
                    ]
                ],
                examples: [
                    [
                        "/contents/",
                        JSON.stringify({ "shortcuts": [{ "id": "redes-sociais", "index": 1, "title": "Redes Sociais", "children": [{ "id": "reddit", "alt": "Reddit", "index": 1, "href": "https://www.reddit.com/", "img": "https://storage.googleapis.com/statisticshock_github_io_public/icons/dynamic/reddit.webp", "show_on_mobile": false }, { "id": "facebook", "alt": "Facebook", "index": 2, "href": "https://www.facebook.com/", "img": "https://storage.googleapis.com/statisticshock_github_io_public/icons/dynamic/fb.webp", "show_on_mobile": false }, { "id": "...", "alt": "...", "index": -1, "href": "...", "img": "...", "show_on_mobile": false }] }], "gamecards": [{ "id": "completionist", "label": "Completionist", "position": 1, "href": "https://completionist.me/", "img": "https://storage.googleapis.com/statisticshock_github_io_public/icons/dynamic/completionist.webp", "img_css": [{ "attribute": "background-size", "value": "contain" }, { "attribute": "...", "value": "..." }] }], "headers": [{ "href": "https://storage.googleapis.com/statisticshock_github_io_public/headers/arthur_sword_ruan.webp", "name": "arthur_sword_ruan.webp", "active": true }], "mfc": [{ "id": "641151", "href": "https://pt.myfigurecollection.net//item/641151", "img": "https://storage.googleapis.com/statisticshock_github_io_public/mfc/main_images/641151.webp", "img_sufix": "641151-d517a", "icon": "https://storage.googleapis.com/statisticshock_github_io_public/mfc/icons/641151.webp", "character": "Rem", "character_jap": "レム", "source": "Re:Zero Kara Hajimeru Isekai Seikatsu", "source_jap": "Re：ゼロから始める異世界生活", "classification": "PM Figure", "classification_jap": "PM フィギュア", "category": "Prepainted", "type": "Owned", "title": "Re:Zero Kara Hajimeru Isekai Seikatsu - Rem - PM Figure - Curtsey (SEGA)", "tags": "2018 • 50th prize fair • abs • blue hair • female • figure • lace • maid • media factory • nagatsuki tappei • pair figure • pm figure • prize • pvc • re:zero kara hajimeru isekai seikatsu • re:zero series • rem • sega prize • sega • white lace • yasu" }], "my_beloved_headers": [{ "href": "https://storage.googleapis.com/statisticshock_github_io_public/pageImages/stardew_valley_hero.webp", "name": "stardew-valley", "active": true }], "my_beloved_shop": [{ "img": "https://http2.mlstatic.com/D_NQ_NP_786559-CBT92899874430_092025-O-controles-de-joystick-para-nintendo-switch-com-base-de-carre.webp", "link": "https://pt.aliexpress.com/item/1005007314402841.html", "tipo": "gamepad", "marca": "Aolion", "item": "K10", "valorNumerico": 203, "valor": "203,00", "id": "gamepad_k10", "host": "pt.aliexpress.com" }] }, null, "\t")
                    ],
                    [
                        "/contents/shortcuts/",
                        JSON.stringify({ "shortcuts": { "id": "redes-sociais", "index": 1, "title": "Redes Sociais", "children": [{ "id": "reddit", "alt": "Reddit", "index": 1, "href": "https://www.reddit.com/", "img": "https://storage.googleapis.com/statisticshock_github_io_public/icons/dynamic/reddit.webp", "showOnMobile": false }, { "id": "facebook", "alt": "Facebook", "index": 2, "href": "https://www.facebook.com/", "img": "https://storage.googleapis.com/statisticshock_github_io_public/icons/dynamic/fb.webp", "showOnMobile": false }, { "id": "instagram", "alt": "Instagram", "index": 3, "href": "https://www.instagram.com/", "img": "https://storage.googleapis.com/statisticshock_github_io_public/icons/dynamic/insta.webp", "showOnMobile": false }, { "id": "x-twitter", "alt": "X (Twitter)", "index": 4, "href": "https://x.com/home", "img": "https://storage.googleapis.com/statisticshock_github_io_public/icons/dynamic/x.webp", "showOnMobile": false }, { "id": "tiktok", "alt": "TikTok", "index": 5, "href": "https://www.tiktok.com/", "img": "https://storage.googleapis.com/statisticshock_github_io_public/icons/dynamic/tiktok.webp", "showOnMobile": false }, { "id": "discord", "alt": "Discord", "index": 6, "href": "https://discord.com/app", "img": "https://storage.googleapis.com/statisticshock_github_io_public/icons/dynamic/discord.webp", "showOnMobile": false }] } }, null, "\t")
                    ]
                ]
            },
            {
                id: "retro-achievements",
                route: "/retroAchievements/<language>/",
                description: {
                    en: "",
                    pt: ""
                },
                parameters: [
                    [
                        "language",
                        {
                            en: "The language of display.\nAccepts both " + cb("pt-BR") + " and " + cb("en-US") + ".",
                            pt: "O idioma de exibição.\nAceita tanto " + cb("pt-BR") + " quanto " + cb("en-US") + "."
                        }
                    ]
                ],
                examples: [
                    [
                        "/retroAchievements/pt-BR/",
                        JSON.stringify({ "awards": [{ "awardData": 5371, "awardDataExtra": 1, "title": "The Legend of Zelda: Link's Awakening DX", "consoleId": 6, "consoleName": "Game Boy Color", "flags": 0, "imageIcon": "https://retroachievements.org/Images/046977.png", "allData": [{ "awardType": "Platinado • Zerado", "awardedAt": "2024-03-11T02:43:46+00:00", "displayOrder": 2 }] }] }, null, "\t")
                    ]
                ]
            },
            {
                id: "version",
                route: "/version/",
                description: {
                    en: "Gets up-to-date version of the <a href=\"https://statisticshock.github.io/\" target=\"_blank\">webpage</a> and this API.",
                    pt: "Obtém a versão atualizada da <a href=\"https://statisticshock.github.io/\" target=\"_blank\">página da web</a> e desta API."
                },
                examples: [
                    [
                        "/version/",
                        JSON.stringify({ page: "1.3.0", server: "2.1.0" }, null, "\t")
                    ]
                ]
            }
        ]
    },
    {
        method: "POST",
        description: {
            en: "These methods both <b>get</b> and <b>create</b> data from the database.",
            pt: "Esses métodos tanto <b>obtém</b> quanto <b>criar</b> dados da base de dados."
        },
        endpoints: [
            {
                id: "contents",
                route: "/contents/<type>/",
                description: {
                    en: "Creates data in the provided type.",
                    pt: "Cria dados no tipo fornecido."
                },
                parameters: [
                    [
                        "type",
                        {
                            en: "Accepts " + contentString("and") + ".",
                            pt: "Aceita " + contentString("e") + "."
                        }
                    ]
                ]
            }
        ]
    },
    {
        method: "PUT",
        description: {
            en: "These methods should be used to <b>change</b> data in the database.",
            pt: "Esses métodos devem ser utilizados para <b>mudar</b> dados da base de dados."
        },
        endpoints: [
            {
                id: "contents",
                route: "/contents/<type>/",
                description: {
                    en: "Edits data in the provided type.",
                    pt: "Edita dados no tipo fornecido."
                },
                parameters: [
                    [
                        "type",
                        {
                            en: "Accepts " + contentString("and") + ".",
                            pt: "Aceita " + contentString("e") + "."
                        }
                    ]
                ]
            }
        ]
    },
    {
        method: "DELETE",
        description: {
            en: "These methods should be used to <b>delete</b> data in the database.",
            pt: "Esses métodos devem ser utilizados para <b>deletar</b> dados da base de dados."
        },
        endpoints: [
            {
                id: "contents",
                route: "/contents/<type>/",
                description: {
                    en: "Deletes data in the provided type.",
                    pt: "Deleta dados no tipo fornecido."
                },
                parameters: [
                    [
                        "type",
                        {
                            en: "Accepts " + contentString("and") + ".",
                            pt: "Aceita " + contentString("e") + "."
                        }
                    ]
                ]
            }
        ]
    }
];

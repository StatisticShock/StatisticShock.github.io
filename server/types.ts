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
export type NewShortcutData = {
    folder: string,
    title: string,
    url: string
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
        img: string
    }>
};
export type PageContent = {
    shortcuts: Array<Shortcut>,
    headers: Array<string>
};
export type ErrorJson = {
    message: string
};
export type ShortcutResponse = {
    sectionId: string,
    newImgPath: string,
}

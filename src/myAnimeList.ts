export default class MyAnimeList {
    static scrappleDataFromMyAnimeList (): void {
        const malString: string = 'https://api.myanimelist.net/v2/';
        const userString: string = 'HikariMontgomery'
        const clientId: string = 'ef7bb92f38af1f3148915b5316b12aa0';

        let json: string = '';

        fetch(`${malString}users/${userString}/animelist?fields=list_status&limit=10`, {
            headers: {
                "X-MAL-CLIENT-ID": clientId,
            }
        })
            .then(res => res.json())
            .then(data => json = data)
            .catch(err => console.error(err));

        console.log(json);
    };
}
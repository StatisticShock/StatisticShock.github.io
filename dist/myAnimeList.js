var MyAnimeList = /** @class */ (function () {
    function MyAnimeList() {
    }
    MyAnimeList.scrappleDataFromMyAnimeList = function () {
        var malString = 'https://api.myanimelist.net/v2/';
        var userString = 'HikariMontgomery';
        var clientId = 'ef7bb92f38af1f3148915b5316b12aa0';
        var json = '';
        fetch("".concat(malString, "users/").concat(userString, "/animelist?fields=list_status&limit=10"), {
            headers: {
                "X-MAL-CLIENT-ID": clientId,
            }
        })
            .then(function (res) { return res.json(); })
            .then(function (data) { return json = data; })
            .catch(function (err) { return console.error(err); });
        console.log(json);
    };
    ;
    return MyAnimeList;
}());
export default MyAnimeList;

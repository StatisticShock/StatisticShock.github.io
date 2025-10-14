var HistoryState = /** @class */ (function () {
    function HistoryState() {
    }
    HistoryState.updateContent = function (path) {
        var route = this.routes[path] || { title: '404', content: 'Page not found.' };
        document.getElementById('title').textContent = route.title;
        document.getElementById('content').textContent = route.content;
    };
    ;
    HistoryState.routes = {
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
    return HistoryState;
}());
;
window.addEventListener('load', onLoadFunctions);
function onLoadFunctions() {
    HistoryState.updateContent(window.location.pathname);
}
;
window.addEventListener('popstate', onPopStateFunctions);
function onPopStateFunctions() {
    HistoryState.updateContent(window.location.pathname);
}
;
export {};

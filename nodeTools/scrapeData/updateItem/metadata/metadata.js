api.on('metadata-data', (event, metadata) => {
    const container = document.querySelector('.container');
    const keys = [
        'id', 'href', 'img', 'character', 'characterJap', 'origin', 'classification', 'category', 'type', 'title'
    ]
    const oldSpans = Array.from(container.querySelectorAll('span'));

    keys.forEach((key) => {
        if (metadata[key]) {
            const span = document.createElement('span');
            span.innerHTML = `${metadata[key]}`;

            const oldSpan = oldSpans.filter((node) => {
                return node.innerHTML === key;
            })[0]

            oldSpan.after(span);
        };
    });

    oldSpans.forEach((oldSpan) => {
        const allSpans = Array.from(container.querySelectorAll('span'));
        const nextOne = allSpans[allSpans.indexOf(oldSpan) + 1];

        if (keys.includes(nextOne.innerHTML)) {
            const span = document.createElement('span');
            span.innerHTML = '';

            oldSpan.after(span);
        };
    });

    document.title = `Metadados: ${metadata.character}`

    window.resizeTo(800, parseFloat(getComputedStyle(container).height) + 120);
});

api.on('metadata-update', (event, [metadata, newKeys, json]) => {
    const oldData = json.filter((item) => item.id === metadata.id)[0];
    const container = document.querySelector('.container');
    const changeableKeys = ['character', 'characterJap', 'origin', 'classification'];
    const updateableKeys = ['type'];
    const oldSpans = Array.from(container.querySelectorAll('span'));

    container.innerHTML = '';

    changeableKeys.forEach((key) => {
        if (metadata[key]) {
            const span = document.createElement('span');
            const input = document.createElement('input');
            
            span.innerHTML = key;
            input.id = key;
            input.style.backgroundColor = oldData[key] === metadata[key] ? 'transparent' : 'khaki';
            input.style.color = oldData[key] === metadata[key] ? 'white' : 'black';
            input.value = metadata[key];

            container.appendChild(span);
            container.appendChild(input);
        };
    });

    document.title = `Atualizar Metadados`

    const okButton = document.querySelector('#ok-button');
    okButton.style.display = '';
    okButton.onclick = function (ev) {
        const inputs = document.querySelectorAll('input');
        let obj = metadata;

        inputs.forEach((input) => {
            obj[input.id] = input.value;
        });

        api.send('update-new-metadata', [obj.id, obj, json]);
    };

    window.resizeTo(800, parseFloat(getComputedStyle(container).height) + 120);
});
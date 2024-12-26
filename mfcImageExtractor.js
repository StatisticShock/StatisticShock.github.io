async function fetchAndExtractImages(url, selector) {
    const response = await fetch(url);
    const html = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const images = Array.from(doc.querySelectorAll(selector)).map(img => img.src);
    return images;
}

// Usage
fetchAndExtractImages(
    'https://pt.myfigurecollection.net/?mode=view&username=HikariKun&tab=collection&page=1',
    'div.item-icon.diaporama img'
).then(images => {
    console.log(images);
});

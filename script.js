// Open in new tab
const items = document.querySelectorAll('.shortcut-item');
items.forEach(element => {
   element.target = '_blank' 
});

//To make aside the same height of Shortcut-Items
window.addEventListener('load', resizeAside);
window.addEventListener('resize', resizeAside);

function resizeAside () {
   const aside = document.querySelector('aside');
   const shortcuts = document.querySelector('#shortcuts');

   aside.style.height = shortcuts.offsetHeight - 6 + 'px';
}
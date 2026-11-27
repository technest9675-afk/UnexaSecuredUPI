const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('app/index.html', 'utf8');
const dom = new JSDOM(html);
const document = dom.window.document;

const bC = document.getElementById('businessContent');
console.log('businessContent children count:', bC.children.length);
for (let i = 0; i < bC.children.length; i++) {
  const child = bC.children[i];
  console.log(`bC child ${i}: <${child.tagName.toLowerCase()} id="${child.id}" class="${child.className.substring(0, 30)}">`);
}

const bTabStore = document.getElementById('bTabStore');
console.log('\nbTabStore children count:', bTabStore.children.length);
for (let i = 0; i < bTabStore.children.length; i++) {
  const child = bTabStore.children[i];
  console.log(`bTabStore child ${i}: <${child.tagName.toLowerCase()} id="${child.id}" class="${child.className.substring(0, 30)}">`);
}

const bottomNav = document.getElementById('bottomNav');
console.log('\nbottomNav parent id:', bottomNav.parentElement.id);
const businessBottomNav = document.getElementById('businessBottomNav');
console.log('businessBottomNav parent id:', businessBottomNav.parentElement.id);

const modalQR = document.getElementById('modalBusinessQR');
console.log('modalBusinessQR parent id:', modalQR.parentElement.id);

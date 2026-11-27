const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('app/index.html', 'utf8');
const dom = new JSDOM(html);
const document = dom.window.document;

const store = document.getElementById('bTabStore');
console.log('bTabStore element tag:', store.tagName);
console.log('bTabStore direct children count:', store.children.length);
for (let i = 0; i < store.children.length; i++) {
  const c = store.children[i];
  console.log(`Child ${i}: <${c.tagName.toLowerCase()} id="${c.id}" class="${c.className.substring(0, 40)}">`);
}

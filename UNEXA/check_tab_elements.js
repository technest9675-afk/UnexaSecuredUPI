const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('app/index.html', 'utf8');
const dom = new JSDOM(html);
const document = dom.window.document;

['bTabHome', 'bTabKhata', 'bTabSettlements', 'bTabStore'].forEach(id => {
  const el = document.getElementById(id);
  console.log(`\n============================`);
  console.log(`SECTION: #${id}`);
  console.log(`============================`);
  const items = el.querySelectorAll('button, a, [onclick]');
  console.log(`Total interactive elements: ${items.length}`);
  items.forEach((item, idx) => {
    console.log(`[${idx + 1}] <${item.tagName.toLowerCase()}> text: "${item.textContent.trim().replace(/\s+/g, ' ').substring(0, 50)}" | onclick: "${item.getAttribute('onclick') || ''}"`);
  });
});

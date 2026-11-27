const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('app/index.html', 'utf8');
const dom = new JSDOM(html);
const document = dom.window.document;

['businessHeader', 'bTabHome', 'bTabKhata', 'bTabSettlements', 'bTabStore', 'businessBottomNav'].forEach(id => {
  const el = document.getElementById(id);
  console.log(`\n=== Section: #${id} ===`);
  const btns = el.querySelectorAll('button, [onclick]');
  console.log(`Found ${btns.length} buttons/onclicks:`);
  btns.forEach((b, i) => {
    console.log(`  [${i+1}] "${b.textContent.trim().replace(/\s+/g, ' ').substring(0, 45)}" -> onclick: "${b.getAttribute('onclick') || 'NONE'}"`);
  });
});

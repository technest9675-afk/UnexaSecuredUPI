const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('app/index.html', 'utf8');
const dom = new JSDOM(html);
const document = dom.window.document;

function auditBusinessSection(id) {
  const el = document.getElementById(id);
  if (!el) {
    console.log(`❌ #${id} NOT FOUND`);
    return;
  }
  console.log(`\n=================== #${id} ===================`);
  const elements = el.querySelectorAll('button, [onclick], input, select');
  console.log(`Total interactive elements: ${elements.length}`);
  elements.forEach((item, i) => {
    const tag = item.tagName.toLowerCase();
    const text = item.textContent.trim().replace(/\s+/g, ' ').substring(0, 50);
    const onclick = item.getAttribute('onclick') || '';
    const itemType = item.getAttribute('type') || '';
    const placeholder = item.getAttribute('placeholder') || '';
    console.log(`[${i + 1}] <${tag} ${itemType ? 'type="'+itemType+'" ' : ''}${placeholder ? 'placeholder="'+placeholder+'" ' : ''}> "${text}" -> onclick: "${onclick}"`);
  });
}

auditBusinessSection('businessHeader');
auditBusinessSection('bTabHome');
auditBusinessSection('bTabKhata');
auditBusinessSection('bTabSettlements');
auditBusinessSection('bTabStore');
auditBusinessSection('businessBottomNav');
auditBusinessSection('modalBusinessQR');
auditBusinessSection('modalAutoSplit');
auditBusinessSection('modalBusinessLoan');
auditBusinessSection('modalStaff');

const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('app/index.html', 'utf8');
const dom = new JSDOM(html);
const document = dom.window.document;

function auditElement(containerId, containerEl) {
  if (!containerEl) {
    console.log(`Container #${containerId} not found!`);
    return;
  }
  console.log(`\n=== Auditing #${containerId} ===`);
  const buttons = containerEl.querySelectorAll('button, [onclick]');
  console.log(`Total interactive elements: ${buttons.length}`);
  buttons.forEach((btn, i) => {
    const text = btn.textContent.trim().replace(/\s+/g, ' ');
    const onclick = btn.getAttribute('onclick') || '(NO ONCLICK)';
    console.log(`[${i + 1}] Text: "${text.substring(0, 40)}" | onclick: ${onclick}`);
  });
}

auditElement('businessHeader', document.getElementById('businessHeader'));
auditElement('bTabHome', document.getElementById('bTabHome'));
auditElement('bTabKhata', document.getElementById('bTabKhata'));
auditElement('bTabSettlements', document.getElementById('bTabSettlements'));
auditElement('bTabStore', document.getElementById('bTabStore'));
auditElement('businessBottomNav', document.getElementById('businessBottomNav'));
auditElement('modalBusinessQR', document.getElementById('modalBusinessQR'));
auditElement('modalAutoSplit', document.getElementById('modalAutoSplit'));
auditElement('modalBusinessLoan', document.getElementById('modalBusinessLoan'));
auditElement('modalStaff', document.getElementById('modalStaff'));

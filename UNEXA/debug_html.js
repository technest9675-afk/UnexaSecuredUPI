const fs = require('fs');
const html = fs.readFileSync('app/index.html', 'utf8');

console.log('Main App Header exists:', html.includes('id="mainAppHeader"'));
console.log('Business Header exists:', html.includes('id="businessHeader"'));
console.log('Business Content exists:', html.includes('id="businessContent"'));
console.log('Business Bottom Nav exists:', html.includes('id="businessBottomNav"'));
console.log('bTabHome exists:', html.includes('id="bTabHome"'));

const bContentIdx = html.indexOf('<main id="businessContent"');
console.log('Starts at:', bContentIdx);
console.log('Content preview:', html.substring(bContentIdx, bContentIdx + 200));

// Let's check updateAuthViewVisibility logic
const funcIdx = html.indexOf('updateAuthViewVisibility = function');
console.log('updateAuthViewVisibility override exists:', funcIdx > -1);
if (funcIdx > -1) {
  console.log('Override preview:', html.substring(funcIdx, funcIdx + 500));
}

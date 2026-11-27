const fs = require('fs');
const html = fs.readFileSync('app/index.html', 'utf8');

const bHIdx = html.indexOf('id="businessHeader"');
console.log('businessHeader snippet:');
console.log(html.substring(bHIdx - 100, bHIdx + 400));

const bCIdx = html.indexOf('id="businessContent"');
console.log('\nbusinessContent snippet:');
console.log(html.substring(bCIdx - 100, bCIdx + 400));

const bNIdx = html.indexOf('id="businessBottomNav"');
console.log('\nbusinessBottomNav snippet:');
console.log(html.substring(bNIdx - 100, bNIdx + 400));

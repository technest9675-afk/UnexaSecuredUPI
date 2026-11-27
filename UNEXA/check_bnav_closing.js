const fs = require('fs');
const html = fs.readFileSync('app/index.html', 'utf8');

const bNIdx = html.indexOf('id="businessBottomNav"');
const mQRIdx = html.indexOf('id="modalBusinessQR"');
console.log('--- Between businessBottomNav and modalBusinessQR ---');
console.log(html.substring(bNIdx + 1500, mQRIdx + 100));

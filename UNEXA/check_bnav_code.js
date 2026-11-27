const fs = require('fs');
const html = fs.readFileSync('app/index.html', 'utf8');

const bNIdx = html.indexOf('id="businessBottomNav"');
console.log(html.substring(bNIdx, bNIdx + 1600));

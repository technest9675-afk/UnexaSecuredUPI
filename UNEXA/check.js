const fs = require('fs');
let html = fs.readFileSync('app/index.html', 'utf8');

const startIdx = html.indexOf('<main id="businessContent"');
const endIdx = html.indexOf('</main>', startIdx) + 7;

console.log('Business Content Length:', endIdx - startIdx);

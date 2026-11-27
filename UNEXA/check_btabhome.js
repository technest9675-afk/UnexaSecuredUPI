const fs = require('fs');
const html = fs.readFileSync('app/index.html', 'utf8');

const bTabHomeIdx = html.indexOf('<div id="bTabHome"');
console.log('bTabHome content preview:', html.substring(bTabHomeIdx, bTabHomeIdx + 500));

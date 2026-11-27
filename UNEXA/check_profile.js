const fs = require('fs');
const html = fs.readFileSync('app/index.html', 'utf8');

const mainContentIdx = html.indexOf('id="mainContent"');
const profileViewIdx = html.indexOf('id="profileView"');
const endMainContentIdx = html.indexOf('</main>', mainContentIdx);

console.log('mainContent starts at:', mainContentIdx);
console.log('profileView starts at:', profileViewIdx);
console.log('mainContent ends at:', endMainContentIdx);

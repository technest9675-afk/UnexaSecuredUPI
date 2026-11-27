const fs = require('fs');
let html = fs.readFileSync('app/index.html', 'utf8');

html = html.replace(/<div class="bbps-icon-circle bbps-color-[a-z]+">/g, '<div class="bbps-icon-circle">');

fs.writeFileSync('app/index.html', html);
console.log('Removed color classes from HTML');

const fs = require('fs');
const html = fs.readFileSync('app/index.html', 'utf8');

let scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gm;
let match;
let allCode = '';

while ((match = scriptRegex.exec(html)) !== null) {
  allCode += match[1] + '\n';
}

fs.writeFileSync('all_scripts.js', allCode);

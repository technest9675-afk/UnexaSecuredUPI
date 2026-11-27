const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('app/index.html', 'utf8');
const dom = new JSDOM(html);
const scripts = dom.window.document.querySelectorAll('script');

let allCode = '';
scripts.forEach(s => allCode += s.textContent + '\n');
fs.writeFileSync('all_scripts.js', allCode);

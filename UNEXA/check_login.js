const fs = require('fs');
const html = fs.readFileSync('app/index.html', 'utf8');
const loginStart = html.indexOf('id="loginAuthView"');
console.log(html.substring(loginStart, loginStart + 2000));

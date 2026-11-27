const fs = require('fs');
let code = fs.readFileSync('update_engine_js.js', 'utf8');
code = code.replace("if (s === -1 && lines[i].includes(\\`function \\${funcName}(\\`)) s = i;", "if (s === -1 && lines[i].includes('function ' + funcName + '(')) s = i;");
fs.writeFileSync('update_engine_js.js', code);

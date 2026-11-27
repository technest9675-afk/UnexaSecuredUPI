const fs = require('fs');
const html = fs.readFileSync('app/index.html', 'utf8');

const mQRIdx = html.indexOf('id="modalBusinessQR"');
console.log('mQRIdx:', mQRIdx);
console.log(html.substring(mQRIdx - 100, mQRIdx + 200));

const mASIdx = html.indexOf('id="modalAutoSplit"');
console.log('mASIdx:', mASIdx);

const mBLIdx = html.indexOf('id="modalBusinessLoan"');
console.log('mBLIdx:', mBLIdx);

const mSTIdx = html.indexOf('id="modalStaff"');
console.log('mSTIdx:', mSTIdx);

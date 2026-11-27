const fs = require('fs');
let html = fs.readFileSync('app/index.html', 'utf8');

html = html.replace('<div class="modal-overlay hidden" id="modalBusinessQR" style="z-index: 60;">', '<div class="modal-overlay" id="modalBusinessQR" style="z-index: 60;">');

const oldFunc = `function showBusinessQR() {
  const modal = document.getElementById('modalBusinessQR');
  if(modal) {
    modal.classList.remove('hidden');
    setTimeout(() => {
      modal.querySelector('.modal-bottom-sheet').style.transform = 'translateY(0)';
    }, 10);
  }
}`;
html = html.replace(oldFunc, `function showBusinessQR() { openModal('modalBusinessQR'); }`);

fs.writeFileSync('app/index.html', html);
console.log('Fixed QR Modal.');

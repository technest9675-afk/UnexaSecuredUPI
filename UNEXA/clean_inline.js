const fs = require('fs');
let html = fs.readFileSync('app/index.html', 'utf8');

html = html.replace(/<div class="bbps-icon-circle border-amber-500\/50 bg-amber-500\/10 text-amber-300 font-black text-\[10px\]">\s*LIC\s*<\/div>/, 
  `<div class="bbps-icon-circle">
                  <i data-lucide="shield-check" class="w-5 h-5"></i>
                </div>`);

html = html.replace(/class="bbps-icon-circle border-emerald-500\/40 bg-emerald-500\/10 text-emerald-400"/g, 'class="bbps-icon-circle"');
html = html.replace(/class="bbps-icon-circle border-blue-500\/40 bg-blue-500\/10 text-blue-400"/g, 'class="bbps-icon-circle"');

fs.writeFileSync('app/index.html', html);
console.log('Fixed inline classes and LIC icon');

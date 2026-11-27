const fs = require('fs');
let html = fs.readFileSync('app/index.html', 'utf8');

html = html.replace(/\.bbps-service-btn:hover \.bbps-icon-circle\s*\{[\s\S]*?\}/, 
`.bbps-service-btn:hover .bbps-icon-circle {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: scale(1.05);
  }`);

fs.writeFileSync('app/index.html', html);
console.log('Fixed hover state');

const fs = require('fs');
let html = fs.readFileSync('app/index.html', 'utf8');

html = html.replace(/<i data-lucide="sim-card"/g, '<i data-lucide="cpu"');
html = html.replace(/icon: 'sim-card'/g, "icon: 'cpu'");

html = html.replace(/body\.theme-light \.bbps-icon-circle\s*\{[\s\S]*?\}/, 
`body.theme-light .bbps-icon-circle {
    border: 1px solid rgba(139, 92, 246, 0.4) !important;
    background: #fbfbfe !important;
    color: #6d28d9 !important;
    box-shadow: 0 2px 8px rgba(139, 92, 246, 0.08) !important;
  }`);

html = html.replace(/body\.theme-light \.bbps-service-title\s*\{[\s\S]*?\}/,
`body.theme-light .bbps-service-title {
    color: #1e3a8a !important; /* clean dark-blue */
  }`);

fs.writeFileSync('app/index.html', html);
console.log('Fixed light mode CSS and sim icon');

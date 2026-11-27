const fs = require('fs');
let html = fs.readFileSync('app/index.html', 'utf8');

// 1. Update .bbps-icon-circle CSS to remove hardcoded colors and set dimensions
html = html.replace(/\.bbps-icon-circle\s*\{[\s\S]*?\}/, 
`.bbps-icon-circle {
    width: 40px;
    height: 40px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 6px;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }`);

// 2. Remove the light theme specific color overrides for bbps-icon-circle
html = html.replace(/body\.theme-light \.bbps-icon-circle\s*\{[\s\S]*?\}/, '');

// 3. Define color palettes
const palettes = [
  'bg-indigo-600/20 border border-indigo-500/40 text-indigo-400',
  'bg-purple-600/30 border border-purple-500/50 text-purple-400',
  'bg-cyan-600/20 border border-cyan-500/40 text-cyan-400',
  'bg-emerald-600/20 border border-emerald-500/40 text-emerald-400',
  'bg-amber-600/20 border border-amber-500/40 text-amber-400',
  'bg-pink-600/20 border border-pink-500/40 text-pink-400',
  'bg-rose-600/20 border border-rose-500/40 text-rose-400',
  'bg-blue-600/20 border border-blue-500/40 text-blue-400'
];

// 4. Inject into HTML
let colorIndex = 0;
html = html.replace(/class="bbps-icon-circle([^"]*)"/g, (match, existingClasses) => {
  // Clear any existing color classes we might have added
  let cleanedClasses = existingClasses.replace(/bg-[a-z]+-\d+\/\d+/g, '')
                                      .replace(/border-[a-z]+-\d+\/\d+/g, '')
                                      .replace(/text-[a-z]+-\d+/g, '')
                                      .replace(/border /g, '')
                                      .trim();
                                      
  const palette = palettes[colorIndex % palettes.length];
  colorIndex++;
  return `class="bbps-icon-circle ${palette} ${cleanedClasses}".trim()`;
});
// Need to fix the trailing quote properly:
html = fs.readFileSync('app/index.html', 'utf8');

// Do it properly:
html = html.replace(/\.bbps-icon-circle\s*\{[\s\S]*?\}/, 
`.bbps-icon-circle {
    width: 40px;
    height: 40px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 6px;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }`);
html = html.replace(/body\.theme-light \.bbps-icon-circle\s*\{[\s\S]*?\}/, '');
html = html.replace(/body\.theme-light \.bbps-service-btn:hover \.bbps-icon-circle\s*\{[\s\S]*?\}/, '');

let cIndex = 0;
html = html.replace(/<div class="bbps-icon-circle.*?"/g, (match) => {
  const palette = palettes[cIndex % palettes.length];
  cIndex++;
  return `<div class="bbps-icon-circle ${palette}"`;
});

fs.writeFileSync('app/index.html', html);
console.log('Done coloring icons');

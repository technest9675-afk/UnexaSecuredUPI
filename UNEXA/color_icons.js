const fs = require('fs');
let html = fs.readFileSync('app/index.html', 'utf8');

const colorClasses = [
  'bbps-color-indigo', 'bbps-color-cyan', 'bbps-color-emerald', 
  'bbps-color-amber', 'bbps-color-rose', 'bbps-color-purple', 
  'bbps-color-blue', 'bbps-color-teal'
];

let i = 0;
html = html.replace(/<div class="bbps-icon-circle">/g, () => {
  const color = colorClasses[i % colorClasses.length];
  i++;
  return `<div class="bbps-icon-circle ${color}">`;
});

fs.writeFileSync('app/index.html', html);
console.log('Injected color classes to app/index.html');

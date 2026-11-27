const fs = require('fs');
let html = fs.readFileSync('app/index.html', 'utf8');

html = html.replace(/\.bbps-icon-circle\s*\{[\s\S]*?\}/, 
`.bbps-icon-circle {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 1px solid rgba(168, 85, 247, 0.4);
    background: rgba(147, 51, 234, 0.15);
    color: #c084fc;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 6px;
    transition: all 0.2s ease;
    box-shadow: 0 4px 14px rgba(168, 85, 247, 0.1);
    flex-shrink: 0;
  }`);

html = html.replace(/\.bbps-service-title\s*\{[\s\S]*?\}/, 
`.bbps-service-title {
    font-size: 11px;
    font-weight: 600;
    line-height: 1.2;
    color: #a5b4fc;
    text-align: center;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }`);

fs.writeFileSync('app/index.html', html);
console.log('Updated CSS');

/**
 * Unexa Synchronization Script
 * Synchronizes HTML, config.js, and supabase-client.js across:
 * - app/
 * - root
 * - android/app/src/main/assets/public/
 */
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const appHtml = path.join(rootDir, 'app/index.html');
const rootHtml = path.join(rootDir, 'index.html');
const androidHtml = path.join(rootDir, 'android/app/src/main/assets/public/index.html');

const appConfig = path.join(rootDir, 'app/config.js');
const rootConfig = path.join(rootDir, 'config.js');
const androidConfig = path.join(rootDir, 'android/app/src/main/assets/public/config.js');

const appSupabase = path.join(rootDir, 'app/supabase-client.js');
const rootSupabase = path.join(rootDir, 'supabase-client.js');
const androidSupabase = path.join(rootDir, 'android/app/src/main/assets/public/supabase-client.js');

// 1. Sync HTML
const htmlContent = fs.readFileSync(appHtml, 'utf8');
fs.writeFileSync(rootHtml, htmlContent, 'utf8');
fs.writeFileSync(androidHtml, htmlContent, 'utf8');
console.log('✓ Synchronized index.html to root and android assets');

// 2. Sync config.js
if (fs.existsSync(appConfig)) {
  const configContent = fs.readFileSync(appConfig, 'utf8');
  fs.writeFileSync(rootConfig, configContent, 'utf8');
  fs.writeFileSync(androidConfig, configContent, 'utf8');
  console.log('✓ Synchronized config.js to root and android assets');
}

// 3. Sync supabase-client.js
if (fs.existsSync(appSupabase)) {
  const supabaseContent = fs.readFileSync(appSupabase, 'utf8');
  fs.writeFileSync(rootSupabase, supabaseContent, 'utf8');
  fs.writeFileSync(androidSupabase, supabaseContent, 'utf8');
  console.log('✓ Synchronized supabase-client.js to root and android assets');
}

// 4. Sync Logo Assets
const logoFiles = ['unexa-shield-logo.png', 'unexa-lockup-logo.png'];
logoFiles.forEach(file => {
  const src = path.join(rootDir, 'app', file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(rootDir, file));
    const androidTarget = path.join(rootDir, 'android/app/src/main/assets/public', file);
    if (fs.existsSync(path.dirname(androidTarget))) {
      fs.copyFileSync(src, androidTarget);
    }
    console.log(`✓ Synchronized ${file} to root and android assets`);
  }
});

console.log('All Unexa assets successfully synchronized!');

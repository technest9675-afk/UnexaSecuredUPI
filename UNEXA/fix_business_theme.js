const fs = require('fs');
let html = fs.readFileSync('app/index.html', 'utf8');

// Update switchMode to handle theme
const switchModeFunc = `function switchMode(targetMode) {
  currentActiveMode = targetMode;
  showToast(\`Switching to \${targetMode === 'business' ? 'Business' : 'Personal'} Mode...\`);
  playSuccessChime();
  updateAuthViewVisibility();
}`;

const newSwitchModeFunc = `function switchMode(targetMode) {
  currentActiveMode = targetMode;
  showToast(\`Switching to \${targetMode === 'business' ? 'Business' : 'Personal'} Mode...\`);
  playSuccessChime();
  
  if (targetMode === 'business') {
    document.body.classList.remove('theme-light');
  } else {
    if(window.applyTheme) applyTheme(appState.theme || 'amoled');
  }
  
  updateAuthViewVisibility();
}`;

html = html.replace(switchModeFunc, newSwitchModeFunc);

// Update updateAuthViewVisibility to also enforce theme on load
const enforceThemeStr = `currentActiveMode = loginAppMode;
  } else {
    if (currentActiveMode === 'business') {`;

const newEnforceThemeStr = `currentActiveMode = loginAppMode;
  } else {
    if (currentActiveMode === 'business') {
      document.body.classList.remove('theme-light');`;

html = html.replace(enforceThemeStr, newEnforceThemeStr);

// Also override applyTheme safely
const applyThemeOverride = `
const oldApplyTheme = applyTheme;
applyTheme = function(themeName) {
  oldApplyTheme(themeName);
  if (typeof currentActiveMode !== 'undefined' && currentActiveMode === 'business') {
    document.body.classList.remove('theme-light');
  }
};
`;

html = html.replace('// Override existing updateAuthViewVisibility safely', applyThemeOverride + '\n// Override existing updateAuthViewVisibility safely');

// Let's also fix bContent background explicitly to bg-[#07090e]
// Already bg-[#07090e] in index.html, so that's fine.

fs.writeFileSync('app/index.html', html);
console.log('Fixed Business Mode theme visibility issues!');

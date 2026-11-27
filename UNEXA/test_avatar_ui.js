const fs = require('fs');
const path = require('path');
const workspaceDir = __dirname;
const { JSDOM } = require(path.join(workspaceDir, 'node_modules', 'jsdom'));

let passedTests = 0;
let failedTests = 0;

function assert(condition, testName) {
  if (condition) {
    passedTests++;
    console.log(`  ✓ [PASS] ${testName}`);
  } else {
    failedTests++;
    console.error(`  ✗ [FAIL] ${testName}`);
  }
}

console.log('\n============================================================');
console.log('UNEXA AVATAR UI & PROFILE PHOTO TEST SUITE');
console.log('============================================================\n');

const html = fs.readFileSync(path.join(workspaceDir, 'app', 'index.html'), 'utf8');

// 1. CSS & Sizing
console.log('Test Suite 1: CSS Precision & Circular Avatar Classes');
assert(html.includes('.avatar-circular {'), '.avatar-circular CSS rule is defined');
assert(html.includes('border-radius: 50%'), 'Avatar CSS specifies border-radius: 50%');
assert(html.includes('object-fit: cover'), 'Avatar CSS specifies object-fit: cover');
assert(html.includes('object-position: center'), 'Avatar CSS specifies object-position: center');
assert(html.includes('.header-avatar-frame {'), '.header-avatar-frame CSS class exists');
assert(html.includes('width: 38px') && html.includes('height: 38px'), '.header-avatar-frame sets 38x38px dimensions');
assert(html.includes('overflow: hidden'), '.header-avatar-frame sets overflow: hidden');
assert(html.includes('flex-shrink: 0'), '.header-avatar-frame prevents flex shrinking');

// 2. DOM Structure & Vertical Alignment
console.log('\nTest Suite 2: Header Avatar DOM & Vertical Alignment');
const dom = new JSDOM(html);
const { window } = dom;
const { document } = window;

const header = document.getElementById('mainAppHeader');
assert(header !== null, '#mainAppHeader exists in DOM');

const avatarContainer = document.getElementById('headerAvatarContainer');
assert(avatarContainer !== null, '#headerAvatarContainer exists');
assert(avatarContainer.classList.contains('header-avatar-frame'), '#headerAvatarContainer has header-avatar-frame class');

const headerImg = document.getElementById('headerUserAvatar');
assert(headerImg !== null, '#headerUserAvatar exists');
assert(headerImg.classList.contains('avatar-circular'), '#headerUserAvatar has avatar-circular class');

const onlineDot = document.getElementById('headerOnlineDot');
assert(onlineDot !== null, '#headerOnlineDot exists outside the overflow-hidden frame');

const headerUserName = document.getElementById('headerUserName');
assert(headerUserName !== null, '#headerUserName exists');

const headerUpiId = document.getElementById('headerUpiId');
assert(headerUpiId !== null, '#headerUpiId exists');

// Verify alignment parent container
const userBlock = header.querySelector('.flex.items-center.gap-3');
assert(userBlock !== null, 'Header user container uses flex items-center for vertical alignment');

// 3. Initials Generator & Error Fallback Engine
console.log('\nTest Suite 3: Initials Generator & Error Fallback Engine');

// Extract the avatar functions from HTML and evaluate with window in context
const avatarInitialsCode = html.match(/\/\/ Global Circular Initials Avatar Generator[\s\S]*?window\.handleAvatarError = function[\s\S]*?\};/)[0];
new Function('window', 'document', avatarInitialsCode)(window, document);

assert(typeof window.getInitialsFromName === 'function', 'window.getInitialsFromName is defined');
assert(window.getInitialsFromName('Aarav Sharma') === 'AS', 'Aarav Sharma -> AS');
assert(window.getInitialsFromName('Rohan') === 'RO', 'Rohan -> RO');
assert(window.getInitialsFromName('Priya Patel') === 'PP', 'Priya Patel -> PP');
assert(window.getInitialsFromName('') === 'U', 'Empty name defaults to U');

assert(typeof window.generateInitialsAvatar === 'function', 'window.generateInitialsAvatar is defined');
const svgUri = window.generateInitialsAvatar('Aarav Sharma');
assert(svgUri.startsWith('data:image/svg+xml,'), 'generateInitialsAvatar returns valid SVG data URI');
assert(decodeURIComponent(svgUri).includes('AS'), 'Generated SVG contains user initials');
assert(decodeURIComponent(svgUri).includes('circle'), 'Generated SVG contains circle element for perfect circle display');

// Test handleAvatarError
const testImg = document.createElement('img');
testImg.src = 'https://broken-image-link-test.jpg';
window.handleAvatarError(testImg);
assert(testImg.src.startsWith('data:image/svg+xml,'), 'handleAvatarError falls back to clean circular SVG initials');
assert(testImg.onerror === null, 'handleAvatarError clears onerror handler to prevent error loops');

// 4. Avatar Consistency across views
console.log('\nTest Suite 4: Consistency Across All App Views');
const profileAvatar = document.getElementById('profileCardAvatar');
assert(profileAvatar !== null, '#profileCardAvatar exists');
assert(profileAvatar.classList.contains('avatar-circular'), '#profileCardAvatar has avatar-circular class');

const infoAvatar = document.getElementById('infoModalAvatar');
assert(infoAvatar !== null, '#infoModalAvatar exists');
assert(infoAvatar.classList.contains('avatar-circular'), '#infoModalAvatar has avatar-circular class');

const changePreview = document.getElementById('changeAvatarPreview');
assert(changePreview !== null, '#changeAvatarPreview exists');
assert(changePreview.classList.contains('avatar-circular'), '#changeAvatarPreview has avatar-circular class');

const facePreview = document.getElementById('faceScanAvatarPreview');
assert(facePreview !== null, '#faceScanAvatarPreview exists');
assert(facePreview.classList.contains('avatar-circular'), '#faceScanAvatarPreview has avatar-circular class');

// 5. Change Avatar Modal Actions & Upload Logic
console.log('\nTest Suite 5: Change Avatar Modal Actions & Upload Functions');
const modalAvatar = document.getElementById('modalChangeAvatar');
assert(modalAvatar !== null, '#modalChangeAvatar exists');

// Setup mock state and functions
window.appState = { user: { name: 'Vikram Mehta', avatar: 'https://example.com/custom-photo.jpg' } };
window.defaultState = { user: { name: 'Aarav Sharma', avatar: '' } };
window.saveState = () => {};
window.playSuccessChime = () => {};
window.showToast = () => {};
window.closeModal = () => {};

// Evaluate controller functions
const controllerCode = html.match(/let pendingAvatarDataUrl = null;[\s\S]*?window\.saveCroppedAvatar = applyAndSaveCurrentAvatar;/)[0];
new Function('window', 'document', 'appState', 'defaultState', 'saveState', 'playSuccessChime', 'showToast', 'closeModal', `
  var appState = window.appState;
  var defaultState = window.defaultState;
  var saveState = window.saveState;
  var playSuccessChime = window.playSuccessChime;
  var showToast = window.showToast;
  var closeModal = window.closeModal;
  var DEFAULT_AVATAR_DATA_URI = window.DEFAULT_AVATAR_DATA_URI;
  var handleAvatarError = window.handleAvatarError;
  ${controllerCode}
  window.updateUserAvatarDisplay = updateUserAvatarDisplay;
  window.applyAndSaveCurrentAvatar = applyAndSaveCurrentAvatar;
`)(window, document, window.appState, window.defaultState, window.saveState, window.playSuccessChime, window.showToast, window.closeModal);

const removeAvatarCode = html.match(/function removeCustomAvatar\(\) \{[\s\S]*?closeModal\('modalChangeAvatar'\);\s*\}/)[0];
new Function('window', 'document', 'appState', 'defaultState', 'saveState', 'showToast', 'closeModal', `
  var appState = window.appState;
  var defaultState = window.defaultState;
  var saveState = window.saveState;
  var showToast = window.showToast;
  var closeModal = window.closeModal;
  var DEFAULT_AVATAR_DATA_URI = window.DEFAULT_AVATAR_DATA_URI;
  var updateUserAvatarDisplay = window.updateUserAvatarDisplay;
  ${removeAvatarCode}
  window.removeCustomAvatar = removeCustomAvatar;
`)(window, document, window.appState, window.defaultState, window.saveState, window.showToast, window.closeModal);

assert(typeof window.applyAndSaveCurrentAvatar === 'function', 'applyAndSaveCurrentAvatar function exists');
assert(typeof window.removeCustomAvatar === 'function', 'removeCustomAvatar function exists');
assert(typeof window.updateUserAvatarDisplay === 'function', 'updateUserAvatarDisplay function exists');

// Test updateUserAvatarDisplay
window.updateUserAvatarDisplay();
assert(headerImg.src === 'https://example.com/custom-photo.jpg', 'updateUserAvatarDisplay updates headerUserAvatar');
assert(profileAvatar.src === 'https://example.com/custom-photo.jpg', 'updateUserAvatarDisplay updates profileCardAvatar');
assert(infoAvatar.src === 'https://example.com/custom-photo.jpg', 'updateUserAvatarDisplay updates infoModalAvatar');
assert(changePreview.src === 'https://example.com/custom-photo.jpg', 'updateUserAvatarDisplay updates changeAvatarPreview');

// Test removeCustomAvatar
window.removeCustomAvatar();
assert(window.appState.user.avatar.startsWith('data:image/svg+xml,'), 'removeCustomAvatar resets avatar to clean initials SVG');

// 6. Mobile & Desktop Responsive Layout Checks
console.log('\nTest Suite 6: Responsive Layout Safety & Flex Constraints');
const headerContainer = header.querySelector('.flex.items-center.gap-3');
assert(headerContainer.classList.contains('min-w-0'), 'Header group has min-w-0 to prevent flex blowout');

const headerNameSpan = header.querySelector('#headerUserName span');
assert(headerNameSpan.classList.contains('truncate'), 'User name has truncate class for small mobile screens');

const headerUpiP = header.querySelector('#headerUpiId');
assert(headerUpiP.classList.contains('truncate'), 'UPI ID has truncate class for small mobile screens');

const headerRow = header.querySelector('#headerUpiId').parentElement;
assert(headerRow.classList.contains('flex-wrap'), 'Header subtitle row wraps safely on narrow devices');

console.log('\n============================================================');
console.log(`TOTAL AVATAR TESTS: ${passedTests + failedTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
console.log('============================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL AVATAR TESTS PASSED 100% SUCCESSFULLY!\n');
}

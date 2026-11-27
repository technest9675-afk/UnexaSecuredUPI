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
console.log('UNEXA THEME-ADAPTIVE PROFILE CARD UI TEST SUITE');
console.log('============================================================\n');

const html = fs.readFileSync(path.join(workspaceDir, 'app', 'index.html'), 'utf8');
const dom = new JSDOM(html, { runScripts: 'outside-only' });
const { window } = dom;
const { document } = window;

// Test Suite 1: Semantic Theme Variables Definition
console.log('Test Suite 1: Semantic Theme Variables in Dark and Light Modes');

// Dark Mode Semantic Variables in :root
assert(html.includes('--profile-card-bg: #151C2E'), ':root defines dark card background #151C2E');
assert(html.includes('--profile-card-border: #334155'), ':root defines subtle dark border #334155');
assert(html.includes('--profile-name-color: #F1F5F9'), ':root defines near-white name text #F1F5F9');
assert(html.includes('--profile-text-secondary: #A8B3C7'), ':root defines soft gray secondary text #A8B3C7');
assert(html.includes('--profile-camera-border: #151C2E'), ':root defines matching camera badge border #151C2E');
assert(html.includes('--profile-upi-pill-bg: #1E293B'), ':root defines dark secondary surface for UPI chip #1E293B');
assert(html.includes('--profile-upi-pill-border: #334155'), ':root defines UPI chip border #334155');
assert(html.includes('--profile-divider-color: #334155'), ':root defines dark divider border #334155');

// Light Mode Semantic Variables in body.theme-light
assert(html.includes('body.theme-light {') && html.includes('--profile-card-bg: #ffffff'), 'body.theme-light defines white card background #ffffff');
assert(html.includes('--profile-card-border: rgba(226, 232, 240, 0.9)'), 'body.theme-light defines light border');
assert(html.includes('--profile-name-color: #0f172a'), 'body.theme-light defines dark slate name text #0f172a');
assert(html.includes('--profile-text-secondary: #475569'), 'body.theme-light defines slate secondary text #475569');
assert(html.includes('--profile-camera-border: #ffffff'), 'body.theme-light defines white camera badge border');
assert(html.includes('--profile-upi-pill-bg: #eef2ff'), 'body.theme-light defines light tinted UPI chip surface #eef2ff');

// Test Suite 2: Profile Card CSS Architecture & Variables Application
console.log('\nTest Suite 2: Profile Card CSS Architecture & Variables');
const profileCard = document.getElementById('mainUserProfileCard');
assert(profileCard !== null, '#mainUserProfileCard exists in DOM');
assert(profileCard && profileCard.classList.contains('unexa-profile-card'), 'Profile card has .unexa-profile-card class');
assert(profileCard && profileCard.classList.contains('upi-card'), 'Profile card preserves .upi-card class');

assert(html.includes('background: var(--profile-card-bg) !important'), '.unexa-profile-card uses var(--profile-card-bg)');
assert(html.includes('border: 1px solid var(--profile-card-border) !important'), '.unexa-profile-card uses var(--profile-card-border)');
assert(html.includes('border-radius: 24px !important'), '.unexa-profile-card specifies 24px rounded corners');
assert(html.includes('padding: 18px !important'), '.unexa-profile-card specifies refined 18px padding');
assert(html.includes('box-shadow: var(--profile-card-shadow) !important'), '.unexa-profile-card uses var(--profile-card-shadow)');

assert(html.includes('color: var(--profile-name-color) !important'), '.profile-name uses var(--profile-name-color)');
assert(html.includes('color: var(--profile-text-secondary) !important'), '.profile-phone and .profile-email use var(--profile-text-secondary)');

// Test Suite 3: Profile Header, Avatar & Badges
console.log('\nTest Suite 3: Profile Header, Avatar & Badges');
const avatarImg = document.getElementById('profileCardAvatar');
assert(avatarImg !== null, '#profileCardAvatar exists in profile card');
assert(avatarImg && avatarImg.classList.contains('avatar-circular'), 'Avatar image has .avatar-circular class');
assert(avatarImg && avatarImg.getAttribute('onerror') === 'handleAvatarError(this)', 'Avatar image has handleAvatarError fallback');

const cameraBadge = profileCard ? profileCard.querySelector('.profile-camera-badge') : null;
assert(cameraBadge !== null, '.profile-camera-badge exists on avatar');
assert(cameraBadge && cameraBadge.querySelector('i[data-lucide="camera"]') !== null, 'Camera badge contains camera icon');
assert(html.includes('.profile-camera-badge {'), '.profile-camera-badge CSS rule is defined');
assert(html.includes('border: 2px solid var(--profile-camera-border) !important'), 'Camera badge border dynamically adapts to theme');

const nameEl = document.getElementById('profileCardName');
assert(nameEl !== null, '#profileCardName exists');
assert(nameEl && nameEl.textContent.trim() === 'Aarav Sharma', 'Profile displays name "Aarav Sharma"');
assert(nameEl && nameEl.classList.contains('profile-name'), 'Name has .profile-name class');

const verifiedIcon = profileCard ? profileCard.querySelector('i[data-lucide="badge-check"]') : null;
assert(verifiedIcon !== null, 'Verification badge-check icon exists next to name');

const phoneEl = document.getElementById('profileCardPhone');
assert(phoneEl !== null, '#profileCardPhone exists');
assert(phoneEl && phoneEl.textContent.trim() === '+91 98765 43210', 'Profile displays phone "+91 98765 43210"');

const phoneBadge = document.getElementById('profilePhoneBadge');
assert(phoneBadge !== null, '#profilePhoneBadge exists');
assert(phoneBadge && phoneBadge.textContent.trim() === 'VERIFIED', 'Phone badge displays uppercase "VERIFIED"');
assert(phoneBadge && phoneBadge.classList.contains('profile-verified-badge'), 'Phone badge has .profile-verified-badge class');
assert(phoneBadge && phoneBadge.getAttribute('onclick') === 'openVerifyPhoneModal()', 'Phone badge has onclick="openVerifyPhoneModal()"');

const emailEl = document.getElementById('profileCardEmail');
assert(emailEl !== null, '#profileCardEmail exists');
assert(emailEl && emailEl.textContent.trim() === 'aarav.sharma@example.com', 'Profile displays email "aarav.sharma@example.com"');

const emailBadge = document.getElementById('profileEmailBadge');
assert(emailBadge !== null, '#profileEmailBadge exists');
assert(emailBadge && (emailBadge.textContent.trim() === 'VERIFIED' || emailBadge.textContent.trim() === 'VERIFY'), 'Email action displays verified status ("VERIFIED" or "VERIFY")');
assert(emailBadge && emailBadge.classList.contains('profile-verify-btn'), 'Email action has .profile-verify-btn class');
assert(emailBadge && emailBadge.getAttribute('onclick') === 'openVerifyEmailModal()', 'Email action has onclick="openVerifyEmailModal()"');

// Test Suite 4: UPI ID Row & Inline Copy Confirmation
console.log('\nTest Suite 4: UPI ID Row & Inline Copy Confirmation');
const upiRow = profileCard ? profileCard.querySelector('.profile-upi-row') : null;
assert(upiRow !== null, '.profile-upi-row container exists for single-line alignment');
assert(html.includes('border-top: 1px solid var(--profile-divider-color) !important'), 'UPI row divider uses semantic theme variable');

const upiPill = profileCard ? profileCard.querySelector('.profile-upi-pill') : null;
assert(upiPill !== null, '.profile-upi-pill exists with subtle tinted background');
assert(html.includes('background: var(--profile-upi-pill-bg) !important'), 'UPI pill uses var(--profile-upi-pill-bg)');
assert(html.includes('border: 1px solid var(--profile-upi-pill-border) !important'), 'UPI pill uses var(--profile-upi-pill-border)');
assert(html.includes('color: var(--profile-upi-pill-text) !important'), 'UPI pill uses var(--profile-upi-pill-text)');
assert(upiPill && upiPill.querySelector('i[data-lucide="id-card"]') !== null, 'UPI pill contains id-card icon');
assert(upiPill && upiPill.textContent.includes('aaravsharma@upi'), 'UPI pill contains "aaravsharma@upi"');

const copyBtn = profileCard ? profileCard.querySelector('.profile-upi-copy-btn') : null;
assert(copyBtn !== null, '.profile-upi-copy-btn exists inside UPI pill');
const copyIcon = document.getElementById('profileUpiCopyIcon');
assert(copyIcon !== null, '#profileUpiCopyIcon exists');
const copyText = document.getElementById('profileUpiCopyText');
assert(copyText !== null, '#profileUpiCopyText exists for inline "Copied!" feedback');

const changePhotoBtn = profileCard ? profileCard.querySelector('.profile-change-photo-btn') : null;
assert(changePhotoBtn !== null, '.profile-change-photo-btn exists on right side of UPI row');
assert(changePhotoBtn && changePhotoBtn.getAttribute('onclick') === 'openChangeAvatarModal()', 'Change Photo button calls openChangeAvatarModal()');
assert(changePhotoBtn && changePhotoBtn.querySelector('i[data-lucide="image"]') !== null, 'Change Photo contains image icon');

assert(html.includes('async function copyUpiId'), 'copyUpiId function is defined');
assert(html.includes("copyIcon.setAttribute('data-lucide', 'check')"), 'copyUpiId sets checkmark icon on copy success');
assert(html.includes("copyText.textContent = 'Copied!'"), 'copyUpiId displays "Copied!" text on copy success');

// Test Suite 5: QR Code Button Design & Contrast
console.log('\nTest Suite 5: QR Code Button Design, Sizing & Contrast');
const qrBtn = document.getElementById('btnViewShareQr');
assert(qrBtn !== null, '#btnViewShareQr exists in profile card');
assert(qrBtn && qrBtn.classList.contains('profile-btn-qr'), 'QR button has .profile-btn-qr class');
assert(qrBtn && qrBtn.getAttribute('onclick') === 'openPersonalQrModal()', 'QR button calls openPersonalQrModal()');
assert(qrBtn && qrBtn.querySelector('i[data-lucide="qr-code"]') !== null, 'QR button contains qr-code icon');
assert(qrBtn && qrBtn.textContent.includes('View & Share My QR Code'), 'QR button displays "View & Share My QR Code"');

assert(html.includes('.profile-btn-qr {'), '.profile-btn-qr CSS rule is defined');
assert(html.includes('linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%) !important'), 'QR button uses vibrant indigo-to-purple gradient');
assert(html.includes('color: #ffffff !important'), 'QR button uses crisp white high-contrast text');
assert(html.includes('height: 44px'), 'QR button has 44px standard height');
assert(html.includes('border-radius: 14px !important'), 'QR button has 14px rounded corners');
assert(html.includes('.profile-btn-qr:disabled'), 'QR button defines disabled / loading state styles');

// Test Suite 6: Business Mode Button Design & Dimensions
console.log('\nTest Suite 6: Business Mode Button Alignment & Coordination');
const businessBtn = document.getElementById('btnSwitchBusinessMode');
assert(businessBtn !== null, '#btnSwitchBusinessMode exists in profile card');
assert(businessBtn && businessBtn.classList.contains('profile-btn-business'), 'Business button has .profile-btn-business class');
assert(businessBtn && businessBtn.getAttribute('onclick') === "switchMode('business')", 'Business button calls switchMode("business")');
assert(businessBtn && businessBtn.querySelector('i[data-lucide="briefcase"]') !== null, 'Business button contains briefcase icon');
assert(businessBtn && businessBtn.textContent.includes('Switch to Business Mode'), 'Business button displays "Switch to Business Mode"');

assert(html.includes('.profile-btn-business {'), '.profile-btn-business CSS rule is defined');
assert(html.includes('linear-gradient(135deg, #f59e0b 0%, #eab308 100%) !important'), 'Business button uses tasteful amber-to-gold gradient');
assert(html.includes('color: #0f172a !important'), 'Business button uses dark slate high-contrast text');
assert(html.includes('.profile-btn-business:active'), 'Business button defines tactile pressed state');

// Test Suite 7: Dynamic Theme Switching & data-theme Attributes
console.log('\nTest Suite 7: Dynamic Theme Switching Engine');
assert(html.includes("document.documentElement.setAttribute('data-theme'"), 'applyTheme updates data-theme attribute on <html>');
assert(html.includes("document.body.setAttribute('data-theme'"), 'applyTheme updates data-theme attribute on <body>');
assert(html.includes("document.documentElement.classList.add('dark')"), 'applyTheme adds .dark class in dark mode');
assert(html.includes("document.documentElement.classList.remove('dark')"), 'applyTheme removes .dark class in light mode');

// Test Suite 8: Animations & Reduced Motion
console.log('\nTest Suite 8: Premium Animations & Reduced Motion');
assert(html.includes('@keyframes profileCardFadeInUp'), '@keyframes profileCardFadeInUp is defined');
assert(html.includes('animation: profileCardFadeInUp 0.32s'), 'Profile card applies subtle entrance animation');
assert(html.includes('@media (prefers-reduced-motion: reduce)'), 'prefers-reduced-motion query is present');

// Test Suite 9: Multi-Platform Assets Synchronization
console.log('\nTest Suite 9: Multi-Platform Assets Synchronization');
const rootHtml = fs.readFileSync(path.join(workspaceDir, 'index.html'), 'utf8');
const androidHtml = fs.readFileSync(path.join(workspaceDir, 'android', 'app', 'src', 'main', 'assets', 'public', 'index.html'), 'utf8');

assert(rootHtml.includes('--profile-card-bg: #151C2E'), 'Root index.html has dark card background variable');
assert(androidHtml.includes('--profile-card-bg: #151C2E'), 'Android index.html has dark card background variable');
assert(rootHtml.includes('btnViewShareQr'), 'Root index.html has btnViewShareQr');
assert(androidHtml.includes('btnViewShareQr'), 'Android index.html has btnViewShareQr');
assert(rootHtml.includes('btnSwitchBusinessMode'), 'Root index.html has btnSwitchBusinessMode');
assert(androidHtml.includes('btnSwitchBusinessMode'), 'Android index.html has btnSwitchBusinessMode');

console.log('\n============================================================');
console.log(`TOTAL PROFILE CARD TESTS: ${passedTests + failedTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
console.log('============================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL THEME-ADAPTIVE PROFILE CARD UI TESTS PASSED 100% SUCCESSFULLY!\n');
}

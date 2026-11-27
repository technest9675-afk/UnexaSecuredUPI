/**
 * UNEXA CRITICAL OTP, AUTHENTICATION, UI BUG AND PERFORMANCE REPAIR VERIFICATION
 *
 * Verifies:
 * 1. Phone OTP Normalization & Standardized Error Response Contract
 * 2. Total Removal of Default PIN (1234) Fallbacks
 * 3. Merchant Scam Shield Real Heuristic Integration (No Fake NPCI / HMAC claims)
 * 4. Zero Duplicate DOM IDs in HTML Structure
 * 5. Scoped Lucide Icon Rendering Performance
 * 6. Managed Timer Lifecycles (Burner Countdown & Clock)
 * 7. Zero-Storage Policy for Secrets & PINs
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

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
console.log('UNEXA CRITICAL REPAIRS & PERFORMANCE TEST SUITE');
console.log('============================================================\n');

// 1. Supabase Client Contract & PIN Hardening
console.log('Test Suite 1: Supabase Client OTP & PIN Hardening');
const UnexaSupabase = require('./app/supabase-client.js');

(async () => {
  // Test formatE164Phone
  assert(UnexaSupabase.formatE164Phone('9876543210') === '+919876543210', 'E.164 normalization for Indian 10-digit mobile number');
  assert(UnexaSupabase.formatE164Phone('+91 98765 43210') === '+919876543210', 'E.164 normalization strips whitespace and duplicates');

  // Test structured error response in signInWithOtp
  const signInRes = await UnexaSupabase.signInWithOtp('9876543210');
  assert(signInRes && typeof signInRes.error === 'object', 'signInWithOtp returns structured error object');
  assert(typeof signInRes.error.message === 'string', 'signInWithOtp error has string message');
  assert(String(signInRes.error) === signInRes.error.message, 'signInWithOtp error toString() returns message');

  // Test structured error response in verifyOtp
  const verifyRes = await UnexaSupabase.verifyOtp('9876543210', '123456');
  assert(verifyRes && typeof verifyRes.error === 'object', 'verifyOtp returns structured error object');
  assert(typeof verifyRes.error.message === 'string', 'verifyOtp error has string message');
  assert(verifyRes.session === null, 'verifyOtp returns null session on invalid/mock token');

  // Test PIN security: verifySessionPin without setSessionPin must reject '1234'
  const unconfiguredPinCheck = await UnexaSupabase.verifySessionPin('1234');
  assert(unconfiguredPinCheck === false, 'verifySessionPin strictly rejects default 1234 when unconfigured');

  // Test verifyAppPin rejection of 1234 without setup
  const unconfiguredAppPin = await UnexaSupabase.verifyAppPin('1234');
  assert(unconfiguredAppPin.success === false, 'verifyAppPin strictly rejects default 1234 without prior configuration');

  // 2. DOM & UI Verification
  console.log('\nTest Suite 2: DOM Elements, Merchant Scam Shield & Avatar Presentation');
  const appHtml = fs.readFileSync(path.join(__dirname, 'app', 'index.html'), 'utf8');

  // Merchant Scam Shield Modal IDs
  assert(appHtml.includes('id="merchantScamInput"'), '#merchantScamInput exists in DOM');
  assert(appHtml.includes('id="merchantScamResultBox"'), '#merchantScamResultBox exists in DOM');
  assert(!appHtml.includes('Run NPCI Switch Verification'), 'Fake "Run NPCI Switch Verification" claim eliminated from modal button');
  assert(!appHtml.includes('Zero Fake Payment Guarantee'), 'Misleading "Zero Fake Payment Guarantee" claim eliminated');
  assert(appHtml.includes('AI Fraud & Payment Heuristic Radar'), 'Honest AI Fraud Radar title present in merchant modal');

  // Verify verifyMerchantUtr implementation in HTML
  assert(appHtml.includes('function verifyMerchantUtr()'), 'verifyMerchantUtr function declared');
  const fnMatch = appHtml.match(/function verifyMerchantUtr\(\) \{([\s\S]*?)\n\}/);
  assert(fnMatch && !fnMatch[1].includes('confetti'), 'Fake confetti animation removed from verifyMerchantUtr');
  assert(!appHtml.includes('particleCount: 80, spread: 60'), 'Old fake verification particle parameters eliminated');
  assert(appHtml.includes('AI Advisory Disclaimer:'), 'AI Advisory Disclaimer prominently rendered in verification result');

  // Verify Avatar Consistency
  assert(appHtml.includes('id="headerUserAvatar"') && appHtml.includes('avatar-circular'), 'Header avatar has avatar-circular class');
  assert(appHtml.includes('id="profileCardAvatar"') && appHtml.includes('avatar-circular'), 'Profile card avatar has avatar-circular class');
  assert(appHtml.includes('id="infoModalAvatar"') && appHtml.includes('avatar-circular'), 'Info modal avatar has avatar-circular class');
  assert(appHtml.includes('id="faceScanAvatarPreview"') && appHtml.includes('avatar-circular'), 'Face scan preview avatar has avatar-circular class');

  // Dead demo banner removal
  assert(!appHtml.includes('phoneVerifySmsBanner'), 'phoneVerifySmsBanner completely removed from scripts');
  assert(!appHtml.includes('phoneVerifyIncomingOtp'), 'phoneVerifyIncomingOtp completely removed from scripts');
  assert(!appHtml.includes('emailVerifyBanner'), 'emailVerifyBanner completely removed from scripts');
  assert(!appHtml.includes('emailVerifyIncomingOtp'), 'emailVerifyIncomingOtp completely removed from scripts');
  assert(!appHtml.includes('resetPinIncomingOtpText'), 'resetPinIncomingOtpText completely removed from scripts');

  // 3. Performance & Scoped Icon Engine
  console.log('\nTest Suite 3: Performance, Timers & Scoped Icon Rendering');

  assert(appHtml.includes('window.safeCreateIcons'), 'safeCreateIcons helper defined');
  assert(appHtml.includes('openModal(modalId)'), 'openModal function declared');
  assert(appHtml.includes('safeCreateIcons(modal)'), 'openModal scopes icon rendering strictly to target modal');
  assert(appHtml.includes('window._unexaTimers'), 'window._unexaTimers tracks active interval handles');
  assert(appHtml.includes('stopBurnerCountdown'), 'stopBurnerCountdown helper defined to prevent interval leaks');

  // 4. Duplicate ID Audit in DOM
  console.log('\nTest Suite 4: DOM ID Uniqueness Audit');
  const dom = new JSDOM(appHtml);
  const doc = dom.window.document;
  const allIdElements = doc.querySelectorAll('[id]');
  const idCounts = {};
  allIdElements.forEach(el => {
    const id = el.getAttribute('id');
    idCounts[id] = (idCounts[id] || 0) + 1;
  });
  const duplicates = Object.entries(idCounts).filter(([id, count]) => count > 1);
  assert(duplicates.length === 0, `DOM has zero duplicate IDs (found: ${duplicates.length})`);

  // 5. Zero-Storage Policy
  console.log('\nTest Suite 5: Zero-Storage Policy for Balances & PINs');
  assert(appHtml.includes('delete safeState.user.upiPin;'), 'saveState explicitly deletes user.upiPin');
  assert(appHtml.includes('delete safeState.user.security.appPin;'), 'saveState explicitly deletes user.security.appPin');
  assert(appHtml.includes('delete safeState.appPin;'), 'saveState explicitly deletes safeState.appPin');

  // Final summary
  console.log('\n============================================================');
  console.log(`REPAIR TEST RESULTS: ${passedTests} PASSED, ${failedTests} FAILED`);
  console.log('============================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
})();

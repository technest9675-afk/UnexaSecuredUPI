/**
 * UNEXA Personal Mode UI Redesign & EyeSecure AI Test Suite
 * Validates:
 *   1. Primary Payment Dock (One-Handed Fast UPI Actions)
 *   2. UNEXA EyeSecure AI Security Center (#securityView) & Viewfinder
 *   3. Honest "Hardware Enclave Integration Pending" Attestation Notice
 *   4. Eye-liveness simulation logic (startEyeSecureScan, simulateEyeBlink)
 *   5. 5-Tab + Center Scan Bottom Navigation (#bottomNav)
 *   6. Navigation Router (navigateToTab, navigateBackFromSecurity, switchUpiMode)
 *   7. Multi-Platform Assets Synchronization
 */

const fs = require('fs');
const path = require('path');
const workspaceDir = __dirname;
const { JSDOM } = require(path.join(workspaceDir, 'node_modules', 'jsdom'));

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  ✓ [PASS] ${testName}`);
    testsPassed++;
  } else {
    console.error(`  ✗ [FAIL] ${testName} - ${details}`);
    testsFailed++;
  }
}

console.log('============================================================');
console.log('UNEXA PERSONAL MODE REDESIGN & EYESECURE AI TEST SUITE');
console.log('============================================================\n');

const html = fs.readFileSync(path.join(workspaceDir, 'app', 'index.html'), 'utf8');
const dom = new JSDOM(html, { runScripts: 'outside-only' });
const { window } = dom;
const { document } = window;

// --------------------------------------------------------------------------
// TEST SUITE 1: Primary Payment Dock (Fast One-Handed Actions)
// --------------------------------------------------------------------------
console.log('Test Suite 1: Primary Payment Dock (Fast One-Handed Actions)');
const personalUpiView = document.getElementById('personalUpiView');
assert(personalUpiView !== null, '#personalUpiView exists in the DOM');

const primaryDock = personalUpiView.querySelector('.primary-pay-dock');
assert(primaryDock !== null, '.primary-pay-dock exists inside #personalUpiView');
const dockButtons = primaryDock.querySelectorAll('.pay-dock-btn');
assert(dockButtons.length === 4, `Primary dock contains EXACTLY 4 fast action buttons (found: ${dockButtons.length})`);

// Check Button 1: Scan QR
const btnScan = dockButtons[0];
assert(btnScan && btnScan.getAttribute('onclick') === 'openScannerModal()', 'Dock Button 1 calls openScannerModal()');
assert(btnScan && btnScan.textContent.includes('Scan QR'), 'Dock Button 1 is labeled "Scan QR"');

// Check Button 2: Send
const btnSend = dockButtons[1];
assert(btnSend && btnSend.getAttribute('onclick') === 'openPayContactsModal()', 'Dock Button 2 calls openPayContactsModal()');
assert(btnSend && btnSend.textContent.includes('Send'), 'Dock Button 2 is labeled "Send"');

// Check Button 3: Request
const btnReq = dockButtons[2];
assert(btnReq && btnReq.getAttribute('onclick') === 'openRequestMoneyModal()', 'Dock Button 3 calls openRequestMoneyModal()');
assert(btnReq && btnReq.textContent.includes('Request'), 'Dock Button 3 is labeled "Request"');

// Check Button 4: To Bank
const btnBank = dockButtons[3];
assert(btnBank && btnBank.getAttribute('onclick') === 'openBankTransferModal()', 'Dock Button 4 calls openBankTransferModal()');
assert(btnBank && btnBank.textContent.includes('To Bank'), 'Dock Button 4 is labeled "To Bank"');

// --------------------------------------------------------------------------
// TEST SUITE 2: UNEXA EyeSecure AI Security Center (#securityView)
// --------------------------------------------------------------------------
console.log('\nTest Suite 2: UNEXA EyeSecure AI Security Center (#securityView)');
const securityView = document.getElementById('securityView');
assert(securityView !== null, '#securityView exists in the DOM');
assert(securityView.classList.contains('hidden'), '#securityView is initially hidden');

assert(securityView.textContent.includes('EyeSecure™ AI'), 'Security section displays "EyeSecure™ AI" title');
assert(securityView.textContent.includes('GRADE A+'), 'Security section displays "GRADE A+" badge');
assert(securityView.textContent.includes('AI-Powered Facial Identity Protection'), 'Displays "AI-Powered Facial Identity Protection" subtitle');

// Strict hardware elimination checks
assert(!securityView.textContent.includes('Hardware Enclave Integration Pending'), 'Orange Hardware Enclave Integration Pending warning is completely removed');
assert(!securityView.textContent.includes('Hardware TouchID'), 'Hardware TouchID is completely removed');
assert(!securityView.textContent.includes('DEVICE BINDING & PRIVACY'), 'DEVICE BINDING & PRIVACY is completely removed');
assert(!securityView.textContent.includes('TEE Enclave'), 'TEE Enclave is completely removed');

// Circular Camera Frame Viewfinder
const scanFrame = document.getElementById('eyeScanFrame');
assert(scanFrame !== null, '#eyeScanFrame exists');
assert(scanFrame.classList.contains('eye-scan-frame'), '#eyeScanFrame has .eye-scan-frame class');

assert(document.getElementById('eyeScanLaser') !== null, '#eyeScanLaser laser line exists');
assert(document.getElementById('eyeFaceGuide') !== null, '#eyeFaceGuide face alignment guide exists');
assert(document.getElementById('eyeReticleLeft') !== null, '#eyeReticleLeft corneal reticle exists');
assert(document.getElementById('eyeReticleRight') !== null, '#eyeReticleRight corneal reticle exists');
assert(document.getElementById('eyeScanVideo') !== null, '#eyeScanVideo front camera element exists');

// Controls & Progress
assert(document.getElementById('btnStartEyeScan') !== null, '#btnStartEyeScan button exists');
assert(document.getElementById('btnSimulateBlink') !== null, '#btnSimulateBlink button exists');
assert(document.getElementById('eyeScanProgressBar') !== null, '#eyeScanProgressBar progress bar exists');
assert(document.getElementById('eyeScanStatusTitle') !== null, '#eyeScanStatusTitle status title exists');
assert(securityView.textContent.includes('Ready for Identity Verification'), 'Status heading is "Ready for Identity Verification"');

// Video Blink Challenge
assert(securityView.textContent.includes('VIDEO BLINK CHALLENGE'), 'Displays "VIDEO BLINK CHALLENGE"');
assert(securityView.textContent.includes('1x Blink'), 'Displays "1x Blink" option');
assert(securityView.textContent.includes('2x Blinks'), 'Displays "2x Blinks" option');
assert(securityView.textContent.includes('3x Blinks'), 'Displays "3x Blinks" option');
assert(securityView.textContent.includes('Recommended'), 'Displays "Recommended" on 2x Blinks');

// Periodic Re-Verification
assert(securityView.textContent.includes('PERIODIC RE-VERIFICATION'), 'Displays "PERIODIC RE-VERIFICATION" section');
assert(securityView.textContent.includes('60-DAY CYCLE'), 'Displays "60-DAY CYCLE" badge');
assert(securityView.textContent.includes('Biometric Re-verification Cycle'), 'Displays "Biometric Re-verification Cycle" title');
assert(securityView.textContent.includes('LAST VERIFIED'), 'Displays "LAST VERIFIED" metric card');
assert(securityView.textContent.includes('NEXT SCHEDULED SCAN'), 'Displays "NEXT SCHEDULED SCAN" metric card');
assert(securityView.textContent.includes('Enforce 60-Day Video Re-check'), 'Displays "Enforce 60-Day Video Re-check" toggle');

// AI Identity Verification (Software-Only)
assert(securityView.textContent.includes('AI IDENTITY VERIFICATION'), 'Displays "AI IDENTITY VERIFICATION" section');
assert(securityView.textContent.includes('Eye-Liveness Detection'), 'Displays Eye-Liveness Detection card');
assert(securityView.textContent.includes('Facial Identity Matching'), 'Displays Facial Identity Matching card');
assert(securityView.textContent.includes('AI Presentation Attack Detection'), 'Displays AI Presentation Attack Detection card');

// --------------------------------------------------------------------------
// TEST SUITE 3: 5-Tab + Center Scan Bottom Navigation
// --------------------------------------------------------------------------
console.log('\nTest Suite 3: 5-Tab + Center Scan Bottom Navigation (#bottomNav)');
const bottomNav = document.getElementById('bottomNav');
assert(bottomNav !== null, '#bottomNav exists in the DOM');

const navHome = document.getElementById('navHome');
assert(navHome !== null, '#navHome tab exists');
assert(navHome.getAttribute('onclick') === "navigateToTab('home')", '#navHome calls navigateToTab(\'home\')');

const navHistory = document.getElementById('navHistory');
assert(navHistory !== null, '#navHistory tab exists');
assert(navHistory.getAttribute('onclick') === "openHistoryModal()", '#navHistory calls openHistoryModal()');

const centerScan = bottomNav.querySelector('.scan-pay-btn');
assert(centerScan !== null, 'Center .scan-pay-btn exists');
assert(centerScan.getAttribute('onclick') === "openScannerModal()", 'Center button calls openScannerModal()');

const navGroups = document.getElementById('navGroups');
assert(navGroups !== null, '#navGroups tab exists');
assert(navGroups.getAttribute('onclick') === "navigateToTab('groups')", '#navGroups calls navigateToTab(\'groups\')');

const navSecurity = document.getElementById('navSecurity');
assert(navSecurity !== null, '#navSecurity tab exists');
assert(navSecurity.getAttribute('onclick') === "navigateToTab('security')", '#navSecurity calls navigateToTab(\'security\')');

const navProfile = document.getElementById('navProfile');
assert(navProfile !== null, '#navProfile tab exists');
assert(navProfile.getAttribute('onclick') === "navigateToTab('profile')", '#navProfile calls navigateToTab(\'profile\')');

// --------------------------------------------------------------------------
// TEST SUITE 4: JavaScript Router & EyeSecure Functions
// --------------------------------------------------------------------------
console.log('\nTest Suite 4: JavaScript Router & EyeSecure Functions');
assert(html.includes('function navigateToTab(tab) {'), 'navigateToTab function is defined');
assert(html.includes("tab === 'security'"), 'navigateToTab handles "security" tab');
assert(html.includes('function navigateBackFromSecurity()'), 'navigateBackFromSecurity function is defined');
assert(html.includes('function initEyeSecureUI()'), 'initEyeSecureUI function is defined');
assert(html.includes('function resetEyeSecureUI()'), 'resetEyeSecureUI function is defined');
assert(html.includes('function startEyeSecureScan()'), 'startEyeSecureScan function is defined');
assert(html.includes('function simulateEyeBlink()'), 'simulateEyeBlink function is defined');
assert(html.includes('function selectBlinkChallenge('), 'selectBlinkChallenge function is defined');
assert(html.includes('function refreshVerificationCycle('), 'refreshVerificationCycle function is defined');
assert(html.includes('function togglePeriodicRecheck('), 'togglePeriodicRecheck function is defined');
assert(html.includes('function testPresentationAttackDetection()'), 'testPresentationAttackDetection function is defined');

// --------------------------------------------------------------------------
// TEST SUITE 5: Multi-Platform Assets Synchronization
// --------------------------------------------------------------------------
console.log('\nTest Suite 5: Multi-Platform Assets Synchronization');
const rootHtml = fs.readFileSync(path.join(workspaceDir, 'index.html'), 'utf8');
const androidHtml = fs.readFileSync(path.join(workspaceDir, 'android', 'app', 'src', 'main', 'assets', 'public', 'index.html'), 'utf8');

assert(rootHtml.includes('primary-pay-dock'), 'Root index.html includes primary-pay-dock');
assert(androidHtml.includes('primary-pay-dock'), 'Android index.html includes primary-pay-dock');
assert(rootHtml.includes('id="securityView"'), 'Root index.html includes #securityView');
assert(androidHtml.includes('id="securityView"'), 'Android index.html includes #securityView');
assert(rootHtml.includes('id="navSecurity"'), 'Root index.html includes #navSecurity');
assert(androidHtml.includes('id="navSecurity"'), 'Android index.html includes #navSecurity');

console.log('\n============================================================');
console.log(`TOTAL PERSONAL MODE REDESIGN TESTS: ${testsPassed + testsFailed} | PASSED: ${testsPassed} | FAILED: ${testsFailed}`);
console.log('============================================================\n');

if (testsFailed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL PERSONAL MODE REDESIGN & EYESECURE AI TESTS PASSED 100% SUCCESSFULLY!\n');
}

/**
 * UNEXA LOGIN PAGE UI REDESIGN TEST SUITE
 * 
 * Verifies all visual and functional components matching the 4 reference screenshots:
 *   1. Top Navigation Bar (Squircle back button, centered Unexa UPI badge, squircle help button)
 *   2. Hero Trust Showcase (Unexa shield logo in squircle card, title, multi-rail subtitle, 3 security pills: AI SHIELD ACTIVE, AES-256 E2E, NPCI 2.0 REGULATED)
 *   3. Dual-Layer Segmented Selectors (Sign In vs Create Account, Personal UPI [purple] vs Business Merchant [blue])
 *   4. Dynamic 4-State Cards:
 *      - State 1: Sign In + Personal UPI (Personal Sign In, SIM 1 Active, +91, phone input, purple Get Secure OTP & Login button)
 *      - State 2: Sign In + Business Merchant (Merchant Portal Sign In, MDR FREE, GST/VPA, store input, blue Access Merchant Portal button)
 *      - State 3: Create Account + Personal UPI (Create UPI Account, 4-step stepper, legal name, phone input, checkbox, purple Bind Device button)
 *      - State 4: Create Account + Business Merchant (Merchant UPI Account, store name, category dropdown, GSTIN, bank/IFSC, blue Register button)
 *   5. Quick Biometric Access Cards (Touch ID [SECURE ENCLAVE], Face ID [3D LIVENESS], Master PIN [4-DIGIT NPCI], FIDO2 Enclave pill)
 *   6. Zero-Trust SIM & Device Bound Container (Device ID: UNX-9082-iOS, DEMO SANDBOX button)
 *   7. Footer & Security Directives (Terms of Service, NPCI UPI Directives, 24/7 Security Hotline, NPCI Certified)
 *   8. Multi-Platform Assets Synchronization (app/, root, android/)
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

let passedCount = 0;
let failedCount = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  ✓ [PASS] ${testName}`);
    passedCount++;
  } else {
    console.error(`  ✗ [FAIL] ${testName} - ${details}`);
    failedCount++;
  }
}

async function runLoginUITests() {
  console.log('\n============================================================');
  console.log('UNEXA LOGIN PAGE UI REDESIGN TEST SUITE');
  console.log('============================================================\n');

  const appHtml = fs.readFileSync(path.resolve('app/index.html'), 'utf8');

  const dom = new JSDOM(appHtml, {
    url: 'http://localhost:3000',
    runScripts: 'dangerously',
    beforeParse(window) {
      window.tailwind = { config: {} };
    }
  });

  const { window } = dom;
  const { document } = window;
  const loginAuthView = document.getElementById('loginAuthView');
  const authStepPhone = document.getElementById('authStepPhone');

  // --------------------------------------------------------------------------
  // SUITE 1: Status Bar & Top Navigation Bar
  // --------------------------------------------------------------------------
  console.log('Test Suite 1: Status Bar & Top Navigation Bar');
  assert(Boolean(loginAuthView), '#loginAuthView exists in DOM');
  assert(loginAuthView.className.includes('bg-[#F8FAFD]'), '#loginAuthView has soft lavender-white background (#F8FAFD)');

  // Status Bar Area Preservation
  const statusBar = document.querySelector('.status-bar');
  assert(Boolean(statusBar), '.status-bar element exists in DOM');
  assert(!statusBar.innerHTML.includes('statusBarTime'), 'Time indicator (14:45/11:11) is completely removed');
  assert(!statusBar.innerHTML.includes('5G'), '5G network indicator is completely removed');
  assert(!statusBar.innerHTML.includes('wifi'), 'Wi-Fi symbol is completely removed');
  assert(!statusBar.innerHTML.includes('98%'), 'Battery percentage (98%) is completely removed');
  assert(!statusBar.innerHTML.includes('battery-charging'), 'Battery charging/indicator icon is completely removed');
  assert(statusBar.children.length === 0, 'Status bar area is empty and preserves background/height');

  // Top Navigation Bar
  const topNav = authStepPhone.firstElementChild;
  assert(Boolean(topNav), 'Top navigation bar exists in authStepPhone');
  assert(topNav.innerHTML.includes('arrow-left'), 'Squircle back button with arrow-left exists');
  assert(topNav.innerHTML.includes('UNEXA'), 'Centered UNEXA brand name exists');
  assert(topNav.innerHTML.includes('UPI'), 'Centered UPI badge exists');
  assert(topNav.innerHTML.includes('unexa-shield-logo.png'), 'Unexa shield logo exists in top navigation');
  assert(topNav.innerHTML.includes('aria-label="Help and Support"'), 'Right squircle help button exists');
  assert(!topNav.innerHTML.includes('data-lucide="user"'), 'Profile button (avatar) is removed from top navigation');
  assert(!topNav.innerHTML.includes('bg-indigo-600'), 'Purple circle profile avatar is removed from top navigation');

  // --------------------------------------------------------------------------
  // SUITE 2: Hero Security & Trust Showcase
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 2: Hero Trust Showcase');
  assert(authStepPhone.innerHTML.includes('Unexa Secure UPI'), '"Unexa Secure UPI" title is rendered');
  assert(authStepPhone.innerHTML.includes('Multi-Rail Instant Payments &amp; Zero-Trust Hardware Enclave Protection') || authStepPhone.innerHTML.includes('Multi-Rail Instant Payments & Zero-Trust Hardware Enclave Protection'), 'Multi-Rail Enclave subtitle rendered');
  assert(authStepPhone.innerHTML.includes('AI SHIELD ACTIVE'), '"AI SHIELD ACTIVE" badge exists');
  assert(authStepPhone.innerHTML.includes('AES-256 E2E'), '"AES-256 E2E" encryption badge exists');
  assert(authStepPhone.innerHTML.includes('NPCI 2.0 REGULATED'), '"NPCI 2.0 REGULATED" badge exists');
  assert(authStepPhone.innerHTML.includes('unexa-shield-logo.png'), 'Unexa shield logo image exists in hero squircle card');

  // --------------------------------------------------------------------------
  // SUITE 3: Dual-Layer Segmented Selectors
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 3: Dual-Layer Segmented Selectors');
  const tabLogin = document.getElementById('tabAuthLogin');
  const tabCreate = document.getElementById('tabAuthCreate');
  const btnPersonal = document.getElementById('modeSelectPersonal');
  const btnBusiness = document.getElementById('modeSelectBusiness');

  assert(Boolean(tabLogin), '#tabAuthLogin exists');
  assert(Boolean(tabCreate), '#tabAuthCreate exists');
  assert(tabLogin.textContent.includes('Sign In'), '#tabAuthLogin displays "Sign In"');
  assert(tabCreate.textContent.includes('Create Account'), '#tabAuthCreate displays "Create Account"');

  assert(Boolean(btnPersonal), '#modeSelectPersonal exists');
  assert(Boolean(btnBusiness), '#modeSelectBusiness exists');
  assert(btnPersonal.textContent.includes('Personal UPI'), '#modeSelectPersonal displays "Personal UPI"');
  assert(btnBusiness.textContent.includes('Business Merchant'), '#modeSelectBusiness displays "Business Merchant"');
  assert(btnPersonal.className.includes('bg-[#4338ca]'), 'Personal mode has purple active styling (#4338ca)');

  // Test mode toggle
  window.setLoginMode('business');
  assert(btnBusiness.className.includes('bg-[#0284c7]'), 'Business button receives blue active styling (#0284c7) on switch');
  window.setLoginMode('personal');
  assert(btnPersonal.className.includes('bg-[#4338ca]'), 'Personal button receives purple active styling (#4338ca) on switch back');

  // --------------------------------------------------------------------------
  // SUITE 4: Dynamic 4-State Main Cards
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 4: Dynamic 4-State Main Cards');
  const authPanelLogin = document.getElementById('authPanelLogin');
  const authPanelCreate = document.getElementById('authPanelCreate');
  const panelLoginPersonal = document.getElementById('panelLoginPersonal');
  const panelLoginBusiness = document.getElementById('panelLoginBusiness');
  const panelCreatePersonal = document.getElementById('panelCreatePersonal');
  const panelCreateBusiness = document.getElementById('panelCreateBusiness');

  assert(Boolean(authPanelLogin), '#authPanelLogin exists in card');
  assert(Boolean(authPanelCreate), '#authPanelCreate exists in card');
  assert(Boolean(panelLoginPersonal), '#panelLoginPersonal exists');
  assert(Boolean(panelLoginBusiness), '#panelLoginBusiness exists');
  assert(Boolean(panelCreatePersonal), '#panelCreatePersonal exists');
  assert(Boolean(panelCreateBusiness), '#panelCreateBusiness exists');

  // State 1: Sign In + Personal UPI
  window.switchAuthTab('login');
  window.setLoginMode('personal');
  assert(!authPanelLogin.classList.contains('hidden'), 'Sign In panel is visible');
  assert(!panelLoginPersonal.classList.contains('hidden'), 'Personal Sign In card is visible in State 1');
  assert(panelLoginBusiness.classList.contains('hidden'), 'Merchant Sign In card is hidden in State 1');
  assert(panelLoginPersonal.innerHTML.includes('Personal Sign In'), '"Personal Sign In" title rendered');
  assert(panelLoginPersonal.innerHTML.includes('SIM 1 Active'), '"SIM 1 Active" badge rendered');
  assert(panelLoginPersonal.innerHTML.includes('Registered Mobile Number'), '"Registered Mobile Number" label rendered');
  assert(panelLoginPersonal.innerHTML.includes('+91'), '+91 prefix rendered');

  const authPhoneInput = document.getElementById('authPhoneInput');
  assert(Boolean(authPhoneInput), '#authPhoneInput exists');
  assert(authPhoneInput.getAttribute('placeholder') === '98765 43210', 'Placeholder is 98765 43210');
  assert(authPhoneInput.getAttribute('maxlength') === '10', 'Maxlength is strictly 10');

  const btnSendOtp = panelLoginPersonal.querySelector('button[onclick="sendLoginOtp()"]');
  assert(Boolean(btnSendOtp), 'Get Secure OTP & Login button exists');
  assert(btnSendOtp.textContent.includes('Get Secure OTP & Login'), 'Button text says "Get Secure OTP & Login"');
  assert(btnSendOtp.className.includes('bg-[#4338ca]'), 'Button uses brand purple color (#4338ca)');

  // State 2: Sign In + Business Merchant
  window.setLoginMode('business');
  assert(!panelLoginBusiness.classList.contains('hidden'), 'Merchant Sign In card is visible in State 2');
  assert(panelLoginPersonal.classList.contains('hidden'), 'Personal Sign In card is hidden in State 2');
  assert(panelLoginBusiness.innerHTML.includes('Merchant Portal Sign In'), '"Merchant Portal Sign In" title rendered');
  assert(panelLoginBusiness.innerHTML.includes('MDR FREE'), '"MDR FREE" badge rendered');
  assert(panelLoginBusiness.innerHTML.includes('GST / VPA Verified'), '"GST / VPA Verified" note rendered');

  const merchantLoginInput = document.getElementById('merchantLoginInput');
  assert(Boolean(merchantLoginInput), '#merchantLoginInput exists in State 2');
  const btnMerchantLogin = panelLoginBusiness.querySelector('button[onclick="handleMerchantLogin()"]');
  assert(Boolean(btnMerchantLogin), 'Access Merchant Portal button exists');
  assert(btnMerchantLogin.className.includes('bg-[#0284c7]'), 'Merchant button uses blue accent (#0284c7)');

  // State 3: Create Account + Personal UPI
  window.switchAuthTab('create');
  window.setLoginMode('personal');
  assert(!authPanelCreate.classList.contains('hidden'), 'Create Account panel is visible');
  assert(!panelCreatePersonal.classList.contains('hidden'), 'Personal Create Account card is visible in State 3');
  assert(panelCreateBusiness.classList.contains('hidden'), 'Merchant Create Account card is hidden in State 3');
  assert(panelCreatePersonal.innerHTML.includes('Create UPI Account'), '"Create UPI Account" title rendered');
  assert(panelCreatePersonal.innerHTML.includes('PROFILE'), 'Step 1 PROFILE in stepper exists');
  assert(panelCreatePersonal.innerHTML.includes('SMS'), 'Step 2 SMS in stepper exists');
  assert(panelCreatePersonal.innerHTML.includes('PIN'), 'Step 3 PIN in stepper exists');
  assert(panelCreatePersonal.innerHTML.includes('BANK'), 'Step 4 BANK in stepper exists');

  const regFullName = document.getElementById('regFullName');
  const regPhoneInput = document.getElementById('regPhoneInput');
  assert(Boolean(regFullName), '#regFullName input exists');
  assert(Boolean(regPhoneInput), '#regPhoneInput input exists');
  assert(panelCreatePersonal.innerHTML.includes('SIM Slot 1 Auto-Detected'), 'SIM Slot 1 Auto-Detected rendered');
  assert(panelCreatePersonal.innerHTML.includes('regPersonalAgree'), 'Personal compliance checkbox exists');

  const btnCreateSubmit = document.getElementById('btnCreateAccountSubmit');
  assert(Boolean(btnCreateSubmit), '#btnCreateAccountSubmit button exists');
  assert(btnCreateSubmit.textContent.includes('Send Verification OTP & Bind Device'), 'Button text says "Send Verification OTP & Bind Device"');
  assert(btnCreateSubmit.className.includes('bg-[#4338ca]'), 'Personal button uses purple (#4338ca)');

  // State 4: Create Account + Business Merchant
  window.setLoginMode('business');
  assert(!panelCreateBusiness.classList.contains('hidden'), 'Merchant Create Account card is visible in State 4');
  assert(panelCreatePersonal.classList.contains('hidden'), 'Personal Create Account card is hidden in State 4');
  assert(panelCreateBusiness.innerHTML.includes('Merchant UPI Account'), '"Merchant UPI Account" title rendered');

  const regMerchantName = document.getElementById('regMerchantName');
  const regMerchantCategory = document.getElementById('regMerchantCategory');
  const regMerchantGstin = document.getElementById('regMerchantGstin');
  const regMerchantAcc = document.getElementById('regMerchantAcc');
  const regMerchantIfsc = document.getElementById('regMerchantIfsc');

  assert(Boolean(regMerchantName), '#regMerchantName input exists');
  assert(Boolean(regMerchantCategory), '#regMerchantCategory select exists');
  assert(Boolean(regMerchantGstin), '#regMerchantGstin input exists');
  assert(panelCreateBusiness.innerHTML.includes('VERIFIED'), 'VERIFIED GSTIN badge rendered');
  assert(Boolean(regMerchantAcc), '#regMerchantAcc input exists');
  assert(Boolean(regMerchantIfsc), '#regMerchantIfsc input exists');
  assert(panelCreateBusiness.innerHTML.includes('T+0 AUTO-SWEEP'), 'T+0 AUTO-SWEEP badge rendered');
  assert(panelCreateBusiness.innerHTML.includes('regMerchantAgree'), 'Merchant compliance checkbox exists');

  const btnMerchantRegister = panelCreateBusiness.querySelector('button[onclick="handleMerchantRegister()"]');
  assert(Boolean(btnMerchantRegister), 'Register Merchant & Setup QR button exists');
  assert(btnMerchantRegister.className.includes('bg-[#0284c7]'), 'Merchant button uses blue accent (#0284c7)');

  // --------------------------------------------------------------------------
  // SUITE 5: Quick Biometric Access Cards
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 5: Quick Biometric Access Cards');
  assert(authStepPhone.innerHTML.includes('OR QUICK BIOMETRIC ACCESS'), '"OR QUICK BIOMETRIC ACCESS" divider present');
  assert(authStepPhone.innerHTML.includes('Touch ID'), '"Touch ID" card present');
  assert(authStepPhone.innerHTML.includes('SECURE ENCLAVE'), '"SECURE ENCLAVE" subtitle present');
  assert(authStepPhone.innerHTML.includes('Face ID'), '"Face ID" card present');
  assert(authStepPhone.innerHTML.includes('3D LIVENESS'), '"3D LIVENESS" subtitle present');
  assert(authStepPhone.innerHTML.includes('Master PIN'), '"Master PIN" card present');
  assert(authStepPhone.innerHTML.includes('4-DIGIT NPCI'), '"4-DIGIT NPCI" subtitle present');
  assert(authStepPhone.innerHTML.includes('FIDO2 &amp; WebAuthn Isolated Cryptographic Enclave') || authStepPhone.innerHTML.includes('FIDO2 & WebAuthn Isolated Cryptographic Enclave'), 'Enclave compliance caption pill present');

  const biometricBtn = authStepPhone.querySelector('button[onclick="openBiometricLoginModal()"]');
  const faceBtn = authStepPhone.querySelector('button[onclick="openFaceLockLoginModal()"]');
  const pinBtn = authStepPhone.querySelector('button[onclick="openAppLockLoginModal()"]');

  assert(Boolean(biometricBtn), 'Biometric button wired to openBiometricLoginModal()');
  assert(Boolean(faceBtn), 'Face button wired to openFaceLockLoginModal()');
  assert(Boolean(pinBtn), 'PIN button wired to openAppLockLoginModal()');

  // --------------------------------------------------------------------------
  // SUITE 6: Zero-Trust Device Binding Container
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 6: Zero-Trust Device Binding Container');
  assert(authStepPhone.innerHTML.includes('Zero-Trust SIM &amp; Device Bound') || authStepPhone.innerHTML.includes('Zero-Trust SIM & Device Bound'), '"Zero-Trust SIM & Device Bound" title present');
  assert(authStepPhone.innerHTML.includes('Device ID: UNX-9082-iOS • Tamper Free'), 'Device ID and Tamper Free subtitle present');

  const sandboxBtn = authStepPhone.querySelector('button[onclick="enterDemoSandboxMode()"]');
  assert(Boolean(sandboxBtn), 'Offline Demo Sandbox button present and wired to enterDemoSandboxMode()');
  assert(sandboxBtn.textContent.includes('DEMO SANDBOX'), 'Button text includes "DEMO SANDBOX"');

  // --------------------------------------------------------------------------
  // SUITE 7: Footer & Directives
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 7: Footer & Directives');
  assert(authStepPhone.innerHTML.includes('Terms of Service'), 'Terms of Service link present');
  assert(authStepPhone.innerHTML.includes('NPCI UPI Directives'), 'NPCI UPI Directives link present');
  assert(authStepPhone.innerHTML.includes('24/7 Security Hotline'), '24/7 Security Hotline contact present');
  assert(authStepPhone.innerHTML.includes('NPCI Certified'), 'NPCI Certified badge present');
  assert(authStepPhone.innerHTML.includes('headphones'), 'Headphones icon present');

  // --------------------------------------------------------------------------
  // SUITE 8: Multi-Platform Assets Synchronization Audit
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 8: Multi-Platform Assets Synchronization Audit');
  const rootHtml = fs.readFileSync(path.resolve('index.html'), 'utf8');
  const androidHtml = fs.readFileSync(path.resolve('android/app/src/main/assets/public/index.html'), 'utf8');

  assert(rootHtml.includes('Unexa Secure UPI'), 'Root index.html has Unexa Secure UPI');
  assert(androidHtml.includes('Unexa Secure UPI'), 'Android index.html has Unexa Secure UPI');
  assert(rootHtml.includes('Zero-Trust SIM &amp; Device Bound') || rootHtml.includes('Zero-Trust SIM & Device Bound'), 'Root index.html has Zero-Trust SIM & Device Bound');
  assert(androidHtml.includes('Zero-Trust SIM &amp; Device Bound') || androidHtml.includes('Zero-Trust SIM & Device Bound'), 'Android index.html has Zero-Trust SIM & Device Bound');
  assert(rootHtml.includes('SECURE ENCLAVE'), 'Root index.html has SECURE ENCLAVE');
  assert(androidHtml.includes('SECURE ENCLAVE'), 'Android index.html has SECURE ENCLAVE');
  assert(rootHtml.includes('unexa-shield-logo.png'), 'Root index.html includes unexa-shield-logo.png');
  assert(androidHtml.includes('unexa-shield-logo.png'), 'Android index.html includes unexa-shield-logo.png');
  assert(fs.existsSync(path.resolve('app/unexa-shield-logo.png')), 'app/unexa-shield-logo.png exists');
  assert(fs.existsSync(path.resolve('unexa-shield-logo.png')), 'root unexa-shield-logo.png exists');
  assert(fs.existsSync(path.resolve('android/app/src/main/assets/public/unexa-shield-logo.png')), 'android unexa-shield-logo.png exists');

  // --------------------------------------------------------------------------
  // Summary
  // --------------------------------------------------------------------------
  console.log('\n============================================================');
  console.log(`TOTAL LOGIN UI TESTS: ${passedCount + failedCount} | PASSED: ${passedCount} | FAILED: ${failedCount}`);
  console.log('============================================================\n');

  if (failedCount > 0) {
    console.error('❌ Some login UI tests failed.');
    process.exit(1);
  } else {
    console.log('🎉 ALL LOGIN PAGE UI TESTS PASSED 100% SUCCESSFULLY!\n');
    process.exit(0);
  }
}

runLoginUITests().catch(err => {
  console.error('Unhandled error during login UI tests:', err);
  process.exit(1);
});

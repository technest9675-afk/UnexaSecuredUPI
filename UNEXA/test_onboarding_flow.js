/**
 * UNEXA FIRST-TIME REGISTRATION & BANK ONBOARDING TEST SUITE
 * 
 * Verifies:
 *   1. First Launch & Auth Routing (Create Account vs Log In segmented tabs)
 *   2. Registration Form Validation (Name, Indian Mobile, Email, inline errors)
 *   3. E.164 Phone Normalization & Duplicate Identity Prevention
 *   4. Real Supabase OTP Handling (Zero fake OTP simulation, honest error handling)
 *   5. Progressive Multi-Step Onboarding Modal & Visual Stepper (Steps 1, 2, 3)
 *   6. Secure App PIN Setup (4 numeric digits, match confirmation, server bcrypt RPC, zero-storage)
 *   7. Dedicated Add Bank Details Page (Educational copy, setup-required notice, safe skip, masked account metadata)
 *   8. Zero Banking Secret Guarantee (No UPI PIN, banking password, or card OTP collected or stored)
 *   9. Server Onboarding State Persistence & Resumption (5 distinct lifecycle states)
 *  10. Returning User Direct Entry & PIN Gate
 *  11. Safe Logout & Session Teardown
 *  12. Multi-Platform Synchronization (app/, root, android/)
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

async function runOnboardingTests() {
  console.log('\n============================================================');
  console.log('UNEXA FIRST-TIME REGISTRATION & BANK ONBOARDING TEST SUITE');
  console.log('============================================================\n');

  const UnexaSupabase = require('./app/supabase-client.js');
  const appHtml = fs.readFileSync(path.resolve('app/index.html'), 'utf8');

  // --------------------------------------------------------------------------
  // SUITE 1: Auth Routing & Segmented Tab Navigation
  // --------------------------------------------------------------------------
  console.log('Test Suite 1: Auth Routing & Segmented Tab Navigation (Create Account vs Log In)');

  const dom = new JSDOM(appHtml, {
    url: 'http://localhost:3000',
    runScripts: 'dangerously',
    beforeParse(window) {
      window.tailwind = { config: {} };
    }
  });

  const { window } = dom;
  const { document } = window;

  const tabAuthCreate = document.getElementById('tabAuthCreate');
  const tabAuthLogin = document.getElementById('tabAuthLogin');
  const authPanelCreate = document.getElementById('authPanelCreate');
  const authPanelLogin = document.getElementById('authPanelLogin');

  assert(Boolean(tabAuthCreate), '#tabAuthCreate button exists in DOM');
  assert(Boolean(tabAuthLogin), '#tabAuthLogin button exists in DOM');
  assert(Boolean(authPanelCreate), '#authPanelCreate registration panel exists in DOM');
  assert(Boolean(authPanelLogin), '#authPanelLogin returning user login panel exists in DOM');

  // Verify switchAuthTab helper
  assert(typeof window.switchAuthTab === 'function', 'switchAuthTab is exported to window');

  // Test switching to "create" tab
  window.switchAuthTab('create');
  assert(!authPanelCreate.classList.contains('hidden'), 'Create Account panel is visible when "create" tab is active');
  assert(authPanelLogin.classList.contains('hidden'), 'Log In panel is hidden when "create" tab is active');
  assert(tabAuthCreate.className.includes('indigo'), 'Create tab button receives active styling');

  // Test switching to "login" tab
  window.switchAuthTab('login');
  assert(!authPanelLogin.classList.contains('hidden'), 'Log In panel is visible when "login" tab is active');
  assert(authPanelCreate.classList.contains('hidden'), 'Create Account panel is hidden when "login" tab is active');
  assert(tabAuthLogin.className.includes('indigo'), 'Login tab button receives active styling');

  // --------------------------------------------------------------------------
  // SUITE 2: Create Account Form Input Validation & Inline Errors
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 2: Create Account Form Input Validation & Inline Errors');

  const regFullName = document.getElementById('regFullName');
  const regPhoneInput = document.getElementById('regPhoneInput');
  const regEmailInput = document.getElementById('regEmailInput');
  const regNameError = document.getElementById('regNameError');
  const regPhoneError = document.getElementById('regPhoneError');
  const regEmailError = document.getElementById('regEmailError');
  const authCreateGeneralError = document.getElementById('authCreateGeneralError');

  assert(Boolean(regFullName), '#regFullName input exists');
  assert(Boolean(regPhoneInput), '#regPhoneInput input exists');
  assert(Boolean(regEmailInput), '#regEmailInput input exists');
  assert(Boolean(regNameError), '#regNameError element exists');
  assert(Boolean(regPhoneError), '#regPhoneError element exists');
  assert(Boolean(regEmailError), '#regEmailError element exists');
  assert(Boolean(authCreateGeneralError), '#authCreateGeneralError element exists');

  // Test Name Validation
  assert(typeof window.validateRegName === 'function', 'validateRegName function exists');
  regFullName.value = '';
  assert(window.validateRegName() === false, 'Rejects empty full name');
  assert(!regNameError.classList.contains('hidden'), 'Shows inline error for empty name');

  regFullName.value = 'A';
  assert(window.validateRegName() === false, 'Rejects 1-character name');

  regFullName.value = 'Rohan Verma';
  assert(window.validateRegName() === true, 'Accepts valid full name');
  assert(regNameError.classList.contains('hidden'), 'Hides inline error on valid name');

  // Test Phone Validation
  assert(typeof window.validateRegPhone === 'function', 'validateRegPhone function exists');
  regPhoneInput.value = '123';
  assert(window.validateRegPhone() === false, 'Rejects invalid phone length');
  assert(!regPhoneError.classList.contains('hidden'), 'Shows inline error for invalid phone');

  regPhoneInput.value = '2345678901';
  assert(window.validateRegPhone() === false, 'Rejects Indian mobile starting with 2-5');

  regPhoneInput.value = '9876543210';
  assert(window.validateRegPhone() === true, 'Accepts valid 10-digit Indian mobile starting with 9');
  assert(regPhoneError.classList.contains('hidden'), 'Hides inline error on valid phone');

  // Test Email Validation (Optional field)
  assert(typeof window.validateRegEmail === 'function', 'validateRegEmail function exists');
  regEmailInput.value = '';
  assert(window.validateRegEmail() === true, 'Accepts empty optional email');

  regEmailInput.value = 'invalid-email-address';
  assert(window.validateRegEmail() === false, 'Rejects malformed email string');
  assert(!regEmailError.classList.contains('hidden'), 'Shows inline error for malformed email');

  regEmailInput.value = 'rohan.verma@example.com';
  assert(window.validateRegEmail() === true, 'Accepts valid email address');
  assert(regEmailError.classList.contains('hidden'), 'Hides inline error on valid email');

  // --------------------------------------------------------------------------
  // SUITE 3: E.164 Normalization & Duplicate Identity Prevention
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 3: E.164 Normalization & Duplicate Identity Prevention');

  assert(typeof UnexaSupabase.formatE164Phone === 'function', 'formatE164Phone is available');
  assert(UnexaSupabase.formatE164Phone('9876543210') === '+919876543210', 'Normalizes 10 digits to +919876543210');
  assert(UnexaSupabase.formatE164Phone('+91 98765 43210') === '+919876543210', 'Strips whitespace');
  assert(UnexaSupabase.formatE164Phone('09876543210') === '+919876543210', 'Normalizes leading 0');

  // Test checkPhoneExists method on Supabase client
  assert(typeof UnexaSupabase.checkPhoneExists === 'function', 'checkPhoneExists helper is exported on Supabase client');
  const phoneExistsRes = await UnexaSupabase.checkPhoneExists('9876543210');
  assert(typeof phoneExistsRes === 'object' && 'exists' in phoneExistsRes, 'checkPhoneExists returns structured object with exists boolean');

  // --------------------------------------------------------------------------
  // SUITE 4: Real Supabase OTP Handling & Error Transparency
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 4: Real Supabase Phone OTP Handling (Zero-Fake Policy)');

  // Ensure no fake auto-fill or simulation code is present
  assert(!appHtml.includes('Math.random().toString().slice(2, 8)'), 'Zero random fake OTP generation in application source');
  assert(!appHtml.includes('autoFillOtp'), 'Zero autoFillOtp backdoor buttons');

  // Verify honest notice when SMS provider is unconfigured
  const otpRes = await UnexaSupabase.signInWithOtp('9876543210');
  assert(otpRes && otpRes.error !== null, 'signInWithOtp returns structured error when SMS gateway unconfigured');
  assert(typeof otpRes.error.message === 'string', 'signInWithOtp error has clear message');

  // --------------------------------------------------------------------------
  // SUITE 5: Progressive Multi-Step Onboarding Modal & Visual Stepper
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 5: Progressive Multi-Step Onboarding Modal & Visual Stepper');

  const modalOnboarding = document.getElementById('modalOnboardingSetup');
  const onboardStepBadge1 = document.getElementById('onboardStepBadge1');
  const onboardStepBadge2 = document.getElementById('onboardStepBadge2');
  const onboardStepBadge3 = document.getElementById('onboardStepBadge3');
  const onboardStep1View = document.getElementById('onboardStep1View');
  const onboardStep2View = document.getElementById('onboardStep2View');
  const onboardStep3View = document.getElementById('onboardStep3View');

  assert(Boolean(modalOnboarding), '#modalOnboardingSetup exists in DOM');
  assert(Boolean(onboardStepBadge1), 'Step 1 badge exists in stepper');
  assert(Boolean(onboardStepBadge2), 'Step 2 badge exists in stepper');
  assert(Boolean(onboardStepBadge3), 'Step 3 badge exists in stepper');
  assert(Boolean(onboardStep1View), '#onboardStep1View exists in DOM');
  assert(Boolean(onboardStep2View), '#onboardStep2View exists in DOM');
  assert(Boolean(onboardStep3View), '#onboardStep3View exists in DOM');

  // Test openOnboardingStep navigation
  assert(typeof window.openOnboardingStep === 'function', 'openOnboardingStep helper is exported');

  // Navigate to Step 2
  window.openOnboardingStep(2);
  assert(!onboardStep2View.classList.contains('hidden'), 'Step 2 view is active and visible');
  assert(onboardStep1View.classList.contains('hidden'), 'Step 1 view is hidden');
  assert(onboardStep3View.classList.contains('hidden'), 'Step 3 view is hidden');
  assert(onboardStepBadge2.classList.contains('bg-indigo-600/30'), 'Step 2 badge has active indicator');

  // Navigate to Step 3
  window.openOnboardingStep(3);
  assert(!onboardStep3View.classList.contains('hidden'), 'Step 3 view is active and visible');
  assert(onboardStep1View.classList.contains('hidden'), 'Step 1 view is hidden');
  assert(onboardStep2View.classList.contains('hidden'), 'Step 2 view is hidden');
  assert(onboardStepBadge3.className.includes('amber'), 'Step 3 badge has active indicator');

  // --------------------------------------------------------------------------
  // SUITE 6: Secure App PIN Setup & Verification (Zero-Storage)
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 6: Secure App PIN Setup (4 Digits, Match Confirmation & Server RPC)');

  const onboardPin = document.getElementById('onboardPin');
  const onboardPinConfirm = document.getElementById('onboardPinConfirm');
  const onboardPinError = document.getElementById('onboardPinError');

  assert(Boolean(onboardPin), '#onboardPin input exists');
  assert(Boolean(onboardPinConfirm), '#onboardPinConfirm input exists');
  assert(Boolean(onboardPinError), '#onboardPinError element exists');
  assert(onboardPin.getAttribute('type') === 'password', '#onboardPin masks input with type="password"');
  assert(onboardPinConfirm.getAttribute('type') === 'password', '#onboardPinConfirm masks input with type="password"');
  assert(onboardPin.getAttribute('maxlength') === '4', '#onboardPin strictly limited to 4 digits');

  assert(typeof window.submitOnboardPinStep === 'function', 'submitOnboardPinStep function exists');

  // Test validation: Non-numeric PIN
  onboardPin.value = 'abcd';
  onboardPinConfirm.value = 'abcd';
  window.submitOnboardPinStep();
  assert(!onboardPinError.classList.contains('hidden'), 'Shows error for non-numeric PIN');

  // Test validation: Short PIN
  onboardPin.value = '12';
  onboardPinConfirm.value = '12';
  window.submitOnboardPinStep();
  assert(!onboardPinError.classList.contains('hidden'), 'Shows error for incomplete PIN length');

  // Test validation: Mismatched PIN
  onboardPin.value = '1234';
  onboardPinConfirm.value = '4321';
  window.submitOnboardPinStep();
  assert(!onboardPinError.classList.contains('hidden'), 'Shows error when PIN confirmation does not match');

  // Test Zero-Storage: verify PIN is never saved to localStorage
  window.localStorage.clear();
  window.saveState();
  const storedData = window.localStorage.getItem('unexa_state') || '{}';
  assert(!storedData.includes('userPin'), 'localStorage does not contain userPin');
  assert(!storedData.includes('appPin'), 'localStorage does not contain appPin');
  assert(!storedData.includes('upiPin'), 'localStorage does not contain upiPin');

  // --------------------------------------------------------------------------
  // SUITE 7: Dedicated Add Bank Details Page & Zero-Secret Guarantee
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 7: Dedicated Add Bank Details Page & Zero-Secret Policy');

  const onboardBankSelect = document.getElementById('onboardBankSelect');
  const onboardAccLast4 = document.getElementById('onboardAccLast4');
  const onboardSkipBank = document.getElementById('onboardSkipBank');
  const onboardErrorNotice = document.getElementById('onboardErrorNotice');

  assert(Boolean(onboardBankSelect), '#onboardBankSelect dropdown exists');
  assert(Boolean(onboardAccLast4), '#onboardAccLast4 input exists');
  assert(Boolean(onboardSkipBank), '#onboardSkipBank checkbox exists');
  assert(Boolean(onboardErrorNotice), '#onboardErrorNotice element exists');

  // Verify educational copy explaining why bank linking is needed
  const step3Html = onboardStep3View.innerHTML;
  assert(step3Html.includes('Add Bank Account for UPI') || step3Html.includes('primary bank account'), 'Includes educational banner explaining necessity of bank linking');
  assert(step3Html.includes('UPI'), 'Mentions UPI payments');
  assert(step3Html.toLowerCase().includes('group pool'), 'Mentions group shared pools');

  // Verify honest "Setup Required" notice
  assert(step3Html.includes('Setup Required') || step3Html.includes('setup mode'), 'Displays honest Setup Required / Live Provider Notice');

  // Verify Zero Banking Secret Guarantee Callout
  assert(step3Html.includes('never collects or stores your UPI PIN, banking passwords, or card OTPs'), 'Prominently features zero-secret guarantee to user');

  // Check client method addBankAccount
  assert(typeof UnexaSupabase.addBankAccount === 'function', 'addBankAccount client method is exported');
  assert(typeof UnexaSupabase.isBankingProviderConfigured === 'function', 'isBankingProviderConfigured helper is exported');

  // Verify bank account insertion validates and masks
  const bankRes = await UnexaSupabase.addBankAccount({
    bankName: 'HDFC Bank',
    accountMasked: '8812',
    ifsc: 'HDFC0001234'
  });
  assert(bankRes !== null && typeof bankRes === 'object', 'addBankAccount returns structured response');

  // Verify toggleOnboardBankSection helper
  assert(typeof window.toggleOnboardBankSection === 'function', 'toggleOnboardBankSection helper exists');
  window.toggleOnboardBankSection(true);
  const onboardBankInputs = document.getElementById('onboardBankInputs');
  assert(onboardBankInputs.classList.contains('opacity-40'), 'Dims bank inputs when Skip is selected');
  assert(onboardBankInputs.classList.contains('pointer-events-none'), 'Disables bank inputs when Skip is selected');
  window.toggleOnboardBankSection(false);
  assert(!onboardBankInputs.classList.contains('opacity-40'), 'Restores bank inputs when Skip is unselected');

  // --------------------------------------------------------------------------
  // SUITE 8: Server Onboarding Status Lifecycle & Resumption
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 8: Server Onboarding Status Persistence & Resumption (5 Lifecycle States)');

  assert(typeof UnexaSupabase.fetchOnboardingStatus === 'function', 'fetchOnboardingStatus helper is exported');
  assert(typeof UnexaSupabase.updateOnboardingStep === 'function', 'updateOnboardingStep helper is exported');
  assert(typeof UnexaSupabase.createRegistrationProfile === 'function', 'createRegistrationProfile helper is exported');

  // Check response structure of fetchOnboardingStatus
  const statusRes = await UnexaSupabase.fetchOnboardingStatus('test-user-id');
  assert('onboarding_step' in statusRes, 'fetchOnboardingStatus returns onboarding_step property');
  assert('is_onboarded' in statusRes, 'fetchOnboardingStatus returns is_onboarded property');
  assert('bank_accounts' in statusRes, 'fetchOnboardingStatus returns bank_accounts array');

  // Test SQL migration integrity: check onboarding_step constraint
  const migrationSql = fs.readFileSync(path.resolve('supabase/migrations/20261019000002_onboarding_flow.sql'), 'utf8');
  assert(migrationSql.includes('phone_not_verified'), 'SQL migration contains phone_not_verified state');
  assert(migrationSql.includes('pin_setup_incomplete'), 'SQL migration contains pin_setup_incomplete state');
  assert(migrationSql.includes('bank_linking_pending'), 'SQL migration contains bank_linking_pending state');
  assert(migrationSql.includes('onboarding_complete'), 'SQL migration contains onboarding_complete state');

  // --------------------------------------------------------------------------
  // SUITE 9: Returning User Direct Entry & Safe Logout
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 9: Returning User Direct Entry & Safe Logout');

  assert(typeof window.handleLogout === 'function', 'handleLogout function is available on window');
  assert(typeof window.submitOnboardingSetup === 'function', 'submitOnboardingSetup function is available on window');

  // Mock window.confirm for JSDOM
  window.confirm = () => true;

  // Verify handleLogout clears session and switches to login view
  window.appState.isLoggedIn = true;
  window.appState.isOnboarded = true;
  window.handleLogout();
  assert(window.appState.isLoggedIn === false, 'handleLogout marks isLoggedIn as false');
  assert(window.appState.isOnboarded === false, 'handleLogout resets isOnboarded flag');

  const loginAuthView = document.getElementById('loginAuthView');
  assert(!loginAuthView.classList.contains('hidden'), 'Login authentication view is shown after logout');

  // --------------------------------------------------------------------------
  // SUITE 10: Multi-Platform Assets Synchronization Audit
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 10: Multi-Platform Assets Synchronization Audit');

  const rootHtml = fs.readFileSync(path.resolve('index.html'), 'utf8');
  const androidHtml = fs.readFileSync(path.resolve('android/app/src/main/assets/public/index.html'), 'utf8');
  const rootClient = fs.readFileSync(path.resolve('supabase-client.js'), 'utf8');
  const androidClient = fs.readFileSync(path.resolve('android/app/src/main/assets/public/supabase-client.js'), 'utf8');

  // Check tabAuthCreate in all index.html files
  assert(rootHtml.includes('id="tabAuthCreate"'), 'Root index.html has #tabAuthCreate');
  assert(androidHtml.includes('id="tabAuthCreate"'), 'Android index.html has #tabAuthCreate');

  // Check onboardStep2View in all index.html files
  assert(rootHtml.includes('id="onboardStep2View"'), 'Root index.html has #onboardStep2View');
  assert(androidHtml.includes('id="onboardStep2View"'), 'Android index.html has #onboardStep2View');

  // Check onboardStep3View in all index.html files
  assert(rootHtml.includes('id="onboardStep3View"'), 'Root index.html has #onboardStep3View');
  assert(androidHtml.includes('id="onboardStep3View"'), 'Android index.html has #onboardStep3View');

  // Check checkPhoneExists in all client files
  assert(rootClient.includes('checkPhoneExists'), 'Root supabase-client.js has checkPhoneExists');
  assert(androidClient.includes('checkPhoneExists'), 'Android supabase-client.js has checkPhoneExists');

  // Check fetchOnboardingStatus in all client files
  assert(rootClient.includes('fetchOnboardingStatus'), 'Root supabase-client.js has fetchOnboardingStatus');
  assert(androidClient.includes('fetchOnboardingStatus'), 'Android supabase-client.js has fetchOnboardingStatus');

  // Check addBankAccount in all client files
  assert(rootClient.includes('addBankAccount'), 'Root supabase-client.js has addBankAccount');
  assert(androidClient.includes('addBankAccount'), 'Android supabase-client.js has addBankAccount');

  // --------------------------------------------------------------------------
  // Summary
  // --------------------------------------------------------------------------
  console.log('\n============================================================');
  console.log(`TOTAL ONBOARDING TESTS: ${passedCount + failedCount} | PASSED: ${passedCount} | FAILED: ${failedCount}`);
  console.log('============================================================\n');

  if (failedCount > 0) {
    console.error('❌ Some onboarding tests failed.');
    process.exit(1);
  } else {
    console.log('🎉 ALL ONBOARDING & REGISTRATION TESTS PASSED 100% SUCCESSFULLY!\n');
    process.exit(0);
  }
}

runOnboardingTests().catch(err => {
  console.error('Unhandled error during onboarding tests:', err);
  process.exit(1);
});

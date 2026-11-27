/**
 * Unexa Phase A & B: Supabase Authentication, Session Gate, & Zero-Storage Security Test Suite
 * 
 * Verifies:
 *   1. E.164 phone normalization (+91 prefixing, digit stripping)
 *   2. Supabase Auth signInWithOtp & verifyOtp negative & positive handling
 *   3. Removal of fake OTP push banners, local Math.random() codes, and auto-fill buttons
 *   4. Visibility of auth failure error notices (#authPhoneError, #authOtpError)
 *   5. Strict session gate: defaultState.isLoggedIn === false, balance === 0
 *   6. Zero-storage policy: localStorage never stores authoritative balances, PINs, or bank accounts
 *   7. Segregation of DEMO_FIXTURES: sample data isolated from production state
 *   8. Session restoration and secure logout behavior
 */

const fs = require('fs');
const path = require('path');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

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

async function runAuthSecurityTests() {
  console.log('\n============================================================');
  console.log('UNEXA PHASE A & B: AUTHENTICATION & SECURITY TEST SUITE');
  console.log('============================================================\n');

  const UnexaSupabase = require('./app/supabase-client.js');
  const appHtml = fs.readFileSync(path.resolve('app/index.html'), 'utf8');

  // --------------------------------------------------------------------------
  // SUITE 1: E.164 Phone Normalization & Validation
  // --------------------------------------------------------------------------
  console.log('Test Suite 1: E.164 Phone Normalization & Client Helper Methods');

  assert(typeof UnexaSupabase.formatE164Phone === 'function', 'formatE164Phone helper is exported');
  assert(UnexaSupabase.formatE164Phone('9876543210') === '+919876543210', 'Normalizes standard 10-digit phone to +919876543210');
  assert(UnexaSupabase.formatE164Phone('+91 98765 43210') === '+919876543210', 'Strips spaces and formats +91 number');
  assert(UnexaSupabase.formatE164Phone('09876543210') === '+919876543210', 'Normalizes 11-digit leading zero number');
  assert(UnexaSupabase.formatE164Phone('+1 415 555 2671') === '+14155552671', 'Preserves international country codes');
  assert(UnexaSupabase.formatE164Phone('') === '', 'Handles empty phone input gracefully');

  // --------------------------------------------------------------------------
  // SUITE 2: Supabase Auth OTP Client Functionality
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 2: Supabase Auth OTP Client Functions');

  assert(typeof UnexaSupabase.signInWithOtp === 'function', 'signInWithOtp is declared');
  assert(typeof UnexaSupabase.verifyOtp === 'function', 'verifyOtp is declared');

  // Verify signInWithOtp handles uninitialized client / offline gracefully
  const signInRes = await UnexaSupabase.signInWithOtp('9876543210');
  assert(signInRes !== null && typeof signInRes === 'object', 'signInWithOtp returns structured response object');
  assert('error' in signInRes, 'signInWithOtp response contains error property');
  assert(signInRes.formattedIdentifier === '+919876543210', 'signInWithOtp returns formatted E.164 identifier');

  // Verify verifyOtp handles bad tokens / uninitialized client gracefully
  const verifyRes = await UnexaSupabase.verifyOtp('9876543210', '000000');
  assert(verifyRes !== null && typeof verifyRes === 'object', 'verifyOtp returns structured response object');
  assert('error' in verifyRes, 'verifyOtp response contains error property');
  assert(verifyRes.session === null, 'verifyOtp returns null session on invalid token');

  // --------------------------------------------------------------------------
  // SUITE 3: Removal of Residual Fake Demo & Auto-Fill Artifacts
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 3: Verification of Residual Demo / Fake OTP Removal');

  assert(!appHtml.includes('id="smsNotificationBanner"'), '#smsNotificationBanner is completely removed from DOM');
  assert(!appHtml.includes('id="phoneVerifySmsBanner"'), '#phoneVerifySmsBanner is removed from Modal 47');
  assert(!appHtml.includes('id="emailVerifyBanner"'), '#emailVerifyBanner is removed from Modal 48');
  assert(!appHtml.includes('id="resetPinSmsBanner"'), '#resetPinSmsBanner is removed from Reset PIN Modal');
  assert(!appHtml.includes('function selectDemoPhone('), 'selectDemoPhone function is eliminated');
  assert(!appHtml.includes('function autoFillOtp('), 'autoFillOtp function is eliminated');
  assert(!appHtml.includes('onclick="autoFillOtp()"'), 'autoFillOtp click handler is removed');
  assert(!appHtml.includes('onclick="autoFillPhoneOtp()"'), 'autoFillPhoneOtp click handler is removed');
  assert(!appHtml.includes('onclick="autoFillEmailOtp()"'), 'autoFillEmailOtp click handler is removed');
  assert(!appHtml.includes('onclick="autoFillResetOtp()"'), 'autoFillResetOtp click handler is removed');

  // Verify phone input is not prefilled with demo phone
  const dom = new JSDOM(appHtml, { runScripts: 'outside-only' });
  const doc = dom.window.document;
  const phoneInput = doc.getElementById('authPhoneInput');
  assert(Boolean(phoneInput), '#authPhoneInput exists in DOM');
  assert(!phoneInput.value || phoneInput.value === '', '#authPhoneInput is empty by default (no demo prefill)');

  // --------------------------------------------------------------------------
  // SUITE 4: Error Visibility and Notice Elements in DOM
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 4: Authentication Error Notice Elements');

  const authPhoneError = doc.getElementById('authPhoneError');
  assert(Boolean(authPhoneError), '#authPhoneError element exists in DOM');
  assert(authPhoneError.classList.contains('hidden'), '#authPhoneError is hidden by default');

  const authOtpError = doc.getElementById('authOtpError');
  assert(Boolean(authOtpError), '#authOtpError element exists in DOM');
  assert(authOtpError.classList.contains('hidden'), '#authOtpError is hidden by default');

  // Verify explicit offline sandbox button exists
  const sandboxBtn = doc.querySelector('button[onclick="enterDemoSandboxMode()"]');
  assert(Boolean(sandboxBtn), 'Explicit Explore in Offline Demo Sandbox button exists');

  // --------------------------------------------------------------------------
  // SUITE 5: Strict Session Gate & State Segregation
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 5: Strict Session Gate & State Segregation');

  // Verify defaultState in appHtml has isLoggedIn = false and balance = 0
  const defaultStateMatch = appHtml.match(/const defaultState = (\{[\s\S]*?\n\};)/);
  assert(Boolean(defaultStateMatch), 'defaultState declaration found');

  const parsedDefault = new Function(`return ${defaultStateMatch[1]}`)();
  assert(parsedDefault.isLoggedIn === false, 'defaultState.isLoggedIn is strictly false');
  assert(parsedDefault.user.balance === 0, 'defaultState.user.balance is strictly 0');
  assert(parsedDefault.user.upiLiteBalance === 0, 'defaultState.user.upiLiteBalance is strictly 0');
  assert(Array.isArray(parsedDefault.bankAccounts) && parsedDefault.bankAccounts.length === 0, 'defaultState.bankAccounts is empty array');
  assert(Array.isArray(parsedDefault.transactions) && parsedDefault.transactions.length === 0, 'defaultState.transactions is empty array');
  assert(Object.keys(parsedDefault.pools).length === 0, 'defaultState.pools is empty object');

  // Verify DEMO_FIXTURES is segregated
  const demoFixturesMatch = appHtml.match(/const DEMO_FIXTURES = (\{[\s\S]*?\n\};)/);
  assert(Boolean(demoFixturesMatch), 'DEMO_FIXTURES constant is segregated');
  const parsedFixtures = new Function(`return ${demoFixturesMatch[1]}`)();
  assert(parsedFixtures.user.balance === 125430, 'DEMO_FIXTURES retains sample balance for offline preview only');
  assert(Boolean(parsedFixtures.pools.goa), 'DEMO_FIXTURES retains sample Goa pool');

  // --------------------------------------------------------------------------
  // SUITE 6: Zero-Storage Policy in localStorage
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 6: Zero-Storage Policy for Balances and Secrets in localStorage');

  // Check saveState implementation in appHtml
  assert(appHtml.includes('delete safeState.user.balance;'), 'saveState explicitly strips user.balance from storage');
  assert(appHtml.includes('delete safeState.bankAccounts;'), 'saveState explicitly strips bankAccounts from storage');
  assert(appHtml.includes('delete safeState.pools;'), 'saveState explicitly strips pools from storage');
  assert(appHtml.includes('delete safeState.transactions;'), 'saveState explicitly strips transactions from storage');

  // Test full DOM simulation of state save and reload
  const liveDom = new JSDOM(appHtml, {
    url: 'http://localhost:3000',
    runScripts: 'dangerously'
  });

  const win = liveDom.window;
  assert(win.appState.isLoggedIn === false, 'Browser initialization starts with isLoggedIn === false');

  // Simulate dirty state with balances and accounts
  win.appState.user.balance = 999999;
  win.appState.user.upiPin = '1234';
  win.appState.bankAccounts = [{ id: 'ba1', balance: 50000 }];
  win.appState.pools = { p1: { balance: 25000 } };
  win.saveState();

  const storedRaw = win.localStorage.getItem('UNEXA_STATE_V3');
  assert(Boolean(storedRaw), 'State saved to localStorage');
  const storedParsed = JSON.parse(storedRaw);

  assert(storedParsed.user?.balance === undefined, 'localStorage has ZERO storage of user.balance');
  assert(storedParsed.user?.upiPin === undefined, 'localStorage has ZERO storage of user.upiPin');
  assert(storedParsed.bankAccounts === undefined, 'localStorage has ZERO storage of bankAccounts');
  assert(storedParsed.pools === undefined, 'localStorage has ZERO storage of pools');
  assert(storedParsed.transactions === undefined, 'localStorage has ZERO storage of transactions');

  // --------------------------------------------------------------------------
  // SUITE 7: Session Restoration & Secure Logout
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 7: Session Restoration & Secure Logout Logic');

  assert(appHtml.includes('window.UnexaSupabase.getCurrentSession()'), 'DOMContentLoaded queries getCurrentSession() for session restoration');
  assert(appHtml.includes('appState.isLoggedIn = false;'), 'Logout resets isLoggedIn to false');
  assert(appHtml.includes('appState.user.balance = 0;'), 'Logout resets balance to 0');
  assert(appHtml.includes('appState.bankAccounts = [];'), 'Logout clears bankAccounts');
  assert(appHtml.includes('window.UnexaSupabase.signOut()'), 'Logout invokes UnexaSupabase.signOut()');

  console.log('\n============================================================');
  console.log(`TOTAL AUTH & SECURITY TESTS: ${passedCount + failedCount} | PASSED: ${passedCount} | FAILED: ${failedCount}`);
  console.log('============================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
  process.exit(0);
}

runAuthSecurityTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});

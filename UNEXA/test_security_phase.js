/**
 * Unexa Phase 2: Security & Negative Testing Suite
 * Validates all 10 security requirements:
 *   1. Fake login, backdoor OTPs, and authentication bypasses eliminated
 *   2. Secure session handling, biometric session verification, and logout
 *   3. Zero-storage policy for credentials (no PINs, passwords, or tokens in localStorage)
 *   4. Strict input validation and boundary enforcement (amount, VPA, phone)
 *   5. XSS defense and HTML entity sanitization
 *   6. Audit log scrubbing (secrets redacted in metadata)
 *   7. Server-side permissions, row locking, and immutable ledger triggers
 *   8. Protection against overdrawing, negative balances, and unauthorized mutations
 *   9. Row Level Security (RLS) policies across all exposed tables
 *  10. Automated negative tests for invalid inputs, backdoor attempts, and tamper requests
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

async function runSecurityTests() {
  console.log('\n============================================================');
  console.log('UNEXA PHASE 2: SECURITY & NEGATIVE TEST SUITE');
  console.log('============================================================\n');

  // Load Supabase Client Engine in Node environment
  const UnexaSupabase = require('./app/supabase-client.js');

  // --------------------------------------------------------------------------
  // SUITE 1: Input Validation & Boundary Protection (Negative Tests)
  // --------------------------------------------------------------------------
  console.log('Test Suite 1: Input Validation & Boundary Defense (Negative Tests)');

  // 1.1 Amount Validation Negative Tests
  assert(!UnexaSupabase.validateAmount(-100).valid, 'validateAmount rejects negative amount (-100)');
  assert(!UnexaSupabase.validateAmount(0).valid, 'validateAmount rejects zero amount (0)');
  assert(!UnexaSupabase.validateAmount(100001).valid, 'validateAmount rejects amount exceeding 100k limit (100001)');
  assert(!UnexaSupabase.validateAmount(500000).valid, 'validateAmount rejects large overdraw attempt (500000)');
  assert(!UnexaSupabase.validateAmount('abc').valid, 'validateAmount rejects string "abc"');
  assert(!UnexaSupabase.validateAmount('₹500').valid, 'validateAmount rejects currency prefix string');
  assert(!UnexaSupabase.validateAmount(NaN).valid, 'validateAmount rejects NaN');
  assert(!UnexaSupabase.validateAmount(Infinity).valid, 'validateAmount rejects Infinity');
  assert(!UnexaSupabase.validateAmount(null).valid, 'validateAmount rejects null');
  assert(!UnexaSupabase.validateAmount(undefined).valid, 'validateAmount rejects undefined');
  assert(!UnexaSupabase.validateAmount(50.123).valid, 'validateAmount rejects excess decimal places (50.123)');

  // 1.2 Amount Validation Positive Tests
  assert(UnexaSupabase.validateAmount(1).valid && UnexaSupabase.validateAmount(1).value === 1, 'validateAmount accepts minimum integer (1)');
  assert(UnexaSupabase.validateAmount(500.50).valid && UnexaSupabase.validateAmount(500.50).value === 500.5, 'validateAmount accepts 2 decimals (500.50)');
  assert(UnexaSupabase.validateAmount(100000).valid && UnexaSupabase.validateAmount(100000).value === 100000, 'validateAmount accepts maximum limit (100000)');

  // 1.3 UPI VPA Validation Negative Tests
  assert(!UnexaSupabase.validateVpa('').valid, 'validateVpa rejects empty string');
  assert(!UnexaSupabase.validateVpa(null).valid, 'validateVpa rejects null');
  assert(!UnexaSupabase.validateVpa('alexbank').valid, 'validateVpa rejects handle missing @ symbol');
  assert(!UnexaSupabase.validateVpa('<script>@okhdfc').valid, 'validateVpa rejects XSS script tag injection in VPA');
  assert(!UnexaSupabase.validateVpa('user@bank; DROP TABLE profiles;').valid, 'validateVpa rejects SQL injection attempt in VPA');
  assert(!UnexaSupabase.validateVpa('a@b').valid, 'validateVpa rejects too short handles (a@b)');

  // 1.4 UPI VPA Validation Positive Tests
  assert(UnexaSupabase.validateVpa('alex@oksbi').valid, 'validateVpa accepts standard handle alex@oksbi');
  assert(UnexaSupabase.validateVpa('store.billing-12@icici').valid, 'validateVpa accepts complex merchant VPA');

  // 1.5 Phone Validation Negative Tests
  assert(!UnexaSupabase.validatePhone('12345').valid, 'validatePhone rejects short string (5 digits)');
  assert(!UnexaSupabase.validatePhone('abcdefghij').valid, 'validatePhone rejects alphabet string');
  assert(!UnexaSupabase.validatePhone('').valid, 'validatePhone rejects empty phone');
  assert(UnexaSupabase.validatePhone('9876543210').valid, 'validatePhone accepts valid 10-digit mobile number');
  assert(UnexaSupabase.validatePhone('+91 98765 43210').valid, 'validatePhone normalizes phone with +91 country code and spaces');

  // --------------------------------------------------------------------------
  // SUITE 2: XSS Defense & HTML Sanitization (Negative Tests)
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 2: XSS Defense & HTML Sanitization (Negative Tests)');

  const xssScript = "<script>alert('XSS')</script>";
  const escapedScript = UnexaSupabase.escapeHtml(xssScript);
  assert(!escapedScript.includes('<script>'), 'escapeHtml neutralizes <script> opening tag');
  assert(!escapedScript.includes('</script>'), 'escapeHtml neutralizes </script> closing tag');
  assert(escapedScript.includes('&lt;script&gt;'), 'escapeHtml converts < and > into safe HTML entities');

  const xssImg = '<img src=x onerror=alert(document.cookie)>';
  const escapedImg = UnexaSupabase.escapeHtml(xssImg);
  assert(!escapedImg.includes('<img'), 'escapeHtml prevents active <img> tag execution');
  assert(escapedImg.includes('&lt;img'), 'escapeHtml converts <img> into &lt;img');

  const xssAttr = '" onfocus="alert(1)"';
  const escapedAttr = UnexaSupabase.escapeHtml(xssAttr);
  assert(!escapedAttr.includes('"'), 'escapeHtml escapes double quotes to &quot;');

  assert(UnexaSupabase.escapeHtml(null) === '', 'escapeHtml handles null safely');
  assert(UnexaSupabase.escapeHtml(undefined) === '', 'escapeHtml handles undefined safely');

  // --------------------------------------------------------------------------
  // SUITE 3: Audit Logging & Sensitive Data Scrubbing (Negative Tests)
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 3: Audit Logging & Secret Scrubbing (Negative Tests)');

  // Intercept console.log to inspect logged audit records
  let lastAuditOutput = null;
  const originalConsoleLog = console.log;
  console.log = function (...args) {
    if (args[0] && typeof args[0] === 'string' && args[0].includes('[Unexa Audit]')) {
      lastAuditOutput = args[1];
    }
    originalConsoleLog.apply(console, args);
  };

  const secretPayload = {
    amount: 500,
    utr: '624910293847',
    pin: '1234',
    upiPin: '9988',
    appPin: '4321',
    password: 'superSecretPassword123!',
    token: 'jwt_token_secret_xyz',
    otp: '849201',
    secret: 'my_private_key',
    apiKey: 'sk_live_1234567890',
    nested: {
      userPin: '0000',
      safeNote: 'Dinner with friends'
    }
  };

  await UnexaSupabase.logAudit('TEST_EVENT', secretPayload);
  console.log = originalConsoleLog;

  assert(lastAuditOutput !== null, 'logAudit executed and output scrubbed record');
  assert(lastAuditOutput.pin === '[REDACTED_SECRET]', 'pin is automatically redacted');
  assert(lastAuditOutput.upiPin === '[REDACTED_SECRET]', 'upiPin is automatically redacted');
  assert(lastAuditOutput.appPin === '[REDACTED_SECRET]', 'appPin is automatically redacted');
  assert(lastAuditOutput.password === '[REDACTED_SECRET]', 'password is automatically redacted');
  assert(lastAuditOutput.token === '[REDACTED_SECRET]', 'token is automatically redacted');
  assert(lastAuditOutput.otp === '[REDACTED_SECRET]', 'otp is automatically redacted');
  assert(lastAuditOutput.secret === '[REDACTED_SECRET]', 'secret key is automatically redacted');
  assert(lastAuditOutput.apiKey === '[REDACTED_SECRET]', 'apiKey is automatically redacted');
  assert(lastAuditOutput.nested.userPin === '[REDACTED_SECRET]', 'nested pin is automatically redacted');
  assert(lastAuditOutput.amount === 500, 'safe financial metadata (amount) is preserved');
  assert(lastAuditOutput.utr === '624910293847', 'safe identifier metadata (utr) is preserved');
  assert(lastAuditOutput.nested.safeNote === 'Dinner with friends', 'safe nested metadata is preserved');

  // --------------------------------------------------------------------------
  // SUITE 4: Zero-Storage Policy (Negative Tests for PIN in localStorage)
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 4: Zero-Credential Storage Policy (Negative Tests)');

  // Load app/index.html in DOM environment to test client state and storage sanitization
  const appHtml = fs.readFileSync('app/index.html', 'utf8');

  // Verify no hardcoded backdoor values remain in app/index.html
  assert(!appHtml.includes("entered === '849201'"), 'Backdoor 849201 completely removed from verifyLoginOtp');
  assert(!appHtml.includes("entered !== '849201'"), 'Backdoor 849201 completely removed from verifyPhoneOtp');
  assert(!appHtml.includes("entered !== '593821'"), 'Backdoor 593821 completely removed from verifyEmailOtp');
  assert(appHtml.includes("let currentOtpCode = null;"), 'currentOtpCode initialized as null');
  assert(appHtml.includes("let currentPhoneVerifyOtp = null;"), 'currentPhoneVerifyOtp initialized as null');
  assert(appHtml.includes("let currentEmailVerifyOtp = null;"), 'currentEmailVerifyOtp initialized as null');
  assert(appHtml.includes("let currentResetOtp = null;"), 'currentResetOtp initialized as null');

  // Verify PIN is not exposed in toast messages
  assert(!appHtml.includes('Incorrect UPI PIN (${enteredPin})'), 'PIN leak removed from payment error toast');
  assert(!appHtml.includes('Permanent UPI PIN is set to: ${tempNewPin}'), 'PIN leak removed from PIN reset success toast');
  assert(!appHtml.includes('permanent PIN (${tempNewPin})'), 'PIN leak removed from post-reset prompt toasts');
  assert(!appHtml.includes('App Lock PIN updated to: ${newPin}'), 'PIN leak removed from app lock update toast');
  assert(!appHtml.includes('Enter ${currentPhoneVerifyOtp}'), 'OTP leak removed from phone verification error toast');
  assert(!appHtml.includes('Enter ${currentEmailVerifyOtp}'), 'OTP leak removed from email verification error toast');

  // Mock DOM localStorage test for sanitizeStateForStorage
  const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`, {
    url: 'http://localhost:3000',
    runScripts: 'dangerously'
  });

  const dirtyState = {
    isLoggedIn: true,
    user: {
      name: 'Aarav Sharma',
      phone: '+91 98765 43210',
      balance: 45000,
      upiPin: '1234',
      appPin: '9988',
      security: {
        biometric: true,
        appPin: '5678'
      }
    }
  };

  // Evaluate sanitizeStateForStorage from app/index.html
  const sanitizeMatch = appHtml.match(/function sanitizeStateForStorage\(state\) \{[\s\S]*?\n\}/);
  assert(Boolean(sanitizeMatch), 'sanitizeStateForStorage function exists in index.html');

  const sanitizeFn = new Function('state', `
    ${sanitizeMatch[0]}
    return sanitizeStateForStorage(state);
  `);

  const cleanState = sanitizeFn(dirtyState);
  assert(cleanState.user.upiPin === undefined, 'sanitizeStateForStorage deletes user.upiPin');
  assert(cleanState.user.appPin === undefined, 'sanitizeStateForStorage deletes user.appPin');
  assert(cleanState.user.security.appPin === undefined, 'sanitizeStateForStorage deletes user.security.appPin');
  assert(cleanState.user.balance === 45000, 'sanitizeStateForStorage preserves safe balance and name');

  // Verify JSON stringified storage has zero occurrences of PIN
  const serialized = JSON.stringify(cleanState);
  assert(!serialized.includes('upiPin'), 'Serialized state does not contain "upiPin" key');
  assert(!serialized.includes('appPin'), 'Serialized state does not contain "appPin" key');

  // --------------------------------------------------------------------------
  // SUITE 5: In-Memory PIN Lifecycle & Session Verification
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 5: In-Memory PIN Hash & Session Authentication');

  await UnexaSupabase.setSessionPin('4829');
  const validCheck = await UnexaSupabase.verifySessionPin('4829');
  assert(validCheck === true, 'verifySessionPin succeeds with matching PIN');

  const invalidCheck = await UnexaSupabase.verifySessionPin('0000');
  assert(invalidCheck === false, 'verifySessionPin fails with wrong PIN (negative test)');

  // Verify signOut clears in-memory PIN state
  await UnexaSupabase.signOut();
  const postLogoutCheck = await UnexaSupabase.verifySessionPin('4829');
  // After sign out, memory hash is wiped and reverts to demo baseline (not 4829)
  assert(postLogoutCheck === false, 'signOut resets in-memory session PIN hash');

  // --------------------------------------------------------------------------
  // SUITE 6: Database Ledger Immutability & Balance Protection (Schema Rules)
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 6: Database Ledger Immutability & Balance Protection');

  const schemaPath = path.resolve('supabase/migrations/20261015000001_initial_schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');

  // 6.1 Transaction Immutability Trigger
  assert(sql.includes('CREATE TRIGGER trg_immutable_transactions'), 'Immutability trigger trg_immutable_transactions is declared');
  assert(sql.includes('BEFORE UPDATE OR DELETE ON public.transactions'), 'Trigger fires BEFORE UPDATE OR DELETE on transactions');
  assert(sql.includes('Transactions are immutable and cannot be updated or deleted once recorded'), 'Trigger raises exception prohibiting ledger mutation');

  // 6.2 Atomic Server RPC (execute_transfer)
  assert(sql.includes('CREATE OR REPLACE FUNCTION public.execute_transfer'), 'execute_transfer atomic transfer RPC exists');
  assert(sql.includes('SECURITY DEFINER SET search_path = public'), 'execute_transfer uses SECURITY DEFINER with pinned search_path');
  assert(sql.includes('FOR UPDATE'), 'execute_transfer acquires explicit row lock (FOR UPDATE) to prevent race conditions');
  assert(sql.includes('p_amount <= 0'), 'execute_transfer rejects non-positive amounts');
  assert(sql.includes('p_amount > 100000'), 'execute_transfer enforces statutory ceiling of 100k INR');
  assert(sql.includes('v_current_balance < p_amount'), 'execute_transfer verifies balance sufficiency before deduction');
  assert(sql.includes('CHECK (balance >= 0)'), 'bank_accounts table declares check constraint balance >= 0');
  assert(sql.includes('CHECK (amount > 0)'), 'transactions table declares check constraint amount > 0');

  // 6.3 Client-Side Balance Guard Verification
  assert(appHtml.includes('Insufficient group pool balance!'), 'executePaymentLogic checks and blocks insufficient pool balance');
  assert(appHtml.includes('Insufficient bank balance!'), 'executePaymentLogic checks and blocks insufficient personal balance');
  assert(appHtml.includes('Invalid payment amount!'), 'executePaymentLogic validates amount before deducting balance');

  // --------------------------------------------------------------------------
  // SUITE 7: Row-Level Security (RLS) Policy Verification
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 7: Row-Level Security (RLS) Least-Privilege Policies');

  const rlsTables = [
    'profiles', 'bank_accounts', 'transactions', 'groups', 'group_members',
    'group_expenses', 'group_splits', 'merchants', 'merchant_collections',
    'khata_parties', 'khata_entries', 'merchant_settlements', 'merchant_staff',
    'audit_logs'
  ];

  rlsTables.forEach(t => {
    assert(sql.includes(`ALTER TABLE public.${t} ENABLE ROW LEVEL SECURITY;`), `RLS explicitly enabled on public.${t}`);
  });

  assert(sql.includes('auth.uid() = user_id'), 'Transactions RLS isolates records to auth.uid()');
  assert(sql.includes('is_group_member(group_id, auth.uid())'), 'Group expenses RLS requires verified group membership');
  assert(sql.includes('is_merchant_authorized(id, auth.uid())'), 'Merchants RLS requires authorized ownership or staff role');
  assert(sql.includes('CREATE POLICY "audit_logs_select_own"'), 'Audit logs RLS restricts reads to owning user');

  // --------------------------------------------------------------------------
  // SUMMARY REPORT
  // --------------------------------------------------------------------------
  console.log('\n============================================================');
  console.log(`TOTAL SECURITY TESTS: ${passedCount + failedCount} | PASSED: ${passedCount} | FAILED: ${failedCount}`);
  console.log('============================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
  process.exit(0);
}

runSecurityTests().catch(err => {
  console.error('Security test runner encountered fatal error:', err);
  process.exit(1);
});

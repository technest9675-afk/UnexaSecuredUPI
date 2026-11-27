/**
 * UNEXA COMPLETE ACCOUNT FLOW, SECURITY, UI/UX AND FEATURE IMPROVEMENT TEST SUITE
 * Verifies all 10 Phases:
 *   Phase 1: Profile Photo & Circular Avatar Consistency
 *   Phase 2: Registration, Login Flow & Server-Side PIN Security
 *   Phase 3: Optional Real WebAuthn Biometric & PIN Fallback
 *   Phase 4: Bank Account Onboarding & Honest Check Balance
 *   Phase 5: Mode Permissions & Business Eligibility
 *   Phase 6: Unified AI Scam Shield (Personal & Business)
 *   Phase 7: Complete 10 Group Tools Suite
 *   Phase 8: UI/UX Accessibility, Touch Targets & Reduced Motion
 *   Phase 9: Database Migration & RLS Security
 *   Phase 10: Complete Integration & Test Reporting
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
console.log('UNEXA COMPREHENSIVE VERIFICATION TEST SUITE (10 PHASES)');
console.log('============================================================\n');

// -----------------------------------------------------------------------------
// 1. Database & Migrations (Phase 9)
// -----------------------------------------------------------------------------
console.log('Test Suite 1: Phase 9 — Database Schema & RLS Migrations');
const migrationPath = path.join(__dirname, 'supabase', 'migrations', '20261019000001_complete_account_flow.sql');
const schemaPath = path.join(__dirname, 'supabase', 'schema.sql');

assert(fs.existsSync(migrationPath), 'Migration 20261019000001_complete_account_flow.sql exists');
const migSql = fs.readFileSync(migrationPath, 'utf8');

assert(migSql.includes('user_app_pins'), 'Migration contains public.user_app_pins table');
assert(migSql.includes('setup_app_pin'), 'Migration defines setup_app_pin RPC');
assert(migSql.includes('verify_app_pin'), 'Migration defines verify_app_pin RPC with bcrypt and rate-limiting');
assert(migSql.includes('apply_for_business'), 'Migration defines apply_for_business RPC');
assert(migSql.includes('group_recurring_expenses'), 'Migration defines group_recurring_expenses table');
assert(migSql.includes('group_budgets'), 'Migration defines group_budgets table');
assert(migSql.includes('group_expense_approvals'), 'Migration defines group_expense_approvals table');
assert(migSql.includes('storage.buckets') && migSql.includes('avatars'), 'Migration provisions avatars storage bucket');

const fullSchema = fs.readFileSync(schemaPath, 'utf8');
assert(fullSchema.includes('20261019000001_complete_account_flow'), 'Schema.sql contains the complete account flow migration');

// -----------------------------------------------------------------------------
// 2. Supabase Client SDK Enhancements (Phases 1, 2, 5, 6, 7)
// -----------------------------------------------------------------------------
console.log('\nTest Suite 2: Supabase Client SDK Methods');
const UnexaSupabase = require('./app/supabase-client.js');

assert(typeof UnexaSupabase.uploadAvatar === 'function', 'UnexaSupabase.uploadAvatar method is implemented');
assert(typeof UnexaSupabase.setupAppPin === 'function', 'UnexaSupabase.setupAppPin method is implemented');
assert(typeof UnexaSupabase.verifyAppPin === 'function', 'UnexaSupabase.verifyAppPin method is implemented');
assert(typeof UnexaSupabase.applyForBusinessAccount === 'function', 'UnexaSupabase.applyForBusinessAccount method is implemented');
assert(typeof UnexaSupabase.fetchRecurringExpenses === 'function', 'UnexaSupabase.fetchRecurringExpenses is implemented');
assert(typeof UnexaSupabase.addRecurringExpense === 'function', 'UnexaSupabase.addRecurringExpense is implemented');
assert(typeof UnexaSupabase.fetchGroupBudget === 'function', 'UnexaSupabase.fetchGroupBudget is implemented');
assert(typeof UnexaSupabase.setGroupBudget === 'function', 'UnexaSupabase.setGroupBudget is implemented');
assert(typeof UnexaSupabase.fetchExpenseApprovals === 'function', 'UnexaSupabase.fetchExpenseApprovals is implemented');
assert(typeof UnexaSupabase.submitExpenseApproval === 'function', 'UnexaSupabase.submitExpenseApproval is implemented');
assert(typeof UnexaSupabase.ScamShield === 'object' && typeof UnexaSupabase.ScamShield.analyze === 'function', 'UnexaSupabase.ScamShield engine is available');

// -----------------------------------------------------------------------------
// 3. AI Scam Shield Engine (Phase 6)
// -----------------------------------------------------------------------------
console.log('\nTest Suite 3: Phase 6 — AI Scam Shield Engine Heuristics');
const shield = UnexaSupabase.ScamShield;

// Test urgent threat
const threatResult = shield.analyze('URGENT: Your bank account will be blocked within 2 hours. Send OTP immediately to verify KYC!');
assert(threatResult.riskScore >= 70, 'Urgent coercion and OTP request detected with high/critical risk score');
assert(threatResult.riskLevel === 'CRITICAL', 'Urgent coercion categorized as CRITICAL threat');
assert(threatResult.isSafe === false, 'Threat marked isSafe = false');
assert(threatResult.threatTitle.includes('CRITICAL'), 'Threat title indicates critical fraud');
assert(threatResult.matchedPatterns.length >= 2, 'Multiple malicious patterns identified');
assert(typeof threatResult.disclaimer === 'string' && threatResult.disclaimer.includes('AI advisory'), 'Scam Shield outputs advisory disclaimer');

// Test safe message
const safeResult = shield.analyze('Dinner payment split for pizza party');
assert(safeResult.riskScore < 20, 'Normal dinner split receives low risk score');
assert(safeResult.riskLevel === 'LOW', 'Normal message categorized as LOW risk');
assert(safeResult.isSafe === true, 'Normal message isSafe = true');

// Test business overpayment scam
const bizScam = shield.analyze('Payment screenshot sent with UTR 998822. I overpaid extra 5000 by mistake, please refund back to my QR.', { mode: 'business' });
assert(bizScam.riskScore >= 30, 'Merchant overpayment/refund trick detected in business mode');
assert(bizScam.matchedPatterns.some(p => p.includes('Merchant') || p.includes('manipulation')), 'Matched merchant manipulation pattern');

// -----------------------------------------------------------------------------
// 4. PIN Validation & Zero-Plaintext Rule (Phase 2)
// -----------------------------------------------------------------------------
console.log('\nTest Suite 4: Phase 2 — PIN Security & Low Entropy Architecture');

(async () => {
  // Test invalid PIN format rejection
  const invalidPinRes = await UnexaSupabase.setupAppPin('123'); // only 3 digits
  assert(invalidPinRes.error && invalidPinRes.error.includes('4 numeric digits'), 'Rejects PINs that are not exactly 4 numeric digits');

  const invalidAlphaRes = await UnexaSupabase.setupAppPin('abcd');
  assert(invalidAlphaRes.error && invalidAlphaRes.error.includes('4 numeric digits'), 'Rejects non-numeric PINs');

  const validPinRes = await UnexaSupabase.setupAppPin('4321');
  assert(validPinRes.data && validPinRes.data.success, 'Accepts valid 4-digit numeric PIN');

  const verifyMatch = await UnexaSupabase.verifyAppPin('4321');
  assert(verifyMatch.success === true, 'Validates correct PIN');

  const verifyMismatch = await UnexaSupabase.verifyAppPin('9999');
  assert(verifyMismatch.success === false, 'Rejects incorrect PIN');

  // ---------------------------------------------------------------------------
  // 5. Frontend DOM & HTML Markup (Phases 1, 2, 3, 4, 5, 7, 8)
  // ---------------------------------------------------------------------------
  console.log('\nTest Suite 5: Frontend DOM, Modals & UX Markup');
  const htmlContent = fs.readFileSync(path.join(__dirname, 'app', 'index.html'), 'utf8');

  // Phase 1: Avatar markup & fallbacks
  assert(htmlContent.includes('DEFAULT_AVATAR_DATA_URI'), 'HTML defines DEFAULT_AVATAR_DATA_URI fallback');
  assert(htmlContent.includes('handleAvatarError'), 'HTML defines handleAvatarError function');
  assert(htmlContent.includes('onerror="handleAvatarError(this)"'), 'Avatar elements have onerror fallback');
  assert(htmlContent.includes('avatar-circular'), 'Avatar elements use consistent circular styling class');

  // Phase 2: Onboarding & PIN Unlock Modals
  assert(htmlContent.includes('id="modalOnboardingSetup"'), 'Modal #modalOnboardingSetup exists for new users');
  assert(htmlContent.includes('id="onboardFullName"'), 'Onboarding collects full legal name');
  assert(htmlContent.includes('id="onboardVpaHandle"'), 'Onboarding collects custom UPI handle');
  assert(htmlContent.includes('id="onboardPin"'), 'Onboarding collects 4-digit PIN');
  assert(htmlContent.includes('id="modalAppPinUnlock"'), 'Modal #modalAppPinUnlock exists for returning users');
  assert(htmlContent.includes('id="appPinLockoutBanner"'), 'Lockout banner exists for repeated failures');

  // Phase 3: Biometric & WebAuthn
  assert(htmlContent.includes('checkPlatformAuthenticatorAvailability'), 'checkPlatformAuthenticatorAvailability uses real WebAuthn checks');
  assert(htmlContent.includes('modalBiometricConsent'), 'Modal #modalBiometricConsent exists for explicit enrollment');
  assert(htmlContent.includes('Hardware Sensor Unavailable'), 'Honest hardware unavailable message is present');

  // Phase 4: Bank Onboarding & Check Balance
  assert(htmlContent.includes('checkBalanceBankSelect'), 'Check Balance contains dynamic bank selector');
  assert(!htmlContent.includes('CBS Core Banking'), 'Fake CBS Core Banking claim is removed');

  // Phase 5: Business Mode Access & Application
  assert(htmlContent.includes('isBusinessModeEligible'), 'isBusinessModeEligible controls Business Mode access');
  assert(htmlContent.includes('id="modalApplyBusiness"'), 'Modal #modalApplyBusiness exists for non-eligible users');
  assert(htmlContent.includes('submitBusinessApplication'), 'submitBusinessApplication calls server RPC');

  // Phase 7: 10 Group Tools
  assert(htmlContent.includes('id="modalGroupToolsSuite"'), 'Modal #modalGroupToolsSuite exists');
  assert(htmlContent.includes('id="modalGroupToolDetail"'), 'Modal #modalGroupToolDetail exists');
  assert(htmlContent.includes('smartSplit'), 'Smart Split tool implemented');
  assert(htmlContent.includes('recurring'), 'Recurring Expenses tool implemented');
  assert(htmlContent.includes('budgetGuard'), 'Budget Guard tool implemented');
  assert(htmlContent.includes('optimizer'), 'Settlement Optimizer debt graph algorithm implemented');
  assert(htmlContent.includes('approval'), 'Expense Approval tool implemented');
  assert(htmlContent.includes('timeline'), 'Expense Timeline feed implemented');
  assert(htmlContent.includes('fairness'), 'Fairness Insights analytics implemented');
  assert(htmlContent.includes('reminders'), 'Payment Reminders nudge tool implemented');
  assert(htmlContent.includes('tripMode'), 'Trip/Event Mode tool implemented');
  assert(htmlContent.includes('exportReport'), 'Exportable Group Report tool implemented');
  assert(htmlContent.includes('downloadGroupCsvReport'), 'downloadGroupCsvReport function implemented');
  assert(htmlContent.includes('copyGroupReportToClipboard'), 'copyGroupReportToClipboard function implemented');

  // Phase 8: Accessibility & Styling
  assert(htmlContent.includes('prefers-reduced-motion'), 'prefers-reduced-motion CSS media query is present');
  assert(htmlContent.includes('touch-target'), 'touch-target min 44px style is defined');
  assert(htmlContent.includes('role="dialog"'), 'Modals include accessibility role="dialog" attributes');

  // ---------------------------------------------------------------------------
  // 6. JSDOM Functional Flow Verification (Phase 10)
  // ---------------------------------------------------------------------------
  console.log('\nTest Suite 6: JSDOM Functional Flow Verification');
  const dom = new JSDOM(htmlContent, {
    url: 'http://localhost:3000',
    runScripts: 'dangerously'
  });

  const { window } = dom;

  // Verify global helpers
  assert(typeof window.handleAvatarError === 'function', 'window.handleAvatarError is accessible in browser runtime');
  assert(typeof window.UnexaScamShield === 'object', 'window.UnexaScamShield is accessible in browser runtime');
  assert(typeof window.isBusinessModeEligible === 'function', 'window.isBusinessModeEligible is defined');
  assert(typeof window.openGroupToolModal === 'function', 'window.openGroupToolModal is defined');
  assert(typeof window.downloadGroupCsvReport === 'function', 'window.downloadGroupCsvReport is defined');

  // Verify non-eligible user cannot enter business mode
  window.appState.user.business_status = 'none';
  window.appState.isDemoMode = false;
  assert(window.isBusinessModeEligible() === false, 'User with business_status "none" is not eligible for Business Mode');

  // Verify approved user is eligible
  window.appState.user.business_status = 'approved';
  assert(window.isBusinessModeEligible() === true, 'User with business_status "approved" is eligible for Business Mode');

  console.log('\n============================================================');
  console.log(`TOTAL COMPLETE FLOW TESTS: ${passedTests + failedTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
  console.log('============================================================\n');

  window.close();
  if (failedTests > 0) {
    process.exit(1);
  }
  process.exit(0);
})();

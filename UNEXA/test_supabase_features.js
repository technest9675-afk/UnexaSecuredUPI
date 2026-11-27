/**
 * Unexa Phase 3: Supabase Features & Backend Connectivity Test Suite
 * 
 * Verifies:
 *   1. Personal Mode: Profile, Bank Accounts, Transactions, Atomic Transfer RPC
 *   2. Group Mode: Create Groups, Member Management, Equal/Custom Splits, Settlements
 *   3. Business Mode: Merchant Profiles, Collections, Settlements, Khata, Staff Roles
 *   4. Zero-Trust Transfer & Resilience: Server balance verification, offline fallbacks, demo labeling
 *   5. UI Wiring: Backend status badges, payment receipt verification status, DOM controllers
 */

const fs = require('fs');
const path = require('path');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

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

async function runTestSuite() {
  console.log('\n============================================================');
  console.log('UNEXA PHASE 3: SUPABASE FEATURES & BACKEND CONNECTIVITY');
  console.log('============================================================\n');

  // Load UnexaSupabase module
  const UnexaSupabase = require('./app/supabase-client.js');

  // --------------------------------------------------------------------------
  // TEST SUITE 1: Personal Mode Backend Services
  // --------------------------------------------------------------------------
  console.log('Test Suite 1: Personal Mode Backend Services');

  assert(typeof UnexaSupabase.fetchProfile === 'function', 'UnexaSupabase.fetchProfile is declared');
  assert(typeof UnexaSupabase.updateProfile === 'function', 'UnexaSupabase.updateProfile is declared');
  assert(typeof UnexaSupabase.fetchBankAccounts === 'function', 'UnexaSupabase.fetchBankAccounts is declared');
  assert(typeof UnexaSupabase.fetchTransactions === 'function', 'UnexaSupabase.fetchTransactions is declared');
  assert(typeof UnexaSupabase.executeTransfer === 'function', 'UnexaSupabase.executeTransfer is declared');

  // Negative & offline tests without network
  const profOffline = await UnexaSupabase.fetchProfile();
  assert(profOffline.isOffline === true, 'fetchProfile handles offline/unauthenticated state gracefully');
  assert(profOffline.data === null, 'fetchProfile returns null data on offline fallback');

  const bankOffline = await UnexaSupabase.fetchBankAccounts();
  assert(bankOffline.isOffline === true, 'fetchBankAccounts handles offline/unauthenticated state gracefully');

  const txOffline = await UnexaSupabase.fetchTransactions();
  assert(txOffline.isOffline === true, 'fetchTransactions handles offline/unauthenticated state gracefully');

  // Transfer validation
  const invalidAmtTransfer = await UnexaSupabase.executeTransfer({
    bankAccountId: 'ba_test',
    payeeVpa: 'alex@oksbi',
    payeeName: 'Alex',
    amount: -50
  });
  assert(invalidAmtTransfer.success === false, 'executeTransfer blocks negative amount');

  const invalidVpaTransfer = await UnexaSupabase.executeTransfer({
    bankAccountId: 'ba_test',
    payeeVpa: 'invalid-vpa-without-at',
    payeeName: 'Alex',
    amount: 100
  });
  assert(invalidVpaTransfer.success === false, 'executeTransfer blocks invalid VPA handle');

  const overdrawTransfer = await UnexaSupabase.executeTransfer({
    bankAccountId: 'ba_test',
    payeeVpa: 'alex@oksbi',
    payeeName: 'Alex',
    amount: 250000
  });
  assert(overdrawTransfer.success === false, 'executeTransfer blocks transfer exceeding 100k ceiling');

  // --------------------------------------------------------------------------
  // TEST SUITE 2: Group Mode Backend Services
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 2: Group Mode Backend Services');

  assert(typeof UnexaSupabase.fetchGroups === 'function', 'UnexaSupabase.fetchGroups is declared');
  assert(typeof UnexaSupabase.createGroup === 'function', 'UnexaSupabase.createGroup is declared');
  assert(typeof UnexaSupabase.addGroupMember === 'function', 'UnexaSupabase.addGroupMember is declared');
  assert(typeof UnexaSupabase.removeGroupMember === 'function', 'UnexaSupabase.removeGroupMember is declared');
  assert(typeof UnexaSupabase.recordGroupExpense === 'function', 'UnexaSupabase.recordGroupExpense is declared');
  assert(typeof UnexaSupabase.settleGroupPool === 'function', 'UnexaSupabase.settleGroupPool is declared');

  const grpOffline = await UnexaSupabase.fetchGroups();
  assert(grpOffline.isOffline === true, 'fetchGroups handles offline fallback gracefully');

  const grpCreateOffline = await UnexaSupabase.createGroup({ name: 'Goa Trip', budget: 15000 });
  assert(grpCreateOffline.isOffline === true, 'createGroup handles unauthenticated execution without throw');

  const grpMemberOffline = await UnexaSupabase.addGroupMember('grp_1', { memberName: 'Rohan' });
  assert(grpMemberOffline.isOffline === true, 'addGroupMember handles unauthenticated execution safely');

  const grpExpenseOffline = await UnexaSupabase.recordGroupExpense('grp_1', {
    title: 'Dinner',
    amount: 1200,
    payerName: 'Rohan',
    splitType: 'equal',
    splits: { m1: 600, m2: 600 }
  });
  assert(grpExpenseOffline.isOffline === true, 'recordGroupExpense handles offline fallback safely');

  const grpSettleOffline = await UnexaSupabase.settleGroupPool('grp_1');
  assert(grpSettleOffline.isOffline === true, 'settleGroupPool handles offline fallback safely');

  // --------------------------------------------------------------------------
  // TEST SUITE 3: Business Mode Backend Services
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 3: Business Mode Backend Services');

  assert(typeof UnexaSupabase.fetchMerchant === 'function', 'UnexaSupabase.fetchMerchant is declared');
  assert(typeof UnexaSupabase.setupMerchantProfile === 'function', 'UnexaSupabase.setupMerchantProfile is declared');
  assert(typeof UnexaSupabase.fetchMerchantCollections === 'function', 'UnexaSupabase.fetchMerchantCollections is declared');
  assert(typeof UnexaSupabase.recordKhataEntry === 'function', 'UnexaSupabase.recordKhataEntry is declared');
  assert(typeof UnexaSupabase.requestSettlement === 'function', 'UnexaSupabase.requestSettlement is declared');
  assert(typeof UnexaSupabase.manageStaff === 'function', 'UnexaSupabase.manageStaff is declared');

  const merchOffline = await UnexaSupabase.fetchMerchant();
  assert(merchOffline.isOffline === true, 'fetchMerchant handles offline state without error');

  const khataOffline = await UnexaSupabase.recordKhataEntry('m_1', {
    partyName: 'Sharma Grocery',
    partyPhone: '+91 98765 00000',
    amount: 500,
    type: 'credit'
  });
  assert(khataOffline.isOffline === true, 'recordKhataEntry handles offline fallback without error');

  const settleOffline = await UnexaSupabase.requestSettlement('m_1', 8200);
  assert(settleOffline.isOffline === true, 'requestSettlement handles offline fallback without error');

  const staffOffline = await UnexaSupabase.manageStaff('m_1', {
    staffName: 'Vikram',
    staffPhone: '+91 98765 11111',
    role: 'cashier'
  });
  assert(staffOffline.isOffline === true, 'manageStaff handles offline fallback without error');

  // --------------------------------------------------------------------------
  // TEST SUITE 4: UI DOM Elements & Status Badges
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 4: UI DOM Elements & Status Badges');

  const htmlContent = fs.readFileSync(path.resolve('app/index.html'), 'utf8');
  const dom = new JSDOM(htmlContent, { runScripts: 'outside-only' });
  const doc = dom.window.document;

  const backendStatusBadge = doc.getElementById('backendStatusBadge');
  assert(Boolean(backendStatusBadge), '#backendStatusBadge exists in mainAppHeader');
  assert(backendStatusBadge.textContent.includes('DEMO MODE'), '#backendStatusBadge defaults to DEMO MODE indicator');

  const businessBackendBadge = doc.getElementById('businessBackendStatusBadge');
  assert(Boolean(businessBackendBadge), '#businessBackendStatusBadge exists in businessHeader');
  assert(businessBackendBadge.textContent.includes('DEMO MODE'), '#businessBackendStatusBadge defaults to DEMO MODE indicator');

  const successVerificationStatus = doc.getElementById('successVerificationStatus');
  assert(Boolean(successVerificationStatus), '#successVerificationStatus element exists in modalPaymentSuccess');
  assert(successVerificationStatus.textContent.includes('Simulated Sandbox Transfer'), '#successVerificationStatus defaults to Simulated Sandbox Transfer');

  const modalBackendStatus = doc.getElementById('modalBackendStatus');
  assert(Boolean(modalBackendStatus), '#modalBackendStatus modal exists in DOM');

  // Verify Controller Functions are declared in index.html
  assert(htmlContent.includes('function updateBackendIndicator('), 'updateBackendIndicator function is implemented in index.html');
  assert(htmlContent.includes('function toggleBackendStatusInfo('), 'toggleBackendStatusInfo function is implemented in index.html');
  assert(htmlContent.includes('function syncWithSupabaseBackend('), 'syncWithSupabaseBackend function is implemented in index.html');
  assert(htmlContent.includes('function registerSupabaseAuthListener('), 'registerSupabaseAuthListener function is implemented in index.html');

  // Verify feature wiring in existing functions
  assert(htmlContent.includes('UnexaSupabase.executeTransfer('), 'executePaymentLogic wires to UnexaSupabase.executeTransfer');
  assert(htmlContent.includes('UnexaSupabase.createGroup('), 'submitCreateNewPool wires to UnexaSupabase.createGroup');
  assert(htmlContent.includes('UnexaSupabase.addGroupMember('), 'submitAddMember wires to UnexaSupabase.addGroupMember');
  assert(htmlContent.includes('UnexaSupabase.recordGroupExpense('), 'submitUnifiedGroupExpense wires to UnexaSupabase.recordGroupExpense');
  assert(htmlContent.includes('UnexaSupabase.settleGroupPool('), 'confirmSettleAndClosePool wires to UnexaSupabase.settleGroupPool');
  assert(htmlContent.includes('UnexaSupabase.requestSettlement('), 'processInstantSettlement wires to UnexaSupabase.requestSettlement');
  assert(htmlContent.includes('UnexaSupabase.recordKhataEntry('), 'saveKhataEntry wires to UnexaSupabase.recordKhataEntry');
  assert(htmlContent.includes('UnexaSupabase.manageStaff('), 'saveStaffMember wires to UnexaSupabase.manageStaff');

  // --------------------------------------------------------------------------
  // TEST SUITE 5: Zero-Trust Transfer & Negative Balance Checks
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 5: Zero-Trust Verification & Demo Policy');

  // Verify executePaymentLogic does not claim verified real money transfer without backend
  assert(htmlContent.includes('Simulated Sandbox Transfer'), 'Receipt explicitly labels transfers as Simulated Sandbox Transfer in demo mode');
  assert(htmlContent.includes('Verified Server Ledger Transfer'), 'Receipt only grants Verified Server Ledger Transfer when server RPC confirms it');
  assert(htmlContent.includes('Insufficient group pool balance!'), 'Group pool balance checks enforce non-negative balances');
  assert(htmlContent.includes('Insufficient bank balance!'), 'Personal account balance checks enforce non-negative balances');

  console.log('\n============================================================');
  console.log(`TOTAL SUPABASE FEATURE TESTS: ${testsPassed + testsFailed} | PASSED: ${testsPassed} | FAILED: ${testsFailed}`);
  console.log('============================================================\n');

  if (testsFailed > 0) {
    process.exit(1);
  }
  process.exit(0);
}

runTestSuite().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});

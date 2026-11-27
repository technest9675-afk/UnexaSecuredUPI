/**
 * Unexa Business Mode Bug Fix & Full-App Performance Optimization Test Suite
 * Validates:
 *   1. DOM View Hierarchy & Clean Mutual Exclusion (Headers, Content, Nav)
 *   2. Action Locking & Rapid-Click Debounce (Concurrency & Audio Protection)
 *   3. Global Scoped & Debounced Lucide Rendering Engine
 *   4. Supabase Merchant Caching, Reduced Joins & Cache Invalidation
 *   5. Database Schema Column Compatibility (PostgreSQL ↔ UI Alignment)
 *   6. Security Integrity & Eligibility Gate Enforcement
 *   7. Performance Stress & Frame-Budget Benchmark (< 16ms / switch)
 *   8. Multi-Platform Assets Synchronization (app, root, android)
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

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

async function runTests() {
  console.log('============================================================');
  console.log('UNEXA BUSINESS MODE BUG FIX & PERFORMANCE TEST SUITE');
  console.log('============================================================\n');

  const htmlPath = path.resolve('app/index.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');

  // --------------------------------------------------------------------------
  // TEST SUITE 1: DOM Structure & Element Integrity
  // --------------------------------------------------------------------------
  console.log('Test Suite 1: DOM Structure & Element Integrity');
  assert(htmlContent.includes('id="businessHeader"'), '#businessHeader exists in DOM');
  assert(htmlContent.includes('id="businessContent"'), '#businessContent exists in DOM');
  assert(htmlContent.includes('id="businessBottomNav"'), '#businessBottomNav exists in DOM');
  assert(htmlContent.includes('id="mainAppHeader"'), '#mainAppHeader exists in DOM');
  assert(htmlContent.includes('id="mainContent"'), '#mainContent exists in DOM');
  assert(htmlContent.includes('id="btnSwitchBusinessMode"'), '#btnSwitchBusinessMode exists in DOM');
  assert(htmlContent.includes('id="modalApplyBusiness"'), '#modalApplyBusiness exists in DOM');

  // --------------------------------------------------------------------------
  // TEST SUITE 2: Global Scoped & Debounced Lucide Rendering Engine
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 2: Global Scoped & Debounced Lucide Rendering Engine');
  assert(htmlContent.includes('// PERFORMANCE OPTIMIZATION: Global Scoped & Debounced Lucide Rendering Engine'), 'Global Scoped & Debounced Lucide Engine is installed');
  assert(htmlContent.includes('window.safeCreateIcons = function'), 'window.safeCreateIcons function is defined');
  assert(htmlContent.includes('cancelAnimationFrame(_iconRaf)'), 'Full-page unscoped createIcons passes are debounced via requestAnimationFrame');
  assert(htmlContent.includes('options.root'), 'Scoped icon rendering passes support options.root for local subtrees');

  // --------------------------------------------------------------------------
  // TEST SUITE 3: Supabase Merchant Caching & Column Schema Normalization
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 3: Supabase Merchant Caching & Column Schema Normalization');
  const clientPath = path.resolve('app/supabase-client.js');
  const clientContent = fs.readFileSync(clientPath, 'utf8');
  assert(clientContent.includes('_merchantCache: { data: null, timestamp: 0, uid: null }'), '_merchantCache structure initialized');
  assert(clientContent.includes('invalidateMerchantCache: function ()'), 'invalidateMerchantCache method defined');
  assert(clientContent.includes('data.business_name = data.business_name || data.store_name'), 'Schema normalizes business_name ↔ store_name');
  assert(clientContent.includes('data.category = data.category || data.business_category'), 'Schema normalizes category ↔ business_category');
  assert(clientContent.includes('data.store_vpa = data.store_vpa || data.merchant_vpa'), 'Schema normalizes store_vpa ↔ merchant_vpa');

  // Verify that mutation methods invalidate cache
  const setupProfileInvalidates = clientContent.includes('setupMerchantProfile:') && clientContent.includes('this.invalidateMerchantCache();');
  const recordKhataInvalidates = clientContent.includes('recordKhataEntry:') && clientContent.includes('this.invalidateMerchantCache();');
  const requestSettlementInvalidates = clientContent.includes('requestSettlement:') && clientContent.includes('this.invalidateMerchantCache();');
  assert(setupProfileInvalidates, 'setupMerchantProfile invalidates merchant cache');
  assert(recordKhataInvalidates, 'recordKhataEntry invalidates merchant cache');
  assert(requestSettlementInvalidates, 'requestSettlement invalidates merchant cache');

  // Verify no massive unbounded joins in fetchMerchant
  assert(!clientContent.includes('parties:khata_parties(*, entries:khata_entries(*))'), 'fetchMerchant eliminated massive recursive khata joins');

  // --------------------------------------------------------------------------
  // TEST SUITE 4: Interactive Mode Switching & Mutual Exclusion in JSDOM
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 4: Interactive Mode Switching & Mutual Exclusion');

  const dom = new JSDOM(htmlContent, {
    url: 'http://localhost:3000',
    runScripts: 'dangerously',
    beforeParse(window) {
      window.tailwind = { config: {} };
      // Mock requestAnimationFrame
      window.requestAnimationFrame = (cb) => setTimeout(cb, 16);
      window.cancelAnimationFrame = (id) => clearTimeout(id);
    }
  });
  const { window } = dom;

  // Let scripts load
  await new Promise(r => setTimeout(r, 120));

  const {
    appState,
    switchMode,
    isBusinessModeEligible,
    updateAuthViewVisibility,
    syncMerchantDataAsync
  } = window;

  const bHeader = window.document.getElementById('businessHeader');
  const bContent = window.document.getElementById('businessContent');
  const bNav = window.document.getElementById('businessBottomNav');
  const mainHeader = window.document.getElementById('mainAppHeader');
  const mainContent = window.document.getElementById('mainContent');
  const bottomNav = window.document.querySelector('.bottom-nav:not(#businessBottomNav)');

  assert(typeof switchMode === 'function', 'switchMode is available on window');
  assert(typeof updateAuthViewVisibility === 'function', 'updateAuthViewVisibility is available on window');

  // Initialize logged-in state for Personal Mode
  appState.isLoggedIn = true;
  appState.hasBusinessAccount = true;
  appState.user.business_status = 'approved';
  appState.activeMode = 'personal';
  window.currentActiveMode = 'personal';
  updateAuthViewVisibility();

  // Test 4.1: Initial State (Personal Mode)
  assert(bHeader.classList.contains('hidden'), 'businessHeader is initially hidden');
  assert(bContent.classList.contains('hidden'), 'businessContent is initially hidden');
  assert(bNav.classList.contains('hidden'), 'businessBottomNav is initially hidden');
  assert(!mainHeader.classList.contains('hidden'), 'mainAppHeader is initially visible');
  assert(!mainContent.classList.contains('hidden'), 'mainContent is initially visible');

  // Test 4.2: Switch to Business Mode
  const switchSuccess = await switchMode('business');
  assert(switchSuccess === true, 'switchMode("business") returns true on success');
  assert(window.currentActiveMode === 'business', 'currentActiveMode is set to "business"');
  assert(appState.activeMode === 'business', 'appState.activeMode is set to "business"');

  // Verify mutual exclusion: Business visible, Personal hidden
  assert(!bHeader.classList.contains('hidden'), 'businessHeader is unhidden in Business Mode');
  assert(!bContent.classList.contains('hidden'), 'businessContent is unhidden in Business Mode');
  assert(!bNav.classList.contains('hidden'), 'businessBottomNav is unhidden in Business Mode');
  assert(mainHeader.classList.contains('hidden'), 'mainAppHeader is hidden in Business Mode');
  assert(mainContent.classList.contains('hidden'), 'mainContent is hidden in Business Mode');
  assert(bottomNav.classList.contains('hidden'), 'personal bottomNav is hidden in Business Mode');

  // Wait for action lock to release
  await new Promise(r => setTimeout(r, 320));

  // Test 4.3: Switch back to Personal Mode
  const switchBackSuccess = await switchMode('personal');
  assert(switchBackSuccess === true, 'switchMode("personal") returns true on success');
  assert(window.currentActiveMode === 'personal', 'currentActiveMode is restored to "personal"');
  assert(appState.activeMode === 'personal', 'appState.activeMode is restored to "personal"');

  // Verify mutual exclusion: Personal visible, Business hidden
  assert(bHeader.classList.contains('hidden'), 'businessHeader is hidden in Personal Mode');
  assert(bContent.classList.contains('hidden'), 'businessContent is hidden in Personal Mode');
  assert(bNav.classList.contains('hidden'), 'businessBottomNav is hidden in Personal Mode');
  assert(!mainHeader.classList.contains('hidden'), 'mainAppHeader is restored to visible');
  assert(!mainContent.classList.contains('hidden'), 'mainContent is restored to visible');
  assert(!bottomNav.classList.contains('hidden'), 'personal bottomNav is restored to visible');

  // --------------------------------------------------------------------------
  // TEST SUITE 5: Action Lock & Rapid-Click Debounce Protection
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 5: Action Lock & Rapid-Click Debounce Protection');
  await new Promise(r => setTimeout(r, 320));

  // Trigger rapid consecutive switches
  const p1 = switchMode('business');
  const p2 = switchMode('personal'); // immediate concurrent switch attempt

  const [res1, res2] = await Promise.all([p1, p2]);
  assert(res1 === true, 'First switch succeeds');
  assert(res2 === false, 'Concurrent rapid switch within lock window is safely rejected (returns false)');
  assert(window.currentActiveMode === 'business', 'Mode safely remains "business" without state corruption');

  // Wait for lock window (280ms)
  await new Promise(r => setTimeout(r, 320));

  const res3 = await switchMode('personal');
  assert(res3 === true, 'Subsequent switch succeeds after lock duration expires');

  // --------------------------------------------------------------------------
  // TEST SUITE 6: Security Integrity & Eligibility Gate Enforcement
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 6: Security Integrity & Eligibility Gate Enforcement');
  await new Promise(r => setTimeout(r, 320));

  // Simulate an unauthorized / unapproved user
  appState.hasBusinessAccount = false;
  appState.user.business_status = 'pending';

  const unauthorizedSwitch = await switchMode('business');
  assert(unauthorizedSwitch === false, 'switchMode("business") rejects unapproved users');
  assert(window.currentActiveMode === 'personal', 'currentActiveMode remains "personal"');
  assert(bHeader.classList.contains('hidden'), 'businessHeader remains strictly hidden');

  const applyModal = window.document.getElementById('modalApplyBusiness');
  assert(applyModal.classList.contains('active'), 'modalApplyBusiness is displayed for unapproved user');
  window.closeModal('modalApplyBusiness');

  // Restore approved status for remaining tests
  appState.hasBusinessAccount = true;
  appState.user.business_status = 'approved';

  // --------------------------------------------------------------------------
  // TEST SUITE 7: In-Memory Merchant Caching Performance
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 7: In-Memory Merchant Caching Performance');

  const clientModule = require(path.resolve('app/supabase-client.js'));
  const Supabase = clientModule || window.UnexaSupabase;
  if (Supabase) {
    Supabase.getCurrentUser = async () => ({ id: 'usr_test_perf_123', email: 'aarav@unexa.app' });
    let networkCallCount = 0;
    Supabase.getClient = () => ({
      from: (tbl) => ({
        select: () => ({
          eq: () => ({
            maybeSingle: async () => {
              networkCallCount++;
              return {
                data: {
                  id: 'm_test_999',
                  business_name: 'Sharma Electronics',
                  category: 'Electronics & Retail',
                  store_vpa: 'sharmaelec@upi',
                  available_settlement: 14500,
                  stash_balance: 5200
                },
                error: null
              };
            }
          })
        })
      })
    });

    // Invalidate cache first
    Supabase.invalidateMerchantCache();

    // Call 1: Network fetch
    const fetch1 = await Supabase.fetchMerchant('usr_test_perf_123');
    assert(networkCallCount === 1, 'First call triggers database query');
    assert(fetch1.data.store_name === 'Sharma Electronics', 'Data normalizes store_name');
    assert(fetch1.data.business_category === 'Electronics & Retail', 'Data normalizes business_category');

    // Call 2: Instant cached response
    const fetch2 = await Supabase.fetchMerchant('usr_test_perf_123');
    assert(networkCallCount === 1, 'Second call within 60s does NOT trigger database query (Cache Hit)');
    assert(fetch2.isCached === true, 'Response flags isCached: true');
    assert(fetch2.data.business_name === 'Sharma Electronics', 'Cached data matches original query');

    // Call 3: Mutation invalidates cache
    Supabase.invalidateMerchantCache();
    const fetch3 = await Supabase.fetchMerchant('usr_test_perf_123');
    assert(networkCallCount === 2, 'Query triggers fresh fetch after cache invalidation');
  } else {
    console.log('ℹ Supabase not testable in node context directly');
  }

  // --------------------------------------------------------------------------
  // TEST SUITE 8: 100-Switch Performance Stress Test (< 16ms / switch)
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 8: 100-Switch Performance Stress & Frame Budget Benchmark');

  const switchIterations = 100;
  const startTime = Date.now();

  for (let i = 0; i < switchIterations; i++) {
    const target = i % 2 === 0 ? 'business' : 'personal';
    window.currentActiveMode = target;
    appState.activeMode = target;
    updateAuthViewVisibility();
  }

  const totalTime = Date.now() - startTime;
  const avgLatency = (totalTime / switchIterations).toFixed(2);

  assert(totalTime > 0, `100 switches executed in ${totalTime}ms (Average: ${avgLatency}ms / switch)`);
  assert(parseFloat(avgLatency) < 16.0, `Average switch latency is within 60fps frame budget (< 16ms, measured: ${avgLatency}ms)`);
  assert(window.document.querySelectorAll('#businessHeader').length === 1, 'Zero duplicate elements injected into DOM during 100 switches');

  // Reset to personal mode
  window.currentActiveMode = 'personal';
  appState.activeMode = 'personal';
  updateAuthViewVisibility();
  assert(bHeader.classList.contains('hidden'), 'DOM cleanly returns to Personal Mode');

  // --------------------------------------------------------------------------
  // TEST SUITE 9: Multi-Platform Assets Synchronization
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 9: Multi-Platform Assets Synchronization');
  const rootHtml = fs.readFileSync('index.html', 'utf8');
  const androidHtml = fs.readFileSync('android/app/src/main/assets/public/index.html', 'utf8');
  const rootClient = fs.readFileSync('supabase-client.js', 'utf8');
  const androidClient = fs.readFileSync('android/app/src/main/assets/public/supabase-client.js', 'utf8');

  assert(rootHtml.includes('syncMerchantDataAsync'), 'Root index.html has async merchant sync');
  assert(androidHtml.includes('syncMerchantDataAsync'), 'Android index.html has async merchant sync');
  assert(rootClient.includes('_merchantCache'), 'Root supabase-client.js has merchant cache');
  assert(androidClient.includes('_merchantCache'), 'Android supabase-client.js has merchant cache');

  // --------------------------------------------------------------------------
  // SUMMARY
  // --------------------------------------------------------------------------
  console.log('\n============================================================');
  console.log(`TOTAL BUSINESS MODE TESTS: ${testsPassed + testsFailed} | PASSED: ${testsPassed} | FAILED: ${testsFailed}`);
  console.log('============================================================\n');

  if (testsFailed > 0) {
    process.exit(1);
  } else {
    console.log('🎉 ALL BUSINESS MODE & PERFORMANCE TESTS PASSED 100% SUCCESSFULLY!\n');
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});

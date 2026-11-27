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
console.log('UNEXA ACCOUNT OVERVIEW UI & LAYOUT TEST SUITE');
console.log('============================================================\n');

const html = fs.readFileSync(path.join(workspaceDir, 'app', 'index.html'), 'utf8');

// Test Suite 1: DOM Elements Removal Verification
console.log('Test Suite 1: Removal of Total Balance & Profile Rewards Vault');
const dom = new JSDOM(html, { runScripts: 'outside-only' });
const { window } = dom;
const { document } = window;

const profileView = document.getElementById('profileView');
assert(profileView !== null, '#profileView exists in the DOM');

// Check that personalTotalBalance is removed
const totalBalanceEl = document.getElementById('personalTotalBalance');
assert(totalBalanceEl === null, '#personalTotalBalance element is completely removed from the DOM');

// Check that profileRewardsBadge is removed
const profileRewardsBadge = document.getElementById('profileRewardsBadge');
assert(profileRewardsBadge === null, '#profileRewardsBadge element is completely removed from the DOM');

// Check that profileCashbackWon is removed
const profileCashbackWon = document.getElementById('profileCashbackWon');
assert(profileCashbackWon === null, '#profileCashbackWon element is completely removed from the DOM');

// Check that Rewards Vault card in profileView is removed
const profileTrophyIcon = profileView ? profileView.querySelector('[data-lucide="trophy"]') : null;
assert(profileTrophyIcon === null, 'Trophy icon from Cashback & Rewards Vault is completely removed from profileView');

// Test Suite 2: Account Overview Heading & Security Badge
console.log('\nTest Suite 2: Account Overview Heading & Security Badge');
const sectionTitles = Array.from(document.querySelectorAll('.section-title'));
const accountOverviewTitle = sectionTitles.find(el => el.textContent.trim() === 'Account Overview');
assert(accountOverviewTitle !== null, 'Account Overview section heading is preserved');

const sectionHeader = accountOverviewTitle ? accountOverviewTitle.closest('.section-header') : null;
assert(sectionHeader !== null, '.section-header container exists for Account Overview');
assert(sectionHeader && sectionHeader.textContent.includes('TIER-1 SECURE'), 'Account Overview header contains "TIER-1 SECURE" badge');
const shieldIcon = sectionHeader ? sectionHeader.querySelector('[data-lucide="shield"]') : null;
assert(shieldIcon !== null, 'Account Overview header contains shield icon');

// Test Suite 3: Aggregated UPI Balance & Visibility Toggle
console.log('\nTest Suite 3: Aggregated UPI Balance & Visibility Toggle');
const aggregatedBalEl = document.getElementById('profileAggregatedBalance');
assert(aggregatedBalEl !== null, '#profileAggregatedBalance element exists');
assert(aggregatedBalEl && aggregatedBalEl.textContent.trim() === '₹84,250.00', 'Aggregated balance shows ₹84,250.00');

const trendEl = document.getElementById('profileBalanceTrend');
assert(trendEl !== null, '#profileBalanceTrend element exists');
assert(trendEl && trendEl.textContent.includes('+₹12.4k this week'), 'Balance trend indicator displays "+₹12.4k this week"');

const eyeIcon = document.getElementById('profileBalanceEyeIcon');
assert(eyeIcon !== null, '#profileBalanceEyeIcon exists for balance visibility toggle');
assert(html.includes('toggleProfileBalanceVisibility()'), 'toggleProfileBalanceVisibility() is bound to toggle button');
assert(html.includes('checkAllBankBalances()'), 'checkAllBankBalances() is bound to Check All button');

// Test Suite 4: Linked Bank Accounts & Compact Cards
console.log('\nTest Suite 4: Linked Bank Accounts & Compact Cards');
const bankCountEl = document.getElementById('profileBankCount');
assert(bankCountEl !== null, '#profileBankCount element exists');
assert(bankCountEl && bankCountEl.textContent.trim() === '3', '#profileBankCount displays "3" linked banks');

const linkedBanksList = document.getElementById('profileLinkedBanksList');
assert(linkedBanksList !== null, '#profileLinkedBanksList container exists');
const bankCards = linkedBanksList ? linkedBanksList.children : [];
assert(bankCards.length === 3, `Linked banks list contains 3 bank cards (found: ${bankCards.length})`);

assert(linkedBanksList && linkedBanksList.textContent.includes('HDFC Bank'), 'Linked bank card 1 displays HDFC Bank');
assert(linkedBanksList && linkedBanksList.textContent.includes('DEFAULT'), 'HDFC Bank has DEFAULT badge');
assert(linkedBanksList && linkedBanksList.textContent.includes('•• 4821'), 'HDFC Bank displays •• 4821');

assert(linkedBanksList && linkedBanksList.textContent.includes('ICICI Bank'), 'Linked bank card 2 displays ICICI Bank');
assert(linkedBanksList && linkedBanksList.textContent.includes('•• 9032'), 'ICICI Bank displays •• 9032');

assert(linkedBanksList && linkedBanksList.textContent.includes('SBI Bank'), 'Linked bank card 3 displays SBI Bank');
assert(linkedBanksList && linkedBanksList.textContent.includes('•• 1157'), 'SBI Bank displays •• 1157');

const txnCountEl = document.getElementById('profileTxnCount');
assert(txnCountEl !== null, '#profileTxnCount element exists');
assert(txnCountEl && txnCountEl.textContent.trim() === '412', '#profileTxnCount displays "412" transactions');

const upiLiteEl = document.getElementById('profileUpiLiteBalance');
assert(upiLiteEl !== null, '#profileUpiLiteBalance element exists');
assert(upiLiteEl && upiLiteEl.textContent.trim() === '₹1,850', '#profileUpiLiteBalance displays "₹1,850"');

assert(html.includes('openBankAccountsModal()'), 'Add Bank Account calls openBankAccountsModal()');
assert(html.includes('RuPay UPI'), 'RuPay UPI action button is rendered');

// Test Suite 5: Unrelated Elements Preservation
console.log('\nTest Suite 5: Unrelated Features Preservation');
// Check that Quick Actions Rewards Vault still exists
const ledgerRewardsBadge = document.getElementById('ledgerRewardsBadge');
assert(ledgerRewardsBadge !== null, '#ledgerRewardsBadge in Feature Hub/Quick Actions is preserved');
const ledgerCashbackWon = document.getElementById('ledgerCashbackWon');
assert(ledgerCashbackWon !== null, '#ledgerCashbackWon in Feature Hub/Quick Actions is preserved');

// Check that modal functions and state logic exist in script
assert(html.includes('function openBankAccountsModal'), 'openBankAccountsModal function is preserved');
assert(html.includes('function openHistoryModal'), 'openHistoryModal function is preserved');
assert(html.includes('function openRewardsHubModal'), 'openRewardsHubModal function is preserved');

// Test Suite 6: Runtime Null-Safety Verification
console.log('\nTest Suite 6: Runtime Null-Safety Verification');
// Check that all JavaScript references to personalTotalBalance, profileRewardsBadge, profileCashbackWon are guarded
const lines = html.split('\n');
let unguardedTotalBal = 0;
let unguardedProfileBadge = 0;
let unguardedProfileWon = 0;

lines.forEach((line, i) => {
  if (line.includes("getElementById('personalTotalBalance')")) {
    const windowSnippet = lines.slice(i, i + 4).join(' ');
    if (windowSnippet.includes('.textContent') && !windowSnippet.includes('if (') && !windowSnippet.includes('totalBalEl &&') && !windowSnippet.includes('balEl &&') && !windowSnippet.includes('balEl?.')) {
      unguardedTotalBal++;
    }
  }
  if (line.includes("getElementById('profileRewardsBadge')")) {
    const windowSnippet = lines.slice(i, i + 4).join(' ');
    if (windowSnippet.includes('.textContent') && !windowSnippet.includes('if (profileBadge)')) {
      unguardedProfileBadge++;
    }
  }
  if (line.includes("getElementById('profileCashbackWon')")) {
    const windowSnippet = lines.slice(i, i + 4).join(' ');
    if (windowSnippet.includes('.textContent') && !windowSnippet.includes('if (profileWonText)')) {
      unguardedProfileWon++;
    }
  }
});

assert(unguardedTotalBal === 0, 'All personalTotalBalance references in JavaScript are null-safe');
assert(unguardedProfileBadge === 0, 'All profileRewardsBadge references in JavaScript are null-safe');
assert(unguardedProfileWon === 0, 'All profileCashbackWon references in JavaScript are null-safe');

// Test Suite 7: Assets Synchronization Check
console.log('\nTest Suite 7: Multi-Platform Assets Synchronization');
const rootHtml = fs.readFileSync(path.join(workspaceDir, 'index.html'), 'utf8');
const androidHtml = fs.readFileSync(path.join(workspaceDir, 'android', 'app', 'src', 'main', 'assets', 'public', 'index.html'), 'utf8');

assert(!rootHtml.includes('id="personalTotalBalance"'), 'Root index.html has personalTotalBalance removed');
assert(!androidHtml.includes('id="personalTotalBalance"'), 'Android index.html has personalTotalBalance removed');
assert(rootHtml.includes('id="profileAggregatedBalance"'), 'Root index.html has profileAggregatedBalance');
assert(androidHtml.includes('id="profileAggregatedBalance"'), 'Android index.html has profileAggregatedBalance');
assert(rootHtml.includes('id="profileLinkedBanksList"'), 'Root index.html has profileLinkedBanksList');
assert(androidHtml.includes('id="profileLinkedBanksList"'), 'Android index.html has profileLinkedBanksList');

console.log('\n============================================================');
console.log(`TOTAL ACCOUNT OVERVIEW TESTS: ${passedTests + failedTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
console.log('============================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL ACCOUNT OVERVIEW TESTS PASSED 100% SUCCESSFULLY!\n');
}

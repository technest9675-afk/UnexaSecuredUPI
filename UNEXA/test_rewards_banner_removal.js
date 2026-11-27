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
console.log('UNEXA REWARDS & CASHBACKS BANNER REMOVAL TEST SUITE');
console.log('============================================================\n');

const html = fs.readFileSync(path.join(workspaceDir, 'app', 'index.html'), 'utf8');
const dom = new JSDOM(html, { runScripts: 'outside-only' });
const { window } = dom;
const { document } = window;

// Test Suite 1: DOM Elements Complete Removal Verification
console.log('Test Suite 1: Removal of Banner Elements from Dashboard');

const personalUpiView = document.getElementById('personalUpiView');
assert(personalUpiView !== null, '#personalUpiView exists in the DOM');

// Check that homeUnscratchedBadge is removed
const homeUnscratchedBadge = document.getElementById('homeUnscratchedBadge');
assert(homeUnscratchedBadge === null, '#homeUnscratchedBadge element is completely removed from the DOM');

// Check that homeTotalCashbackText is removed
const homeTotalCashbackText = document.getElementById('homeTotalCashbackText');
assert(homeTotalCashbackText === null, '#homeTotalCashbackText element is completely removed from the DOM');

// Check that no trophy icon exists within #personalUpiView
const personalTrophy = personalUpiView ? personalUpiView.querySelector('i[data-lucide="trophy"]') : null;
assert(personalTrophy === null, 'Trophy icon is completely removed from #personalUpiView');

// Check that banner title and text are removed
assert(!html.includes('id="homeUnscratchedBadge"'), 'id="homeUnscratchedBadge" does not exist in app/index.html');
assert(!html.includes('id="homeTotalCashbackText"'), 'id="homeTotalCashbackText" does not exist in app/index.html');
assert(!html.includes('2 UNOPENED CARDS'), '"2 UNOPENED CARDS" text is completely removed');
assert(!html.includes('Tap to Scratch &amp; Claim') && !html.includes('Tap to Scratch & Claim'), '"Tap to Scratch & Claim" text is completely removed from dashboard');
assert(!html.includes('<!-- Section: CASHBACK & REWARDS BANNER -->'), 'CASHBACK & REWARDS BANNER comment is removed');

// Test Suite 2: Layout Continuity & No Empty Placeholder Space
console.log('\nTest Suite 2: Layout Continuity & Section Spacing');

const personalToolsGrid = personalUpiView.querySelector('.personal-tools-grid');
assert(personalToolsGrid !== null, '.personal-tools-grid container exists');

// Verify that the next element after personal-tools-grid is the Recent Activity section
const nextSection = personalToolsGrid.nextElementSibling;
assert(nextSection !== null, 'Next section element exists after personal-tools-grid');
assert(nextSection.querySelector('#homeRecentTxList') !== null, 'Next section immediately following Personal Tools is Recent Activity');

// Verify personalToolsGrid has mb-4 for clean, standard section gap
assert(personalToolsGrid.classList.contains('mb-4'), '.personal-tools-grid retains standard mb-4 margin');

// Test Suite 3: Preservation of Unrelated Rewards Features
console.log('\nTest Suite 3: Preservation of Unrelated Rewards Features');

// 1. RewardBox card in Personal Tools
const cards = Array.from(personalToolsGrid.querySelectorAll('.personal-tool-card'));
const rewardBoxCard = cards.find(c => c.textContent.includes('RewardBox'));
assert(rewardBoxCard !== undefined, 'RewardBox card is preserved in Personal Tools');
assert(rewardBoxCard && rewardBoxCard.getAttribute('onclick') === "openRewardsHubModal('cards')", 'RewardBox card retains onclick="openRewardsHubModal(\'cards\')"');
assert(rewardBoxCard && rewardBoxCard.querySelector('i[data-lucide="gift"]') !== null, 'RewardBox card retains gift icon');

// 2. Rewards Hub Modal
const modalRewardsHub = document.getElementById('modalRewardsHub');
assert(modalRewardsHub !== null, '#modalRewardsHub bottom sheet modal is preserved in the DOM');

// 3. Modal open function in source
assert(html.includes('function openRewardsHubModal'), 'openRewardsHubModal function is preserved in source code');

// 4. Quick Actions / Feature Hub Cashback & Rewards Vault
const ledgerBadge = document.getElementById('ledgerRewardsBadge');
assert(ledgerBadge !== null, '#ledgerRewardsBadge in Feature Hub/Quick Actions is preserved');
const ledgerWonText = document.getElementById('ledgerCashbackWon');
assert(ledgerWonText !== null, '#ledgerCashbackWon in Feature Hub/Quick Actions is preserved');

// Test Suite 4: Runtime Null Safety Verification
console.log('\nTest Suite 4: Runtime Null Safety Verification');

const lines = html.split('\n');
let unguardedHomeBadge = 0;
let unguardedHomeWon = 0;

lines.forEach((line, i) => {
  if (line.includes("getElementById('homeUnscratchedBadge')")) {
    const windowSnippet = lines.slice(i, i + 5).join(' ');
    if (windowSnippet.includes('.textContent') && !windowSnippet.includes('if (homeBadge)')) {
      unguardedHomeBadge++;
    }
  }
  if (line.includes("getElementById('homeTotalCashbackText')")) {
    const windowSnippet = lines.slice(i, i + 3).join(' ');
    if (windowSnippet.includes('.textContent') && !windowSnippet.includes('if (homeWonText)')) {
      unguardedHomeWon++;
    }
  }
});

assert(unguardedHomeBadge === 0, 'All homeUnscratchedBadge references in JavaScript are null-safe');
assert(unguardedHomeWon === 0, 'All homeTotalCashbackText references in JavaScript are null-safe');

// Test Suite 5: Multi-Platform Assets Synchronization
console.log('\nTest Suite 5: Multi-Platform Assets Synchronization');

const rootHtml = fs.readFileSync(path.join(workspaceDir, 'index.html'), 'utf8');
const androidHtml = fs.readFileSync(path.join(workspaceDir, 'android', 'app', 'src', 'main', 'assets', 'public', 'index.html'), 'utf8');

assert(!rootHtml.includes('id="homeUnscratchedBadge"'), 'Root index.html has homeUnscratchedBadge removed');
assert(!androidHtml.includes('id="homeUnscratchedBadge"'), 'Android index.html has homeUnscratchedBadge removed');
assert(!rootHtml.includes('id="homeTotalCashbackText"'), 'Root index.html has homeTotalCashbackText removed');
assert(!androidHtml.includes('id="homeTotalCashbackText"'), 'Android index.html has homeTotalCashbackText removed');
assert(!rootHtml.includes('<!-- Section: CASHBACK & REWARDS BANNER -->'), 'Root index.html has banner comment removed');
assert(!androidHtml.includes('<!-- Section: CASHBACK & REWARDS BANNER -->'), 'Android index.html has banner comment removed');

console.log('\n============================================================');
console.log(`TOTAL BANNER REMOVAL TESTS: ${passedTests + failedTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
console.log('============================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL REWARDS BANNER REMOVAL TESTS PASSED 100% SUCCESSFULLY!\n');
}

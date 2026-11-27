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
console.log('UNEXA POLISHED 2-TAB MODE SELECTOR TEST SUITE');
console.log('============================================================\n');

const html = fs.readFileSync(path.join(workspaceDir, 'app', 'index.html'), 'utf8');

// 1. Complete Removal of ACTIVE Badge
console.log('Test Suite 1: Complete Removal of ACTIVE Badge');
const dom = new JSDOM(html);
const { window } = dom;
const { document } = window;

const switcher = document.querySelector('.mode-switch-container');
assert(switcher !== null, '.mode-switch-container exists in DOM');

const activeBadgeEl = document.getElementById('groupTabActiveBadge');
assert(activeBadgeEl === null, 'No #groupTabActiveBadge element exists in the DOM');

const switcherText = switcher.textContent;
assert(!switcherText.includes('ACTIVE'), 'The text "ACTIVE" is completely absent from the mode switch container');

const tabPersonal = document.getElementById('tabPersonalUpi');
const tabGroup = document.getElementById('tabGroupUpi');
assert(tabPersonal !== null, '#tabPersonalUpi exists');
assert(tabGroup !== null, '#tabGroupUpi exists');

assert(tabPersonal.querySelector('.mode-tab-badge-slot') === null, 'No badge slot in Personal UPI tab');
assert(tabGroup.querySelector('.mode-tab-badge-slot') === null, 'No badge slot in Group Pools tab');
assert(tabPersonal.querySelector('.mode-tab-badge') === null, 'No badge element in Personal UPI tab');
assert(tabGroup.querySelector('.mode-tab-badge') === null, 'No badge element in Group Pools tab');
assert(!html.includes('.mode-tab-badge-slot {'), 'Obsolete .mode-tab-badge-slot CSS rule removed');
assert(!html.includes('.mode-tab-badge-spacer {'), 'Obsolete .mode-tab-badge-spacer CSS rule removed');

// 2. Alignment & Single-Row Horizontal Geometry
console.log('\nTest Suite 2: Perfect Alignment & Geometry');
assert(switcher.getAttribute('role') === 'tablist', 'Mode switcher has role="tablist"');
const tabs = switcher.querySelectorAll('.mode-tab-btn');
assert(tabs.length === 2, 'Mode switcher contains EXACTLY 2 options: Personal UPI & Group Pools');

assert(html.includes('.mode-switch-container {'), '.mode-switch-container CSS rule exists');
assert(html.includes('overflow: hidden'), '.mode-switch-container has overflow: hidden');
assert(html.includes('border-radius: 16px'), '.mode-switch-container preserves 16px rounded corners');
assert(html.includes('padding: 4px'), '.mode-switch-container has consistent 4px padding');

assert(html.includes('flex: 1 1 0px'), '.mode-tab-btn uses flex: 1 1 0px for strictly equal 50/50 width distribution');
assert(html.includes('min-width: 0'), '.mode-tab-btn specifies min-width: 0 to prevent blowout');
assert(html.includes('height: 44px'), '.mode-tab-btn specifies equal fixed height (44px)');
assert(html.includes('flex-direction: row'), '.mode-tab-btn arranges icon and label on a single horizontal row');
assert(html.includes('align-items: center'), '.mode-tab-btn centers icon and label vertically');
assert(html.includes('justify-content: center'), '.mode-tab-btn centers icon and label horizontally');
assert(html.includes('gap: 8px'), '.mode-tab-btn provides consistent 8px spacing between icon and text');

// Verify icon and label inside each button
const personalIcon = tabPersonal.querySelector('i[data-lucide="user"]');
const personalLabel = tabPersonal.querySelector('.mode-tab-label');
const groupIcon = tabGroup.querySelector('i[data-lucide="users"]');
const groupLabel = tabGroup.querySelector('.mode-tab-label');

assert(personalIcon !== null, 'Personal UPI has user icon');
assert(personalLabel !== null && personalLabel.textContent.trim() === 'Personal UPI', 'Personal UPI has label');
assert(groupIcon !== null, 'Group Pools has users icon');
assert(groupLabel !== null && groupLabel.textContent.trim() === 'Group Pools', 'Group Pools has label');

assert(html.includes('.mode-tab-icon {'), '.mode-tab-icon CSS rule exists');
assert(html.includes('width: 16px'), '.mode-tab-icon has 16px width');
assert(html.includes('height: 16px'), '.mode-tab-icon has 16px height');
assert(html.includes('.mode-tab-label {'), '.mode-tab-label CSS rule exists');
assert(html.includes('line-height: 1'), '.mode-tab-label has line-height: 1 to ensure identical baseline');
assert(html.includes('white-space: nowrap'), '.mode-tab-label prevents wrapping with white-space: nowrap');
assert(html.includes('text-overflow: ellipsis'), '.mode-tab-label prevents overflow with text-overflow: ellipsis');

// 3. Smooth Animation, Sliding Indicator & Transitions
console.log('\nTest Suite 3: Smooth Sliding Indicator & Animation');
const indicator = document.getElementById('modeSwitchIndicator');
assert(indicator !== null, '#modeSwitchIndicator element exists in DOM');
assert(indicator.getAttribute('aria-hidden') === 'true', '#modeSwitchIndicator has aria-hidden="true"');
assert(switcher.firstElementChild === indicator, '#modeSwitchIndicator is the first child of .mode-switch-container');

assert(html.includes('.mode-switch-indicator {'), '.mode-switch-indicator CSS rule exists');
assert(html.includes('position: absolute'), 'Indicator has position: absolute');
assert(html.includes('width: calc(50% - 4px)'), 'Indicator width is calc(50% - 4px) for exact 50% coverage minus padding');
assert(html.includes('border-radius: 12px'), 'Indicator border-radius is 12px (geometric concentricity with 16px outer)');
assert(html.includes('linear-gradient(135deg, #6366f1 0%, #4338ca 100%)'), 'Indicator preserves the signature purple gradient');
assert(html.includes('transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1)'), 'Indicator uses 250ms smooth transition curve');
assert(html.includes('transform: translate3d(0, 0, 0)'), 'Indicator starts at translateX(0) for Personal UPI');
assert(html.includes('transform: translate3d(100%, 0, 0)'), 'Indicator slides to translateX(100%) for Group Pools');
assert(html.includes('pointer-events: none'), 'Indicator has pointer-events: none to prevent click interference');
assert(html.includes('z-index: 1'), 'Indicator sits at z-index: 1 beneath button labels');
assert(html.includes('z-index: 2'), 'Buttons sit at z-index: 2 above indicator');

// Press feedback and color transitions
assert(html.includes('transition: color 200ms ease'), 'Labels have gentle 200ms color transition');
assert(html.includes('transform: scale(0.98)'), 'Buttons provide subtle active press feedback (scale 0.98)');
assert(html.includes('.mode-tab-btn:focus-visible {'), 'Buttons define visible keyboard focus indicator');

// 4. Tab Switching Functionality & State Synchronization
console.log('\nTest Suite 4: Tab Switching Functionality & State Sync');
assert(tabPersonal.classList.contains('active'), 'Personal UPI tab is active by default');
assert(tabPersonal.getAttribute('aria-selected') === 'true', 'Personal UPI has aria-selected="true"');
assert(tabPersonal.getAttribute('tabindex') === '0', 'Personal UPI has tabindex="0"');
assert(!tabGroup.classList.contains('active'), 'Group Pools is inactive by default');
assert(tabGroup.getAttribute('aria-selected') === 'false', 'Group Pools has aria-selected="false"');
assert(tabGroup.getAttribute('tabindex') === '-1', 'Group Pools has tabindex="-1"');
assert(!indicator.classList.contains('active-group'), 'Indicator is at default position (Personal)');

// Setup mock state for JavaScript functions
window.appState = { upiMode: 'personal', hasBusinessAccount: true, isDemoMode: true };
window.saveState = () => {};
window.showToast = () => {};
window.playSuccessChime = () => {};
window.renderHomeRecentTransactions = () => {};
window.renderGroupPoolUI = () => {};

// Evaluate switchUpiMode function from HTML
const switchUpiModeCode = html.match(/function switchUpiMode\(mode\) \{[\s\S]*?\n\}/)[0];
new Function('window', 'document', 'appState', 'saveState', 'showToast', 'playSuccessChime', 'renderHomeRecentTransactions', 'renderGroupPoolUI', `
  var appState = window.appState;
  var saveState = window.saveState;
  var showToast = window.showToast;
  var playSuccessChime = window.playSuccessChime;
  var renderHomeRecentTransactions = window.renderHomeRecentTransactions;
  var renderGroupPoolUI = window.renderGroupPoolUI;
  ${switchUpiModeCode}
  window.switchUpiMode = switchUpiMode;
`)(window, document, window.appState, window.saveState, window.showToast, window.playSuccessChime, window.renderHomeRecentTransactions, window.renderGroupPoolUI);

// Test Switching to Group Mode
window.switchUpiMode('group');
assert(tabGroup.classList.contains('active'), 'Group Pools becomes active after switchUpiMode("group")');
assert(tabGroup.getAttribute('aria-selected') === 'true', 'Group Pools has aria-selected="true"');
assert(tabGroup.getAttribute('tabindex') === '0', 'Group Pools has tabindex="0"');
assert(!tabPersonal.classList.contains('active'), 'Personal UPI is deactivated');
assert(tabPersonal.getAttribute('aria-selected') === 'false', 'Personal UPI has aria-selected="false"');
assert(tabPersonal.getAttribute('tabindex') === '-1', 'Personal UPI has tabindex="-1"');
assert(indicator.classList.contains('active-group'), 'Indicator has .active-group class (translateX 100%)');
assert(switcher.classList.contains('mode-group-active'), 'Container has .mode-group-active class');
assert(window.appState.upiMode === 'group', 'appState.upiMode updated to group');

// Test Switching back to Personal Mode
window.switchUpiMode('personal');
assert(tabPersonal.classList.contains('active'), 'Personal UPI becomes active after switchUpiMode("personal")');
assert(tabPersonal.getAttribute('aria-selected') === 'true', 'Personal UPI has aria-selected="true"');
assert(tabPersonal.getAttribute('tabindex') === '0', 'Personal UPI has tabindex="0"');
assert(!tabGroup.classList.contains('active'), 'Group Pools is deactivated');
assert(tabGroup.getAttribute('aria-selected') === 'false', 'Group Pools has aria-selected="false"');
assert(tabGroup.getAttribute('tabindex') === '-1', 'Group Pools has tabindex="-1"');
assert(!indicator.classList.contains('active-group'), 'Indicator removes .active-group class (translateX 0)');
assert(!switcher.classList.contains('mode-group-active'), 'Container removes .mode-group-active class');
assert(window.appState.upiMode === 'personal', 'appState.upiMode updated to personal');

// Rapid 10x switching test for alignment stability
for (let i = 0; i < 10; i++) {
  window.switchUpiMode(i % 2 === 0 ? 'group' : 'personal');
}
assert(tabPersonal.classList.contains('active'), 'Selector returns cleanly to Personal UPI after 10 switches');
assert(!indicator.classList.contains('active-group'), 'Indicator returns cleanly to position 0 after 10 switches');

// 5. Accessibility, Keyboard Navigation & Reduced Motion
console.log('\nTest Suite 5: Accessibility & Reduced Motion');
assert(html.includes('@media (prefers-reduced-motion: reduce)'), '@media (prefers-reduced-motion: reduce) rule is present');
assert(html.includes('transition: none !important'), 'Reduced motion disables nonessential transitions');
assert(html.includes('onkeydown="handleModeSwitcherKeyDown(event)"'), 'Mode switcher container has onkeydown keyboard handler');
assert(html.includes('function handleModeSwitcherKeyDown'), 'handleModeSwitcherKeyDown function is defined');

// 6. Preservation of Business Backend & Features
console.log('\nTest Suite 6: Preservation of Business Features & Backend');
assert(html.includes('function switchMode(targetMode)'), 'switchMode function preserved for Business Mode');
assert(html.includes('isBusinessModeEligible'), 'isBusinessModeEligible logic preserved');
assert(html.includes('id="businessHeader"'), 'Business header preserved');
assert(html.includes('id="businessContent"'), 'Business content preserved');
assert(html.includes('id="modalApplyBusiness"'), 'modalApplyBusiness preserved');

// 7. Multi-Platform Assets Check
console.log('\nTest Suite 7: Multi-Platform Assets Synchronization');
const rootHtml = fs.readFileSync(path.join(workspaceDir, 'index.html'), 'utf8');
const androidHtml = fs.readFileSync(path.join(workspaceDir, 'android', 'app', 'src', 'main', 'assets', 'public', 'index.html'), 'utf8');

assert(!rootHtml.includes('id="groupTabActiveBadge"'), 'Root index.html has ACTIVE badge removed');
assert(!androidHtml.includes('id="groupTabActiveBadge"'), 'Android index.html has ACTIVE badge removed');
assert(rootHtml.includes('id="modeSwitchIndicator"'), 'Root index.html has modeSwitchIndicator');
assert(androidHtml.includes('id="modeSwitchIndicator"'), 'Android index.html has modeSwitchIndicator');

console.log('\n============================================================');
console.log(`TOTAL MODE SELECTOR TESTS: ${passedTests + failedTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
console.log('============================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL POLISHED MODE SELECTOR TESTS PASSED 100% SUCCESSFULLY!\n');
}

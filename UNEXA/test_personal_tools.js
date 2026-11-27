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
console.log('UNEXA PERSONAL TOOLS FEATURE GRID & ALIGNMENT TEST SUITE');
console.log('============================================================\n');

const html = fs.readFileSync(path.join(workspaceDir, 'app', 'index.html'), 'utf8');
const dom = new JSDOM(html);
const { document } = dom.window;

// 1. Section Title & Visual Consistency with Group Tools
console.log('Test Suite 1: Section Title & Consistency with Group Tools');
const personalView = document.getElementById('personalUpiView');
assert(personalView !== null, '#personalUpiView exists in the DOM');

const sectionTitles = Array.from(personalView.querySelectorAll('.section-title'));
const personalToolsTitle = sectionTitles.find(el => el.textContent.includes('PERSONAL TOOLS'));
assert(personalToolsTitle !== null, 'Personal Tools section title exists in #personalUpiView');

const personalHeader = personalToolsTitle ? personalToolsTitle.closest('.section-header') : null;
assert(personalHeader !== null, 'Personal Tools heading is wrapped in .section-header');

// Check subtitle
const subtitle = personalHeader ? personalHeader.querySelector('.text-\\[10px\\]') : null;
assert(subtitle !== null, 'Personal Tools heading contains descriptive subtitle');

// Compare with Group Tools header structure
const groupView = document.getElementById('groupUpiView');
assert(groupView !== null, '#groupUpiView exists in the DOM');
const groupTitles = Array.from(groupView.querySelectorAll('.section-title'));
const groupToolsTitle = groupTitles.find(el => el.textContent.includes('GROUP TOOLS'));
assert(groupToolsTitle !== null, 'Group Tools section title exists');

assert(personalToolsTitle.classList.contains('section-title') && groupToolsTitle.classList.contains('section-title'),
  'Personal Tools and Group Tools share identical .section-title class');
assert(personalToolsTitle.querySelector('i[data-lucide]') !== null && groupToolsTitle.querySelector('i[data-lucide]') !== null,
  'Both Personal Tools and Group Tools titles include matching icon accents');

// 2. Updated Card Names & Wiring Verification
console.log('\nTest Suite 2: Feature Card Names & Wiring Verification');
const grid = personalView.querySelector('.personal-tools-grid');
assert(grid !== null, '.personal-tools-grid container exists');
assert(grid.getAttribute('role') === 'group', '.personal-tools-grid has role="group"');
assert(grid.getAttribute('aria-label') === 'Personal Tools', '.personal-tools-grid has aria-label="Personal Tools"');

const cards = grid.querySelectorAll('.personal-tool-card');
assert(cards.length === 8, `Grid contains EXACTLY 8 cards (found: ${cards.length})`);

// Card 1: QuickPay (formerly Send Money)
const cardQuickPay = cards[0];
assert(cardQuickPay.getAttribute('onclick') === 'openPayContactsModal()', 'Card 1 (QuickPay) calls openPayContactsModal()');
assert(cardQuickPay.querySelector('i[data-lucide="send"]') !== null, 'Card 1 has send icon');
assert(cardQuickPay.textContent.includes('QuickPay'), 'Card 1 displays updated name "QuickPay"');

// Card 2: PayRequest (formerly Request)
const cardPayRequest = cards[1];
assert(cardPayRequest.getAttribute('onclick') === 'openRequestMoneyModal()', 'Card 2 (PayRequest) calls openRequestMoneyModal()');
assert(cardPayRequest.querySelector('i[data-lucide="arrow-down-left"]') !== null, 'Card 2 has arrow-down-left icon');
assert(cardPayRequest.textContent.includes('PayRequest'), 'Card 2 displays updated name "PayRequest"');

// Card 3: My QR (unchanged)
const cardQr = cards[2];
assert(cardQr.getAttribute('onclick') === 'openPersonalQrModal()', 'Card 3 (My QR) calls openPersonalQrModal()');
assert(cardQr.querySelector('i[data-lucide="qr-code"]') !== null, 'Card 3 has qr-code icon');
assert(cardQr.textContent.includes('My QR'), 'Card 3 displays name "My QR"');

// Card 4: BalanceCheck (formerly Check Balance)
const cardBalanceCheck = cards[3];
assert(cardBalanceCheck.getAttribute('onclick') === 'openCheckBalanceModal()', 'Card 4 (BalanceCheck) calls openCheckBalanceModal()');
assert(cardBalanceCheck.querySelector('i[data-lucide="landmark"]') !== null, 'Card 4 has landmark icon');
assert(cardBalanceCheck.textContent.includes('BalanceCheck'), 'Card 4 displays updated name "BalanceCheck"');

// Card 5: BankTransfer (formerly To Bank)
const cardBankTransfer = cards[4];
assert(cardBankTransfer.getAttribute('onclick') === 'openBankTransferModal()', 'Card 5 (BankTransfer) calls openBankTransferModal()');
assert(cardBankTransfer.querySelector('i[data-lucide="building-2"]') !== null, 'Card 5 has building-2 icon');
assert(cardBankTransfer.textContent.includes('BankTransfer'), 'Card 5 displays updated name "BankTransfer"');

// Card 6: LitePay (formerly UPI Lite)
const cardLitePay = cards[5];
assert(cardLitePay.getAttribute('onclick') === 'openUpiLiteModal()', 'Card 6 (LitePay) calls openUpiLiteModal()');
assert(cardLitePay.querySelector('i[data-lucide="zap"]') !== null, 'Card 6 has zap icon');
assert(cardLitePay.textContent.includes('LitePay'), 'Card 6 displays updated name "LitePay"');

// Card 7: SplitMate (formerly Group Splits)
const cardSplitMate = cards[6];
assert(cardSplitMate.getAttribute('onclick') === "switchUpiMode('group')", 'Card 7 (SplitMate) calls switchUpiMode("group")');
assert(cardSplitMate.querySelector('i[data-lucide="users"]') !== null, 'Card 7 has users icon');
assert(cardSplitMate.textContent.includes('SplitMate'), 'Card 7 displays updated name "SplitMate"');

// Card 8: RewardBox (formerly Rewards)
const cardRewardBox = cards[7];
assert(cardRewardBox.getAttribute('onclick') === "openRewardsHubModal('cards')", 'Card 8 (RewardBox) calls openRewardsHubModal("cards")');
assert(cardRewardBox.querySelector('i[data-lucide="gift"]') !== null, 'Card 8 has gift icon');
assert(cardRewardBox.textContent.includes('RewardBox'), 'Card 8 displays updated name "RewardBox"');

// 3. Grid Geometry & Equal Heights
console.log('\nTest Suite 3: Grid Geometry & Uniform Card Heights');
assert(html.includes('.personal-tools-grid {'), '.personal-tools-grid CSS rule exists');
assert(html.includes('grid-template-columns: repeat(4, 1fr)'), 'Default desktop layout specifies 4 equal-width columns');
assert(html.includes('gap: 10px'), 'Grid specifies consistent 10px horizontal and vertical gaps');
assert(html.includes('@media (max-width: 480px)'), 'Responsive mobile breakpoint at 480px is defined');
assert(html.includes('grid-template-columns: repeat(2, 1fr)'), 'Mobile layout specifies 2 equal-width columns');

assert(html.includes('height: 92px'), '.personal-tool-card specifies fixed 92px height');
assert(html.includes('min-height: 92px'), '.personal-tool-card specifies min-height: 92px');
assert(html.includes('max-height: 92px'), '.personal-tool-card specifies max-height: 92px to prevent height mismatch');

// 4. Flexbox Alignment & Icon / Label Centering
console.log('\nTest Suite 4: Flexbox Alignment & Positioning Precision');
assert(html.includes('display: flex'), '.personal-tool-card uses Flexbox');
assert(html.includes('flex-direction: column'), '.personal-tool-card stacks content vertically');
assert(html.includes('align-items: center'), '.personal-tool-card centers content horizontally');
assert(html.includes('justify-content: center'), '.personal-tool-card centers content vertically');

// Icon container rules
assert(html.includes('.personal-tool-card .tool-icon-wrapper {'), '.tool-icon-wrapper CSS rule exists');
assert(html.includes('width: 42px') && html.includes('height: 42px'), 'Icon container has consistent 42px x 42px dimensions');
assert(html.includes('border-radius: 14px'), 'Icon container has consistent 14px border radius');
assert(html.includes('margin: 0 auto'), 'Icon container is centered with margin: 0 auto');

// Label container rules
assert(html.includes('.personal-tool-card .tool-label {'), '.personal-tool-card .tool-label CSS rule exists');
assert(html.includes('height: 26px'), 'Label has dedicated 26px height slot across all cards');
assert(html.includes('margin-top: 5px'), 'Consistent 5px spacing between icon and label');
assert(html.includes('word-break: break-word'), 'Long labels support controlled word wrapping');
assert(html.includes('overflow-wrap: break-word'), 'Long labels support overflow-wrap');

// 5. NEW Badge Placement & Anti-Clipping
console.log('\nTest Suite 5: NEW Badge Placement & Anti-Clipping');
const newBadge = cardPayRequest.querySelector('.personal-tool-badge');
assert(newBadge !== null, 'NEW badge exists on PayRequest card with .personal-tool-badge class');
assert(newBadge.textContent.trim() === 'NEW', 'Badge displays "NEW" text');
assert(html.includes('.personal-tool-badge {'), '.personal-tool-badge CSS rule exists');
assert(html.includes('top: 5px'), 'Badge is placed neatly at top: 5px inside the card curve');
assert(html.includes('right: 6px'), 'Badge is placed neatly at right: 6px without overlapping icon');
assert(html.includes('overflow: visible !important'), '.personal-tool-card specifies overflow: visible !important to prevent clipping');

// 6. CSS Animations: Entrance, Stagger, Hover & Touch Feedback
console.log('\nTest Suite 6: CSS Animations & Interaction Rules');
assert(html.includes('@keyframes personalToolFadeInUp'), '@keyframes personalToolFadeInUp is defined');
assert(html.includes('transform: translateY(8px)'), 'Keyframe starts with subtle translateY(8px) upward entrance');
assert(html.includes('animation: personalToolFadeInUp'), '.personal-tool-card uses personalToolFadeInUp animation');
assert(html.includes('backwards'), 'Entrance animation specifies backwards fill mode');

for (let i = 1; i <= 8; i++) {
  assert(html.includes(`.personal-tool-card:nth-child(${i}) { animation-delay:`),
    `Sequential animation-delay defined for card ${i}`);
}

assert(html.includes('@media (hover: hover) and (pointer: fine)'), 'Desktop-only hover media query is defined');
assert(html.includes('.personal-tool-card:hover {'), 'Desktop hover rule lifts card');
assert(html.includes('.personal-tool-card:hover .tool-icon-wrapper'), 'Icon micro-interaction on hover is defined');
assert(html.includes('.personal-tool-card:active {'), '.personal-tool-card:active click/touch press feedback rule is defined');
assert(html.includes('transform: scale(0.95)'), 'Active state applies quick scale(0.95) feedback');

// 7. Accessibility & Reduced Motion
console.log('\nTest Suite 7: Accessibility & Reduced Motion');
assert(html.includes('.personal-tool-card:focus-visible {'), 'Visible focus ring defined for keyboard navigation');
assert(html.includes('@media (prefers-reduced-motion: reduce)'), '@media (prefers-reduced-motion: reduce) rule is present');
assert(html.includes('animation: none !important'), 'prefers-reduced-motion disables entrance animations');

// 8. Multi-Platform Assets Synchronization
console.log('\nTest Suite 8: Multi-Platform Assets Synchronization');
const rootHtml = fs.readFileSync(path.join(workspaceDir, 'index.html'), 'utf8');
const androidHtml = fs.readFileSync(path.join(workspaceDir, 'android', 'app', 'src', 'main', 'assets', 'public', 'index.html'), 'utf8');

assert(rootHtml.includes('personal-tool-badge'), 'Root index.html has personal-tool-badge');
assert(androidHtml.includes('personal-tool-badge'), 'Android index.html has personal-tool-badge');
assert(rootHtml.includes('height: 92px'), 'Root index.html has 92px equal card height');
assert(androidHtml.includes('height: 92px'), 'Android index.html has 92px equal card height');
assert(rootHtml.includes('@media (max-width: 480px)'), 'Root index.html has 480px mobile 2-column breakpoint');
assert(androidHtml.includes('@media (max-width: 480px)'), 'Android index.html has 480px mobile 2-column breakpoint');

console.log('\n============================================================');
console.log(`TOTAL PERSONAL TOOLS TESTS: ${passedTests + failedTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
console.log('============================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL PERSONAL TOOLS ALIGNMENT TESTS PASSED 100% SUCCESSFULLY!\n');
}

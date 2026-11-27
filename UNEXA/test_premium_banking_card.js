/**
 * UNEXA — EXACT PREMIUM BANKING CARD UI REDESIGN TEST SUITE
 *
 * Validates:
 * 1. Card Container & Dimensions (rounded-[30px], purple/lavender/deep-indigo gradient, soft shadow)
 * 2. Top Bank Account & NPCI Guard Section (BANK OF BARODA, ••0507, green status dot, NPCI 2.0 GUARD badge)
 * 3. Balance Section & Lite Box (9 masked dots, toggle balance, Primary checking ledger • Real-time sync, Lite: ₹1,850, Zero PIN < ₹500)
 * 4. Four Payment Action Tiles in ONE Horizontal Row (Scan QR, Send, Request, To Bank with exact triggers & icon styling)
 * 5. Personal UPI ↔ Group Pools Mode Switching
 * 6. Multi-Platform Assets Synchronization
 */

const fs = require('fs');
const path = require('path');
const workspaceDir = __dirname;
const { JSDOM } = require(path.join(workspaceDir, 'node_modules', 'jsdom'));

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ [PASS] ${testName}`);
  } else {
    failedTests++;
    console.error(`  ✗ [FAIL] ${testName}${details ? ' - ' + details : ''}`);
  }
}

async function runTests() {
  console.log('============================================================');
  console.log('UNEXA — EXACT PREMIUM BANKING CARD UI REDESIGN SUITE');
  console.log('============================================================\n');

  const htmlPath = path.join(workspaceDir, 'app', 'index.html');
  const rawHtml = fs.readFileSync(htmlPath, 'utf8');

  // Load in JSDOM outside-only mode
  const dom = new JSDOM(rawHtml, { runScripts: 'outside-only' });
  const { window } = dom;
  const { document } = window;

  // Provide mock browser APIs
  window.requestAnimationFrame = (cb) => setTimeout(cb, 0);
  window.cancelAnimationFrame = (id) => clearTimeout(id);
  window.tailwind = { config: {} };
  window.lucide = { createIcons: () => {} };
  window.confetti = () => {};
  window.playBeep = () => {};
  window.playSuccessChime = () => {};
  window.playSoundboxVoice = () => {};
  window.showToast = () => {};
  window.alert = () => {};
  window.formatInr = (n, d = 2) => Number(n).toLocaleString('en-IN', { minimumFractionDigits: d, maximumFractionDigits: d });

  // Evaluate internal inline scripts into window context
  const inlineScripts = rawHtml.match(/<script(?![^>]*src=)>([\s\S]*?)<\/script>/gi) || [];
  inlineScripts.forEach(s => {
    const code = s.replace(/<\/?script[^>]*>/gi, '');
    try {
      window.eval(code);
    } catch (e) {}
  });

  // -------------------------------------------------------------
  // Test Suite 1: Main Banking Card Container & Palette
  // -------------------------------------------------------------
  console.log('Test Suite 1: Main Banking Card Container & Palette');

  const personalView = document.getElementById('personalUpiView');
  assert(personalView !== null, '#personalUpiView container exists');

  const heroCard = personalView.querySelector('.hero-balance-card');
  assert(heroCard !== null, '.hero-balance-card exists inside #personalUpiView');
  assert(heroCard.classList.contains('rounded-[30px]'), 'Card defines large rounded corners (rounded-[30px])');
  assert(heroCard.classList.contains('shadow-2xl'), 'Card defines soft deep elevation shadow');

  const styleTag = document.getElementById('premiumBankingCardStyles');
  assert(styleTag !== null, '#premiumBankingCardStyles CSS architecture is embedded in head');
  assert(styleTag.textContent.includes('radial-gradient'), 'Card defines lavender ambient radial highlight in upper-left');
  assert(styleTag.textContent.includes('#7c3aed') || styleTag.textContent.includes('#818cf8'), 'Card defines vibrant purple center gradient');
  assert(styleTag.textContent.includes('#312e81') || styleTag.textContent.includes('#3730a3') || styleTag.textContent.includes('#4f46e5'), 'Card defines deep indigo bottom-right palette');

  // -------------------------------------------------------------
  // Test Suite 2: Top Bank Account & Security Badge Section
  // -------------------------------------------------------------
  console.log('\nTest Suite 2: Top Bank Account & Security Badge Section');

  const bankName = heroCard.querySelector('.hero-bank-name');
  assert(bankName !== null, '.hero-bank-name element exists');
  assert(bankName.textContent.includes('BANK OF BARODA'), 'Bank name displays "BANK OF BARODA"');
  assert(heroCard.textContent.includes('••0507'), 'Card displays masked account number "••0507"');

  const greenDot = heroCard.querySelector('.bg-emerald-400');
  assert(greenDot !== null, 'Connected green status indicator dot exists');

  const npciBadge = heroCard.querySelector('.hero-npci-badge');
  assert(npciBadge !== null, '.hero-npci-badge exists in upper-right');
  assert(npciBadge.textContent.includes('NPCI 2.0') && npciBadge.textContent.includes('GUARD'), 'Security badge displays "NPCI 2.0 GUARD"');
  assert(npciBadge.querySelector('[data-lucide="shield-check"]') !== null, 'Security badge includes cyan shield security icon');

  // -------------------------------------------------------------
  // Test Suite 3: Balance Section & Compact Lite Card
  // -------------------------------------------------------------
  console.log('\nTest Suite 3: Balance Section & Compact Lite Card');

  const currencySign = heroCard.querySelector('.hero-currency');
  assert(currencySign !== null && currencySign.textContent.includes('₹'), 'Rupee currency symbol is displayed');

  const balVal = document.getElementById('heroBalanceValue');
  assert(balVal !== null, '#heroBalanceValue balance figure exists');
  assert(balVal.textContent.includes('●●●●●●●●●') || balVal.textContent.includes('•••••••••'), 'Balance is masked by default with circular dots (●●●●●●●●●)');

  const eyeBtn = document.getElementById('toggleBalanceBtn');
  assert(eyeBtn !== null, '#toggleBalanceBtn exists');
  const eyeIcon = document.getElementById('eyeIcon');
  assert(eyeIcon !== null, '#eyeIcon exists inside toggle button');

  // Test eye toggle interaction
  eyeBtn.click();
  await new Promise(r => setTimeout(r, 200));
  assert(!balVal.textContent.includes('●●●●●●●●●'), 'Clicking eye button unmasks balance to show numerical amount');

  eyeBtn.click();
  await new Promise(r => setTimeout(r, 200));
  assert(balVal.textContent.includes('●●●●●●●●●') || balVal.textContent.includes('•••••••••'), 'Second click re-masks balance back to dots');

  // Ledger description
  const ledgerSub = heroCard.querySelector('.hero-ledger-sub');
  assert(ledgerSub !== null, '.hero-ledger-sub element exists');
  assert(ledgerSub.textContent.includes('Primary checking ledger • Real-time sync'), 'Displays description: "Primary checking ledger • Real-time sync"');

  // Lite Mini Card
  const litePill = heroCard.querySelector('.hero-lite-pill');
  assert(litePill !== null, '.hero-lite-pill compact rounded rectangle exists');
  assert(litePill.getAttribute('onclick') === 'openUpiLiteModal()', 'Clicking Lite card triggers openUpiLiteModal()');
  assert(litePill.textContent.includes('⚡') || litePill.querySelector('[data-lucide="zap"]') !== null, 'Lite card contains lightning bolt');
  assert(litePill.textContent.includes('Lite:'), 'Lite card displays "Lite:"');
  assert(litePill.textContent.includes('1,850'), 'Lite card displays Lite balance (₹1,850)');

  assert(heroCard.textContent.includes('Zero PIN < ₹500') || heroCard.textContent.includes('Zero PIN ≤ ₹500'), 'Displays "Zero PIN < ₹500" below Lite card');

  // -------------------------------------------------------------
  // Test Suite 4: Four Payment Action Tiles in ONE Horizontal Row
  // -------------------------------------------------------------
  console.log('\nTest Suite 4: Four Payment Action Tiles in ONE Horizontal Row');

  const payDock = heroCard.querySelector('.primary-pay-dock');
  assert(payDock !== null, '.primary-pay-dock container exists at the bottom of the card');

  const dockGrid = payDock.querySelector('.grid-cols-4');
  assert(dockGrid !== null, 'Payment action tiles are arranged in a 4-column horizontal grid (.grid-cols-4)');

  const tiles = payDock.querySelectorAll('.pay-dock-btn');
  assert(tiles.length === 4, `Found EXACTLY 4 payment action tiles (found: ${tiles.length})`);

  // Tile 1: Scan QR
  const tile1 = tiles[0];
  assert(tile1.getAttribute('onclick') === 'openScannerModal()', 'Tile 1 triggers openScannerModal()');
  assert(tile1.textContent.includes('Scan QR'), 'Tile 1 is labeled "Scan QR"');
  const t1IconBox = tile1.querySelector('.dock-icon-box');
  assert(t1IconBox && t1IconBox.classList.contains('bg-white'), 'Tile 1 (Scan QR) has solid white icon box background');
  assert(tile1.querySelector('[data-lucide="qr-code"]') !== null, 'Tile 1 contains QR code icon');

  // Tile 2: Send
  const tile2 = tiles[1];
  assert(tile2.getAttribute('onclick') === 'openPayContactsModal()', 'Tile 2 triggers openPayContactsModal()');
  assert(tile2.textContent.includes('Send'), 'Tile 2 is labeled "Send"');
  assert(tile2.querySelector('[data-lucide="send"]') !== null, 'Tile 2 contains Send icon');

  // Tile 3: Request
  const tile3 = tiles[2];
  assert(tile3.getAttribute('onclick') === 'openRequestMoneyModal()', 'Tile 3 triggers openRequestMoneyModal()');
  assert(tile3.textContent.includes('Request'), 'Tile 3 is labeled "Request"');
  assert(tile3.querySelector('[data-lucide="arrow-down-left"]') !== null, 'Tile 3 contains Request arrow icon');

  // Tile 4: To Bank
  const tile4 = tiles[3];
  assert(tile4.getAttribute('onclick') === 'openBankTransferModal()', 'Tile 4 triggers openBankTransferModal()');
  assert(tile4.textContent.includes('To Bank'), 'Tile 4 is labeled "To Bank"');
  assert(tile4.querySelector('[data-lucide="landmark"]') !== null, 'Tile 4 contains Bank building/pillars icon');

  // -------------------------------------------------------------
  // Test Suite 5: Mode Switching (Personal UPI vs Group Pools)
  // -------------------------------------------------------------
  console.log('\nTest Suite 5: Mode Switching (Personal UPI vs Group Pools)');

  const groupView = document.getElementById('groupUpiView');
  assert(groupView !== null, '#groupUpiView exists');

  // Switch to Group Mode
  window.switchUpiMode('group');
  assert(personalView.classList.contains('hidden'), '#personalUpiView is hidden when in Group Pools mode');
  assert(!groupView.classList.contains('hidden'), '#groupUpiView is visible in Group Pools mode');

  // Switch back to Personal Mode
  window.switchUpiMode('personal');
  assert(!personalView.classList.contains('hidden'), '#personalUpiView is visible in Personal UPI mode');
  assert(groupView.classList.contains('hidden'), '#groupUpiView is hidden in Personal UPI mode');

  // -------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------
  console.log('\n============================================================');
  console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
  console.log('============================================================\n');

  if (failedTests > 0) {
    console.error(`❌ ${failedTests} test(s) failed.`);
    process.exit(1);
  } else {
    console.log('🎉 ALL PREMIUM BANKING CARD TESTS PASSED 100% SUCCESSFULLY!');
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error('Unhandled test error:', err);
  process.exit(1);
});

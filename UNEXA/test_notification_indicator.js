/**
 * Unexa Notification Indicator Behavior Test Suite
 * Validates:
 *   1. CSS Architecture, transitions, theme rings, and reduced motion.
 *   2. Initial dot visibility based on unseen state.
 *   3. Smooth fade-out animation classes and transition completion.
 *   4. Failure safety: notifications not marked seen if modal fails to open.
 *   5. Notification history preservation (zero data deletion).
 *   6. Dynamic real-time reappearance when new notifications arrive without reload.
 *   7. Cross-interface consistency (Personal UPI, Group Pools, Business Mode, Desktop).
 *   8. Multi-platform asset synchronization (app, root, android).
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
  console.log('UNEXA NOTIFICATION INDICATOR BEHAVIOR TEST SUITE');
  console.log('============================================================\n');

  const htmlPath = path.resolve('app/index.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');

  // --------------------------------------------------------------------------
  // TEST SUITE 1: CSS Architecture & Transitions
  // --------------------------------------------------------------------------
  console.log('Test Suite 1: CSS Architecture & Transitions');
  assert(htmlContent.includes('.notif-badge-dot {'), '.notif-badge-dot CSS class is defined');
  assert(htmlContent.includes('transition: opacity 240ms') || htmlContent.includes('transition: opacity'), 'Notification dot defines smooth opacity transition');
  assert(htmlContent.includes('will-change: opacity, transform'), 'Notification dot uses will-change optimization');
  assert(htmlContent.includes('.notif-badge-dot.notif-badge-visible'), '.notif-badge-visible state is defined');
  assert(htmlContent.includes('.notif-badge-dot.notif-badge-fading-out'), '.notif-badge-fading-out state is defined');
  assert(htmlContent.includes('.notif-badge-dot.notif-badge-hidden'), '.notif-badge-hidden state is defined');
  assert(htmlContent.includes('body.theme-light .notif-badge-dot'), 'Light theme adaptive box-shadow ring is defined');
  assert(htmlContent.includes('@media (prefers-reduced-motion: reduce)'), 'prefers-reduced-motion media query is defined for badge');

  // --------------------------------------------------------------------------
  // TEST SUITE 2: DOM Markup & Multi-Interface Bell Elements
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 2: DOM Markup & Multi-Interface Bell Elements');
  assert(htmlContent.includes('id="headerNotifBadge"'), '#headerNotifBadge exists in header');
  assert(htmlContent.includes('id="desktopNotifBadge"'), '#desktopNotifBadge exists in desktop controls');
  assert(htmlContent.includes('id="businessNotifBadge"'), '#businessNotifBadge exists in business header');
  assert(htmlContent.includes('id="notificationsContainer"'), '#notificationsContainer exists in notification modal');
  assert(htmlContent.includes('id="modalBusinessNotifications"'), '#modalBusinessNotifications exists in DOM');

  // Check desktop bell structure
  const desktopBellHasBellSpan = htmlContent.includes('<span class="relative inline-flex items-center justify-center">') &&
    htmlContent.includes('id="desktopNotifBadge"');
  assert(desktopBellHasBellSpan, 'Desktop bell wraps bell icon with relative container for zero layout shift');

  // --------------------------------------------------------------------------
  // TEST SUITE 3: Runtime State & Visibility Control
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 3: Runtime State & Indicator Visibility Control');

  const dom = new JSDOM(htmlContent, {
    url: 'http://localhost:3000',
    runScripts: 'dangerously',
    beforeParse(window) {
      window.tailwind = { config: {} };
    }
  });
  const { window } = dom;

  // Let scripts load
  await new Promise(r => setTimeout(r, 100));

  const {
    appState,
    renderNotificationBadge,
    openNotificationsModal,
    openBusinessNotificationsModal,
    markNotificationsAsSeen,
    markBusinessNotificationsAsSeen,
    addNotification,
    addBusinessNotification,
    fadeBadgeOut
  } = window;

  const headerBadge = window.document.getElementById('headerNotifBadge');
  const desktopBadge = window.document.getElementById('desktopNotifBadge');
  const businessBadge = window.document.getElementById('businessNotifBadge');

  assert(typeof renderNotificationBadge === 'function', 'renderNotificationBadge function exists on window');
  assert(typeof openNotificationsModal === 'function', 'openNotificationsModal function exists on window');
  assert(typeof markNotificationsAsSeen === 'function', 'markNotificationsAsSeen function exists on window');
  assert(typeof addNotification === 'function', 'addNotification function exists on window');

  // Test 3.1: When unread is true, dots are visible
  appState.hasUnreadNotifications = true;
  appState.hasUnreadBusinessNotifications = true;
  renderNotificationBadge();

  assert(headerBadge.classList.contains('notif-badge-visible'), 'headerNotifBadge has .notif-badge-visible when unread is true');
  assert(headerBadge.style.display !== 'none', 'headerNotifBadge is not display:none when unread is true');
  assert(desktopBadge.classList.contains('notif-badge-visible'), 'desktopNotifBadge has .notif-badge-visible when unread is true');
  assert(desktopBadge.style.display !== 'none', 'desktopNotifBadge is not display:none when unread is true');
  assert(businessBadge.classList.contains('notif-badge-visible'), 'businessNotifBadge has .notif-badge-visible when unread is true');

  // Test 3.2: When unread is false, dots are hidden
  appState.hasUnreadNotifications = false;
  appState.hasUnreadBusinessNotifications = false;
  renderNotificationBadge();

  assert(headerBadge.classList.contains('notif-badge-hidden'), 'headerNotifBadge has .notif-badge-hidden when unread is false');
  assert(headerBadge.style.display === 'none', 'headerNotifBadge has display:none when unread is false');
  assert(desktopBadge.classList.contains('notif-badge-hidden'), 'desktopNotifBadge has .notif-badge-hidden when unread is false');
  assert(desktopBadge.style.display === 'none', 'desktopNotifBadge has display:none when unread is false');
  assert(businessBadge.classList.contains('notif-badge-hidden'), 'businessNotifBadge has .notif-badge-hidden when unread is false');
  assert(businessBadge.style.display === 'none', 'businessNotifBadge has display:none when unread is false');

  // --------------------------------------------------------------------------
  // TEST SUITE 4: Smooth Fade-Out Animation on Opening Modal
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 4: Smooth Fade-Out Animation on Modal Open');

  // Reset to unread
  appState.hasUnreadNotifications = true;
  renderNotificationBadge();
  assert(headerBadge.classList.contains('notif-badge-visible'), 'Badges reset to visible before opening');

  // Open notifications modal
  const openSuccess = openNotificationsModal();
  assert(openSuccess === true, 'openNotificationsModal returns true on successful open');

  const modal = window.document.getElementById('modalNotifications');
  assert(modal.classList.contains('active'), 'modalNotifications has .active class');
  assert(appState.hasUnreadNotifications === false, 'appState.hasUnreadNotifications is set to false');
  assert(headerBadge.classList.contains('notif-badge-fading-out'), 'headerNotifBadge immediately receives .notif-badge-fading-out class');
  assert(!headerBadge.classList.contains('notif-badge-visible'), 'headerNotifBadge no longer has .notif-badge-visible class');

  // Wait for fade timeout (260ms fallback)
  await new Promise(r => setTimeout(r, 320));
  assert(headerBadge.classList.contains('notif-badge-hidden'), 'headerNotifBadge receives .notif-badge-hidden after transition completes');
  assert(headerBadge.style.display === 'none', 'headerNotifBadge is display:none after transition completes');
  assert(desktopBadge.classList.contains('notif-badge-hidden'), 'desktopNotifBadge receives .notif-badge-hidden after transition completes');

  // --------------------------------------------------------------------------
  // TEST SUITE 5: History Preservation (Zero Deletion)
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 5: Notification History Preservation');

  const notifContainer = window.document.getElementById('notificationsContainer');
  const cardsBefore = notifContainer ? notifContainer.querySelectorAll('.upi-card').length : 0;
  assert(cardsBefore >= 3, `Notification panel retains all pre-existing notification cards (${cardsBefore} found)`);
  assert(notifContainer.textContent.includes('Priya Sharma'), 'Retains Priya Sharma transaction notification in history');
  assert(notifContainer.textContent.includes('Goa Trip 2026'), 'Retains Goa Trip settlement alert in history');
  assert(notifContainer.textContent.includes('AI Scam Shield'), 'Retains AI Scam Shield report in history');

  // Close and re-open modal - cards should still remain
  window.closeModal('modalNotifications');
  assert(!modal.classList.contains('active'), 'modalNotifications is closed');
  openNotificationsModal();
  const cardsAfter = notifContainer.querySelectorAll('.upi-card').length;
  assert(cardsAfter === cardsBefore, `History count is unchanged on second modal opening (${cardsAfter} cards)`);
  window.closeModal('modalNotifications');

  // --------------------------------------------------------------------------
  // TEST SUITE 6: Failure Safety - Errors Do Not Mark Notifications As Seen
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 6: Failure Safety');

  // Set unread
  appState.hasUnreadNotifications = true;
  renderNotificationBadge();
  assert(headerBadge.classList.contains('notif-badge-visible'), 'Dot is visible before error test');

  // Temporarily alter modal ID to simulate missing modal
  const origId = modal.id;
  modal.id = 'tempModalChanged';

  const failedResult = openNotificationsModal();
  assert(failedResult === false, 'openNotificationsModal safely returns false when modal element is missing');
  assert(appState.hasUnreadNotifications === true, 'hasUnreadNotifications remains true when modal fails to open');
  assert(headerBadge.classList.contains('notif-badge-visible'), 'headerNotifBadge remains visible when modal fails to open');
  assert(!headerBadge.classList.contains('notif-badge-fading-out'), 'headerNotifBadge does not fade out when modal fails to open');

  // Restore modal ID
  modal.id = origId;

  // --------------------------------------------------------------------------
  // TEST SUITE 7: Immediate Real-Time Reappearance on New Incoming Notification
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 7: Real-Time Reappearance on Incoming Notification');

  // Mark all seen first
  markNotificationsAsSeen();
  await new Promise(r => setTimeout(r, 320));
  assert(headerBadge.classList.contains('notif-badge-hidden'), 'Dot is hidden before new incoming notification');

  // Push new notification
  const newNotif = addNotification({
    title: 'Instant Refund Processed',
    message: '₹ 1,200 refunded for canceled cab booking',
    type: 'payment'
  });

  assert(newNotif !== null, 'addNotification returns created notification object');
  assert(appState.hasUnreadNotifications === true, 'appState.hasUnreadNotifications is immediately true');
  assert(headerBadge.classList.contains('notif-badge-visible'), 'headerNotifBadge immediately has .notif-badge-visible without page reload');
  assert(headerBadge.style.display !== 'none', 'headerNotifBadge is immediately displayed without page reload');
  assert(desktopBadge.classList.contains('notif-badge-visible'), 'desktopNotifBadge immediately has .notif-badge-visible without page reload');

  // Verify newly added item appears at top of panel
  const firstCard = notifContainer.firstElementChild;
  assert(firstCard.textContent.includes('Instant Refund Processed'), 'New notification card prepended to panel history');

  // --------------------------------------------------------------------------
  // TEST SUITE 8: Business Mode Bell Consistency
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 8: Business Mode Bell Consistency');

  appState.hasUnreadBusinessNotifications = true;
  renderNotificationBadge();
  assert(businessBadge.classList.contains('notif-badge-visible'), 'businessNotifBadge is visible when business unread is true');

  const bizOpenSuccess = openBusinessNotificationsModal();
  assert(bizOpenSuccess === true, 'openBusinessNotificationsModal returns true');
  const bizModal = window.document.getElementById('modalBusinessNotifications');
  assert(bizModal.classList.contains('active'), 'modalBusinessNotifications has .active class');
  assert(appState.hasUnreadBusinessNotifications === false, 'hasUnreadBusinessNotifications set to false');
  assert(businessBadge.classList.contains('notif-badge-fading-out'), 'businessNotifBadge receives .notif-badge-fading-out');

  await new Promise(r => setTimeout(r, 320));
  assert(businessBadge.classList.contains('notif-badge-hidden'), 'businessNotifBadge hidden after fade-out transition');

  // Incoming business notification
  addBusinessNotification({
    title: 'Customer Tip Received',
    message: '₹ 50 received via Counter QR Standee'
  });
  assert(appState.hasUnreadBusinessNotifications === true, 'hasUnreadBusinessNotifications is true');
  assert(businessBadge.classList.contains('notif-badge-visible'), 'businessNotifBadge re-appears on new business notification');
  window.closeModal('modalBusinessNotifications');

  // --------------------------------------------------------------------------
  // TEST SUITE 9: Multi-Platform Asset Synchronization
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 9: Multi-Platform Assets Synchronization');

  const rootContent = fs.readFileSync(path.resolve('index.html'), 'utf8');
  const androidContent = fs.readFileSync(path.resolve('android/app/src/main/assets/public/index.html'), 'utf8');

  assert(rootContent.includes('.notif-badge-dot'), 'Root index.html has .notif-badge-dot');
  assert(androidContent.includes('.notif-badge-dot'), 'Android index.html has .notif-badge-dot');
  assert(rootContent.includes('id="businessNotifBadge"'), 'Root index.html has businessNotifBadge');
  assert(androidContent.includes('id="businessNotifBadge"'), 'Android index.html has businessNotifBadge');
  assert(rootContent.includes('id="notificationsContainer"'), 'Root index.html has notificationsContainer');
  assert(androidContent.includes('id="notificationsContainer"'), 'Android index.html has notificationsContainer');
  assert(rootContent.includes('openBusinessNotificationsModal'), 'Root index.html has openBusinessNotificationsModal');
  assert(androidContent.includes('openBusinessNotificationsModal'), 'Android index.html has openBusinessNotificationsModal');

  // Clean up timers
  if (window._unexaTimers && window._unexaTimers.clock) {
    clearInterval(window._unexaTimers.clock);
  }
  window.close();

  // Summary
  console.log('\n============================================================');
  console.log(`TOTAL NOTIFICATION INDICATOR TESTS: ${testsPassed + testsFailed} | PASSED: ${testsPassed} | FAILED: ${testsFailed}`);
  console.log('============================================================\n');

  if (testsFailed === 0) {
    console.log('🎉 ALL NOTIFICATION INDICATOR TESTS PASSED 100% SUCCESSFULLY!\n');
    process.exit(0);
  } else {
    console.error('❌ SOME NOTIFICATION INDICATOR TESTS FAILED!\n');
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});

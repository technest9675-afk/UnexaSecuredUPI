/**
 * UNEXA UNIFIED TEST RUNNER
 * Executes all 4 test suites:
 * 1. test_complete_flow.js (Phases 1 - 10)
 * 2. test_auth_security.js (Phase A & B Supabase Auth & Zero-Storage)
 * 3. test_security_phase.js (Security & Zero-Exposure Checks)
 * 4. test_supabase_features.js (Personal, Group, Business Supabase Operations)
 */

const { execSync } = require('child_process');

console.log('====================================================');
console.log('🚀 EXECUTING UNEXA UNIFIED TEST SUITE');
console.log('====================================================\n');

const suites = [
  { name: 'Critical Repairs & Performance (OTP, UI, Anti-Fake)', file: 'test_critical_repair.js' },
  { name: 'Complete Account Flow & Features (Phases 1-10)', file: 'test_complete_flow.js' },
  { name: 'Auth & Session Gate Security (Phases A & B)', file: 'test_auth_security.js' },
  { name: 'Database & Security Suite', file: 'test_security_phase.js' },
  { name: 'Supabase Features & Operations Suite', file: 'test_supabase_features.js' },
  { name: 'Profile Avatar & Responsive UI Suite', file: 'test_avatar_ui.js' },
  { name: 'Mode Selector & Tabs Alignment Suite', file: 'test_mode_selector.js' },
  { name: 'Account Overview UI & 2-Card Layout Suite', file: 'test_account_overview.js' },
  { name: 'Personal Tools Feature Grid & Animations Suite', file: 'test_personal_tools.js' },
  { name: 'Rewards & Cashbacks Banner Removal Suite', file: 'test_rewards_banner_removal.js' },
  { name: 'Enhanced Profile Card UI Suite', file: 'test_profile_card_ui.js' },
  { name: 'Notification Indicator Behavior & Transitions Suite', file: 'test_notification_indicator.js' },
  { name: 'Business Mode Optimization & Performance Benchmark', file: 'test_business_mode_performance.js' },
  { name: 'First-Time Registration & Bank Onboarding Flow', file: 'test_onboarding_flow.js' },
  { name: 'Redesigned Login Page UI Suite', file: 'test_login_page_ui.js' },
  { name: 'Personal Mode UI Redesign & EyeSecure AI Suite', file: 'test_personal_mode_redesign.js' },
  { name: 'Multilingual Voice Pay AI Engine Suite', file: 'test_voice_pay.js' },
  { name: 'Working Demo OTP & Transaction PIN 9675 Suite', file: 'test_demo_otp_and_pin.js' },
  { name: 'Exact Premium Banking Card UI Redesign Suite', file: 'test_premium_banking_card.js' },
  { name: 'Staff Salary Management & Payroll System Suite', file: 'test_staff_salary.js' }
];

let allPassed = true;

for (const suite of suites) {
  console.log(`\n▶ Running: ${suite.name} (${suite.file})...`);
  try {
    execSync(`node ${suite.file}`, { stdio: 'inherit' });
    console.log(`✔ Passed: ${suite.name}`);
  } catch (err) {
    console.error(`✖ Failed: ${suite.name}`);
    allPassed = false;
    process.exit(1);
  }
}

console.log('\n====================================================');
console.log('🎉 ALL TEST SUITES PASSED WITH 100% SUCCESS RATE!');
console.log('====================================================\n');

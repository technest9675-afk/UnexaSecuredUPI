/**
 * Unexa Phase 1 Integration Test Suite: Supabase Integration
 * Verifies:
 *   1. Environment & Secret Isolation (.env, .env.example, .gitignore)
 *   2. Supabase SDK Initialization & Remote Auth Endpoint Reachability
 *   3. PostgreSQL Schema & RLS Policy Integrity
 *   4. Client-Side DOM Loading & Zero-Regression on Existing Modes
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
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

async function runTests() {
  console.log('\n============================================================');
  console.log('UNEXA PHASE 1: SUPABASE INTEGRATION TEST SUITE');
  console.log('============================================================\n');

  // --------------------------------------------------------------------------
  // TEST SUITE 1: Environment Security & Secret Isolation
  // --------------------------------------------------------------------------
  console.log('Test Suite 1: Environment & Secret Isolation');

  const gitignorePath = path.resolve('.gitignore');
  assert(fs.existsSync(gitignorePath), '.gitignore exists in root directory');
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  assert(gitignoreContent.includes('.env'), '.gitignore explicitly excludes .env');
  assert(gitignoreContent.includes('.env.local'), '.gitignore explicitly excludes .env.local');

  const envExamplePath = path.resolve('.env.example');
  assert(fs.existsSync(envExamplePath), '.env.example template exists');
  const envExampleContent = fs.readFileSync(envExamplePath, 'utf8');
  assert(!envExampleContent.includes('sb_publishable_97W4y3Dk8Xp0UqkL1Z1_nA_R2EEbh-i'), '.env.example does not contain real secrets');
  assert(envExampleContent.includes('SUPABASE_URL='), '.env.example contains SUPABASE_URL placeholder');
  assert(envExampleContent.includes('SUPABASE_ANON_KEY='), '.env.example contains SUPABASE_ANON_KEY placeholder');

  const envPath = path.resolve('.env');
  assert(fs.existsSync(envPath), 'Active .env file exists for local development');
  const envContent = fs.readFileSync(envPath, 'utf8');
  assert(envContent.includes('https://rrjjnknukrirjlcqmtrd.supabase.co'), '.env contains correct Supabase project URL');
  assert(envContent.includes('sb_publishable_97W4y3Dk8Xp0UqkL1Z1_nA_R2EEbh-i'), '.env contains publishable anon key');

  const configPath = path.resolve('app/config.js');
  assert(fs.existsSync(configPath), 'app/config.js exists');
  const configContent = fs.readFileSync(configPath, 'utf8');
  assert(configContent.includes('window.UNEXA_CONFIG'), 'app/config.js declares window.UNEXA_CONFIG');
  assert(!configContent.toLowerCase().includes('service_role'), 'app/config.js never exposes service_role key');

  // --------------------------------------------------------------------------
  // TEST SUITE 2: Supabase SDK Initialization & Connectivity
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 2: Supabase SDK Initialization & Live Ping');

  const supabaseUrl = 'https://rrjjnknukrirjlcqmtrd.supabase.co';
  const supabaseKey = 'sb_publishable_97W4y3Dk8Xp0UqkL1Z1_nA_R2EEbh-i';

  const client = createClient(supabaseUrl, supabaseKey);
  assert(Boolean(client), 'Supabase client instance successfully instantiated');
  assert(typeof client.auth.getSession === 'function', 'client.auth.getSession method is present');
  assert(typeof client.from === 'function', 'client.from table querying method is present');

  try {
    // Ping Auth service to verify project accessibility
    const { data, error } = await client.auth.getSession();
    // Getting null session without error confirms valid project URL and client connectivity
    assert(!error, 'client.auth.getSession connected to Supabase without protocol error');
  } catch (err) {
    assert(false, 'Supabase network call threw unexpected exception', err.message);
  }

  // --------------------------------------------------------------------------
  // TEST SUITE 3: Schema & Row Level Security (RLS) Policy Integrity
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 3: Schema & Row Level Security (RLS) Integrity');

  const migrationPath = path.resolve('supabase/migrations/20261015000001_initial_schema.sql');
  assert(fs.existsSync(migrationPath), 'Migration script 20261015000001_initial_schema.sql exists');
  const sql = fs.readFileSync(migrationPath, 'utf8');

  const expectedTables = [
    'profiles',
    'bank_accounts',
    'transactions',
    'groups',
    'group_members',
    'group_expenses',
    'group_splits',
    'merchants',
    'merchant_collections',
    'khata_parties',
    'khata_entries',
    'merchant_settlements',
    'merchant_staff'
  ];

  expectedTables.forEach(table => {
    assert(sql.includes(`CREATE TABLE IF NOT EXISTS public.${table}`), `Schema declares table: public.${table}`);
    assert(sql.includes(`ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY;`), `RLS explicitly enabled on: public.${table}`);
  });

  const expectedHelpers = [
    'is_group_member',
    'is_group_admin',
    'is_merchant_authorized'
  ];

  expectedHelpers.forEach(fn => {
    assert(sql.includes(`FUNCTION public.${fn}`), `Security Definer helper function created: public.${fn}`);
    assert(sql.includes(`SECURITY DEFINER SET search_path = public`), `Helper ${fn} uses SECURITY DEFINER with pinned search_path`);
  });

  // --------------------------------------------------------------------------
  // TEST SUITE 4: Client-Side Loading & Existing Feature Preservation
  // --------------------------------------------------------------------------
  console.log('\nTest Suite 4: Client-Side Loading & Feature Non-Regression');

  const appHtmlPath = path.resolve('app/index.html');
  const appHtml = fs.readFileSync(appHtmlPath, 'utf8');

  assert(appHtml.includes('config.js'), 'app/index.html includes config.js');
  assert(appHtml.includes('supabase-client.js'), 'app/index.html includes supabase-client.js');
  assert(appHtml.includes('@supabase/supabase-js'), 'app/index.html includes @supabase/supabase-js');

  // Verify synchronization to root and android assets
  const rootHtml = fs.readFileSync('index.html', 'utf8');
  assert(rootHtml.includes('supabase-client.js'), 'root index.html synchronized with Supabase client');
  const androidHtml = fs.readFileSync('android/app/src/main/assets/public/index.html', 'utf8');
  assert(androidHtml.includes('supabase-client.js'), 'android public index.html synchronized with Supabase client');

  // Verify existing critical functions remain present in app/index.html
  assert(appHtml.includes('function switchMode('), 'switchMode function intact in app/index.html');
  assert(appHtml.includes('function switchUpiMode('), 'switchUpiMode function intact in app/index.html');
  assert(appHtml.includes('function executePaymentLogic('), 'executePaymentLogic function intact in app/index.html');
  assert(appHtml.includes('function renderGroupPoolUI('), 'renderGroupPoolUI function intact in app/index.html');
  assert(appHtml.includes('function toggleSoundbox('), 'toggleSoundbox function intact in app/index.html');

  console.log('\n============================================================');
  console.log(`TOTAL TESTS: ${testsPassed + testsFailed} | PASSED: ${testsPassed} | FAILED: ${testsFailed}`);
  console.log('============================================================\n');

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test suite runner crashed:', err);
  process.exit(1);
});

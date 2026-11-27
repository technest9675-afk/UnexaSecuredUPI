/**
 * Unexa Configuration Synchronizer
 * Reads .env file and generates safe client-side runtime config (app/config.js)
 * Excludes any private/service-role keys
 */
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env');
const configDestPath = path.resolve(__dirname, '../app/config.js');

let supabaseUrl = 'https://rrjjnknukrirjlcqmtrd.supabase.co';
let supabaseAnonKey = 'sb_publishable_97W4y3Dk8Xp0UqkL1Z1_nA_R2EEbh-i';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...values] = trimmed.split('=');
      const val = values.join('=').trim().replace(/^['"]|['"]$/g, '');
      if (key.trim() === 'SUPABASE_URL') supabaseUrl = val;
      if (key.trim() === 'SUPABASE_ANON_KEY') supabaseAnonKey = val;
    }
  });
}

const configContent = `/**
 * Unexa Runtime Client Configuration
 * Auto-generated from .env via scripts/sync-config.js
 * Contains only safe public anon key - DO NOT PUT SERVICE ROLE KEYS HERE
 */
window.UNEXA_CONFIG = {
  SUPABASE_URL: ${JSON.stringify(supabaseUrl)},
  SUPABASE_ANON_KEY: ${JSON.stringify(supabaseAnonKey)},
  IS_CONFIGURED: true
};
`;

fs.writeFileSync(configDestPath, configContent, 'utf8');
console.log('Successfully synchronized app/config.js from .env');

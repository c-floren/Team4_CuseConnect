// Quick connection check: `npm run db:check`.
// Reads .env.local the same way Vite does, then reads the clubs table.
import { loadEnv } from 'vite';
import { createClient } from '@supabase/supabase-js';

const env = loadEnv('development', process.cwd(), 'VITE_');
const url = env.VITE_SUPABASE_URL;
const anonKey = env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.error('✗ Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.');
  console.error('  Copy .env.example to .env.local and fill in both values.');
  process.exit(1);
}

const supabase = createClient(url, anonKey);
const { data, error } = await supabase.from('clubs').select('name').order('name');

if (error) {
  console.error(`✗ Connected, but reading clubs failed: ${error.message}`);
  console.error('  Has supabase/setup.sql been run in the SQL Editor?');
  process.exit(1);
}

console.log(`✓ Connected to ${new URL(url).host}`);
console.log(`✓ Found ${data.length} clubs: ${data.map((c) => c.name).join(', ')}`);

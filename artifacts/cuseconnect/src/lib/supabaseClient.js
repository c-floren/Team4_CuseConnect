import { createClient } from '@supabase/supabase-js';

/**
 * The one Supabase client for the whole app. Import it from here rather than
 * calling createClient() in each feature.
 *
 * Both values come from .env.local (git-ignored). See "Connecting to the
 * database" in the README. The anon key is safe in the browser — Row Level
 * Security in supabase/setup.sql decides what it can touch. Never put the
 * service_role key here.
 */
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. ' +
      'Copy .env.example to .env.local and fill in the values from the Supabase dashboard ' +
      '(Project Settings → API), then restart `npm run dev`.',
  );
}

export const supabase = createClient(url, anonKey);

import { isDemoMode } from '../../../lib/demoMode.js';
import { demoClubs } from './demoClubs.js';

const CLUB_COLUMNS = 'id, name, description, category, tags, meets';

/**
 * The only place that decides where clubs come from. Pages call this and
 * never check demo mode themselves.
 */
export async function getClubs() {
  if (isDemoMode()) {
    return demoClubs;
  }

  // Imported lazily: supabaseClient throws when the keys are missing, and
  // demo mode has to work without them.
  const { supabase } = await import('../../../lib/supabaseClient.js');
  const { data, error } = await supabase.from('clubs').select(CLUB_COLUMNS).order('name');

  if (error) {
    throw error;
  }
  return data;
}

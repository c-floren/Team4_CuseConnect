
import { isDemoMode } from '../../../lib/demoMode.js';
import { demoEvents } from './demoEvents.js';

/**
 * Retrieves upcoming events from demo data or Supabase.
 */
export async function getEvents() {
  if (isDemoMode()) {
    return demoEvents
      .filter((event) => new Date(event.event_date) >= new Date())
      .sort(
        (a, b) =>
          new Date(a.event_date) - new Date(b.event_date),
      );
  }

  const { supabase } = await import('../../../lib/supabaseClient.js');

  const { data, error } = await supabase
  .from('events')
  .select('id, title, description, event_date, location, club_id')
  .gte('event_date', new Date().toISOString())
  .order('event_date', { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

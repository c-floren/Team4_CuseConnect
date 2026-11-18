import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getEvents } from './getEvents.js';

// Our own sample events, so these tests don't break when demoEvents.js is
// edited. Deliberately out of date order to prove getEvents sorts them.
vi.mock('./demoEvents.js', () => ({
  demoEvents: [
    { id: 'later', event_date: '2026-03-20T19:00:00' },
    { id: 'past', event_date: '2026-03-01T18:00:00' },
    { id: 'sooner', event_date: '2026-03-12T09:00:00' },
    { id: 'right-now', event_date: '2026-03-10T12:00:00' },
  ],
}));

// A fake Supabase client: from().select().gte().order() resolves to whatever
// each test puts in `supabaseResult`. No network, no .env.local needed.
const { query, setSupabaseResult } = vi.hoisted(() => {
  let result = { data: [], error: null };
  const query = {
    from: vi.fn(() => query),
    select: vi.fn(() => query),
    gte: vi.fn(() => query),
    order: vi.fn(() => Promise.resolve(result)),
  };
  return { query, setSupabaseResult: (next) => (result = next) };
});

vi.mock('../../../lib/supabaseClient.js', () => ({ supabase: query }));

// "Today" is pinned so the tests give the same answer on any date.
// Only Date is faked; real timers keep the async code running normally.
const NOW = new Date('2026-03-10T12:00:00');

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('getEvents in demo mode', () => {
  beforeEach(() => vi.stubEnv('VITE_DEMO_MODE', 'true'));

  it('leaves out events that already happened', async () => {
    const ids = (await getEvents()).map((event) => event.id);

    expect(ids).not.toContain('past');
  });

  it('keeps an event that starts right now', async () => {
    const ids = (await getEvents()).map((event) => event.id);

    expect(ids).toContain('right-now');
  });

  it('returns events soonest first', async () => {
    const ids = (await getEvents()).map((event) => event.id);

    expect(ids).toEqual(['right-now', 'sooner', 'later']);
  });

  it('never calls Supabase', async () => {
    await getEvents();

    expect(query.from).not.toHaveBeenCalled();
  });
});

describe('getEvents with Supabase', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_DEMO_MODE', 'false');
    vi.clearAllMocks();
  });

  it('returns the rows Supabase sends back unchanged', async () => {
    const rows = [
      { id: 1, title: 'Robotics Workshop', club: { name: 'SU Robotics Club' } },
      { id: 2, title: 'Film Night', club: { name: 'Orange Filmworks' } },
    ];
    setSupabaseResult({ data: rows, error: null });

    expect(await getEvents()).toEqual(rows);
  });

  it('asks only for upcoming events, soonest first', async () => {
    setSupabaseResult({ data: [], error: null });

    await getEvents();

    expect(query.from).toHaveBeenCalledWith('events');
    expect(query.gte).toHaveBeenCalledWith('event_date', NOW.toISOString());
    expect(query.order).toHaveBeenCalledWith('event_date', { ascending: true });
  });

  it('throws the Supabase error so the page can show its error message', async () => {
    const error = new Error('permission denied for table events');
    setSupabaseResult({ data: null, error });
    vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(getEvents()).rejects.toBe(error);
  });
});

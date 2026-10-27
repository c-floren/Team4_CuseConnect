/**
 * Demo mode swaps every data source for local sample data, so demo and real
 * data are never mixed. Turn it on with VITE_DEMO_MODE=true in .env.local.
 *
 * A function rather than a constant so tests can flip it with vi.stubEnv().
 */
export function isDemoMode() {
  return import.meta.env.VITE_DEMO_MODE === 'true';
}

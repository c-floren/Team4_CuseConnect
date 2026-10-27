import { isDemoMode } from '../lib/demoMode.js';
import styles from './DemoBanner.module.css';

/** Shown on every page while demo mode is on, so sample data is never mistaken for real. */
export default function DemoBanner() {
  if (!isDemoMode()) {
    return null;
  }

  return (
    <p className={styles.banner} role="note">
      <strong>Demo mode:</strong> clubs shown are sample data, not an official SU list.
    </p>
  );
}

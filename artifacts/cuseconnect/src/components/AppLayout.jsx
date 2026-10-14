import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import styles from './AppLayout.module.css';

/**
 * The shell every page shares. React Router renders the current page into
 * <Outlet />, so the sidebar and top bar stay mounted between pages.
 */
export default function AppLayout() {
  return (
    <div className={styles.app}>
      <Sidebar />

      <div className={styles.main}>
        <header className={styles.topbar}>
          {/* Placeholder until sign-in gives us a real user. */}
          <div className={styles.avatar} aria-hidden="true">
            SO
          </div>
        </header>

        <Outlet />
      </div>
    </div>
  );
}

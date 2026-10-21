import { Link, NavLink } from 'react-router-dom';
import logo from '../assets/cuseconnect-logo.png';
import styles from './Sidebar.module.css';

/**
 * Pages without a `to` aren't built yet. They render as plain text rather than
 * as `href="#"` links, so nothing pretends to navigate somewhere it can't.
 */
const navItems = [
  { label: 'Home', to: '/', end: true },
  { label: 'Events' },
  { label: 'Saved Orgs' },
  { label: 'Forms' },
  { label: 'Friends' },
  { label: 'Quiz', to: '/quiz' },
];

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <Link className={styles.brand} to="/">
        <img className={styles.logo} src={logo} alt="CuseConnect home" />
      </Link>

      <nav aria-label="Main">
        <ul className={styles.navList}>
          {navItems.map(({ label, to, end }) => (
            <li key={label} className={to ? undefined : styles.unbuilt}>
              {to ? (
                // NavLink marks the current page with aria-current="page" and
                // changes routes without a reload, so quiz answers survive.
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
                  }
                >
                  {label}
                </NavLink>
              ) : (
                <span className={`${styles.navItem} ${styles.disabled}`}>
                  {label}
                  <span className={styles.soon}>Soon</span>
                </span>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

import { useEffect, useState } from 'react';
import { getClubs } from '../data/getClubs.js';
import OrgCard from '../components/OrgCard.jsx';
import styles from './OrganizationsPage.module.css';

export default function OrganizationsPage() {
  const [clubs, setClubs] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    // Skips the state update if the page unmounts before the request settles.
    let active = true;

    getClubs()
      .then((data) => active && setClubs(data))
      .catch(() => active && setFailed(true));

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Explore Clubs</h1>

      {failed ? (
        <p className={styles.message} role="alert">
          We couldn't load clubs right now. Try refreshing the page.
        </p>
      ) : !clubs ? (
        <p className={styles.message} role="status">
          Loading clubs…
        </p>
      ) : (
        <ul className={styles.grid}>
          {clubs.map((club) => (
            <li key={club.id}>
              <OrgCard name={club.name} description={club.description} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

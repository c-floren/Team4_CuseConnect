import { recommendations } from '../data/recommendations.js';
import OrgCard from '../components/OrgCard.jsx';
import styles from './OrganizationsPage.module.css';

export default function OrganizationsPage() {
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Your Quiz Recommendations</h1>

      <ul className={styles.grid}>
        {recommendations.map((org) => (
          <li key={org.id}>
            <OrgCard rank={org.rank} name={org.name} blurb={org.blurb} />
          </li>
        ))}
      </ul>
    </main>
  );
}

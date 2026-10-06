import { Link } from 'react-router-dom';
import styles from './ResultsPage.module.css';

/**
 * Placeholder only. Real matching and club cards are a separate story —
 * this exists so "See my matches →" has somewhere to land.
 */
export default function ResultsPage() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <p className={styles.eyebrow}>Results</p>
        <h1 className={styles.heading}>Your matches are coming soon</h1>
        <p className={styles.copy}>
          Thanks for finishing the quiz. Matching against real Syracuse clubs is
          still being built — this screen is a placeholder for now.
        </p>
        <Link className={styles.link} to="/quiz/1">
          Retake the quiz
        </Link>
      </div>
    </main>
  );
}

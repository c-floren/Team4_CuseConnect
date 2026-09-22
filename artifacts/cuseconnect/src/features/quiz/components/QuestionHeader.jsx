import styles from './QuestionHeader.module.css';

export default function QuestionHeader({ current, total, prompt, helper }) {
  return (
    <header className={styles.header}>
      <p className={styles.eyebrow}>
        Question {current} of {total}
      </p>

      <div className={styles.card}>
        <h1 className={styles.prompt}>{prompt}</h1>
        <p className={styles.helper}>{helper}</p>
      </div>
    </header>
  );
}

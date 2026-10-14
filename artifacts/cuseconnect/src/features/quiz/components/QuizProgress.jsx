import styles from './QuizProgress.module.css';

/**
 * The wireframe's top row: "Back" on the left and one progress segment per
 * question filling the rest. Every question is required, so there is no Skip —
 * QuizPage blocks forward navigation until the current question is answered.
 */
export default function QuizProgress({ current, total, onBack, canGoBack }) {
  const segments = Array.from({ length: total }, (_, index) => index + 1);

  return (
    <div className={styles.row}>
      <button
        type="button"
        className={styles.secondary}
        onClick={onBack}
        disabled={!canGoBack}
      >
        Back
      </button>

      <div
        className={styles.track}
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-label={`Question ${current} of ${total}`}
      >
        {segments.map((segment) => (
          <span
            key={segment}
            className={segment <= current ? styles.segmentFilled : styles.segment}
          />
        ))}
      </div>
    </div>
  );
}

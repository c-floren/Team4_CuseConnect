import styles from './QuizProgress.module.css';

/**
 * The wireframe's top row: "← Back" on the left, one progress segment per
 * question in the middle, "Skip" on the right.
 */
export default function QuizProgress({ current, total, onBack, onSkip, canGoBack }) {
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

      <button type="button" className={styles.secondary} onClick={onSkip}>
        Skip
      </button>
    </div>
  );
}

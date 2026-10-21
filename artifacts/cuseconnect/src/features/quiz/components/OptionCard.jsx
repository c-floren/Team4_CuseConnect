import Icon from './Icon.jsx';
import styles from './OptionCard.module.css';

/**
 * One selectable option card, matching the wireframe: square icon slot, label,
 * sublabel, and the control on the right edge.
 *
 * The control is a real <input>, visually hidden and wrapped in a <label>, so
 * the whole card is clickable and keyboard support (Space for checkboxes, arrow
 * keys within a radio group) comes free from the browser. The visible box or
 * circle is drawn by the sibling <span>, styled off the input's :checked state.
 */
export default function OptionCard({ option, type, name, checked, onChange }) {
  const inputType = type === 'multi' ? 'checkbox' : 'radio';

  return (
    <label className={styles.card}>
      <input
        className={`srOnly ${styles.input}`}
        type={inputType}
        name={name}
        value={option.id}
        checked={checked}
        onChange={() => onChange(option.id)}
      />

      <span className={styles.icon}>
        <Icon name={option.icon} />
      </span>

      <span className={styles.text}>
        <span className={styles.label}>{option.label}</span>
        <span className={styles.sublabel}>{option.sublabel}</span>
      </span>

      <span
        className={inputType === 'checkbox' ? styles.box : styles.circle}
        aria-hidden="true"
      />
    </label>
  );
}

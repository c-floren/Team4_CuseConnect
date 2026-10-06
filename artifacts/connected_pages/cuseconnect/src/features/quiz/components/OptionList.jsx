import OptionCard from './OptionCard.jsx';
import styles from './OptionList.module.css';

/**
 * Renders a question's options as a fieldset — two columns for 'grid'
 * questions, one for 'list'. The legend repeats the prompt for screen readers,
 * which otherwise only hear the individual option labels.
 */
export default function OptionList({ question, answer, onToggle }) {
  const isMulti = question.type === 'multi';

  const isChecked = (optionId) =>
    isMulti ? answer.includes(optionId) : answer === optionId;

  return (
    <fieldset className={styles.fieldset}>
      <legend className="srOnly">
        {question.prompt} — {question.helper}
      </legend>

      <div
        className={question.layout === 'grid' ? styles.grid : styles.list}
      >
        {question.options.map((option) => (
          <OptionCard
            key={option.id}
            option={option}
            type={question.type}
            name={question.id}
            checked={isChecked(option.id)}
            onChange={(optionId) => onToggle(optionId)}
          />
        ))}
      </div>
    </fieldset>
  );
}

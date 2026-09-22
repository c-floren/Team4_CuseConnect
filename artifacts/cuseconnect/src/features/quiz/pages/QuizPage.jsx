import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { quizQuestions } from '../data/quizQuestions.js';
import { useQuiz } from '../context/QuizContext.jsx';
import QuizProgress from '../components/QuizProgress.jsx';
import QuestionHeader from '../components/QuestionHeader.jsx';
import OptionList from '../components/OptionList.jsx';
import PrimaryButton from '../components/PrimaryButton.jsx';
import styles from './QuizPage.module.css';

const TOTAL = quizQuestions.length;

export default function QuizPage() {
  const { step } = useParams();
  const navigate = useNavigate();
  const { getAnswer, toggleAnswer, isAnswered } = useQuiz();

  // Which step failed validation, rather than a plain boolean: the message then
  // clears itself whenever the step changes, including via the URL bar.
  const [unansweredStep, setUnansweredStep] = useState(null);

  const stepNumber = Number(step);
  const isValidStep =
    Number.isInteger(stepNumber) && stepNumber >= 1 && stepNumber <= TOTAL;

  // Guards against /quiz/9 and /quiz/abc, which would otherwise index past the
  // end of the array and crash on an undefined question.
  if (!isValidStep) {
    return <Navigate to="/quiz/1" replace />;
  }

  const question = quizQuestions[stepNumber - 1];
  const isLastStep = stepNumber === TOTAL;
  const showError = unansweredStep === stepNumber;
  const errorId = `quiz-error-${stepNumber}`;

  // Continue stays enabled and explains itself on click. A disabled button
  // would give no reason, and keyboard users can skip past it entirely.
  const goForward = () => {
    if (!isAnswered(question.id)) {
      setUnansweredStep(stepNumber);
      return;
    }
    navigate(isLastStep ? '/results' : `/quiz/${stepNumber + 1}`);
  };

  const goBack = () => navigate(`/quiz/${stepNumber - 1}`);

  const handleToggle = (optionId) => {
    setUnansweredStep(null);
    toggleAnswer(question.id, optionId, question.type);
  };

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <QuizProgress
          current={stepNumber}
          total={TOTAL}
          canGoBack={stepNumber > 1}
          onBack={goBack}
        />

        <QuestionHeader
          current={stepNumber}
          total={TOTAL}
          prompt={question.prompt}
          helper={question.helper}
        />

        <OptionList
          question={question}
          answer={getAnswer(question.id, question.type)}
          onToggle={handleToggle}
        />

        {showError && (
          <p className={styles.error} id={errorId} role="alert">
            <span className={styles.errorMark} aria-hidden="true">
              !
            </span>
            {question.type === 'multi'
              ? 'Pick at least one option to continue.'
              : 'Choose an option to continue.'}
          </p>
        )}

        <PrimaryButton
          onClick={goForward}
          aria-describedby={showError ? errorId : undefined}
        >
          {isLastStep ? 'See my matches' : 'Continue'}
        </PrimaryButton>
      </div>
    </main>
  );
}

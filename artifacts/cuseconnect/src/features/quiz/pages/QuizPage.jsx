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

  const goForward = () =>
    navigate(isLastStep ? '/results' : `/quiz/${stepNumber + 1}`);

  const goBack = () => navigate(`/quiz/${stepNumber - 1}`);

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <QuizProgress
          current={stepNumber}
          total={TOTAL}
          canGoBack={stepNumber > 1}
          onBack={goBack}
          // Skip advances without recording an answer.
          onSkip={goForward}
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
          onToggle={(optionId) =>
            toggleAnswer(question.id, optionId, question.type)
          }
        />

        <PrimaryButton onClick={goForward} disabled={!isAnswered(question.id)}>
          {isLastStep ? 'See my matches' : 'Continue'}
        </PrimaryButton>
      </div>
    </main>
  );
}

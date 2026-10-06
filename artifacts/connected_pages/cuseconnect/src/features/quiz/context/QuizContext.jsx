import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const QuizContext = createContext(null);

/**
 * Holds the user's answers above the routes, so they survive navigating between
 * steps. This is what lets "← Back" return to a question with the earlier
 * selections still checked.
 *
 * Shape: { interests: ['arts', 'service'], workingStyle: 'small-team', ... }
 * — an array for 'multi' questions, a single id for 'single' questions.
 */
export function QuizProvider({ children }) {
  const [answers, setAnswers] = useState({});

  const toggleAnswer = useCallback((questionId, optionId, type) => {
    setAnswers((prev) => {
      if (type === 'single') {
        return { ...prev, [questionId]: optionId };
      }
      const current = prev[questionId] ?? [];
      const next = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
      return { ...prev, [questionId]: next };
    });
  }, []);

  const getAnswer = useCallback(
    (questionId, type) => {
      const value = answers[questionId];
      if (type === 'multi') return value ?? [];
      return value ?? null;
    },
    [answers],
  );

  const isAnswered = useCallback(
    (questionId) => {
      const value = answers[questionId];
      if (Array.isArray(value)) return value.length > 0;
      return Boolean(value);
    },
    [answers],
  );

  const resetQuiz = useCallback(() => setAnswers({}), []);

  const value = useMemo(
    () => ({ answers, toggleAnswer, getAnswer, isAnswered, resetQuiz }),
    [answers, toggleAnswer, getAnswer, isAnswered, resetQuiz],
  );

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used inside a <QuizProvider>');
  }
  return context;
}

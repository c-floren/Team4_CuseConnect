import { Navigate, Route, Routes } from 'react-router-dom';
import { QuizProvider } from './features/quiz/context/QuizContext.jsx';
import QuizPage from './features/quiz/pages/QuizPage.jsx';
import ResultsPage from './features/quiz/pages/ResultsPage.jsx';

export default function App() {
  return (
    // QuizProvider sits above <Routes> so answers persist across steps.
    <QuizProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/quiz/1" replace />} />
        <Route path="/quiz/:step" element={<QuizPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="*" element={<Navigate to="/quiz/1" replace />} />
      </Routes>
    </QuizProvider>
  );
}

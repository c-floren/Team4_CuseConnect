import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout.jsx';
import OrganizationsPage from './features/organizations/pages/OrganizationsPage.jsx';
import { QuizProvider } from './features/quiz/context/QuizContext.jsx';
import QuizPage from './features/quiz/pages/QuizPage.jsx';
import ResultsPage from './features/quiz/pages/ResultsPage.jsx';

export default function App() {
  return (
    // QuizProvider sits above <Routes> so answers persist across steps, and
    // across trips to other pages and back.
    <QuizProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<OrganizationsPage />} />
          <Route path="quiz" element={<Navigate to="/quiz/1" replace />} />
          <Route path="quiz/:step" element={<QuizPage />} />
          <Route path="results" element={<ResultsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </QuizProvider>
  );
}

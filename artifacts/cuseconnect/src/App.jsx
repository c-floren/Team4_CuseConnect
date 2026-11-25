
import LoginPage from './features/auth/pages/LoginPage.jsx';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout.jsx';
import { AuthProvider } from './features/auth/context/AuthContext.jsx';
import RegisterPage from './features/auth/pages/RegisterPage.jsx';
import { FavoritesProvider } from './features/organizations/context/FavoritesContext.jsx';
import OrganizationsPage from './features/organizations/pages/OrganizationsPage.jsx';
import SavedOrgsPage from './features/organizations/pages/SavedOrgsPage.jsx';
import { QuizProvider } from './features/quiz/context/QuizContext.jsx';
import QuizPage from './features/quiz/pages/QuizPage.jsx';
import ResultsPage from './features/quiz/pages/ResultsPage.jsx';
import EventsPage from './features/events/pages/EventsPage.jsx';

export default function App() {
  return (
    <AuthProvider>
      <QuizProvider>
        <FavoritesProvider>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />

            <Route element={<AppLayout />}>
              <Route index element={<OrganizationsPage />} />
              <Route path="events" element={<EventsPage />} />
              <Route path="saved" element={<SavedOrgsPage />} />
              <Route path="quiz" element={<Navigate to="/quiz/1" replace />} />
              <Route path="quiz/:step" element={<QuizPage />} />
              <Route path="results" element={<ResultsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </FavoritesProvider>
      </QuizProvider>
    </AuthProvider>
  );
}



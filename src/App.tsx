import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from '@/components/layout/Layout';
import LandingPage from '@/pages/LandingPage';
import DashboardPage from '@/pages/DashboardPage';
import SubmissionsPage from '@/pages/SubmissionsPage';
import SubmitAbstractPage from '@/pages/SubmitAbstractPage';
import ReviewsPage from '@/pages/ReviewsPage';
import SchedulePage from '@/pages/SchedulePage';
import RegistrationPage from '@/pages/RegistrationPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import SettingsPage from '@/pages/SettingsPage';
import LoginPage from '@/pages/LoginPage';

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#0f172a',
            borderRadius: '12px',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/submissions" element={<SubmissionsPage />} />
          <Route path="/submit" element={<SubmitAbstractPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

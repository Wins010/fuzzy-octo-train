import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import LandingPage from '@/pages/LandingPage';
import SubmissionsPage from '@/pages/SubmissionsPage';
import SubmitAbstractPage from '@/pages/SubmitAbstractPage';
import ReviewsPage from '@/pages/ReviewsPage';
import SchedulePage from '@/pages/SchedulePage';
import RegistrationPage from '@/pages/RegistrationPage';
import RegistrationOptionsPage from '@/pages/RegistrationOptionsPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import SettingsPage from '@/pages/SettingsPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ConferenceAgendaPage from '@/pages/ConferenceAgendaPage';
import { AdminDashboard, VolunteerDashboard, ReviewerDashboard, AuthorDashboard, AttendeeDashboard } from '@/pages/dashboards';
import { ScheduleManagementPage } from '@/pages/schedule-management';

function App() {
  const { user, isAuthenticated } = useAuth();

  // Redirect to role-specific dashboard
  const DashboardRedirect = () => {
    if (!isAuthenticated || !user) {
      return <Navigate to="/login" replace />;
    }
    
    const roleRoutes = {
      'Admin': '/dashboard/admin',
      'Volunteer': '/dashboard/volunteer',
      'Reviewer': '/dashboard/reviewer',
      'Author': '/dashboard/author',
      'Attendee': '/dashboard/attendee',
    };
    
    return <Navigate to={roleRoutes[user.role] || '/dashboard/attendee'} replace />;
  };

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
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/registration-options" element={<RegistrationOptionsPage />} />
        
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          {/* Redirect /dashboard to role-specific dashboard */}
          <Route path="/dashboard" element={<DashboardRedirect />} />
          
          {/* Role-specific dashboards */}
          <Route path="/dashboard/admin" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/volunteer" element={
            <ProtectedRoute allowedRoles={['Volunteer']}>
              <VolunteerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/reviewer" element={
            <ProtectedRoute allowedRoles={['Reviewer']}>
              <ReviewerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/author" element={
            <ProtectedRoute allowedRoles={['Author']}>
              <AuthorDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/attendee" element={
            <ProtectedRoute allowedRoles={['Attendee']}>
              <AttendeeDashboard />
            </ProtectedRoute>
          } />
          
          {/* Schedule Management (Admin only) */}
          <Route path="/schedule-management" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <ScheduleManagementPage />
            </ProtectedRoute>
          } />
          
          {/* Conference Agenda (All authenticated users) */}
          <Route path="/agenda" element={<ConferenceAgendaPage />} />
          
          {/* Existing routes */}
          <Route path="/submissions" element={<SubmissionsPage />} />
          <Route path="/submit" element={<SubmitAbstractPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

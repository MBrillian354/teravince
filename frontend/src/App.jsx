import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GlobalModal from './components/GlobalModal';
import RoleBasedRoute from './components/RoleBasedRoute';
import NewUserProtectedRoute from './components/NewUserProtectedRoute';
import { authService } from './utils/authService';
import Root from './components/Root';

// Auth imports
import SignUp from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';

// Protected imports
import Dashboard from './pages/protected/Dashboard';
import Profile from './pages/protected/Profile';

// Admin imports
import ManageJobs from './pages/admin/ManageJobs';
import NewJobForm from './pages/admin/NewJobForm';
import EditJobForm from './pages/admin/EditJobForm';
import ManageAccounts from './pages/admin/ManageAccounts';
import NewAccountForm from './pages/admin/NewAccountForm';
import EditAccount from './pages/admin/EditAccount';

// Supervisor imports
import MyStaffs from './pages/supervisor/MyStaffs.jsx';
import TeamReports from './pages/supervisor/TeamReports.jsx';
import JobDescription from './pages/supervisor/JobDescription';
import StaffReport from './pages/supervisor/StaffReport.jsx';
import StaffDetail from './pages/supervisor/StaffDetail.jsx';

// Staff imports
import TasksPage from './pages/protected/TasksPage';
import NewTaskForm from './pages/staff/NewTaskForm';
import EditTaskForm from './pages/staff/EditTaskForm';
import ViewTask from './pages/staff/ViewTask.jsx';

// Public imports
import PrivacyPolicy from './pages/public/PrivacyPolicy.jsx';
import TermsAndConditions from './pages/public/TermsAndConditions.jsx';
import CookiePolicy from './pages/public/CookiePolicy.jsx';
import SimpleModalDemo from './components/SimpleModalDemo';

import NewUserRoleConfirmation from './pages/public/NewUserRoleConfirmation';
import NewUserJobConfirmation from './pages/public/NewUserJobConfirmation';
import ManageTasks from './pages/staff/ManageTasks';
import SupervisorReviewingAndApprovalOfTask from './pages/supervisor/SupervisorReviewingAndApprovalOfTask';
import JobDetails from './pages/supervisor/JobDetails';
import TeamTasks from './pages/supervisor/TeamTasks';
import StatusBadgeDemo from './components/StatusBadgeDemo';
import OAuthSuccess from './pages/auth/OauthSuccess';

// Auth Routes Component
function AuthRoutes() {
  return (
    <>
      <Route path="/" element={<Root />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/oauth-callback" element={<OAuthSuccess />} />
    </>
  );
}

// Protected Routes Component (Dashboard and Profile)
function ProtectedRoutes() {
  return (
    <>
      <Route path="/dashboard" element={
        <RoleBasedRoute>
          <Dashboard />
        </RoleBasedRoute>
      } />
      <Route path="/profile" element={
        <RoleBasedRoute>
          <Profile />
        </RoleBasedRoute>
      } />
      <Route path="/tasks" element={
        <RoleBasedRoute allowedRoles={['staff']}>
          <ManageTasks />
        </RoleBasedRoute>
      } />
    </>
  );
}

// Admin Routes Component
function AdminRoutes() {
  return (
    <>
      <Route path="/jobs" element={
        <RoleBasedRoute allowedRoles={['admin', 'supervisor']}>
          <ManageJobs />
        </RoleBasedRoute>
      } />
      <Route path="/jobs/new" element={
        <RoleBasedRoute allowedRoles={['admin']}>
          <NewJobForm />
        </RoleBasedRoute>
      } />
      <Route path="/jobs/:id/edit" element={
        <RoleBasedRoute allowedRoles={['admin']}>
          <EditJobForm />
        </RoleBasedRoute>
      } />
      <Route path="/accounts" element={
        <RoleBasedRoute allowedRoles={['admin']}>
          <ManageAccounts />
        </RoleBasedRoute>
      } />
      <Route path="/accounts/new" element={
        <RoleBasedRoute allowedRoles={['admin']}>
          <NewAccountForm />
        </RoleBasedRoute>
      } />
      <Route path="/accounts/:id/edit" element={
        <RoleBasedRoute allowedRoles={['admin']}>
          <EditAccount />
        </RoleBasedRoute>
      } />
    </>
  );
}

// Supervisor Routes Component
function SupervisorRoutes() {
  return (
    <>
      <Route path="/dashboard/staffs" element={
        <RoleBasedRoute allowedRoles={['supervisor']}>
          <MyStaffs />
        </RoleBasedRoute>
      } />
      <Route path="/dashboard/staffs/:id" element={
        <RoleBasedRoute allowedRoles={['supervisor']}>
          <StaffDetail />
        </RoleBasedRoute>
      } />
      <Route path="/reports/" element={
        <RoleBasedRoute allowedRoles={['supervisor']}>
          <TeamReports />
        </RoleBasedRoute>
      } />
      <Route path="/reports/job-description" element={
        <RoleBasedRoute allowedRoles={['supervisor']}>
          <JobDescription />
        </RoleBasedRoute>
      } />
      <Route path="/reports/job-description/:jobId" element={
        <RoleBasedRoute allowedRoles={['supervisor']}>
          <JobDetails />
        </RoleBasedRoute>
      } />
      <Route path="/reports/tasks" element={
        <RoleBasedRoute allowedRoles={['supervisor']}>
          <TeamTasks />
        </RoleBasedRoute>
      } />
      <Route path="/reports/tasks/:taskId" element={
        <RoleBasedRoute allowedRoles={['supervisor']}>
          <SupervisorReviewingAndApprovalOfTask />
        </RoleBasedRoute>
      } />
      <Route path="/report/:reportId" element={
        <RoleBasedRoute allowedRoles={['supervisor']}>
          <StaffReport />
        </RoleBasedRoute>
      } />
    </>
  );
}

// Staff Routes Component
function StaffRoutes() {
  return (
    <>
      <Route path="/tasks/new" element={
        <RoleBasedRoute allowedRoles={['staff']}>
          <NewTaskForm />
        </RoleBasedRoute>
      } />
      <Route path="/tasks/:id" element={
        <RoleBasedRoute allowedRoles={['staff']}>
          <ViewTask />
        </RoleBasedRoute>
      } />
      <Route path="/tasks/:id/edit" element={
        <RoleBasedRoute allowedRoles={['staff']}>
          <EditTaskForm />
        </RoleBasedRoute>
      } />

    </>
  );
}

// Public Routes Component (Legal pages)
function PublicRoutes() {
  return (
    <>
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsAndConditions />} />
      <Route path="/cookies" element={<CookiePolicy />} />
      <Route path="/demo" element={<StatusBadgeDemo />} />
      <Route path="/role-confirm" element={
        <NewUserProtectedRoute>
          <NewUserRoleConfirmation />
        </NewUserProtectedRoute>
      } />
      <Route path="/job-confirm" element={
        <NewUserProtectedRoute>
          <NewUserJobConfirmation />
        </NewUserProtectedRoute>
      } />
    </>
  );
}


function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check authentication status whenever the route changes
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
    };

    checkAuth();

    // Listen for storage events to handle login/logout in other tabs
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-gray-900 font-inter">
      {/* Show navbar only when user is authenticated and not on confirmation pages */}
      {isAuthenticated &&
        !location.pathname.includes('/role-confirm') &&
        !location.pathname.includes('/job-confirm') &&
        <Navbar />}

      <main className="flex-1 p-4 md:max-w-6xl mx-auto w-full">
        <Routes>

          {/* Auth Routes */}
          {AuthRoutes()}

          {/* Protected Routes */}
          {ProtectedRoutes()}

          {/* Admin Routes */}
          {AdminRoutes()}

          {/* Supervisor Routes */}
          {SupervisorRoutes()}

          {/* Staff Routes */}
          {StaffRoutes()}

          {/* Public Routes */}
          {PublicRoutes()}

        </Routes>
      </main>

      <Footer />

      {/* Global Modal */}
      <GlobalModal />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

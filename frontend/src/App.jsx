import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GlobalModal from './components/GlobalModal';
import RoleBasedRoute from './components/RoleBasedRoute';
import NewUserProtectedRoute from './components/NewUserProtectedRoute';
import { authService } from './utils/authService';
import Root from './components/Root';

import SignUp from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';

import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import TasksPage from './pages/TasksPage';
import ManageJobs from './pages/ManageJobs';
import NewJobForm from './pages/NewJobForm';
import EditJobForm from './pages/EditJobForm';
import ManageAccounts from './pages/ManageAccounts';
import NewAccountForm from './pages/NewAccountForm';
import EditAccount from './pages/EditAccount';
import MyStaffs from './pages/MyStaffs.jsx';
import Reports from './pages/Reports.jsx';
import JobDescription from './pages/JobDescription';
import StaffReport from './pages/StaffReport.jsx';
import NewTaskForm from './pages/NewTaskForm';
import EditTaskForm from './pages/EditTaskForm';
import ViewTask from './pages/ViewTask.jsx';

import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import TermsAndConditions from './pages/TermsAndConditions.jsx';
import CookiePolicy from './pages/CookiePolicy.jsx';
import SimpleModalDemo from './components/SimpleModalDemo';

import NewUserRoleConfirmation from './pages/NewUserRoleConfirmation';
import NewUserJobConfirmation from './pages/NewUserJobConfirmation';
import ManageTasks from './pages/ManageTasks';
import Tasks from './pages/Tasks';

// Auth Routes Component
function AuthRoutes() {
  return (
    <>
      <Route path="/" element={<Root />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
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
      <Route path="/reports/overview" element={
        <RoleBasedRoute allowedRoles={['supervisor']}>
          <Reports />
        </RoleBasedRoute>
      } />
      <Route path="/reports/job-description" element={
        <RoleBasedRoute allowedRoles={['supervisor']}>
          <JobDescription />
        </RoleBasedRoute>
      } />
      <Route path="/reports/tasks" element={
        <RoleBasedRoute allowedRoles={['supervisor']}>
          <Tasks />
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
      <Route path="/demo" element={<SimpleModalDemo />} />
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

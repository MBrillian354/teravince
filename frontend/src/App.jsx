import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import StaffNavbar from './components/StaffNavbar';
import Footer from './components/Footer';

import SignIn from './pages/Signin';
import SignUp from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';

import AdminDashboard from './pages/AdminDashboard';
import ManageJobs from './pages/ManageJobs';
import NewJobForm from './pages/NewJobForm';
import ManageAccounts from './pages/ManageAccounts';
import NewAccountForm from './pages/NewAccountForm';

import SPVDashboard from './pages/SPVDashboard.jsx';
import MyProfile from './pages/MyProfile.jsx';
import MyStaffs from './pages/MyStaffs.jsx';
import Reports from './pages/Reports.jsx';
import JobDescription from './pages/JobDescription';
import Tasks from './pages/Tasks.jsx';
import StaffReport from './pages/StaffReport.jsx';

import StaffDashboard from './pages/StaffDashboard';
import MyProfileStaff from './pages/StaffMyProfile.jsx';
import StaffTasks from './pages/StaffTasks.jsx';
import AddTask from './pages/AddTask';
import EditTask from './pages/EditTask';
import ViewTask from './pages/ViewTask.jsx';

import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import TermsAndConditions from './pages/TermsAndConditions.jsx';
import CookiePolicy from './pages/CookiePolicy.jsx';

import RoleConfirmation from './pages/RoleConfirmation';
import JobTitleConfirmation from './pages/JobTitleConfirmation';

function AppContent() {
  const [hideNavbar, setHideNavbar] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const pathsToHideNavbar = ['/', '/signup', '/forgot-password'];
    const shouldHide = pathsToHideNavbar.includes(location.pathname.toLowerCase());
    setHideNavbar(shouldHide);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-gray-900 font-inter">
      {/* Navbar logic based on route */}
      {!hideNavbar && (
        location.pathname.startsWith('/staff')
          ? <StaffNavbar />
          : <Navbar />
      )}

      <main className="flex-1 p-4 md:max-w-6xl mx-auto w-full">
        <Routes>
          {/* Auth */}
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Admin */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-jobs" element={<ManageJobs />} />
          <Route path="/admin-jobs/new" element={<NewJobForm />} />
          <Route path="/admin-accounts" element={<ManageAccounts />} />
          <Route path="/admin-accounts/new" element={<NewAccountForm />} />

          {/* Supervisor */}
          <Route path="/spv-dashboard" element={<SPVDashboard />} />
          <Route path="/spv-profile" element={<MyProfile />} />
          <Route path="/spv-staffs" element={<MyStaffs />} />
          <Route path="/spv-tasks" element={<Tasks />} />
          <Route path="/spv-reports" element={<Reports />} />
          <Route path="/spv-jobs" element={<JobDescription />} />
          <Route path="/spv-report/:reportId" element={<StaffReport />} />

          {/* Staff */}
          <Route path="/staff-dashboard" element={<StaffDashboard />} />
          <Route path="/staff-profile" element={<MyProfileStaff />} />
          <Route path="/staff-tasks" element={<StaffTasks />} />
          <Route path="/staff/add-task" element={<AddTask />} />
          <Route path="/staff/edit-task/:id" element={<EditTask />} />
          <Route path="/staff/view-task/:id" element={<ViewTask />} />

          {/* Legal */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/cookies" element={<CookiePolicy />} />
          <Route path="/role-confirm" element={<RoleConfirmation />} />
          <Route path="/job-title" element={<JobTitleConfirmation />} />
        </Routes>
      </main>

      <Footer />
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

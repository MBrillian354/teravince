
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar';
import SPVDashboard from './pages/SPVDashboard.jsx';
import MyProfile from './pages/MyProfile.jsx';
import MyStaffs from './pages/MyStaffs.jsx';
import Footer from './components/Footer.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import TermsAndConditions from './pages/TermsAndConditions.jsx';
import CookiePolicy from './pages/CookiePolicy.jsx';

import AdminDashboard from './pages/AdminDashboard'
import SignIn from './pages/Signin'
import SignUp from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import JobsView from './pages/JobsView'
import AccountsView from './pages/AccountsView'

function AppContent() {
  const [hideNavbar, setHideNavbar] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const pathsToHideNavbar = ['/', '/signup', '/forgot-password']
    const shouldHide = pathsToHideNavbar.includes(location.pathname.toLowerCase())
    setHideNavbar(shouldHide)
  }, [location.pathname])


  return (
    <div className='min-h-screen bg-background text-gray-900 font-inter max-w-6xl mx-auto'>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/jobs" element={<JobsView />} />
        <Route path="/accounts" element={<AccountsView />} />

        <Route path="/spv-dashboard" element={<SPVDashboard />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/staffs" element={<MyStaffs />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/cookies" element={<CookiePolicy />} />
      </Routes>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App;
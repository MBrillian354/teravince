import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
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
      </Routes>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App

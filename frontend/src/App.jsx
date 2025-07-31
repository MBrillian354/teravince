import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import SignIn from './pages/Signin'
import SignUp from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
function App() {
  const hideNavbar = window.location.pathname.toLowerCase() === '/signin' || window.location.pathname.toLowerCase() === '/signup' || window.location.pathname.toLowerCase() === '/forgot-password';
  return (
    <Router>
      <div>
        {!hideNavbar && <Navbar />}
        <Routes>
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Signin" element={<SignIn />} />
          <Route path="/Signup" element={<SignUp />} />
          <Route path="/Forgot-Password" element={<ForgotPassword />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import StaffView from './pages/StaffView'
import SignIn from './pages/Signin'

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/staff" element={<StaffView />} />
          <Route path="/Signin" element={<SignIn />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import StaffView from './pages/StaffView'
import JobsView from './pages/JobsView'
import AccountsView from './pages/AccountsView'

function App() {
  return (
    <Router>
      <Navbar />
      <div className='min-h-screen bg-background text-gray-900 font-inter max-w-6xl mx-auto'>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/jobs" element={<JobsView />} />
          <Route path="/accounts" element={<AccountsView />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

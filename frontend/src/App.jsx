import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import StaffView from './pages/StaffView'

function App() {
  return (
    <Router>
      <Navbar />
      <div className='min-h-screen bg-background text-gray-900 font-inter max-w-6xl mx-auto'>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/staff" element={<StaffView />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

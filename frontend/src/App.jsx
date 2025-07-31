import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/spvDashboard';
import MyProfile from './components/myProfile.jsx';
import MyStaffs from './components/myStaffs';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-1 p-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<MyProfile />} />
          <Route path="/staffs" element={<MyStaffs />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
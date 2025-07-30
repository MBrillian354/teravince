import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/spvDashboard';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-1 p-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
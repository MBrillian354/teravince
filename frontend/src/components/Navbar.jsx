import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-700">TeraVince</h1>
        <nav className="space-x-3 text-sm">
          <NavLink to="/" className="hover:text-indigo-500">Dashboard</NavLink>
          <NavLink to="/profile" className="hover:text-indigo-500">My Profile</NavLink>
          <NavLink to="/tasks" className="hover:text-indigo-500">Tasks & Reports</NavLink>
        </nav>
        <button className="text-gray-600 hover:text-gray-800 text-sm">Log Out</button>
      </div>
    </header>
  );
}
import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
    const navigationItems = [
        { path: "/", label: "Sign In" },
        { path: "/admin-dashboard", label: "(Admin) Dashboard" },
        { path: "/jobs", label: "(Admin) Jobs & Descriptions" },
        { path: "/accounts", label: "(Admin) Accounts" }
    ];

    return (
        <header className="bg-white shadow">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <h1 className="text-xl font-bold text-indigo-700">TeraVince</h1>
                <nav className="space-x-3 text-sm">
                    {navigationItems.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className="hover:text-indigo-500"
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
                <button className="text-gray-600 hover:text-gray-800 text-sm">Log Out</button>
            </div>
        </header>
    );
}
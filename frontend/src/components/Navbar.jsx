import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
    const navigationItems = [
        { path: "/", label: "Sign In" },
        { path: "/admin-dashboard", label: "(Admin) Dashboard" },
        { path: "/admin-jobs", label: "(Admin) Jobs & Descriptions" },
        { path: "/admin-accounts", label: "(Admin) Accounts" },
        { path: "/spv-dashboard", label: "(Supervisor) Dashboard" },
        { path: "/spv-profile", label: "(Supervisor) My Profiles" },
        { path: "/spv-tasks", label: "(Supervisor) Tasks & Reports" },
    ];

    return (
        <header className="bg-white shadow mb-8">
            <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h1 className="text-xl font-bold text-indigo-700">TeraVince</h1>
                <nav className="flex flex-wrap justify-center sm:justify-end gap-2 text-sm max-w-full overflow-x-auto">
                    {navigationItems.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className="hover:text-indigo-500 px-2 py-1 whitespace-nowrap border-x border-gray-200"
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
                <button className="text-gray-600 hover:text-gray-800 text-sm min-w-max px-2 py-1">Log Out</button>
            </div>
        </header>
    );
}
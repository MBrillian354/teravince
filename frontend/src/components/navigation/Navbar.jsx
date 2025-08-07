import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { authService } from '../../utils/authService';

export default function Navbar() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const user = authService.getStoredUser();
    const userRole = user?.role?.toLowerCase();

    const handleLogout = () => {
        authService.logout();
        navigate('/');
    };

    const roleNavItems = {
        admin: [
            { path: "/dashboard", label: "Dashboard" },
            { path: "/jobs", label: "Jobs & Descriptions" },
            { path: "/accounts", label: "Accounts" },
            { path: "/profile", label: "Profile" }
        ],
        supervisor: [
            { path: "/dashboard", label: "Dashboard" },
            { path: "/profile", label: "My Profile" },
            { path: "/reports/", label: "Tasks & Reports" },
        ],
        staff: [
            { path: "/dashboard", label: "Dashboard" },
            { path: "/tasks", label: "Tasks" },
            { path: "/profile", label: "Profile" }
        ]
    };

    const navigationItems = roleNavItems[userRole] || [];

    return (
        <header className="bg-primary text-white shadow mb-8">
            <div className="max-md:hidden container max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
                <img
                    src="/teravince_white.png" 
                    alt="TeraVince Logo"
                    className="h-10 w-auto"
                />
                <nav className="flex justify-center md:justify-end gap-2 max-w-full overflow-x-auto">
                    {navigationItems.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `px-2 py-1 whitespace-nowrap ${isActive
                                    ? 'text-white-700 font-semibold'
                                    : 'text-gray-200 hover:text-white-500'
                                }`
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
                <button
                    onClick={handleLogout}
                    className="btn-outline hover:bg-white/20"
                >
                    Log Out
                </button>
            </div>

            <div className="md:hidden flex w-full justify-between items-center px-4 py-3 ">
                <h1 className="text-xl font-bold text-white-700">TeraVince</h1>
                {/* Hamburger menu for mobile */}
                <button
                    className="text-white focus:outline-none transition-transform duration-200 ease-in-out"
                    aria-label="Toggle navigation menu"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <svg
                        width="28"
                        height="28"
                        fill="none"
                        viewBox="0 0 24 24"
                        className={`transform transition-transform duration-200 ${menuOpen ? 'rotate-90' : ''}`}
                    >
                        {menuOpen ? (
                            <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12" />
                        ) : (
                            <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Navigation Menu */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                <nav className="px-4 py-4 bg-primary border-t border-white/10">
                    <div className="flex flex-col space-y-3">
                        {navigationItems.map((item, index) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setMenuOpen(false)}
                                className={({ isActive }) =>
                                    `px-3 py-2 rounded-md text-left transition-all duration-200 transform ${isActive
                                        ? 'text-white font-semibold bg-white/10'
                                        : 'text-gray-200 hover:text-white hover:bg-white/5'
                                    }`
                                }
                                style={{
                                    animationDelay: menuOpen ? `${index * 50}ms` : '0ms'
                                }}
                            >
                                {item.label}
                            </NavLink>
                        ))}
                        <button
                            onClick={() => {
                                handleLogout();
                                setMenuOpen(false);
                            }}
                            className="px-3 py-2 text-left text-gray-200 hover:text-white hover:bg-white/5 rounded-md transition-all duration-200"
                            style={{
                                animationDelay: menuOpen ? `${navigationItems.length * 50}ms` : '0ms'
                            }}
                        >
                            Log Out
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
}
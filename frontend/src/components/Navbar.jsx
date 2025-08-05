import { NavLink, useNavigate } from 'react-router-dom';
import { authService } from '../utils/authService';

export default function Navbar() {
    const navigate = useNavigate();
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
        <header className="bg-white shadow mb-8">
            <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h1 className="text-xl font-bold text-indigo-700">TeraVince</h1>
                <nav className="flex max-lg:flex-col justify-center sm:justify-end gap-2 text-sm max-w-full overflow-x-auto">
                    {navigationItems.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `px-2 py-1 whitespace-nowrap ${isActive
                                    ? 'text-indigo-700 font-semibold'
                                    : 'text-gray-600 hover:text-indigo-500'
                                }`
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
                <button
                    onClick={handleLogout}
                    className="btn-outline"
                >
                    Log Out
                </button>
            </div>
        </header>
    );
}
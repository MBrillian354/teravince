import { NavLink, useLocation } from 'react-router-dom';

export default function Navbar() {
    const location = useLocation()

    const isStaffRoute = location.pathname.startsWith('/staff')
    const isAdminRoute = location.pathname.startsWith('/admin');
    const isSupervisorRoute = location.pathname.startsWith('/spv');

    const getCurrentRole = () => {
        if (isAdminRoute) return 'admin';
        if (isSupervisorRoute) return 'supervisor';
        if (isStaffRoute) return 'staff';
        return 'public';
    };

    const roleNavItems = {
        public: [
        ],
        admin: [
            { path: "/admin-dashboard", label: "(Admin) Dashboard" },
            { path: "/admin-jobs", label: "(Admin) Jobs & Descriptions" },
            { path: "/admin-accounts", label: "(Admin) Accounts" }
        ],
        supervisor: [
            { path: "/spv-dashboard", label: "(Supervisor) Dashboard" },
            { path: "/spv-profile", label: "(Supervisor) My Profile" },
            { path: "/spv-tasks", label: "(Supervisor) Tasks & Reports" }
        ],
        staff: [
            { path: "/staff-dashboard", label: "(Staff) Dashboard" },
            { path: "/staff-tasks", label: "(Staff) Tasks" },
            // { path: "/staff-analytics", label: "(Staff) Analytics" },
            { path: "/staff-profile", label: "(Staff) Profile" }
        ]
    };

    const navigationItems = roleNavItems[getCurrentRole()];

    return (
        <header className="bg-white shadow mb-8">
            <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h1 className="text-xl font-bold text-indigo-700">TeraVince</h1>
                <nav className="flex max-lg:flex-col justify-center sm:justify-end gap-2 text-sm max-w-full overflow-x-auto">
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
                <NavLink to="/" className="text-gray-600 hover:text-gray-800 text-sm min-w-max px-2 py-1">Log Out</NavLink>
            </div>
        </header>
    );
}
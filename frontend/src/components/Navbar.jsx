import { Link } from 'react-router-dom'

function Navbar() {
    const navigationItems = [
        { path: "/", label: "Sign In" },
        { path: "/admin-dashboard", label: "(Admin) Dashboard" },
        { path: "/jobs", label: "(Admin) Jobs & Descriptions" },
        { path: "/accounts", label: "(Admin) Accounts" }
    ];

    return (
        <nav className="bg-white p-6 text-black ">
            <ul className="flex gap-2">
                {navigationItems.map((item, index) => (
                    <li key={index} className='p-2 border'>
                        <Link to={item.path}>{item.label}</Link>
                    </li>
                ))}
            </ul>
        </nav>
    )
}

export default Navbar

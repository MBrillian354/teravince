import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { HiUserCircle, HiHome } from "react-icons/hi";
import { FiLogOut } from "react-icons/fi";
import { FaTasks } from "react-icons/fa";

const navItems = [
  { to: "/staff-dashboard", icon: <HiHome className="text-xl" />, label: "Dashboard" },
  { to: "/staff-profile", icon: <HiUserCircle className="text-xl" />, label: "Profile" },
  { to: "/staff-tasks", icon: <FaTasks className="text-xl" />, label: "Tasks" },
];

const StaffNavbar = () => {
  const [showNavbar, setShowNavbar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShowNavbar(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <header
      className={`bg-black/20 backdrop-blur-md text-[#EEEBDD] w-full shadow-md transition-all duration-700 ease-out transform ${
        showNavbar ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <NavLink
          to="/"
          className={`text-[#CE1212] text-2xl font-bold tracking-wide transition-all duration-700 transform ${
            showNavbar ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
        >
          Teravince Staff
        </NavLink>

        {/* Navigation Links */}
        <ul className="flex gap-6 items-center">
          {navItems.map(({ to, icon, label }) => (
            <li
              key={to}
              className={`transition-all duration-500 ease-out transform ${
                showNavbar ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "text-[#CE1212] bg-black/30"
                      : "hover:text-[#1B1717]"
                  }`
                }
              >
                {icon}
                <span>{label}</span>
              </NavLink>
            </li>
          ))}

          {/* Logout Button */}
          <li
            className={`transition-all duration-500 ease-out transform ${
              showNavbar ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1 text-sm font-medium hover:text-[#1B1717] transition-all duration-150"
            >
              <FiLogOut className="text-xl" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default StaffNavbar;

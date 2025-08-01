// ================== Main Code ==================
import React from "react";
import { NavLink } from "react-router-dom";
import { HiChartBar, HiUserCircle, HiHome } from "react-icons/hi";
import { FiLogOut } from "react-icons/fi";
import { FaTasks } from "react-icons/fa";

const StaffNavbar = () => {
  return (
    <header className="bg-[#1B1717] w-screen text-[#EEEBDD]">
      <nav className="w-full py-3 flex justify-between items-center">
        <NavLink to="/" className="text-[#CE1212] text-xl font-bold">
          Teravince Staff
        </NavLink>
        <ul className="flex gap-6 items-center">
          <li>
            <NavLink
              to="/staff-dashboard"
              className={({ isActive }) =>
                isActive
                  ? "text-[#CE1212] font-semibold"
                  : "hover:text-[#CE1212] transition"
              }
            >
              <div className="flex items-center gap-1">
                <HiHome className="text-lg" />
                Dashboard
              </div>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/staff-tasks"
              className={({ isActive }) =>
                isActive
                  ? "text-[#CE1212] font-semibold"
                  : "hover:text-[#CE1212] transition"
              }
            >
              <div className="flex items-center gap-1">
                <FaTasks className="text-lg" />
                Tasks
              </div>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/staff-analytics"
              className={({ isActive }) =>
                isActive
                  ? "text-[#CE1212] font-semibold"
                  : "hover:text-[#CE1212] transition"
              }
            >
              <div className="flex items-center gap-1">
                <HiChartBar className="text-lg" />
                Analytics
              </div>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/staff-profile"
              className={({ isActive }) =>
                isActive
                  ? "text-[#CE1212] font-semibold"
                  : "hover:text-[#CE1212] transition"
              }
            >
              <div className="flex items-center gap-1">
                <HiUserCircle className="text-lg" />
                Profile
              </div>
            </NavLink>
          </li>
          <li>
            <button className="hover:text-[#CE1212] transition">
              <div className="flex items-center gap-1">
                <FiLogOut className="text-lg" />
                Logout
              </div>
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default StaffNavbar;

// ================== CSS (Tailwind Styling) ==================
// bg-[#1B1717]: Dark background
// w-full: Full width bar
// text-[#EEEBDD]: Light text color
// text-[#CE1212]: Highlight red
// hover:text-[#CE1212]: Red hover effect
// px-6 py-3: Padding for nav
// flex gap-6 items-center: Layout spacing
// text-lg: Icon size

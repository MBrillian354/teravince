import React, { useState } from 'react';
import { NavLink }       from 'react-router-dom';
import TaskStatusChart   from './taskStatusChart';
import StatsCard         from './statsCard';

export default function Dashboard() {
  // Generate last 12 months for the dropdown
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return {
      value: d.toISOString().slice(0, 7),
      label: d.toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      }),
    };
  });

  const statusData = [
    { label: 'Achieved',        value: 21, color: '#374151' },
    { label: 'On Process',      value: 42, color: '#6B7280' },
    { label: 'Awaiting Review', value: 19, color: '#9CA3AF' },
    { label: 'Not Yet Started', value:  3, color: '#D1D5DB' },
  ];

  return (
    <div className="container mx-auto px-4">
      {/* Big welcome banner */}
      <h1 className="text-3xl font-bold mb-6">
        Welcome back, <span className="underline">Supervisor</span>.
      </h1>

      {/* Tabs with bottom‐border style */}
<nav className="flex space-x-6 border-b border-gray-200 mb-4">
  <NavLink
    to="/"
    end
    className={({ isActive }) =>
      `pb-2 ${
        isActive
          ? 'text-indigo-600 border-b-2 border-indigo-600'
          : 'text-gray-600 hover:text-gray-800'
      }`
    }
  >
    Overview
  </NavLink>
  <NavLink
    to="/staffs"
    className={({ isActive }) =>
      `pb-2 ${
        isActive
          ? 'text-indigo-600 border-b-2 border-indigo-600'
          : 'text-gray-600 hover:text-gray-800'
      }`
    }
  >
    My Staffs
  </NavLink>
</nav>

    {/* Month-selector, no shadow */}
    <div className="rounded px-4 py-3 mb-6 flex justify-end">
     <select
       value={selectedMonth}
       onChange={(e) => setSelectedMonth(e.target.value)}
       className="border border-gray-500 bg-white p-2 text-sm rounded"
     >
       {monthOptions.map((m) => (
         <option key={m.value} value={m.value}>
           {m.label}
         </option>
       ))}
     </select>
  </div>

      {/* Centered Donut + Legend Card */}
      <div className="bg-white rounded shadow p-4 mb-6 flex justify-center items-center h-80">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-8">
          <TaskStatusChart />
          <ul className="space-y-2">
            {statusData.map(({ label, value, color }) => (
              <li key={label} className="flex items-center">
                <span
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: color }}
                />
                <span className="w-36 text-sm">{label}</span>
                <span className="ml-2 text-sm font-medium">{value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard label="Total Tasks" value={85} delta="+2.5%" />
        <StatsCard label="Number of Staffs" value={31} delta="-1.2%" />
        <StatsCard label="Avg Task per Person" value={7} delta="+11%" />
      </div>
    </div>
  );
}

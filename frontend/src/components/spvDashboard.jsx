import React, { useState } from 'react';
import TaskStatusChart from './taskStatusChart';
import StatsCard from './statsCard';

const statusData = [
  { label: 'Achieved',        value: 21, color: '#374151' },
  { label: 'On Process',      value: 42, color: '#6B7280' },
  { label: 'Awaiting Review', value: 19, color: '#9CA3AF' },
  { label: 'Not Yet Started', value:  3, color: '#D1D5DB' },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const today = new Date().toISOString().slice(0, 10);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Display labels when inputs are empty
  const displayStart = startDate || 'Earliest';
  const displayEnd   = endDate   || today;

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-lg font-semibold mb-4">
        Welcome back, <span className="underline">Supervisor</span>.
      </h1>

      {/* Tab + Date‐picker Bar */}
      <div className="bg-white rounded shadow px-4 py-2 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between">
        {/* Tabs */}
        <nav className="flex space-x-4 mb-2 md:mb-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-1 ${activeTab==='overview'? 'border-b-2 border-indigo-600 text-indigo-600':'text-gray-600'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('staffs')}
            className={`pb-1 ${activeTab==='staffs'?   'border-b-2 border-indigo-600 text-indigo-600':'text-gray-600'}`}
          >
            My Staffs
          </button>
        </nav>

        {/* Date range picker */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-gray-50 rounded p-2 shadow-inner">
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
              placeholder="Start date"
            />
          </div>
          <span className="text-gray-500">→</span>
          <div className="flex items-center bg-gray-50 rounded p-2 shadow-inner">
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
              placeholder="End date"
              max={today}
            />
          </div>
        </div>
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
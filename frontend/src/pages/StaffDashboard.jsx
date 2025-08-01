import React from 'react';
import StatsCard from '../components/StatsCard';
import ActivityChart from '../components/ActivityChart';
import HistoryList from '../components/HistoryList';

const StaffDashboard = () => {
  return (
    <div className="min-h-screen bg-[#EEEBDD] text-[#1B1717]">
        {/* Main Dashboard Section */}
      <div className="bg-white shadow p-6 rounded-xl m-6">
        {/* Greeting */}
        <h1 className="text-2xl font-semibold mb-2">Welcome back, User</h1>

        {/* Filters */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium border-b-2 border-[#1B1717]">Overview</h2>
          <div className="flex gap-4">
            <select className="border rounded-md p-2 text-sm">
              <option>Month</option>
            </select>
            <select className="border rounded-md p-2 text-sm">
              <option>Year</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatsCard label="Performance Score" value="90.3 / 100" />
          <StatsCard label="Performance Feedback" value="User A did a great job!" />
          <StatsCard label="Growth Rate" value="+4.7%" delta="+4.7%" />
        </div>

        {/* Activity Chart */}
        <div className="mb-6">
          <ActivityChart />
        </div>

        {/* History List */}
        <div>
          <HistoryList />
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;

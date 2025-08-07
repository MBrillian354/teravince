import React from 'react';
import StatsCard from '../components/StatsCard';
import ActivityChart from '../components/ActivityChart';
import HistoryList from '../components/HistoryList';

const StaffDashboard = () => {
  // Mock staff data from sign-up
  const staff = JSON.parse(localStorage.getItem("user"))

  // Mock dashboard data
  const mockupData = [
    { label: "Performance Score", value: "90.3 / 100" },
    { label: "Performance Feedback", value: "Great job!" },
    { label: "Growth Rate", value: "+4.7%", delta: "+4.7%" },
  ];

  return (
    <div className={containerStyle}>
      <div className="flex justify-between items-center my-6">
        <h1 className="page-title">
          Welcome back, <span className="underline">{staff.firstName + ' ' + staff.lastName}</span>.
        </h1>
      </div>

      {/* Main Dashboard Section */}
      <div className={cardStyle}>

        {/* Filters */}
        <div className={filterWrapperStyle}>
          <div className={filterControlsStyle}>
            <input type="date" className={dateInputStyle} />
          </div>
        </div>

        {/* Stats Cards */}
        <div className={statsGridStyle}>
          {mockupData.map((item, index) => (
            <StatsCard
              key={index}
              label={item.label}
              value={item.value}
              delta={item.delta}
            />
          ))}
        </div>

        {/* Activity Chart */}
        <div className={chartSectionStyle}>
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

// ================== Styling Section ==================

const containerStyle = "min-h-screen bg-background text-primary";
const cardStyle = "card-static";
const filterWrapperStyle = "flex justify-end items-center mb-4";
const filterControlsStyle = "flex gap-4";
const dateInputStyle =
  "border border-primary rounded-xl p-2 px-4 text-sm font-medium bg-accent shadow-md transition duration-150 ease-in-out hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer";
const statsGridStyle = "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6";
const chartSectionStyle = "mb-6";

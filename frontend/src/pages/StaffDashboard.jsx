import React from 'react';
import StatsCard from '../components/StatsCard';
import ActivityChart from '../components/ActivityChart';
import HistoryList from '../components/HistoryList';

const StaffDashboard = () => {
  // Mock staff data from sign-up
  const staff = { firstName: "John", lastName: "Yasuarini" };

  // Mock dashboard data
  const mockupData = [
    { label: "Performance Score", value: "90.3 / 100" },
    { label: "Performance Feedback", value: "Great job!" },
    { label: "Growth Rate", value: "+4.7%", delta: "+4.7%" },
  ];

  return (
    <div className={containerStyle}>
      {/* Main Dashboard Section */}
      <div className={cardStyle}>
        {/* Greeting */}
        <h1 className={greetingStyle}>Welcome back, {staff.firstName}</h1>

        {/* Filters */}
        <div className={filterWrapperStyle}>
          <h2 className={overviewTitleStyle}>Overview</h2>
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
const cardStyle = "bg-surface shadow p-6 rounded-xl m-6";
const greetingStyle = "text-2xl font-semibold mb-2";
const filterWrapperStyle = "flex justify-between items-center mb-4";
const overviewTitleStyle = "text-lg font-medium border-b-2 border-primary";
const filterControlsStyle = "flex gap-4";
const dateInputStyle =
  "border border-primary rounded-xl p-2 px-4 text-sm font-medium bg-accent shadow-md transition duration-150 ease-in-out hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer";
const statsGridStyle = "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6";
const chartSectionStyle = "mb-6";

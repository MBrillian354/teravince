import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StatsCard from '../../components/StatsCard';
import ActivityChart from '../../components/ActivityChart';
import HistoryList from '../../components/HistoryList';
import { fetchStaffDashboard } from '../../store/staffSlice';

const StaffDashboard = () => {
  const dispatch = useDispatch();
  const { dashboardData, isLoading, error } = useSelector((state) => state.staff);
  console.log('Dashboard Data:', dashboardData);

  // Mock staff data from sign-up
  const staff = JSON.parse(localStorage.getItem("user"));

  // State for month/year filter
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  // Fetch dashboard data on component mount and when filters change
  useEffect(() => {
    const params = {};
    params.userId = staff._id; // Use staff ID from localStorage
    if (selectedMonth) params.month = selectedMonth;
    if (selectedYear) params.year = selectedYear;

    dispatch(fetchStaffDashboard(params));
  }, [dispatch, selectedMonth, selectedYear]);

  // Transform backend data to display format
  const statsData = [
    {
      label: "Performance Score",
      value: `${dashboardData.performanceScore || 0} / 100`
    },
    {
      label: "Performance Feedback",
      value: dashboardData.performanceFeedback || 'No feedback yet'
    },
    {
      label: "Growth Rate",
      value: `${dashboardData.growthRate >= 0 ? '+' : ''}${dashboardData.growthRate || 0}%`,
      delta: `${dashboardData.growthRate >= 0 ? '+' : ''}${dashboardData.growthRate || 0}%`
    },
  ];

  if (isLoading) {
    return (
      <div className={containerStyle}>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading dashboard data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={containerStyle}>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerStyle}>
      <div className="flex flex-col justify-between items-start my-6">
        <h1 className="page-title">
          Welcome back, <span className="underline">{staff.firstName + ' ' + staff.lastName}</span>.
        </h1>
        <h2 className='page-subtitle'>{staff.jobId.title}</h2>
      </div>

      {/* Main Dashboard Section */}
      <div className={cardStyle}>

        {/* Filters */}
        <div className={filterWrapperStyle}>
          <div className={filterControlsStyle}>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className={dateInputStyle}
            >
              <option value="">All Months</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className={dateInputStyle}
            >
              <option value="">All Years</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className={statsGridStyle}>
          {statsData.map((item, index) => (
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
          <ActivityChart data={dashboardData.activityRecap || []} />
        </div>

        {/* History List */}
        <div>
          <HistoryList data={dashboardData.history || []} />
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
  "btn-outline px-2";
const statsGridStyle = "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6";
const chartSectionStyle = "mb-6";

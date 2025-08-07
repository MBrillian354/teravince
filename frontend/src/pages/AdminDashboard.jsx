import { useEffect } from 'react';
import StatsCard from '../components/StatsCard';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardData, clearError } from '../store/adminSlice';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { dashboardData, isLoading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center my-6">
        <h1 className="page-title">
          Welcome back, <span className="underline">Admin</span>.
        </h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <div className="flex justify-between items-center">
            <span>Error: {error}</span>
            <button
              onClick={() => dispatch(clearError())}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dashboardData.map((stat, index) => (
            <StatsCard key={index} label={stat.label} value={stat.value} />
          ))}
        </div>
      </div>
    </>
  );
}
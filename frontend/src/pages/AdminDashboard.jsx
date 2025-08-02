import StatsCard from '../components/StatsCard';
import { useSelector } from 'react-redux';

export default function Dashboard() {
  const statsData = useSelector((state) => state.admin.dashboardData);

  return (
    <>
      <h1 className="page-title my-4">
        Welcome back, <span className="underline">Admin</span>.
      </h1>

      <div className="flex flex-col gap-4 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statsData.map((stat, index) => (
            <StatsCard key={index} label={stat.label} value={stat.value} />
          ))}
        </div>
      </div>
    </>
  );
}
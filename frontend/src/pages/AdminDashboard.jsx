import StatsCard from '../components/StatsCard';

export default function Dashboard() {
  const statsData = {
    row1: [
      { label: "Supervisors", value: 85 },
      { label: "Staffs", value: 31 }
    ],
    row2: [
      { label: "Job Titles", value: 7 },
      { label: "Supervisors", value: 85 },
      { label: "Staffs", value: 31 }
    ]
  };

  return (
    <>
      <h1 className="page-title my-4">
        Welcome back, <span className="underline">Admin</span>.
      </h1>

      <div className="flex flex-col gap-4 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {statsData.row1.map((stat, index) => (
            <StatsCard key={index} label={stat.label} value={stat.value} />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statsData.row2.map((stat, index) => (
            <StatsCard key={index} label={stat.label} value={stat.value} />
          ))}
        </div>
      </div>
    </>
  );
}
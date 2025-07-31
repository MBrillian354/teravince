import StatsCard from "@/components/StatsCard"

const AccountsView = () => {
  const accountStats = [
    { label: "Admins", value: 2 },
    { label: "Supervisors", value: 3 },
    { label: "Staffs", value: 2 }
  ];

  const assignmentStats = [
    { label: "Unassigned Positions", value: 2 },
    { label: "Unassigned Jobs", value: 2 }
  ];

  return (
    <>
      <div className='page-title my-4'>Manage Accounts</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        {accountStats.map((stat, index) => (
          <StatsCard key={index} label={stat.label} value={stat.value} />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        {assignmentStats.map((stat, index) => (
          <StatsCard key={index} label={stat.label} value={stat.value} />
        ))}
      </div>
      <div>
        <p>Table here</p>
      </div>
    </>
  )
}

export default AccountsView
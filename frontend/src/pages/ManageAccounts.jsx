import StatsCard from "@/components/StatsCard"
import DataTable from "@/components/DataTable"
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ManageAccounts = () => {
  // accountStats and assignmentStats will be computed dynamically after accountData

  const accountData = useSelector((state) => state.admin.accountsData);

  // Compute stats dynamically based on accountData
  const accountStats = [
    { label: "Admins", value: accountData.filter(item => item.jobTitle === 'Admin').length },
    { label: "Supervisors", value: accountData.filter(item => item.jobTitle === 'Supervisor').length },
    { label: "Staffs", value: accountData.filter(item => item.jobTitle === 'Staff').length },
  ];

  const assignmentStats = [
    { label: "Unassigned Positions", value: accountData.filter(item => item.position === '').length },
    { label: "Unassigned Jobs", value: accountData.filter(item => item.jobTitle === '').length },
  ];

  // Column definitions for DataTable
  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'ID', accessor: 'id' },
    { header: 'Job Title', accessor: 'jobTitle' },
    { header: 'Position', accessor: 'position' },
    { header: 'Status', accessor: 'status' },
    { header: 'Actions', render: row => <button onClick={() => console.log('Action on', row)}>Edit</button> }
  ];

  return (
    <>
      <div className="flex justify-between items-center">
        <div className='page-title my-4'>Manage Accounts</div>
        <Link to="/admin-accounts/new" className="btn btn-primary">Create New Account</Link>
      </div>
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
      <DataTable
        columns={columns}
        data={accountData}
        rowKey="id"
        onRowClick={row => console.log('Row clicked:', row)}
      />
    </>
  )
}

export default ManageAccounts
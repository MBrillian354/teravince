import StatsCard from "@/components/StatsCard"
import DataTable from "@/components/DataTable"
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useModal } from '../hooks/useModal';

const ManageAccounts = () => {
  const { showDeleteConfirm } = useModal();

  // accountStats and assignmentStats will be computed dynamically after accountData
  const accountData = useSelector((state) => state.admin.accountsData);

  const handleDeleteAccount = (accountId, accountName) => {
    showDeleteConfirm(accountName, 'admin/deleteAccount', accountId);
  };

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
    { header: 'Name', accessor: 'name', render: row => `${row.firstName} ${row.lastName}` },
    { header: 'ID', accessor: 'id' },
    { header: 'Job Title', accessor: 'jobTitle' },
    { header: 'Position', accessor: 'position' },
    { header: 'Status', accessor: 'status' },
    {
      header: 'Actions',
      render: row => (
        <div className="flex space-x-2">
          <Link
            to={`/accounts/edit/${row.id}`}
            className="btn-primary"
            onClick={e => e.stopPropagation()}
          >
            Edit
          </Link>
          <button
            className="btn-danger"
            onClick={e => {
              e.stopPropagation();
              handleDeleteAccount(row.id, `${row.firstName} ${row.lastName}`);
            }}
          >
            Delete
          </button>
        </div>
      )
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center">
        <div className='page-title my-4'>Manage Accounts</div>
        <Link to="/accounts/new" className="btn btn-primary">Create New Account</Link>
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
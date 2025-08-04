import StatsCard from "@/components/StatsCard"
import DataTable from "@/components/DataTable"
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useModal } from '../hooks/useModal';
import { useEffect } from 'react';
import { fetchAccounts, deleteAccount, clearError } from '../store/adminSlice';

const ManageAccounts = () => {
  const dispatch = useDispatch();
  const { showDeleteConfirm, showSuccess, showError } = useModal();

  // Get data from Redux store
  const { accountsData, isLoading, error } = useSelector((state) => state.admin);

  // Fetch accounts on component mount
  useEffect(() => {
    dispatch(fetchAccounts());
  }, [dispatch]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleDeleteAccount = (accountId, accountName) => {
    console.log('Deleting account:', accountId, accountName);
    
    const performDelete = async () => {
      try {
        await dispatch(deleteAccount(accountId)).unwrap();
        // Show success notification
        showSuccess(
          'Account deleted successfully',
          `${accountName} has been removed from the system.`,
          'Success',
          { timeout: 4000 }
        );
      } catch (error) {
        console.error('Delete failed:', error);
        // Show error notification
        showError(
          'Failed to delete account',
          error || 'An error occurred while trying to delete the account. Please try again.',
          'Error',
          { timeout: 5000, autoClose: false }
        );
        throw error; // Re-throw to let the modal handle the error state
      }
    };

    showDeleteConfirm(
      accountName,
      performDelete, // Pass the async function instead of the action directly
      accountId
    );
  };

  // Show isLoading state
  if (isLoading && accountsData.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading accounts...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">Error: {error}</div>
        <button
          onClick={() => dispatch(fetchAccounts())}
          className="ml-4 btn btn-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  // Compute stats dynamically based on accountData
  const accountStats = [
    { label: "Admins", value: accountsData.filter(item => item.role === 'admin').length },
    { label: "Supervisors", value: accountsData.filter(item => item.role === 'supervisor').length },
    { label: "Staffs", value: accountsData.filter(item => item.role === 'staff').length },
  ];

  const assignmentStats = [
    { label: "Unassigned Positions", value: accountsData.filter(item => !item.position || item.position === '').length },
    { label: "Unassigned Jobs", value: accountsData.filter(item => !item.jobTitle || item.jobTitle === '').length },
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
            disabled={isLoading}
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

      {isLoading && (
        <div className="mb-4 text-blue-600">
          isLoading...
        </div>
      )}

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
        data={accountsData}
        rowKey="id"
        onRowClick={row => console.log('Row clicked:', row)}
      />
    </>
  )
}

export default ManageAccounts
import StatsCard from "@/components/StatsCard";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useModal } from '../../hooks/useModal';
import { useEffect } from 'react';
import { fetchAccounts, deleteAccount, clearError } from '../../store/adminSlice';
import { capitalizeFirst, capitalizeFirstWithFallback } from '../../utils/textUtils';

const ManageAccounts = () => {
  const dispatch = useDispatch();
  const { showDeleteConfirm, showSuccess, showError } = useModal();

  // Get data from Redux store
  const { accountsData, isLoading, error } = useSelector((state) => state.admin);
  console.log('Accounts Data:', accountsData);

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

  // Remove early returns for loading and error, handle in main render

  // Compute stats dynamically based on accountData
  const accountStats = [
    { label: "Admins", value: accountsData.filter(item => item.role === 'admin').length },
    { label: "Supervisors", value: accountsData.filter(item => item.role === 'supervisor').length },
    { label: "Staffs", value: accountsData.filter(item => item.role === 'staff').length },
  ];

  const assignmentStats = [
    { label: "Unassigned Positions", value: accountsData.filter(item => !item.role || item.role === '').length },
    { label: "Unassigned Jobs", value: accountsData.filter(item => !item.jobId || item.jobId === '').length },
  ];

  // Column definitions for DataTable
  const columns = [
    { header: 'Name', accessor: 'name', render: row => `${row.firstName} ${row.lastName}` },
    { header: 'ID', accessor: 'id' },
    { header: 'Job Title', accessor: 'jobId', render: row => capitalizeFirst(row.jobId?.title || 'Unassigned') },
    { header: 'Position', accessor: 'role', render: row => capitalizeFirst(row.role) },
    {
      header: 'Status', accessor: 'status', render: row => (
        <StatusBadge
          status={capitalizeFirstWithFallback(row.status)}
          type="approval"
          size="xs"
          variant={row.status === 'active' ? 'default' : 'outline'}
        />
      )
    },
    {
      header: 'Actions',
      render: row => (
        <div className="flex space-x-2">
          <Link
            to={`/accounts/${row.id}/edit`}
            className="btn-primary text-xs"
            onClick={e => e.stopPropagation()}
          >
            Edit
          </Link>
          <button
            className="btn-danger text-xs"
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
        {/* Only show Create New Account button if not loading or error */}
        {!isLoading && !error && (
          <Link to="/accounts/new" className="btn btn-primary">Create New Account</Link>
        )}
      </div>

      {/* Loading State */}
      {isLoading && accountsData.length === 0 && (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading accounts...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">Error: {error}</div>
          <button
            onClick={() => dispatch(fetchAccounts())}
            className="ml-4 btn btn-primary"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Content */}
      {!isLoading && !error && (
        <>
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
            title="Accounts"
            columns={columns}
            data={accountsData}
            rowKey="id"
            onRowClick={row => console.log('Row clicked:', row)}
            variant='gradient'
          />
        </>
      )}
    </>
  );
}

export default ManageAccounts

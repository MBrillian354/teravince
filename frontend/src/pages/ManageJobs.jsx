import StatsCard from '../components/StatsCard'
import DataTable from '../components/DataTable'
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchJobs, deleteJob, updateJob, clearError } from '@/store/adminSlice';
import { useModal } from '../hooks/useModal';
import { useEffect } from 'react';
import { capitalizeFirst } from '../utils/textUtils';

const ManageJobs = () => {
  const dispatch = useDispatch();
  const { showDeleteConfirm, showSuccess, showError, showConfirm } = useModal();

  // Get data from Redux store
  const { jobsData, isLoading, error } = useSelector((state) => state.admin);

  // Fetch jobs on component mount
  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleDeleteJob = (jobId, jobTitle) => {
    console.log('Deleting job:', jobId, jobTitle);

    const performDelete = async () => {
      try {
        await dispatch(deleteJob(jobId)).unwrap();
        // Show success notification
        showSuccess(
          'Job deleted successfully',
          `${jobTitle} has been removed from the system.`,
          'Success',
          { timeout: 4000 }
        );
      } catch (error) {
        console.error('Delete failed:', error);
        // Show error notification
        showError(
          'Failed to delete job',
          error || 'An error occurred while trying to delete the job. Please try again.',
          'Error',
          { timeout: 5000, autoClose: false }
        );
        throw error; // Re-throw to let the modal handle the error state
      }
    };

    showDeleteConfirm(
      jobTitle,
      performDelete, // Pass the async function instead of the action directly
      jobId
    );
  };

  const handlePublishJob = (jobId, jobTitle) => {
    console.log('Publishing job:', jobId, jobTitle);

    const performPublish = async () => {
      try {
        // Update job status to 'published' or 'active'
        await dispatch(updateJob({
          id: jobId,
          status: 'active'
        })).unwrap();

        // Show success notification
        showSuccess(
          'Job published successfully',
          `${jobTitle} is now active and visible to staffs.`,
          'Success',
          { timeout: 4000 }
        );
      } catch (error) {
        console.error('Publish failed:', error);
        // Show error notification
        showError(
          'Failed to publish job',
          error || 'An error occurred while trying to publish the job. Please try again.',
          'Error',
          { timeout: 5000, autoClose: false }
        );
        throw error; // Re-throw to let the modal handle the error state
      }
    };

    showConfirm({
      title: 'Publish Confirmation',
      message: `Are you sure you want to publish "${jobTitle}"? Once published, it will be visible to all staff members.`,
      confirmText: 'Publish',
      cancelText: 'Cancel',
      type: 'warning',
      onConfirm: performPublish
    });
  };

  // Show loading state
  if (isLoading && jobsData.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading jobs...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">Error: {error}</div>
        <button
          onClick={() => dispatch(fetchJobs())}
          className="ml-4 btn btn-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  const jobStats = [
    { label: "Active Jobs", value: jobsData.filter(job => job.status === 'Active').length },
    { label: "Drafts", value: jobsData.filter(job => job.status === 'Draft').length }
  ];

  // Define table columns configuration
  const columns = [
    { header: 'Job Title', accessor: 'title' },
    { header: 'Job Description', accessor: 'description', render: row => <p className='whitespace-pre-line'>{row.description}</p> },
    { header: 'Number of Staffs', accessor: 'staffs' },
    { header: 'Status', accessor: 'status', render: row => capitalizeFirst(row.status) },
    {
      header: 'Actions',
      render: row => (
        <div className="flex space-x-2">
          <Link
            to={`/jobs/${row.id}/edit`}
            className="btn-primary"
            onClick={e => e.stopPropagation()}
          >
            Edit
          </Link>
          <button
            className="btn-danger"
            onClick={e => {
              e.stopPropagation();
              handleDeleteJob(row.id, row.title);
            }}
            disabled={isLoading}
          >
            Delete
          </button>
          {row.status === 'draft' && (
            <button
              className="btn-success"
              onClick={e => {
                e.stopPropagation();
                handlePublishJob(row.id, row.title);
              }}
              disabled={isLoading}
            >
              Publish
            </button>
          )}
        </div>
      )
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className='page-title'>Manage Jobs</h1>
        <Link to="/jobs/new" className="btn-primary">Create New Job</Link>
      </div>

      {isLoading && (
        <div className="mb-4 text-blue-600">
          Loading...
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        {jobStats.map((stat, index) => (
          <StatsCard key={index} label={stat.label} value={stat.value} />
        ))}
      </div>
      <div>
        <DataTable
          title="Job Listings"
          columns={columns}
          data={jobsData}
          rowKey="id"
          onRowClick={(row) => console.log('Row clicked:', row)}
          variant='gradient'
        />
      </div>
    </>
  )
}

export default ManageJobs
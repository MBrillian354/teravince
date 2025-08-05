import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TasksReportsTabs from '../components/TasksReportsTabs';
import StatsCard from '../components/StatsCard';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import { tasksAPI } from '../utils/api';

export default function TeamTasks() {
  const navigate = useNavigate();

  // 1) Tab state
  const [activeTab, setActiveTab] = useState('tasks');

  // 2) Data states
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 3) Fetch tasks from backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await tasksAPI.getAll();

        if (response.data.success) {
          // Transform backend data to match component's expected format
          const transformedTasks = response.data.data
            .filter(task => task.taskStatus !== 'draft' && task.approvalStatus !== 'draft') // Exclude draft and cancelled tasks
            .map(task => ({
              id: task._id,
              title: task.title,
              status: getDisplayStatus(task.taskStatus),
              approval: getDisplayApprovalStatus(task.approvalStatus),
              review: getReviewStatus(task.taskStatus, task.approvalStatus),
              employeeName: task.userId ? `${task.userId.firstName} ${task.userId.lastName}` : 'Unknown',
              description: task.description,
              supervisorComment: task.supervisorComment || '',
              score: task.score || 0,
              startDate: task.startDate,
              endDate: task.endDate,
              evidence: task.evidence || '',
              originalTask: task // Keep original data for detailed view
            })); // Exclude cancelled tasks

          setTasks(transformedTasks);
        } else {
          setError('Failed to fetch tasks');
        }
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError(err.response?.data?.msg || 'Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Helper functions to transform backend status to display format
  const getDisplayStatus = (taskStatus) => {
    const statusMap = {
      'draft': 'Draft',
      'inProgress': 'In Progress',
      'submitted': 'Submitted',
      'rejected': 'Rejected',
      'completed': 'Completed',
      'cancelled': 'Cancelled'
    };
    return statusMap[taskStatus] || taskStatus;
  };

  const getDisplayApprovalStatus = (approvalStatus) => {
    const statusMap = {
      'pending': 'Awaiting Approval',
      'approved': 'Approved',
      'rejected': 'Rejected'
    };
    return statusMap[approvalStatus] || approvalStatus;
  };

  const getReviewStatus = (taskStatus, approvalStatus) => {

    console.log('Calculating review status for:', { taskStatus, approvalStatus });
    if (taskStatus === 'submitted' && approvalStatus === 'pending') {
      return 'Awaiting Approval';
    }
    if (taskStatus === 'submitted' && approvalStatus === 'approved') {
      return 'Awaiting Review';
    }
    if (taskStatus === 'inProgress' && approvalStatus === 'approved') {
      return 'Awaiting Submission';
    }
    if (approvalStatus === 'rejected' && taskStatus === 'inProgress') {
      return 'Awaiting Revision';
    }
    if (approvalStatus === 'rejected' && taskStatus === 'submitted') {
      return 'Awaiting Review';
    }
    return 'Undetermined';
  };

  // 4) Calculate summary statistics based on real data
  const calculateSummary = () => {
    const tasksToApprove = tasks.filter(task =>
      task.originalTask.approvalStatus === 'pending'
    ).length;

    const tasksToRevise = tasks.filter(task =>
      task.originalTask.approvalStatus === 'rejected'
    ).length;

    const tasksToReview = tasks.filter(task =>
      task.originalTask.taskStatus === 'submitted'
    ).length;

    return [
      { label: 'Tasks to Approve', value: tasksToApprove },
      { label: 'Task to Revise', value: tasksToRevise },
      { label: 'Task to Review', value: tasksToReview },
    ];
  };

  const summary = calculateSummary();

  // 5) Selected row state
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // Update selected task when tasks are loaded
  useEffect(() => {
    if (tasks.length > 0 && !selectedTaskId) {
      setSelectedTaskId(tasks[0].id);
    }
  }, [tasks, selectedTaskId]);

  // 6) Handle task view
  const handleViewTask = (taskId) => {
    navigate(`/reports/tasks/${taskId}`);
  };

  // 7) Pagination state
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(tasks.length / itemsPerPage);

  // Get paginated tasks
  const paginatedTasks = tasks.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // 8) Table column definitions
  const columns = [
    { header: 'Task Title', accessor: 'title' },
    { header: 'Employee', accessor: 'employeeName' },
    {
      header: 'Submission Status',
      render: (r) => (
        <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">
          {r.status}
        </span>
      ),
    },
    {
      header: 'Approval Status',
      render: (r) => (
        <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">
          {r.approval}
        </span>
      ),
    },
    {
      header: 'Task Status',
      render: (r) => (
        <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">
          {r.review}
        </span>
      ),
    },
{
  header: 'Actions',
  render: (row) => (
    row.originalTask.taskStatus === 'submitted' ? (
      <div className="flex space-x-2">
        <button
          onClick={() => handleViewTask(row.id)}
          className="btn-secondary text-xs"
        >
          Review
        </button>
      </div>
    ) : row.originalTask.taskStatus === 'inProgress' ? (
      <div className="flex space-x-2">
        <button
          onClick={() => handleViewTask(row.id)}
          className="btn-secondary text-xs"
        >
          View
        </button>
      </div>
    ) : null
  ),
  align: 'center'
},
  ];

// Loading state
if (loading) {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-4">Reports, Jobs, and Tasks</h1>
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-600">Loading tasks...</div>
      </div>
    </div>
  );
}

// Error state
if (error) {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-4">Reports, Jobs, and Tasks</h1>
      <div className="flex justify-center items-center py-8">
        <div className="text-red-600">Error: {error}</div>
      </div>
    </div>
  );
}

return (
  <div className="container mx-auto px-4">
    {/* Page title */}
    <h1 className="text-3xl font-bold mb-4">Reports, Jobs, and Tasks</h1>

    {/* Tabs */}
    <TasksReportsTabs active={activeTab} onChange={setActiveTab} />

    {/* Summary Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {summary.map((c) => (
        <StatsCard key={c.label} label={c.label} value={c.value} />
      ))}
    </div>

    {/* Tasks Table */}
    <DataTable
      columns={columns}
      data={paginatedTasks}
      rowKey="id"
      onRowClick={({ id }) => setSelectedTaskId(id)}
      containerClass="bg-white rounded mb-4"
    />

    {/* Pagination */}
    {totalPages > 1 && (
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    )}

    {/* Show message if no tasks */}
    {tasks.length === 0 && !loading && (
      <div className="bg-white rounded shadow p-6 text-center">
        <p className="text-gray-600">No tasks found.</p>
      </div>
    )}
  </div>
);
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TasksReportsTabs from '../components/TasksReportsTabs';
import StatsCard from '../components/StatsCard';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import StatusBadge from '../components/StatusBadge';
import { tasksAPI } from '../utils/api';
import {
  getDisplayTaskStatus,
} from '../utils/statusStyles';// Helper function to get bias detection status
const getBiasDetectionStatus = (biasCheck) => {
  if (!biasCheck) return { status: 'not-checked', label: 'Not Checked' };

  if (biasCheck.is_bias === true) {
    return { status: 'bias-detected', label: 'Bias Detected' };
  } else if (biasCheck.is_bias === false) {
    return { status: 'no-bias', label: 'No Bias' };
  }

  return { status: 'pending', label: 'Pending' };
};

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
            .filter(task => task.taskStatus !== 'draft') // Exclude draft tasks
            .map(task => ({
              id: task._id,
              title: task.title,
              status: getDisplayTaskStatus(task.taskStatus),
              employeeName: task.userId ? `${task.userId.firstName} ${task.userId.lastName}` : 'Unknown',
              description: task.description,
              supervisorComment: task.supervisorComment || '',
              score: task.score || 0,
              startDate: task.startDate,
              completedDate: task.completedDate,
              evidence: task.evidence || '',
              biasStatus: getBiasDetectionStatus(task.bias_check),
              originalTask: task // Keep original data for detailed view
            }));

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

  // 4) Calculate summary statistics based on real data
  const calculateSummary = () => {
    const tasksToApprove = tasks.filter(task =>
      task.originalTask.taskStatus === 'submittedAndAwaitingApproval'
    ).length;

    const taskOngoing = tasks.filter(task =>
      task.originalTask.taskStatus === 'inProgress'
    ).length;

    const tasksToReview = tasks.filter(task =>
      task.originalTask.taskStatus === 'submittedAndAwaitingReview'
    ).length;

    const taskCompleted = tasks.filter(task =>
      task.originalTask.taskStatus === 'completed'
    ).length;

    const tasksWithBias = tasks.filter(task =>
      task.originalTask.bias_check?.is_bias === true
    ).length;

    return [
      { label: 'Task Ongoing', value: taskOngoing },
      { label: 'Tasks to Approve', value: tasksToApprove },
      { label: 'Task to Review', value: tasksToReview },
      { label: 'Task Completed', value: taskCompleted },
      { label: 'Bias Detected', value: tasksWithBias },
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
        <StatusBadge
          status={r.status}
          type="task"
          size="xs"
          showIcon={false}
        />
      ),
    },
    // {
    //   header: 'Approval Status',
    //   render: (r) => (
    //     <StatusBadge
    //       status={r.approval}
    //       type="approval"
    //       size="xs"
    //       showIcon={false}
    //     />
    //   ),
    // },
    // {
    //   header: 'Task Status',
    //   render: (r) => (
    //     <StatusBadge
    //       status={r.review}
    //       type="review"
    //       size="xs"
    //       showIcon={false}
    //     />
    //   ),
    // },
    {
      header: 'Bias Status',
      render: (r) => {
        const biasStatus = r.biasStatus;
        let statusColor = 'bg-muted text-gray-800';

        if (biasStatus.status === 'bias-detected') {
          statusColor = 'bg-red-100 text-danger';
        } else if (biasStatus.status === 'no-bias') {
          statusColor = 'bg-success-light text-success';
        } else if (biasStatus.status === 'pending') {
          statusColor = 'bg-warning-light text-warning';
        }

        return (
          <span className={`px-2 py-1 text-xs rounded-full ${statusColor}`}>
            {biasStatus.label}
          </span>
        );
      },
    },
    {
      header: 'Actions',
      render: (row) => {
        const task = row.originalTask;
        const biasStatus = row.biasStatus;

        // For completed tasks with bias detected, show Review button
        if (task.taskStatus === 'completed' && biasStatus.status === 'bias-detected') {
          return (
            <div className="flex space-x-2">
              <button
                onClick={() => handleViewTask(row.id)}
                className="btn-secondary text-xs bg-danger hover:bg-primary"
              >
                Review Bias
              </button>
            </div>
          );
        }

        // For submitted tasks (awaiting supervisor review)
        if (task.taskStatus === 'submittedAndAwaitingApproval' || task.taskStatus === 'submittedAndAwaitingReview') {
          return (
            <div className="flex space-x-2">
              <button
                onClick={() => handleViewTask(row.id)}
                className="btn-secondary text-xs"
              >
                Review
              </button>
            </div>
          );
        }

        // For in-progress tasks
        if (task.taskStatus !== 'submittedAndAwaitingReview' && task.taskStatus !== 'submittedAndAwaitingApproval') {
          return (
            <div className="flex space-x-2">
              <button
                onClick={() => handleViewTask(row.id)}
                className="btn-secondary text-xs"
              >
                View
              </button>
            </div>
          );
        }

        return null;
      },
      align: 'center'
    },
    {
      header: 'Score',
      accessor: 'score',
      align: 'center',
      render: (r) => (
        <span className="text-xs">{r.score || 'N/A'}</span>
      ),
    }
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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {summary.map((c) => (
          <StatsCard key={c.label} label={c.label} value={c.value} />
        ))}
      </div>

      {/* Tasks Table */}
      <DataTable
        title={"Team Tasks"}
        columns={columns}
        data={paginatedTasks}
        rowKey="id"
        onRowClick={({ id }) => setSelectedTaskId(id)}
        containerClass="bg-surface rounded mb-4"
        variant='gradient'
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
        <div className="bg-surface rounded shadow p-6 text-center">
          <p className="text-gray-600">No tasks found.</p>
        </div>
      )}
    </div>
  );
}
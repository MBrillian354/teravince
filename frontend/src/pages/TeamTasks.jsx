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
  getDisplayApprovalStatus, 
  getReviewStatus 
} from '../utils/statusStyles';

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
              status: getDisplayTaskStatus(task.taskStatus),
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

  // 4) Calculate summary statistics based on real data
  const calculateSummary = () => {
    const tasksToApprove = tasks.filter(task =>
      task.originalTask.approvalStatus === 'pending'
    ).length;

    const taskOngoing = tasks.filter(task =>
      task.originalTask.taskStatus === 'inProgress'
    ).length;

    const tasksToReview = tasks.filter(task =>
      task.originalTask.taskStatus === 'submitted'
    ).length;

    const taskCompleted = tasks.filter(task =>
      task.originalTask.taskStatus === 'completed'
    ).length;

    return [
      { label: 'Task Ongoing', value: taskOngoing },
      { label: 'Tasks to Approve', value: tasksToApprove },
      { label: 'Task to Review', value: tasksToReview },
      { label: 'Task Completed', value: taskCompleted },
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
    {
      header: 'Approval Status',
      render: (r) => (
        <StatusBadge 
          status={r.approval} 
          type="approval" 
          size="xs"
          showIcon={false}
        />
      ),
    },
    {
      header: 'Task Status',
      render: (r) => (
        <StatusBadge 
          status={r.review} 
          type="review" 
          size="xs"
          showIcon={false}
        />
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
        containerClass="bg-white rounded mb-4"
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
        <div className="bg-white rounded shadow p-6 text-center">
          <p className="text-gray-600">No tasks found.</p>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TasksReportsTabs from '../../components/navigation/TasksReportsTabs';
import StatsCard from '../../components/ui/StatsCard';
import DataTable from '../../components/tables/DataTable';
import Pagination from '../../components/tables/Pagination';
import StatusBadge from '../../components/ui/StatusBadge';
import SearchInput from '../../components/tables/SearchInput';
import FilterSelect from '../../components/tables/FilterSelect';
import { tasksAPI } from '../../utils/api';
import { useServerTable } from '../../hooks/useServerTable';
import {
  getDisplayTaskStatus,
} from '../../utils/statusStyles';// Helper function to get bias detection status


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

  // 2) Use server table hook for data management
  const {
    data: rawTasks,
    loading,
    error,
    pagination,
    params,
    updateSearch,
    updateFilter,
    changePage,
    updateSort,
    resetFilters,
    refetch
  } = useServerTable(tasksAPI.getAll, {
    page: 1,
    limit: 10,
    sortBy: 'startDate',
    sortOrder: 'desc'
  });

  // 3) Transform backend data to match component's expected format using useMemo to prevent recreation
  const tasks = useMemo(() =>
    rawTasks.map(task => ({
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
    })), [rawTasks]
  );

  // 4) Calculate summary statistics - we'll need a separate API call for this
  const [summary, setSummary] = useState([
    { label: 'Task Ongoing', value: 0 },
    { label: 'Tasks to Approve', value: 0 },
    { label: 'Task to Review', value: 0 },
    { label: 'Task Completed', value: 0 },
    { label: 'Bias Detected', value: 0 },
  ]);

  // Fetch summary statistics - memoize to prevent recreation
  const fetchSummary = useCallback(async () => {
    try {
      // Get all tasks for summary calculation (without pagination)
      const response = await tasksAPI.getAll({ limit: 1000, page: 1 });
      if (response.data.success) {
        const allTasks = response.data.data;

        const tasksToApprove = allTasks.filter(task =>
          task.taskStatus === 'submittedAndAwaitingApproval'
        ).length;

        const taskOngoing = allTasks.filter(task =>
          task.taskStatus === 'inProgress'
        ).length;

        const tasksToReview = allTasks.filter(task =>
          task.taskStatus === 'submittedAndAwaitingReview'
        ).length;

        const taskCompleted = allTasks.filter(task =>
          task.taskStatus === 'completed'
        ).length;

        const tasksWithBias = allTasks.filter(task =>
          task.bias_check?.is_bias === true
        ).length;

        setSummary([
          { label: 'Task Ongoing', value: taskOngoing },
          { label: 'Tasks to Approve', value: tasksToApprove },
          { label: 'Task to Review', value: tasksToReview },
          { label: 'Task Completed', value: taskCompleted },
          { label: 'Bias Detected', value: tasksWithBias },
        ]);
      }
    } catch (err) {
      console.error('Error fetching summary:', err);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]); // Use memoized function

  // 5) Selected row state
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // Update selected task when tasks are loaded
  useEffect(() => {
    if (tasks.length > 0 && !selectedTaskId) {
      setSelectedTaskId(tasks[0].id);
    }
  }, [tasks.length, selectedTaskId]); // Changed dependency to tasks.length to prevent infinite loop

  // 6) Handle task view - memoize to prevent recreation
  const handleViewTask = useCallback((taskId) => {
    navigate(`/reports/tasks/${taskId}`);
  }, [navigate]);

  // 7) Filter options - memoize to prevent recreation
  const statusOptions = useMemo(() => [
    { value: 'inProgress', label: 'In Progress' },
    { value: 'submittedAndAwaitingApproval', label: 'Awaiting Approval' },
    { value: 'submittedAndAwaitingReview', label: 'Awaiting Review' },
    { value: 'completed', label: 'Completed' },
    { value: 'submissionRejected', label: 'Submission Rejected' },
    { value: 'approvalRejected', label: 'Approval Rejected' },
    { value: 'revisionInProgress', label: 'Revision in Progress' }
  ], []);

  const biasStatusOptions = useMemo(() => [
    { value: 'not-checked', label: 'Not Checked' },
    { value: 'pending', label: 'Bias Detected' },
    { value: 'no-bias', label: 'No Bias' },
    { value: 'bias-detected', label: 'Pending' }
  ], []);

  // 8) Table column definitions
  const columns = useMemo(() => [
    {
      header: 'Task Title',
      accessor: 'title',
      sortable: true,
      render: (r) => (
        <div className="max-w-xs truncate" title={r.title}>
          {r.title}
        </div>
      )
    },
    {
      header: 'Employee',
      accessor: 'employeeName',
      sortable: true
    },
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
      sortable: true,
      render: (r) => (
        <span className="text-xs">{r.score || 'N/A'}</span>
      ),
    }
  ], [handleViewTask]);

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

      {/* Search and Filters */}
      <div className="card-static border border-primary mb-4 p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <SearchInput
              id="team-tasks-search"
              name="teamTasksSearch"
              value={params.search}
              onChange={updateSearch}
              placeholder="Search tasks or staff names..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="flex gap-3">
            <FilterSelect
              id="team-tasks-status-filter"
              name="teamTasksStatusFilter"
              value={params.status}
              onChange={(value) => updateFilter('status', value)}
              options={statusOptions}
              placeholder="All Statuses"
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />

            <FilterSelect
              id="team-tasks-bias-filter"
              name="teamTasksBiasFilter"
              value={params.biasStatus}
              onChange={(value) => updateFilter('biasStatus', value)}
              options={biasStatusOptions}
              placeholder="All Bias Status"
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />

            <button
              onClick={resetFilters}
              className="btn-primary"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Results info */}
        <div className="mt-3 text-sm text-gray-600">
          {loading ? (
            'Loading...'
          ) : (
            `Showing ${tasks.length} of ${pagination.totalTasks} tasks`
          )}
        </div>
      </div>

      {/* Tasks Table */}
      <DataTable
        title={"Team Tasks"}
        columns={columns}
        data={tasks}
        rowKey="id"
        onRowClick={({ id }) => setSelectedTaskId(id)}
        containerClass="card-static mb-4"
        variant='gradient'
        sortBy={params.sortBy}
        sortOrder={params.sortOrder}
        onSort={updateSort}
      />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={changePage}
        />
      )}

      {/* Show message if no tasks */}
      {tasks.length === 0 && !loading && (
        <div className="card-static text-center">
          <p className="text-gray-600">No tasks found.</p>
          {(params.search || params.status || params.biasStatus) && (
            <button
              onClick={resetFilters}
              className="mt-2 text-primary hover:underline"
            >
              Clear filters to see all tasks
            </button>
          )}
        </div>
      )}
    </div>
  );
}

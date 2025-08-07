import React, { useEffect } from "react";
import { Edit2, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import { tasksAPI } from "../utils/api";
import authService from "../utils/authService";
import { fetchTasksByUserId, clearError } from '../store/staffSlice';
import { getDisplayTaskStatus } from '../utils/statusStyles';

// Constants
const COLORS = {
  PRIMARY: 'text-[#810000]',
  SECONDARY: 'text-[#CE1212]',
  TERTIARY: 'text-[#1B1717]'
};

const SUMMARY_CARDS_CONFIG = [
  { title: "Total Tasks", color: COLORS.PRIMARY },
  { title: "Ongoing", color: COLORS.SECONDARY, filterFn: (t) => t.taskStatus === "In Progress" },
  { title: "Under Review", color: COLORS.TERTIARY, filterFn: (t) => t.taskStatus === "Awaiting Review" || t.taskStatus === "Awaiting Approval" },
  { title: "Completed", color: COLORS.PRIMARY, filterFn: (t) => t.taskStatus === "Completed" },
];

// Reusable SummaryCards component
const SummaryCards = ({ tasks }) => {
  const getSummaryData = () => {
    return SUMMARY_CARDS_CONFIG.map(config => ({
      ...config,
      count: config.filterFn ? tasks.filter(config.filterFn).length : tasks.length
    }));
  };

  return (
    <div className="mb-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {getSummaryData().map((card, i) => (
          <div key={i} className="card-outline">
            <h3 className="text-xs font-medium text-[#1B1717] opacity-75">{card.title}</h3>
            <p className={`text-xl font-bold mt-1 ${card.color}`}>{card.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Reusable AddTaskButton component
const AddTaskButton = ({ onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`btn-primary ${className}`}
  >
    + Add Task
  </button>
);

export default function ManageTasks() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = authService.getStoredUser();

  // Get data from Redux store
  const { tasks, isLoading, error } = useSelector((state) => state.staff);
  console.log("Tasks from Redux:", tasks);

  // Fetch tasks on component mount
  useEffect(() => {
    if (user?._id) {
      dispatch(fetchTasksByUserId(user._id));
    }
  }, [dispatch, user?._id]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Transform tasks data for display
  const transformedTasks = Array.isArray(tasks) ? tasks.map(task => ({
    taskId: task._id,
    taskTitle: task.title,
    taskDescription: task.description,
    deadline: task.deadline ? new Date(task.deadline).toLocaleDateString() : "To be determined",
    taskStatus: getDisplayTaskStatus(task.taskStatus),
    submitted: task.taskStatus === 'submittedAndAwaitingReview' || task.taskStatus === 'submittedAndAwaitingApproval' || task.taskStatus === 'completed',
    score: task.score || "N/A"
  })) : [];


  const handleEdit = (id) => {
    navigate(`/tasks/${id}/edit`);
  };

  const handleView = (id) => {
    navigate(`/tasks/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete this task?`)) {
      try {
        await tasksAPI.delete(id);
        // Refresh tasks after deletion
        if (user?._id) {
          dispatch(fetchTasksByUserId(user._id));
        }
        alert('Task deleted successfully');
      } catch (err) {
        console.error('Error deleting task:', err);
        alert('Failed to delete task. Please try again.');
      }
    }
  };

  const handleSubmit = (taskId) => {
    // Navigate to ViewTask with submission mode
    navigate(`/tasks/${taskId}?mode=submit`);
  };

  // Helper functions for button visibility
  const canEditTask = (task) => {
    const editableStatuses = ["Draft", "Approval Rejected", "Revision In Progress"];
    return editableStatuses.includes(task.taskStatus) && 
           task.taskStatus !== "Submission Rejected" && 
           !task.submitted;
  };

  const canViewTask = (task) => {
    const viewableStatuses = ["In Progress", "Awaiting Review", "Awaiting Approval", "Submission Rejected", "Completed"];
    return viewableStatuses.includes(task.taskStatus);
  };

  const columns = [
    {
      header: "Task ID",
      accessor: "taskId",
      render: (task) => (
        <span className={`font-mono ${COLORS.PRIMARY} font-semibold whitespace-nowrap`}>
          {task.taskId.slice(-8)}
        </span>
      )
    },
    {
      header: "Title",
      accessor: "taskTitle",
      render: (task) => (
        <span className="font-medium">{task.taskTitle}</span>
      )
    },
    {
      header: "Description",
      accessor: "taskDescription",
      render: (task) => (
        <span className={COLORS.TERTIARY}>{task.taskDescription}</span>
      )
    },
    {
      header: "Deadline",
      accessor: "deadline",
      render: (task) => (<span className={COLORS.TERTIARY}>{task.deadline}</span>)
    },
    {
      header: "Status",
      accessor: "taskStatus",
      render: (task) => (
        <StatusBadge
          status={task.taskStatus}
          type="task"
          size="xs"
          showIcon={false}
        />
      )
    },
    {
      header: "Manage",
      accessor: "manage",
      render: (task) => (
        <div className="flex gap-2">
          {canEditTask(task) && (
            <>
              <button
                onClick={() => handleEdit(task.taskId)}
                className={`flex items-center gap-1 bg-gray-100 hover:bg-gray-200 ${COLORS.TERTIARY} px-2 py-1 rounded text-xs border border-[#1B1717]`}
              >
                <Edit2 className="w-3 h-3" /> Edit
              </button>
              <button
                onClick={() => handleDelete(task.taskId)}
                className={`flex items-center gap-1 bg-gray-100 hover:bg-gray-200 ${COLORS.TERTIARY} px-2 py-1 rounded text-xs border border-[#1B1717]`}
              >
                <Trash2 className="w-3 h-3" /> Delete
              </button>
            </>
          )}
          {canViewTask(task) && (
            <button
              onClick={() => handleView(task.taskId)}
              className="btn-outline text-xs flex items-center gap-1"
            >
              <Eye className="w-3 h-3" />
              View
            </button>
          )}
        </div>
      )
    },
    {
      header: "Action",
      accessor: "action",
      render: (task) => (
        <div className="text-xs">
          {task.submitted ? (
            <span className="bg-primary text-white px-3 py-1 rounded-full text-xs">Submitted</span>
          ) : (
            <button
              onClick={() => handleSubmit(task.taskId)}
              className="btn-primary text-xs"
            >
              Submit
            </button>
          )}
        </div>
      )
    },
    {
      header: "Score",
      accessor: "score",
      render: (task) => (
        <div className="text-center">
          <span className={`font-bold ${task.score !== "N/A" ? COLORS.TERTIARY : "text-gray-400"}`}>
            {task.score}
          </span>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 w-full mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="page-title">Manage Tasks</h1>
          <AddTaskButton onClick={() => navigate("/tasks/new")} />
        </div>

        {/* Loading State */}
        {isLoading && tasks.length === 0 && (
          <div className="flex justify-center items-center py-8">
            <div className={COLORS.PRIMARY}>Loading tasks...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            <button
              onClick={() => user?._id && dispatch(fetchTasksByUserId(user._id))}
              className="ml-2 underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Show loading indicator during operations */}
        {isLoading && tasks.length > 0 && (
          <div className="mb-4 text-blue-600">
            Loading...
          </div>
        )}

        {/* Content */}
        {!isLoading && !error && (
          <>
            {/* Summary Cards */}
            <SummaryCards tasks={transformedTasks} />


            {/* Note Section */}
            <div className="card-outline mb-4 border-red-800">
              <p><span className="font-semibold">Note:</span> Scores will be available once tasks are marked as Completed.</p>
            </div>

            {/* Task Table */}
            <DataTable
              title="Manage Tasks"
              columns={columns}
              data={transformedTasks}
              rowKey="taskId"
              variant="gradient"
            />
          </>
        )}

        {/* Show content with loading overlay when no initial error */}
        {(!error && tasks.length === 0 && !isLoading) && (
          <>
            {/* Summary Cards */}
            <SummaryCards tasks={[]} />

            {/* Add Task Button */}
            <div className="flex justify-end">
              <AddTaskButton onClick={() => navigate("/tasks/new")} />
            </div>

            {/* No tasks message */}
            <div className="card-outline mb-4 border-red-800 text-center my-4">
              <p>No tasks found. Start by creating your first task!</p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
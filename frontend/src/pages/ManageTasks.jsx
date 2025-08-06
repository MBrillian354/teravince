import React, { useState, useEffect } from "react";
import { Edit2, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import { tasksAPI } from "../utils/api";
import authService from "../utils/authService";
import { fetchTasksByUserId, clearError } from '../store/staffSlice';
import { getDisplayTaskStatus } from '../utils/statusStyles';

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
    const task = transformedTasks.find((t) => t.taskId === id);
    navigate(`/tasks/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete this task?`)) {
      try {
        await tasksAPI.delete(id);
        // Refresh tasks after deletion
        if (user?.id) {
          dispatch(fetchTasksByUserId(user.id));
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

  const columns = [
    {
      header: "Task ID",
      accessor: "taskId",
      render: (task) => (
        <span className="font-mono text-[#810000] font-semibold whitespace-nowrap">
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
        <span className="text-[#1B1717]">{task.taskDescription}</span>
      )
    },
    {
      header: "Deadline",
      accessor: "deadline",
      render: (task) => (<span className="text-[#1B1717]">{task.deadline}</span>)
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
          {(task.taskStatus === "Draft" || 
            task.taskStatus === "Approval Rejected" || 
            task.taskStatus === "Submission Rejected" ||
            task.taskStatus === "Revision In Progress") && !task.submitted && (
            <>
              <button
                onClick={() => handleEdit(task.taskId)}
                className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-[#1B1717] px-2 py-1 rounded text-xs border border-[#1B1717]"
              >
                <Edit2 className="w-3 h-3" /> Edit
              </button>
              <button
                onClick={() => handleDelete(task.taskId)}
                className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-[#1B1717] px-2 py-1 rounded text-xs border border-[#1B1717]"
              >
                <Trash2 className="w-3 h-3" /> Delete
              </button>
            </>
          )}
          {(task.taskStatus === "In Progress" || 
            task.taskStatus === "Awaiting Review" || 
            task.taskStatus === "Awaiting Approval" ||
            task.taskStatus === "Completed") && (
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
            <span className="bg-[#5A0000]/[0.7] text-white px-3 py-1 rounded-full text-xs">Submitted</span>
          ) : (
            <button
              onClick={() => handleSubmit(task.taskId)}
              className="btn-primary tex-xs"
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
          <span className={`font-bold ${task.score !== "N/A" ? "text-[#1B1717]" : "text-gray-400"}`}>
            {task.score}
          </span>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#EEEBDD] text-[#1B1717] flex flex-col">
      <main className="flex-1 w-full mx-auto px-4 py-4">
        {/* Loading State */}
        {isLoading && tasks.length === 0 && (
          <div className="flex justify-center items-center py-8">
            <div className="text-[#810000]">Loading tasks...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            <button
              onClick={() => user?.id && dispatch(fetchTasksByUserId(user.id))}
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
            <div className="mb-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { title: "Total Tasks", count: transformedTasks.length, color: "text-[#810000]" },
                  { title: "Ongoing", count: transformedTasks.filter((t) => t.status === "Ongoing").length, color: "text-[#CE1212]" },
                  { title: "Under Review", count: transformedTasks.filter((t) => t.status === "Under Review").length, color: "text-[#1B1717]" },
                  { title: "Completed", count: transformedTasks.filter((t) => t.status === "Completed").length, color: "text-[#810000]" },
                ].map((card, i) => (
                  <div key={i} className="card-outline">
                    <h3 className="text-xs font-medium text-[#1B1717] opacity-75">{card.title}</h3>
                    <p className={`text-xl font-bold mt-1 ${card.color}`}>{card.count}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Task Button */}
            <div className="flex justify-end">
              <button
                onClick={() => navigate("/tasks/new")}
                className="btn-primary"
              >
                + Add Task
              </button>
            </div>

            {/* Note Section */}
            <div className="bg-[#EEEBDD] my-4 p-3 rounded-lg border border-[#CE1212] text-sm text-[#1B1717]">
              <p><span className="font-semibold">Note:</span> Scores will be available once tasks are marked as Completed.</p>
            </div>

            {/* Task Table */}
            <DataTable
              columns={columns}
              data={transformedTasks}
              rowKey="taskId"
              variant="gradient"
              title="Task Management Recap"
            />
          </>
        )}

        {/* Show content with loading overlay when no initial error */}
        {(!error && tasks.length === 0 && !isLoading) && (
          <>
            {/* Summary Cards */}
            <div className="mb-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { title: "Total Tasks", count: 0, color: "text-[#810000]" },
                  { title: "Ongoing", count: 0, color: "text-[#CE1212]" },
                  { title: "Under Review", count: 0, color: "text-[#1B1717]" },
                  { title: "Completed", count: 0, color: "text-[#810000]" },
                ].map((card, i) => (
                  <div key={i} className="card-outline">
                    <h3 className="text-xs font-medium text-[#1B1717] opacity-75">{card.title}</h3>
                    <p className={`text-xl font-bold mt-1 ${card.color}`}>{card.count}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Task Button */}
            <div className="flex justify-end">
              <button
                onClick={() => navigate("/tasks/new")}
                className="btn-primary"
              >
                + Add Task
              </button>
            </div>

            {/* No tasks message */}
            <div className="bg-[#EEEBDD] my-4 p-3 rounded-lg border border-[#CE1212] text-sm text-[#1B1717] text-center">
              <p>No tasks found. Start by creating your first task!</p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
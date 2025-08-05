import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import DynamicForm from '../components/DynamicForm';
import { fetchTaskById, fetchTasks } from '../store/staffSlice';
import { useModal } from '../hooks/useModal';

export default function ViewTask() {
  const { id, taskId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showError } = useModal();

  const { currentTask, tasks, isLoading } = useSelector(state => state.staff);

  let task;
  // Get task from current task or tasks array
  if (taskId) {
    // If taskId is provided, find the task in the tasks array
    console.log('Finding task by TaskID:', taskId);
    task = currentTask || tasks.find(t => t._id === taskId);
  } else {
    // If no taskId, use currentTask
    console.log('Finding task by ID:', id);
    task = currentTask || tasks.find(t => t._id === id);
  }

  // Fetch task if not loaded
  useEffect(() => {
    if (!task && !isLoading) {
      taskId ? dispatch(fetchTaskById(taskId)) : dispatch(fetchTasks(id));
    }
  }, [dispatch, task, isLoading, id, taskId]);

  // Fetch all tasks if tasks array is empty and no current task
  useEffect(() => {
    if (!currentTask && tasks.length === 0 && !isLoading) {
      dispatch(fetchTasks());
    }
  }, [dispatch, currentTask, tasks.length, isLoading]);

  useEffect(() => {
    if (!isLoading && !task) {
      showError(
        'Task Not Found',
        'The task you are trying to view could not be found.',
        {
          onConfirm: () => {
            navigate('/tasks');
          },
          autoClose: true,
          timeout: 3000
        },
      );
    }
  }, [task, isLoading, showError, navigate]);

  // Helper function to get display status
  const getDisplayTaskStatus = (taskStatus) => {
    switch (taskStatus) {
      case 'inProgress':
        return 'Ongoing';
      case 'submitted':
        return 'Under Review';
      case 'completed':
        return 'Completed';
      case 'rejected':
        return 'Rejected';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Draft';
    }
  };

  const getDisplayApprovalStatus = (approvalStatus) => {
    switch (approvalStatus) {
      case 'pending':
        return 'Under Review';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Pending';
    }
  };

  const formFields = [
    {
      type: 'text',
      name: 'title',
      label: 'Task Title',
      defaultValue: task ? task.title : '',
      disabled: true
    },
    {
      type: 'textarea',
      name: 'description',
      label: 'Task Description',
      rows: 4,
      defaultValue: task ? task.description : '',
      disabled: true
    },
    {
      type: 'textarea',
      name: 'kpis',
      label: 'Key Performance Indicators (KPIs)',
      rows: 3,
      defaultValue: task && task.kpis ? task.kpis.map(kpi =>
        `${kpi.kpiTitle}: ${kpi.amount}`
      ).join('\n') : '',
      disabled: true
    },
    {
      type: 'number',
      name: 'score',
      label: 'Score',
      min: 0,
      max: 100,
      defaultValue: task ? task.score : '',
      disabled: true
    },
    {
      type: 'textarea',
      name: 'evidence',
      label: 'Evidence',
      rows: 3,
      defaultValue: task ? task.evidence : '',
      disabled: true
    },
    {
      type: 'text',
      name: 'createdDate',
      label: 'Created Date',
      defaultValue: task && task.createdDate ? new Date(task.createdDate).toISOString().split('T')[0] : '',
      disabled: true
    },
    {
      type: 'text',
      name: 'startDate',
      label: 'Start Date',
      defaultValue: task && task.startDate ? new Date(task.startDate).toISOString().split('T')[0] : 'Not Started',
      disabled: true
    },
    {
      type: 'text',
      name: 'endDate',
      label: 'End Date',
      defaultValue: task && task.endDate ? new Date(task.endDate).toISOString().split('T')[0] : 'Not Finished',
      disabled: true
    },
    {
      type: 'text',
      name: 'deadline',
      label: 'Deadline',
      defaultValue: task && task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : 'To be determined',
      disabled: true
    },
    {
      type: 'text',
      name: 'taskStatus',
      label: 'Task Status',
      defaultValue: task ? getDisplayTaskStatus(task.taskStatus) : '',
      disabled: true
    },
    {
      type: 'text',
      name: 'approvalStatus',
      label: 'Approval Status',
      defaultValue: task ? getDisplayApprovalStatus(task.approvalStatus) : '',
      disabled: true
    },
    {
      type: 'textarea',
      name: 'supervisorComment',
      label: 'Supervisor Comment',
      rows: 2,
      defaultValue: task ? task.supervisorComment : 'Waiting for review',
      disabled: true
    }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-[#810000]">Loading task...</div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">Task not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#EEEBDD] min-h-screen px-4 py-6 text-[#1B1717]">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md border border-[#CE1212]">
        {/* Announcement for Under Review Status */}
        {task.taskStatus === "submitted" && (
          <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-800">
                  Task is being Reviewed. Please kindly wait.
                </p>
              </div>
            </div>
          </div>
        )}

        <DynamicForm
          title="View Task"
          subtitle="Task details (read-only)"
          fields={formFields}
          showSubmitButton={false}
          footer={
            <div className="flex justify-start mt-6">
              <button
                onClick={() => navigate('/tasks')}
                className="bg-[#5A0000] hover:bg-[#400000] text-white text-sm px-4 py-2 rounded shadow-sm transition"
              >
                Back to Tasks
              </button>
            </div>
          }
        />
      </div>
    </div>
  );
}
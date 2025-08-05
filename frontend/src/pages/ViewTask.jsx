import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import DynamicForm from '../components/DynamicForm';
import { fetchTaskById, fetchTasks, fetchTasksByUserId } from '../store/staffSlice';
import { useModal } from '../hooks/useModal';
import { tasksAPI } from "../utils/api";
import authService from "../utils/authService";
import StatusNotification from "@/components/StatusNotification";

export default function ViewTask() {
  const { id, taskId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showError, showSuccess } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = authService.getStoredUser();
  const { currentTask, tasks, isLoading } = useSelector(state => state.staff);

  // Check if we're in submission mode
  const isSubmissionMode = searchParams.get('mode') === 'submit';

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

  // Handle task submission
  const handleSubmitTask = async () => {
    if (!task) return;

    setIsSubmitting(true);
    try {
      // Update task status to 'submitted'
      const updateData = { taskStatus: 'submitted' };
      if (task?.approvalStatus === 'draft') {
        updateData.approvalStatus = 'pending';
      }

      await tasksAPI.update(task._id, updateData);

      // Refresh tasks after submission
      if (user?._id) {
        dispatch(fetchTasksByUserId(user._id));
      }

      showSuccess(
        'Task Submitted Successfully',
        'Your task has been submitted for review.',
        {
          onConfirm: () => {
            navigate('/tasks');
          },
          autoClose: true,
          timeout: 3000
        }
      );
    } catch (err) {
      console.error('Error submitting task:', err);
      showError(
        'Submission Failed',
        'Failed to submit task. Please try again.',
        {
          onConfirm: () => { },
          autoClose: true,
          timeout: 3000
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if task can be submitted
  const canSubmitTask = () => {
    if (!task) return false;
    return task.taskStatus === 'inProgress' || task.taskStatus === 'draft' || task.taskStatus === 'rejected';
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
      disabled: isSubmissionMode ? false : true
    },
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
        {/* Announcement for Submission Mode */}
        {isSubmissionMode && canSubmitTask() && (
          <StatusNotification
            type="info"
            message="Please review the task details below and submit when ready."
          />

        )}

        {/* Announcement for Already Submitted Tasks */}
        {isSubmissionMode && !canSubmitTask() && task?.taskStatus === "submitted" && (
          <StatusNotification
            type="info"
            message="This task has already been submitted and is under review."
          />
        )}

        {/* Announcement for Under Review Status */}
        {!isSubmissionMode && task.taskStatus === "submitted" && (
          <StatusNotification
            type="info"
            message="Task is being Reviewed. Please kindly wait."
          />
        )}

        <DynamicForm
          title="View Task"
          subtitle={isSubmissionMode ? "Review task details before submission" : "Task details (read-only)"}
          fields={formFields}
          showSubmitButton={false}
          footer={
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => navigate('/tasks')}
                className="btn-outline"
              >
                Back to Tasks
              </button>

              {isSubmissionMode && canSubmitTask() && (
                <div className="flex gap-3">
                  {task?.approvalStatus !== 'approved' && (
                    <button
                      onClick={() => navigate(`/tasks/${task._id}/edit`)}
                      className="btn-outline"
                    >
                      Edit Task
                    </button>
                  )}
                  <button
                    onClick={handleSubmitTask}
                    disabled={isSubmitting}
                    className="btn-primary"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Task'}
                  </button>
                </div>
              )}
            </div>
          }
        />
      </div>
    </div>
  );
}
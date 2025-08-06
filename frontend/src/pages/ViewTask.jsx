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
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [isUploadingEvidence, setIsUploadingEvidence] = useState(false);
  const [kpiAchievedAmounts, setKpiAchievedAmounts] = useState({});

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

  console.log('Current Task:', task);

  // Fetch task if not loaded
  useEffect(() => {
    if (!task && !isLoading) {
      taskId ? dispatch(fetchTaskById(taskId)) : dispatch(fetchTasks(id));
    }
  }, [dispatch, task, isLoading, id, taskId]);

  // Initialize KPI achieved amounts when task is loaded
  useEffect(() => {
    if (task && task.kpis && task.kpis.length > 0) {
      const initialKpiAmounts = {};
      task.kpis.forEach((kpi, index) => {
        initialKpiAmounts[index] = kpi.achievedAmount || '';
      });
      setKpiAchievedAmounts(initialKpiAmounts);
    }
  }, [task]);

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

  // Helper function to get display status using new enum
  const getDisplayTaskStatus = (taskStatus) => {
    switch (taskStatus) {
      case 'inProgress':
        return 'In Progress';
      case 'submittedAndAwaitingReview':
        return 'Awaiting Review';
      case 'submittedAndAwaitingApproval':
        return 'Awaiting Approval';
      case 'revisionInProgress':
        return 'Revision In Progress';
      case 'submissionRejected':
        return 'Submission Rejected';
      case 'approvalRejected':
        return 'Approval Rejected';
      case 'completed':
        return 'Completed';
      case 'draft':
        return 'Draft';
      default:
        return taskStatus;
    }
  };

  // Handle task submission
  const handleSubmitTask = async () => {
    if (!task) return;

    // Validate KPI achieved amounts in submission mode for tasks in progress
    if (isSubmissionMode && task.taskStatus === 'inProgress' && task.kpis && task.kpis.length > 0) {
      const missingKpis = [];
      task.kpis.forEach((kpi, index) => {
        if (!kpiAchievedAmounts[index] || kpiAchievedAmounts[index].toString().trim() === '') {
          missingKpis.push(kpi.kpiTitle);
        }
      });

      if (missingKpis.length > 0) {
        showError(
          'Missing KPI Data',
          `Please fill in the achieved amount for all KPIs: ${missingKpis.join(', ')}`,
          {
            autoClose: true,
            timeout: 10000
          }
        );
        return;
      }
    }

    setIsSubmitting(true);
    try {
      // Determine the appropriate status based on current state
      let newTaskStatus = 'submittedAndAwaitingApproval'; // Default for new tasks

      // If task was previously rejected, determine the appropriate submitted status
      if (task.taskStatus === 'approvalRejected') {
        newTaskStatus = 'submittedAndAwaitingApproval';
      } else if (task.taskStatus === 'submissionRejected' || task.taskStatus === 'revisionInProgress' || task.taskStatus === 'inProgress') {
        newTaskStatus = 'submittedAndAwaitingReview';
      }

      const updateData = {
        taskStatus: newTaskStatus,
        submittedDate: new Date(),
        ...(newTaskStatus === 'submittedAndAwaitingReview' ? { completedDate: new Date() } : {}),
        bias_check: null
      };

      // Include updated KPI data if in submission mode for tasks in progress
      if (isSubmissionMode && task.taskStatus === 'inProgress' && task.kpis && task.kpis.length > 0) {
        const updatedKpis = task.kpis.map((kpi, index) => ({
          ...kpi,
          achievedAmount: parseFloat(kpiAchievedAmounts[index]) || 0
        }));
        updateData.kpis = updatedKpis;
      }

      await tasksAPI.update(task._id, updateData);

      // Refresh tasks after submission
      if (user?._id) {
        dispatch(fetchTasksByUserId(user._id));
      }

      showSuccess(
        'Task Submitted Successfully',
        `Your task has been submitted and is ${getDisplayTaskStatus(newTaskStatus)}.`,
        {
          onConfirm: () => {
            navigate('/tasks');
          },
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
    return task.taskStatus === 'inProgress' ||
      task.taskStatus === 'draft' ||
      task.taskStatus === 'approvalRejected' ||
      task.taskStatus === 'submissionRejected' ||
      task.taskStatus === 'revisionInProgress';
  };

  // Handle evidence file upload
  const handleEvidenceUpload = async (file) => {
    if (!file || !task) return;

    setIsUploadingEvidence(true);
    try {
      const formData = new FormData();
      formData.append('evidence', file);

      await tasksAPI.uploadEvidence(task._id, formData);

      // Refresh task data
      if (taskId) {
        dispatch(fetchTaskById(taskId));
      } else {
        dispatch(fetchTaskById(task._id));
      }

      showSuccess(
        'Evidence Uploaded',
        'Evidence file has been uploaded successfully.',
        {
          autoClose: true,
          timeout: 3000
        }
      );
    } catch (err) {
      console.error('Error uploading evidence:', err);
      showError(
        'Upload Failed',
        'Failed to upload evidence file. Please try again.',
        {
          autoClose: true,
          timeout: 3000
        }
      );
    } finally {
      setIsUploadingEvidence(false);
    }
  };

  // Handle KPI achieved amount changes
  const handleKpiAchievedAmountChange = (index, value) => {
    setKpiAchievedAmounts(prev => ({
      ...prev,
      [index]: value
    }));
  };

  // Handle form submission (for evidence file upload)
  const handleFormSubmit = (formData) => {
    if (formData.evidence && formData.evidence instanceof File) {
      handleEvidenceUpload(formData.evidence);
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
      name: 'completedDate',
      label: 'Completed Date',
      defaultValue: task && task.completedDate ? new Date(task.completedDate).toISOString().split('T')[0] : 'Not Finished',
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
    ...(task?.taskStatus !== 'draft' ? [{
      type: 'textarea',
      name: 'supervisorComment',
      label: 'Supervisor Comment',
      rows: 2,
      defaultValue: task ? task.supervisorComment : 'Waiting for review',
      disabled: true
    }] : []),
    ...(task?.taskStatus !== 'draft' ? [{
      type: 'number',
      name: 'score',
      label: 'Score',
      min: 0,
      max: 100,
      defaultValue: task ? task.score : '',
      disabled: true
    }] : []),
    // KPI fields - show individual inputs in submission mode for tasks in progress, otherwise show as readonly
    ...(isSubmissionMode && task?.taskStatus === 'inProgress' && task?.kpis && task.kpis.length > 0
      ? task.kpis.map((kpi, index) => ([
        {
          type: 'text',
          name: `kpi_title_${index}`,
          label: `KPI ${index + 1}: ${kpi.kpiTitle}`,
          defaultValue: `Target: ${kpi.targetAmount} (${kpi.operator})`,
          disabled: true,
          group: 'kpis',
          isDynamic: false,
          position: 'top'
        },
        {
          type: 'number',
          name: `kpi_achieved_${index}`,
          label: 'Achieved Amount',
          defaultValue: kpiAchievedAmounts[index] || '',
          disabled: false,
          required: true,
          placeholder: 'Enter achieved amount',
          group: 'kpis',
          isDynamic: false,
          position: 'bottom',
          min: 0,
          onChange: (value) => handleKpiAchievedAmountChange(index, value)
        }
      ])).flat()
      : [{
        type: 'textarea',
        name: 'kpis',
        label: 'Key Performance Indicators (KPIs)',
        rows: 3,
        defaultValue: task && task.kpis ? task.kpis.map(kpi =>
          `${kpi.kpiTitle}: Target ${kpi.targetAmount}, Achieved ${kpi.achievedAmount || 0} (${kpi.operator})`
        ).join('\n') : '',
        disabled: true
      }]
    ),
    ...((task?.taskStatus === 'submissionRejected' || task?.taskStatus === 'inProgress') && task?.taskStatus !== 'draft' ? [{
      type: isSubmissionMode ? 'file' : 'link',
      name: 'evidence',
      label: 'Evidence',
      defaultValue: task ? task.evidence : '',
      disabled: isSubmissionMode ? false : true,
      className: isSubmissionMode ? '' : 'justify-start',
      accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt,.xlsx,.xls',
      hint: isSubmissionMode ? 'Upload files as evidence for this task (PDF, DOC, images, etc.)' : ''
    }] : []),
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
    <div className="bg-background min-h-screen px-4 py-6 text-[#1B1717]">
      <div className="max-w-4xl mx-auto p-6 bg-surface rounded-lg shadow-md border border-primary">
        {/* Announcement for Submission Mode */}
        {isSubmissionMode && canSubmitTask() && (
          <StatusNotification
            type="info"
            message="Please review the task details below and submit when ready."
          />

        )}

        {/* Announcement for Already Submitted Tasks */}
        {isSubmissionMode && !canSubmitTask() && (task?.taskStatus === "submittedAndAwaitingReview" || task?.taskStatus === "submittedAndAwaitingApproval") && (
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
          title={isSubmissionMode ? `Submit Task` : `View Task`}
          subtitle={isSubmissionMode ? "Review task details before submission" : "Task details (read-only)"}
          fields={formFields}
          onSubmit={isSubmissionMode ? handleFormSubmit : undefined}
          showSubmitButton={isSubmissionMode && !task?.evidence && !isUploadingEvidence && task?.taskStatus !== 'draft' && task?.taskStatus !== 'approvalRejected'}
          submitButtonText={isUploadingEvidence ? 'Uploading...' : 'Upload Evidence'}
          footer={
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => navigate('/tasks')}
                className="btn-outline"
              >
                Back to Tasks
              </button>

              {isSubmissionMode && canSubmitTask() && !(task?.taskStatus === 'draft' && !isSubmissionMode) && (
                <div className="flex gap-3">
                  {(task?.taskStatus === 'draft' || task?.taskStatus === 'approvalRejected') && (
                    <button
                      onClick={() => navigate(`/tasks/${task._id}/edit`)}
                      className="btn-outline"
                    >
                      Edit Task
                    </button>
                  )}
                  {(task?.taskStatus === 'submissionRejected' || task?.taskStatus === 'inProgress') && task?.evidence ? (
                    <span className="text-green-600 font-medium">
                      ✓ Evidence uploaded - Task ready for submission
                    </span>
                  ) : (task?.taskStatus === 'submissionRejected' || task?.taskStatus === 'inProgress') && (
                    <span className="text-orange-600 font-medium">
                      ⚠ Please upload evidence before submitting
                    </span>
                  )}
                  {/* KPI completion status */}
                  {/* {task?.taskStatus === 'inProgress' && task?.kpis && task.kpis.length > 0 && !areKpisComplete() && (
                    <span className="text-orange-600 font-medium">
                      ⚠ Please fill in achieved amounts for all KPIs
                    </span>
                  )} */}
                  <button
                    onClick={handleSubmitTask}
                    disabled={isSubmitting || (!task?.evidence && task?.taskStatus !== 'draft' && task?.taskStatus !== 'approvalRejected')}
                    className={`btn-primary ${(!task?.evidence && task?.taskStatus !== 'draft' && task?.taskStatus !== 'approvalRejected') ? 'opacity-50 cursor-not-allowed' : ''}`}
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
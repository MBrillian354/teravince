import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DynamicForm from '../components/DynamicForm';
import StatusNotification from '../components/StatusNotification';
import { fetchTaskByIdForReview, updateTaskReview, checkTaskReviewBias, clearCurrentTaskForReview, clearSupervisorError, clearBiasCheckResult } from '../store/supervisorSlice';
import { useModal } from '../hooks/useModal';

export default function SupervisorReviewingAndApprovalOfTask() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showError, showSuccess } = useModal();

  // Get task data from Redux store
  const { currentTaskForReview, biasCheckResult, isLoading, error } = useSelector(state => state.supervisor);
  const task = currentTaskForReview;

  const [supervisorComment, setSupervisorComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch task data when component mounts
  useEffect(() => {
    if (taskId) {
      dispatch(fetchTaskByIdForReview(taskId));
    }

    // Clear any existing errors
    dispatch(clearSupervisorError());

    // Cleanup function
    return () => {
      dispatch(clearCurrentTaskForReview());
      dispatch(clearBiasCheckResult());
    };
  }, [dispatch, taskId]);

  // Set supervisor comment when task is loaded
  useEffect(() => {
    if (task) {
      setSupervisorComment(task.supervisorComment || '');
    }
  }, [task]);

  // Handle errors
  useEffect(() => {
    if (error) {
      showError(
        'Error Loading Task',
        error,
        {
          onConfirm: () => {
            dispatch(clearSupervisorError());
            navigate('/reports/tasks');
          },
        }
      );
    }
  }, [error, showError, dispatch, navigate]);

  // Helper functions to format display values
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

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString).toLocaleDateString();
    return date;
  };

  // Form fields configuration
  const getFormFields = (selectedTask) => {
    if (!selectedTask) return [];

    return [
      {
        type: 'text',
        name: 'staffName',
        label: 'Staff Name',
        defaultValue: `${selectedTask.userId?.firstName} ${selectedTask.userId?.lastName}` || 'N/A',
        disabled: true,
      },
      {
        type: 'text',
        name: 'staffEmail',
        label: 'Staff Email',
        defaultValue: selectedTask.userId?.email || 'N/A',
        disabled: true,
        group: 'staff'
      }, {
        type: 'text',
        name: 'staffPhone',
        label: 'Staff Phone',
        defaultValue: selectedTask.userId?.contactInfo || 'N/A',
        disabled: true,
        group: 'staff'
      },
      {
        type: 'text',
        name: 'taskTitle',
        label: 'Task Title',
        defaultValue: selectedTask.title,
        disabled: true,
      },
      {
        type: 'textarea',
        name: 'taskDescription',
        label: 'Task Description',
        defaultValue: selectedTask.description,
        disabled: true,
        rows: 4
      },
      {
        type: 'textarea',
        name: 'kpis',
        label: 'Key Performance Indicators (KPIs)',
        defaultValue: selectedTask.kpis && selectedTask.kpis.length > 0
          ? selectedTask.kpis.map(kpi => `${kpi.kpiTitle}: ${kpi.amount} (${kpi.operator})`).join('\n')
          : 'No KPIs defined',
        disabled: true,
        rows: 3
      },
      {
        type: 'text',
        name: 'createdDate',
        label: 'Created Date',
        defaultValue: formatDate(selectedTask.createdDate),
        disabled: true,
        group: 'dates'
      },
      {
        type: 'text',
        name: 'submittedDate',
        label: 'Submitted Date',
        defaultValue: formatDate(selectedTask.submittedDate),
        required: true,
        disabled: true,
        group: 'dates'
      },
      {
        type: selectedTask.approvalStats !== 'approved' ? 'text' : 'date',
        name: 'deadline',
        label: 'Deadline',
        defaultValue: formatDate(selectedTask.deadline),
        required: true,
        group: 'dates',
        disabled: selectedTask.approvalStats !== 'approved'
      },
      ...(selectedTask.evidence ? [{
        type: 'link',
        name: 'evidence',
        label: 'Evidence',
        // href: `${process.env.REACT_APP_API_URL}${selectedTask.evidence}`,
        href: `http://localhost:5000/${selectedTask.evidence}`,
        className: 'justify-start',
      }] : []),
      {
        type: 'textarea',
        name: 'supervisorComment',
        label: 'Supervisor Comment',
        defaultValue: selectedTask.supervisorComment || supervisorComment,
        rows: 3,
        placeholder: 'Enter your review comments here...',
        disabled: selectedTask.taskStatus === 'inProgress' || selectedTask.taskStatus === 'completed'
      },

      ...(selectedTask.evidence && selectedTask.taskStatus === 'submitted' ? [{
        type: 'checkbox',
        name: 'biasReviewCheck',
        label: 'I have properly reviewed the staff\'s task without bias',
        required: true
      }] : [])
    ];
  };

  // Handle form submission for approval/revision
  const handleFormSubmit = async (formData, action) => {
    console.log('Form data:', formData);
    console.log('Action:', action);

    // Update the supervisor comment in state
    setSupervisorComment(formData.supervisorComment || '');

    // Validate required fields
    if (action === 'review' && !formData.biasReviewCheck) {
      showError(
        'Validation Error',
        'Please confirm that you have reviewed the task without bias.'
      );
      return;
    }

    if (!formData.supervisorComment || formData.supervisorComment.trim() === '') {
      showError(
        'Validation Error',
        'Please provide a supervisor comment before submitting.'
      );
      return;
    }

    if (!formData.deadline && action === 'approve') {
      showError(
        'Validation Error',
        'Please provide a deadline before submitting.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      let biasCheckResponse = null;

      // Only check for bias if reviewing a task that has already been approved and is submitted
      if (task.approvalStatus === 'approved' && task.taskStatus === 'submitted') {
        biasCheckResponse = await dispatch(checkTaskReviewBias({
          taskId: task._id,
          review: formData.supervisorComment.trim()
        })).unwrap();

        console.log('Bias check result:', biasCheckResponse);

        // If bias is detected, show warning but still allow submission
        if (biasCheckResponse.data && biasCheckResponse.data.is_bias) {
          const proceedWithBias = window.confirm(
            `Potential bias detected: ${biasCheckResponse.data.bias_label}\n\n` +
            `Reason: ${biasCheckResponse.data.bias_reason}\n\n` +
            `Do you want to proceed anyway? Consider revising your review to be more objective.`
          );

          if (!proceedWithBias) {
            setIsSubmitting(false);
            return;
          }
        }
      }

      let updateData = {
        supervisorComment: formData.supervisorComment.trim(),
        deadline: formData.deadline ? new Date(formData.deadline) : null,
      };

      if (action === 'approve') {
        updateData = {
          ...updateData,
          approvalStatus: 'approved',
          taskStatus: 'inProgress',
          bias_check: biasCheckResponse?.data || {
            reviewedWithoutBias: formData.biasReviewCheck,
            reviewDate: new Date().toISOString(),
            action: 'approved'
          }
        };
      } else if (action === 'revise') {
        updateData = {
          ...updateData,
          approvalStatus: 'rejected',
          taskStatus: 'inProgress',
          bias_check: biasCheckResponse?.data || {
            reviewedWithoutBias: formData.biasReviewCheck || false,
            reviewDate: new Date().toISOString(),
            action: 'rejected'
          }
        };
      } else if (action === 'review') {
        // For reviewing already approved tasks
        updateData = {
          ...updateData,
          bias_check: biasCheckResponse?.data || {
            reviewedWithoutBias: true,
            reviewDate: new Date().toISOString(),
            action: 'reviewed'
          }
        };
      }

      await dispatch(updateTaskReview({
        taskId: task._id,
        updateData
      })).unwrap();

      // Show success message
      const actionText = action === 'approve' ? 'approved' : 'sent for revision';
      showSuccess(
        'Task Updated Successfully',
        `The task has been ${actionText} successfully.`,
        {
          onConfirm: () => {
            navigate('/reports/tasks');
          },
          autoClose: true,
          timeout: 3000
        }
      );

    } catch (error) {
      console.error('Task update failed:', error);

      // Check if it's a bias check error or task update error
      const errorMessage = typeof error === 'string' ? error :
        (error.message || `Failed to ${action} task. Please try again.`);

      showError(
        'Update Failed',
        errorMessage,
        { timeout: 5000, autoClose: false }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle button actions with form reference
  const handleButtonAction = (action) => {
    if (isSubmitting) return; // Prevent multiple submissions

    const form = document.querySelector('form');
    if (!form) return;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Get textarea and checkbox values specifically
    const supervisorCommentField = form.querySelector('[name="supervisorComment"]');
    const biasCheckField = form.querySelector('[name="biasReviewCheck"]');

    data.supervisorComment = supervisorCommentField ? supervisorCommentField.value : '';
    data.biasReviewCheck = biasCheckField ? biasCheckField.checked : false;

    handleFormSubmit(data, action);
  };

  if (isLoading && !task) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-[#810000]">Loading task details...</div>
        </div>
      </div>
    );
  }

  if (!task && !isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Task Not Found</h1>
          <p className="text-gray-600 mb-4">The requested task could not be found.</p>
          <button
            onClick={() => navigate('/reports/tasks')}
            className="btn-secondary"
          >
            Back to Tasks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Task Review</h1>
        </div>
        <button
          onClick={() => navigate('/reports/tasks')}
          className="btn-outline"
          disabled={isSubmitting}
        >
          ← Back to Tasks
        </button>
      </div>

      {/* Task Status Alert */}
      {task.approvalStatus === 'approved' && task.taskStatus === 'inProgress' && (
        <StatusNotification
          type="info"
          message="Staff is currently working on this task."
        />
      )}

      {task.approvalStatus === 'approved' && task.taskStatus === 'completed' && (
        <StatusNotification
          type="success"
          message="This task has been approved and completed."
        />
      )}

      {task.approvalStatus === 'rejected' && task.taskStatus === 'inProgress' && (
        <StatusNotification
          type="info"
          message="This task has been rejected and is currently being revised."
        />
      )}

      {task.approvalStatus === 'rejected' && task.taskStatus === 'submitted' && (
        <StatusNotification
          type="info"
          message="Staff has revised their task and is awaiting your approval."
        />
      )}

      {task.taskStatus === 'submitted' && task.approvalStatus === 'pending' && (
        <StatusNotification
          type="info"
          message="This is a new task, awaiting your review and approval."
        />
      )}

      {task.taskStatus === 'submitted' && task.approvalStatus === 'approved' && (
        <StatusNotification
          type="info"
          message="Staff has completed their task and is waiting for your review."
        />
      )}

      {/* Task Detail Form */}
      <div className="bg-white rounded shadow p-6">
        <DynamicForm
          fields={getFormFields(task)}
          showSubmitButton={false}
          className="space-y-6"
          footer={
            <div className="space-y-4">
              {/* Bias Check Result Display */}
              {biasCheckResult && biasCheckResult.data && (
                <div className={`p-4 rounded-lg border-l-4 ${biasCheckResult.data.is_bias
                  ? 'bg-red-50 border-red-500'
                  : 'bg-green-50 border-green-500'
                  }`}>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {biasCheckResult.data.is_bias ? (
                        <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="ml-3">
                      <h4 className={`text-sm font-medium ${biasCheckResult.data.is_bias ? 'text-red-800' : 'text-green-800'
                        }`}>
                        Bias Check Result: {biasCheckResult.data.is_bias ? 'Bias Detected' : 'No Bias Detected'}
                      </h4>
                      {biasCheckResult.data.is_bias && (
                        <div className="mt-2 text-sm text-red-700">
                          <p><strong>Type:</strong> {biasCheckResult.data.bias_label}</p>
                          <p><strong>Reason:</strong> {biasCheckResult.data.bias_reason}</p>
                        </div>
                      )}
                      {!biasCheckResult.data.is_bias && (
                        <p className="mt-1 text-sm text-green-700">
                          Your review appears to be objective and unbiased.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                {task.approvalStatus !== 'approved' && task.taskStatus === 'submitted' && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleButtonAction('revise')}
                      className="btn-outline"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Processing...' : 'Request Revision'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleButtonAction('approve')}
                      className="btn-secondary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Processing...' : 'Approve Task'}
                    </button>
                  </>
                )}
                {task.approvalStatus === 'approved' && task.taskStatus === 'submitted' && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleButtonAction('review')}
                      className="btn-secondary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Processing...' : 'Submit Review'}
                    </button>
                  </>
                )}
                {task.approvalStatus !== 'pending' && task.taskStatus === 'completed' && (
                  <div className="text-sm text-gray-500">
                    This task has already been {task.approvalStatus === 'approved' ? 'approved' : 'rejected'}.
                  </div>
                )}
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
}

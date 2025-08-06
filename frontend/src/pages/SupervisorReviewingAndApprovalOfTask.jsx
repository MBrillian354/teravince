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

      // If task has bias check results, set them in the store for display
      if (task.bias_check) {
        dispatch({
          type: 'supervisor/checkTaskReviewBias/fulfilled',
          payload: { data: task.bias_check }
        });
      }
    }
  }, [task, dispatch]);

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

  // Helper functions to format display values using new enum
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
          ? selectedTask.kpis.map(kpi => `${kpi.kpiTitle}: Target ${kpi.targetAmount}, Achieved ${kpi.achievedAmount || 0} (${kpi.operator})`).join('\n')
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
        type: selectedTask.taskStatus !== 'submittedAndAwaitingApproval' ? 'text' : 'date',
        name: 'deadline',
        label: 'Deadline',
        defaultValue: formatDate(selectedTask.deadline),
        required: true,
        group: 'dates',
        disabled: selectedTask.taskStatus !== 'submittedAndAwaitingApproval'
      },
      ...(selectedTask.taskStatus !== 'submittedAndAwaitingApproval' && selectedTask.evidence ? [{
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
        disabled: selectedTask.taskStatus === 'inProgress' || (selectedTask.taskStatus === 'completed' && !selectedTask.bias_check?.is_bias),
      },

      ...((selectedTask.evidence && selectedTask.taskStatus === 'completed') && (selectedTask.taskStatus === 'submittedAndAwaitingReview') ? [{
        type: 'checkbox',
        name: 'biasReviewCheck',
        label: 'I have properly reviewed the staff\'s task without bias',
        required: true
      }] : []),
      {
        type: 'checkbox',
        name: 'biasReviewCheck',
        label: 'I have properly reviewed the staff\'s task without bias',
        required: true
      }
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

      // For review actions, start bias checking in background and proceed immediately
      if (action === 'review') {
        // Start bias checking in the background without waiting
        // Fire and forget - the bias check will update the task record when it completes
        dispatch(checkTaskReviewBias({
          taskId: task._id,
          review: formData.supervisorComment.trim()
        })).then((result) => {
          // Background update completed - bias check results will be saved to the task
          console.log('Background bias check completed:', result);
        }).catch((error) => {
          // Log error but don't interrupt the user flow
          console.error('Background bias check failed:', error);
        });

        // Proceed immediately without waiting for bias check result
        biasCheckResponse = null;
      } else {
        // For approve/revise actions, check for bias only if needed
        if ((task.taskStatus === 'submittedAndAwaitingReview' || task.taskStatus === 'submittedAndAwaitingApproval') && task.bias_check?.is_bias) {
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
      }

      let updateData = {
        supervisorComment: formData.supervisorComment.trim(),
        deadline: formData.deadline ? new Date(formData.deadline) : null,
      };

      if (action === 'approve') {
        // Approve task - change status to inProgress so staff can work on it
        updateData = {
          ...updateData,
          taskStatus: 'inProgress',
          bias_check: biasCheckResponse?.data || {
            reviewedWithoutBias: formData.biasReviewCheck,
            reviewDate: new Date().toISOString(),
            action: 'approved'
          }
        };
      } else if (action === 'revise') {
        // Differentiate between revising different task states
        if (task.taskStatus === 'completed') {
          // For completed tasks, request revision - change to revisionInProgress
          updateData = {
            ...updateData,
            taskStatus: 'submissionRejected',
            bias_check: biasCheckResponse?.data || {
              reviewedWithoutBias: formData.biasReviewCheck || false,
              reviewDate: new Date().toISOString(),
              action: 'revision_requested_on_completed'
            }
          };
        } else if (task.taskStatus === 'submittedAndAwaitingApproval') {
          // For tasks awaiting approval, reject the approval
          updateData = {
            ...updateData,
            taskStatus: 'approvalRejected',
            bias_check: biasCheckResponse?.data || {
              reviewedWithoutBias: formData.biasReviewCheck || false,
              reviewDate: new Date().toISOString(),
              action: 'approval_rejected'
            }
          };
        } else if (task.taskStatus === 'submittedAndAwaitingReview') {
          // For tasks awaiting review, reject the submission
          updateData = {
            ...updateData,
            taskStatus: 'submissionRejected',
            bias_check: biasCheckResponse?.data || {
              reviewedWithoutBias: formData.biasReviewCheck || false,
              reviewDate: new Date().toISOString(),
              action: 'submission_rejected'
            }
          };
        }
      } else if (action === 'review') {
        // For reviewing completed tasks or submitted tasks - mark as completed
        updateData = {
          ...updateData,
          taskStatus: 'completed',
          completedDate: new Date(),
          bias_check: {
            reviewedWithoutBias: true,
            reviewDate: new Date().toISOString(),
            action: 'reviewed',
            backgroundCheck: true // Flag to indicate bias check is running in background
          }
        };
      }

      await dispatch(updateTaskReview({
        taskId: task._id,
        updateData
      })).unwrap();

      // For completed task reviews (when bias checking is done), redirect immediately to TeamTasks
      if (action === 'review') {
        navigate('/reports/tasks');
        return;
      }

      // Show success message for approve/revise actions
      let actionText;
      if (action === 'approve') {
        actionText = 'approved';
      } else if (action === 'revise') {
        if (task.taskStatus === 'completed') {
          actionText = 'sent back for revision';
        } else {
          actionText = 'sent for revision';
        }
      }

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
      {task.bias_check && task.bias_check.is_bias && (
        <StatusNotification
          type="error"
          message={`⚠️ BIAS DETECTED: ${task.bias_check.bias_label} - ${task.bias_check.bias_reason}`}
        />
      )}

      {task.taskStatus === 'inProgress' && (
        <StatusNotification
          type="info"
          message="Staff is currently working on this task."
        />
      )}

      {task.taskStatus === 'completed' && !task.bias_check?.is_bias && (
        <StatusNotification
          type="success"
          message="This task has been completed."
        />
      )}

      {(task.taskStatus === 'approvalRejected' || task.taskStatus === 'submissionRejected') && (
        <StatusNotification
          type="info"
          message="This task has been rejected and is awaiting revision."
        />
      )}

      {task.taskStatus === 'revisionInProgress' && (
        <StatusNotification
          type="info"
          message="Staff is currently revising this task."
        />
      )}

      {task.taskStatus === 'submittedAndAwaitingApproval' && (
        <StatusNotification
          type="info"
          message="This is a new task, awaiting your review and approval."
        />
      )}

      {task.taskStatus === 'submittedAndAwaitingReview' && !task.bias_check && (
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
              {/* Existing Bias Check Result Display - Show for completed tasks with bias detected */}
              {task.bias_check && task.taskStatus === 'completed' && (
                <div className={`p-4 rounded-lg border-l-4 ${task.bias_check.is_bias
                  ? 'bg-red-50 border-red-500'
                  : 'bg-green-50 border-green-500'
                  }`}>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {task.bias_check.is_bias ? (
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
                      <h4 className={`text-sm font-medium ${task.bias_check.is_bias ? 'text-red-800' : 'text-green-800'
                        }`}>
                        Previous Bias Check Result: {task.bias_check.is_bias ? 'Bias Detected' : 'No Bias Detected'}
                      </h4>
                      {task.bias_check.is_bias && (
                        <div className="mt-2 text-sm text-red-700">
                          <p><strong>Type:</strong> {task.bias_check.bias_label}</p>
                          <p><strong>Reason:</strong> {task.bias_check.bias_reason}</p>
                          <p className="mt-2 text-orange-700"><strong>Action Required:</strong> Please review your comments and consider providing a more objective evaluation.</p>
                        </div>
                      )}
                      {!task.bias_check.is_bias && (
                        <p className="mt-1 text-sm text-green-700">
                          Your previous review was objective and unbiased.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Current Bias Check Result Display - Show during live bias checking */}
              {biasCheckResult && biasCheckResult.data && task.taskStatus === 'submitted' && (
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
                        Current Bias Check Result: {biasCheckResult.data.is_bias ? 'Bias Detected' : 'No Bias Detected'}
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
                {/* For new tasks awaiting approval */}
                {task.taskStatus === 'submittedAndAwaitingApproval' && (
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

                {/* For completed tasks with bias detected - allow re-review and revision */}
                {task.taskStatus === 'completed' && task.bias_check?.is_bias && (
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
                      onClick={() => handleButtonAction('review')}
                      className="btn-secondary bg-orange-600 hover:bg-orange-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Processing...' : 'Re-Review Task'}
                    </button>
                  </>
                )}

                {/* For tasks awaiting review */}
                {task.taskStatus === 'submittedAndAwaitingReview' && (
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
                      onClick={() => handleButtonAction('review')}
                      className="btn-secondary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Processing...' : 'Submit Review'}
                    </button>
                  </>
                )}
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
}

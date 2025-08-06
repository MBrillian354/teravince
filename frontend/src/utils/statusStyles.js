/**
 * Status styling utilities for task management badges and status indicators
 * Provides consistent styling across the application for task statuses using the new enum values
 */

/**
 * Get Tailwind CSS classes for task status badges
 * @param {string} taskStatus - The task status value
 * @returns {string} Tailwind CSS classes for styling
 */
export const getTaskStatusStyles = (taskStatus) => {
  const statusMap = {
    // Draft states - using muted colors
    'draft': 'text-gray-700 bg-muted border-gray-400',
    'Draft': 'text-gray-700 bg-muted border-gray-400',
    
    // Active/Working states - using warning colors
    'inProgress': 'text-warning bg-warning-light border-warning',
    'In Progress': 'text-warning bg-warning-light border-warning',
    'Ongoing': 'text-warning bg-warning-light border-warning',
    
    // Revision states - using warning colors
    'revisionInProgress': 'text-warning bg-warning-light border-warning',
    'Revision In Progress': 'text-warning bg-warning-light border-warning',
    
    // Submitted states - using info colors
    'submittedAndAwaitingReview': 'text-info bg-info-light border-info',
    'Submitted And Awaiting Review': 'text-info bg-info-light border-info',
    'submittedAndAwaitingApproval': 'text-purple-700 bg-purple-100 border-purple-400',
    'Submitted And Awaiting Approval': 'text-purple-700 bg-purple-100 border-purple-400',
    'submitted': 'text-info bg-info-light border-info',
    'Submitted': 'text-info bg-info-light border-info',
    'Under Review': 'text-info bg-info-light border-info',
    
    // Rejected states - using theme danger colors
    'submissionRejected': 'text-danger bg-red-100 border-danger',
    'Submission Rejected': 'text-danger bg-red-100 border-danger',
    'approvalRejected': 'text-danger bg-red-100 border-danger',
    'Approval Rejected': 'text-danger bg-red-100 border-danger',
    'rejected': 'text-danger bg-red-100 border-danger',
    'Rejected': 'text-danger bg-red-100 border-danger',
    
    // Completed states - using theme success colors
    'completed': 'text-success bg-success-light border-success',
    'Completed': 'text-success bg-success-light border-success',
    'done': 'text-success bg-success-light border-success',
    'Done': 'text-success bg-success-light border-success',

    // Cancelled states - using muted colors
    'cancelled': 'text-gray-600 bg-muted border-gray-400',
    'Cancelled': 'text-gray-600 bg-muted border-gray-400',
    
    // Bias statuses - using appropriate colors
    'biasDetected': 'text-danger bg-red-100 border-danger',
    'noBias': 'text-success bg-success-light border-success',
    'notChecked': 'text-neutral-700 bg-neutral-100 border-neutral-400',

    'awaitingReview': 'text-info bg-info-light border-info',
    'Awaiting Review': 'text-info bg-info-light border-info',

    'needReview': 'text-warning bg-warning-light border-warning',
    'Need Review': 'text-warning bg-warning-light border-warning',
  };
  
  return statusMap[taskStatus] || 'text-neutral-700 bg-neutral-100 border-neutral-400';
};

/**
 * Get display text for task status using the new enum values
 * @param {string} taskStatus - The backend task status value
 * @returns {string} Human-readable display text
 */
export const getDisplayTaskStatus = (taskStatus) => {
  const statusMap = {
    'draft': 'Draft',
    'inProgress': 'In Progress', 
    'revisionInProgress': 'Revision In Progress',
    'submittedAndAwaitingReview': 'Awaiting Review',
    'submittedAndAwaitingApproval': 'Awaiting Approval',
    'submissionRejected': 'Submission Rejected',
    'approvalRejected': 'Approval Rejected',
    'completed': 'Completed',
    'done': 'Done',

    'awaitingReview': 'Awaiting Review',
    'needReview': 'Need Review',

    // Bias statuses
    'biasDetected': 'Bias Detected',
    'noBias': 'No Bias',
    'notChecked': 'Not Checked',
  };
  return statusMap[taskStatus] || taskStatus;
};

/**
 * Get status icon for different status types
 * @param {string} status - The status value
 * @param {string} type - The type of status ('task')
 * @returns {string} Unicode icon or emoji
 */
export const getStatusIcon = (status, type = 'task') => {
  const iconMap = {
    // Task status icons
    task: {
      'draft': '📝',
      'inProgress': '⏳',
      'revisionInProgress': '🔄',
      'submittedAndAwaitingReview': '📤',
      'submittedAndAwaitingApproval': '⏰',
      'submissionRejected': '❌',
      'approvalRejected': '🚫',
      'completed': '✅'
    }
  };
  
  return iconMap[type]?.[status] || '';
};

/**
 * Get status priority for sorting (higher number = higher priority)
 * @param {string} status - The status value
 * @param {string} type - The type of status ('task')
 * @returns {number} Priority number for sorting
 */
export const getStatusPriority = (status, type = 'task') => {
  const priorityMap = {
    task: {
      'submittedAndAwaitingApproval': 8,
      'submittedAndAwaitingReview': 7,
      'approvalRejected': 6,
      'submissionRejected': 5,
      'revisionInProgress': 4,
      'inProgress': 3,
      'draft': 2,
      'completed': 1
    }
  };
  
  return priorityMap[type]?.[status] || 0;
};

// Legacy compatibility functions (deprecated but kept for gradual migration)
// These functions are deprecated and should be replaced with the new taskStatus-based logic

/**
 * @deprecated Use getTaskStatusStyles instead
 */
export const getApprovalStatusStyles = (approvalStatus) => {
  console.warn('getApprovalStatusStyles is deprecated. Use getTaskStatusStyles with new taskStatus enum values.');
  return getTaskStatusStyles(approvalStatus);
};

/**
 * @deprecated Use getDisplayTaskStatus instead  
 */
export const getDisplayApprovalStatus = (approvalStatus) => {
  console.warn('getDisplayApprovalStatus is deprecated. Use getDisplayTaskStatus with new taskStatus enum values.');
  return getDisplayTaskStatus(approvalStatus);
};

/**
 * @deprecated Use getDisplayTaskStatus instead
 */
export const getReviewStatus = (taskStatus, approvalStatus) => {
  console.warn('getReviewStatus is deprecated. Use getDisplayTaskStatus with new taskStatus enum values.');
  return getDisplayTaskStatus(taskStatus);
};

/**
 * @deprecated Use getTaskStatusStyles instead
 */
export const getReviewStatusStyles = (reviewStatus) => {
  console.warn('getReviewStatusStyles is deprecated. Use getTaskStatusStyles with new taskStatus enum values.');
  return getTaskStatusStyles(reviewStatus);
};

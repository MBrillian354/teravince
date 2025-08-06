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
    // Draft states
    'draft': 'text-gray-700 bg-gray-100 border-gray-400',
    'Draft': 'text-gray-700 bg-gray-100 border-gray-400',
    
    // Active/Working states
    'inProgress': 'text-amber-700 bg-amber-100 border-amber-400',
    'In Progress': 'text-amber-700 bg-amber-100 border-amber-400',
    'Ongoing': 'text-amber-700 bg-amber-100 border-amber-400',
    
    // Revision states
    'revisionInProgress': 'text-yellow-700 bg-yellow-100 border-yellow-400',
    'Revision In Progress': 'text-yellow-700 bg-yellow-100 border-yellow-400',
    
    // Submitted states
    'submittedAndAwaitingReview': 'text-blue-700 bg-blue-100 border-blue-400',
    'Submitted And Awaiting Review': 'text-blue-700 bg-blue-100 border-blue-400',
    'submittedAndAwaitingApproval': 'text-purple-700 bg-purple-100 border-purple-400',
    'Submitted And Awaiting Approval': 'text-purple-700 bg-purple-100 border-purple-400',
    'submitted': 'text-blue-700 bg-blue-100 border-blue-400',
    'Submitted': 'text-blue-700 bg-blue-100 border-blue-400',
    'Under Review': 'text-blue-700 bg-blue-100 border-blue-400',
    
    // Rejected states
    'submissionRejected': 'text-red-700 bg-red-100 border-red-400',
    'Submission Rejected': 'text-red-700 bg-red-100 border-red-400',
    'approvalRejected': 'text-red-700 bg-red-100 border-red-400',
    'Approval Rejected': 'text-red-700 bg-red-100 border-red-400',
    'rejected': 'text-red-700 bg-red-100 border-red-400',
    'Rejected': 'text-red-700 bg-red-100 border-red-400',
    
    // Completed states
    'completed': 'text-green-700 bg-green-100 border-green-400',
    'Completed': 'text-green-700 bg-green-100 border-green-400',
    
    // Cancelled states
    'cancelled': 'text-gray-600 bg-gray-100 border-gray-400',
    'Cancelled': 'text-gray-600 bg-gray-100 border-gray-400',
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
    'completed': 'Completed'
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

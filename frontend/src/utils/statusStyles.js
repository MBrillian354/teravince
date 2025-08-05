/**
 * Status styling utilities for task management badges and status indicators
 * Provides consistent styling across the application for approval and task statuses
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
    
    // Submitted states
    'submitted': 'text-blue-700 bg-blue-100 border-blue-400',
    'Submitted': 'text-blue-700 bg-blue-100 border-blue-400',
    'Under Review': 'text-blue-700 bg-blue-100 border-blue-400',
    
    // Rejected states
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
 * Get Tailwind CSS classes for approval status badges
 * @param {string} approvalStatus - The approval status value
 * @returns {string} Tailwind CSS classes for styling
 */
export const getApprovalStatusStyles = (approvalStatus) => {
  const statusMap = {
    // Pending states
    'pending': 'text-orange-700 bg-orange-100 border-orange-400',
    'Pending': 'text-orange-700 bg-orange-100 border-orange-400',
    'Under Review': 'text-orange-700 bg-orange-100 border-orange-400',
    'Awaiting Approval': 'text-orange-700 bg-orange-100 border-orange-400',
    'Waiting Submission': 'text-slate-600 bg-slate-100 border-slate-400',
    
    // Approved states
    'approved': 'text-emerald-700 bg-emerald-100 border-emerald-400',
    'Approved': 'text-emerald-700 bg-emerald-100 border-emerald-400',
    
    // Rejected states
    'rejected': 'text-red-700 bg-red-100 border-red-400',
    'Rejected': 'text-red-700 bg-red-100 border-red-400',
    
    // Draft states
    'draft': 'text-gray-600 bg-gray-100 border-gray-400',
    'Draft': 'text-gray-600 bg-gray-100 border-gray-400',
  };
  
  return statusMap[approvalStatus] || 'text-neutral-700 bg-neutral-100 border-neutral-400';
};

/**
 * Get Tailwind CSS classes for review status badges (combined task + approval status)
 * @param {string} reviewStatus - The review status value
 * @returns {string} Tailwind CSS classes for styling
 */
export const getReviewStatusStyles = (reviewStatus) => {
  const statusMap = {
    // Waiting states
    'Awaiting Approval': 'text-purple-700 bg-purple-100 border-purple-400',
    'Awaiting Review': 'text-indigo-700 bg-indigo-100 border-indigo-400',
    'Awaiting Submission': 'text-cyan-700 bg-cyan-100 border-cyan-400',
    'Awaiting Revision': 'text-yellow-700 bg-yellow-100 border-yellow-400',
    'Awaiting Evidence': 'text-pink-700 bg-pink-100 border-pink-400',
    
    // Undetermined
    'Undetermined': 'text-neutral-600 bg-neutral-100 border-neutral-400',
  };
  
  return statusMap[reviewStatus] || 'text-neutral-700 bg-neutral-100 border-neutral-400';
};

/**
 * Get display text for task status
 * @param {string} taskStatus - The backend task status value
 * @returns {string} Human-readable display text
 */
export const getDisplayTaskStatus = (taskStatus) => {
  const statusMap = {
    'draft': 'Draft',
    'inProgress': 'Ongoing',
    'submitted': 'Under Review',
    'rejected': 'Rejected',
    'completed': 'Completed',
    'cancelled': 'Cancelled'
  };
  return statusMap[taskStatus] || 'Draft';
};

/**
 * Get display text for approval status
 * @param {string} approvalStatus - The backend approval status value
 * @returns {string} Human-readable display text
 */
export const getDisplayApprovalStatus = (approvalStatus) => {
  const statusMap = {
    'pending': 'Awaiting Approval',
    'approved': 'Approved',
    'rejected': 'Rejected'
  };
  return statusMap[approvalStatus] || approvalStatus;
};

/**
 * Calculate review status based on task status and approval status
 * @param {string} taskStatus - The task status
 * @param {string} approvalStatus - The approval status
 * @returns {string} Combined review status
 */
export const getReviewStatus = (taskStatus, approvalStatus) => {
  // New task submitted for first approval
  if (taskStatus === 'submitted' && approvalStatus === 'pending') {
    return 'Awaiting Approval';
  }
  
  // Task approved and submitted for review
  if (taskStatus === 'submitted' && approvalStatus === 'approved') {
    return 'Awaiting Review';
  }
  
  // Task approved and staff is working on it
  if (taskStatus === 'inProgress' && approvalStatus === 'approved') {
    return 'Awaiting Submission';
  }
  
  // Task rejected and staff is revising
  if (approvalStatus === 'rejected' && taskStatus === 'inProgress') {
    return 'Awaiting Revision';
  }
  
  // Task rejected and resubmitted
  if (approvalStatus === 'rejected' && taskStatus === 'submitted') {
    return 'Awaiting Review';
  }
  
  // Task completed
  if (taskStatus === 'completed') {
    return 'Completed';
  }
  
  return 'Undetermined';
};

/**
 * Get status icon for different status types
 * @param {string} status - The status value
 * @param {string} type - The type of status ('task', 'approval', 'review')
 * @returns {string} Unicode icon or emoji
 */
export const getStatusIcon = (status, type = 'task') => {
  const iconMap = {
    // Task status icons
    task: {
      'draft': '📝',
      'inProgress': '⏳',
      'submitted': '📤',
      'rejected': '❌',
      'completed': '✅',
      'cancelled': '🚫'
    },
    
    // Approval status icons
    approval: {
      'pending': '🔍',
      'approved': '✅',
      'rejected': '❌',
      'draft': '📝'
    },
    
    // Review status icons
    review: {
      'Awaiting Approval': '🔍',
      'Awaiting Review': '📋',
      'Awaiting Submission': '📝',
      'Awaiting Revision': '🔄',
      'Awaiting Evidence': '📎',
      'Completed': '✅',
      'Undetermined': '❓'
    }
  };
  
  return iconMap[type]?.[status] || '';
};

/**
 * Status badge priority for sorting (higher number = higher priority)
 * @param {string} status - The status value
 * @param {string} type - The type of status ('task', 'approval', 'review')
 * @returns {number} Priority number for sorting
 */
export const getStatusPriority = (status, type = 'task') => {
  const priorityMap = {
    task: {
      'submitted': 5,
      'rejected': 4,
      'inProgress': 3,
      'draft': 2,
      'completed': 1,
      'cancelled': 0
    },
    
    approval: {
      'pending': 3,
      'rejected': 2,
      'approved': 1,
      'draft': 0
    },
    
    review: {
      'Awaiting Approval': 5,
      'Awaiting Review': 4,
      'Awaiting Revision': 3,
      'Awaiting Submission': 2,
      'Awaiting Evidence': 2,
      'Completed': 1,
      'Undetermined': 0
    }
  };
  
  return priorityMap[type]?.[status] || 0;
};

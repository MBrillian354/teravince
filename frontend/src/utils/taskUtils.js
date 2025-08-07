// Shared utilities for task components

// Helper function to get display status using new enum
export const getDisplayTaskStatus = (taskStatus) => {
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

// Check if task can be submitted
export const canSubmitTask = (task) => {
  if (!task) return false;
  return task.taskStatus === 'inProgress' ||
    task.taskStatus === 'draft' ||
    task.taskStatus === 'approvalRejected' ||
    task.taskStatus === 'submissionRejected' ||
    task.taskStatus === 'revisionInProgress';
};

// Get task from current task or tasks array
export const getTaskFromParams = (taskId, id, currentTask, tasks) => {
  if (taskId) {
    // If taskId is provided, find the task in the tasks array
    console.log('Finding task by TaskID:', taskId);
    return currentTask || tasks.find(t => t._id === taskId);
  } else {
    // If no taskId, use currentTask
    console.log('Finding task by ID:', id);
    return currentTask || tasks.find(t => t._id === id);
  }
};

// Create base form fields for task display
export const createBaseFormFields = (task) => {
  return [
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
    }
  ];
};

// Add completed task fields (supervisor comment and score)
export const addCompletedTaskFields = (task) => {
  const fields = [];
  if (task?.taskStatus === 'completed') {
    fields.push(
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
      }
    );
  }
  return fields;
};

// Create KPI fields for viewing mode
export const createViewKpiFields = (task) => {
  return [{
    type: 'textarea',
    name: 'kpis',
    label: 'Key Performance Indicators (KPIs)',
    rows: 3,
    defaultValue: task && task.kpis ? task.kpis.map(kpi =>
      `${kpi.kpiTitle}: Target ${kpi.targetAmount}, Achieved ${kpi.achievedAmount || 0} (${kpi.operator})`
    ).join('\n') : '',
    disabled: true
  }];
};

// Create evidence link field for viewing mode
export const createEvidenceLinkField = (task) => {
  const needsEvidenceLink = task?.evidence &&
    (task?.taskStatus === 'submittedAndAwaitingReview' ||
      task?.taskStatus === 'submissionRejected' ||
      task?.taskStatus === 'completed' ||
      task?.taskStatus === 'inProgress' ||
      task?.taskStatus === 'revisionInProgress');

  if (needsEvidenceLink) {
    return [{
      type: 'link',
      name: 'evidence',
      label: 'Evidence',
      href: import.meta.env.VITE_API_BASE_URL + '/' + task.evidence,
      disabled: true,
      className: 'justify-start',
      hint: 'Click to view the uploaded evidence file'
    }];
  }

  return [];
};

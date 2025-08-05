# Task Management Flow & Status Badge System

## Overview

This document outlines the task management workflow between supervisors and staff in the Teravince application, along with the reusable status badge system implementation.

## Task Management Flow

### 1. Task Lifecycle States

#### Task Status (`taskStatus`)
- **`draft`**: Initial state when task is created
- **`inProgress`**: Task is approved and staff is working on it
- **`submitted`**: Staff has completed and submitted the task
- **`rejected`**: Task was rejected and needs revision
- **`completed`**: Task is finalized and marked as complete
- **`cancelled`**: Task was cancelled

#### Approval Status (`approvalStatus`)
- **`pending`**: Awaiting supervisor approval
- **`approved`**: Supervisor has approved the task
- **`rejected`**: Supervisor has rejected the task
- **`draft`**: Task is still in draft mode

### 2. Workflow Process

```
1. TASK CREATION
   └── Staff creates task (draft → pending)

2. INITIAL APPROVAL
   ├── Supervisor reviews task
   ├── Approves → (approved + inProgress)
   └── Rejects → (rejected + inProgress)

3. STAFF WORK
   ├── Staff works on approved task (inProgress)
   └── Staff submits work → (submitted)

4. FINAL REVIEW
   ├── Supervisor reviews submitted work
   ├── Accepts → (completed)
   └── Requests revision → (rejected + inProgress)

5. COMPLETION
   └── Task marked as completed with score
```

### 3. Review Status Logic

The system calculates a combined "review status" based on task status and approval status:

- **Awaiting Approval**: `taskStatus: 'submitted' + approvalStatus: 'pending'`
- **Awaiting Review**: `taskStatus: 'submitted' + approvalStatus: 'approved'`
- **Awaiting Submission**: `taskStatus: 'inProgress' + approvalStatus: 'approved'`
- **Awaiting Revision**: `taskStatus: 'inProgress' + approvalStatus: 'rejected'`

## Status Badge System

### 1. Components

#### StatusBadge Component
**Location**: `src/components/StatusBadge.jsx`

A reusable component for displaying status badges with consistent styling.

**Props**:
- `status` (string): The status value to display
- `type` (string): Type of status ('task', 'approval', 'review')
- `size` (string): Size variant ('xs', 'sm', 'md', 'lg')
- `variant` (string): Style variant ('default', 'solid', 'outline')
- `showIcon` (boolean): Whether to show status icon
- `className` (string): Additional CSS classes

#### Status Utilities
**Location**: `src/utils/statusStyles.js`

Utility functions for status styling and transformations:

- `getTaskStatusStyles()`: Returns Tailwind classes for task statuses
- `getApprovalStatusStyles()`: Returns Tailwind classes for approval statuses
- `getReviewStatusStyles()`: Returns Tailwind classes for review statuses
- `getDisplayTaskStatus()`: Converts backend status to display text
- `getDisplayApprovalStatus()`: Converts backend approval status to display text
- `getReviewStatus()`: Calculates combined review status
- `getStatusIcon()`: Returns appropriate emoji/icon for status
- `getStatusPriority()`: Returns priority number for sorting

### 2. Usage Examples

#### Basic Usage
```jsx
import StatusBadge from '../components/StatusBadge';

// Task status badge
<StatusBadge status="submitted" type="task" />

// Approval status badge with icon
<StatusBadge 
  status="approved" 
  type="approval" 
  showIcon={false} 
/>

// Review status badge with custom size
<StatusBadge 
  status="Awaiting Review" 
  type="review" 
  size="md"
  variant="solid"
/>
```

#### In Data Tables
```jsx
const columns = [
  {
    header: 'Task Status',
    render: (row) => (
      <StatusBadge 
        status={row.taskStatus} 
        type="task" 
        size="xs"
        showIcon={false}
      />
    ),
  },
  {
    header: 'Approval Status',
    render: (row) => (
      <StatusBadge 
        status={row.approvalStatus} 
        type="approval" 
        size="xs"
        showIcon={false}
      />
    ),
  },
];
```

### 3. Color Scheme

#### Task Status Colors
- **Draft**: Gray (`text-gray-700 bg-gray-100`)
- **In Progress**: Amber (`text-amber-700 bg-amber-100`)
- **Submitted**: Blue (`text-blue-700 bg-blue-100`)
- **Rejected**: Red (`text-red-700 bg-red-100`)
- **Completed**: Green (`text-green-700 bg-green-100`)
- **Cancelled**: Gray (`text-gray-600 bg-gray-100`)

#### Approval Status Colors
- **Pending**: Orange (`text-orange-700 bg-orange-100`)
- **Approved**: Emerald (`text-emerald-700 bg-emerald-100`)
- **Rejected**: Red (`text-red-700 bg-red-100`)

#### Review Status Colors
- **Awaiting Approval**: Purple (`text-purple-700 bg-purple-100`)
- **Awaiting Review**: Indigo (`text-indigo-700 bg-indigo-100`)
- **Awaiting Submission**: Cyan (`text-cyan-700 bg-cyan-100`)
- **Awaiting Revision**: Yellow (`text-yellow-700 bg-yellow-100`)

### 4. Variants

#### Default Variant
Light colored background with darker text - best for general use.

#### Solid Variant
Darker background with light text - for emphasis or dark themes.

#### Outline Variant
Transparent background with colored border and text - for subtle emphasis.

### 5. Accessibility Features

- **Semantic HTML**: Uses proper `span` elements with descriptive attributes
- **Tooltips**: Built-in title attribute showing full status information
- **Screen Reader**: Status text is always readable
- **Color Blind**: Icons provide additional visual cues
- **Keyboard Navigation**: Focusable when needed

## Implementation Guide

### 1. Updating Existing Components

To update existing components to use the new badge system:

1. Import the StatusBadge component and utilities:
```jsx
import StatusBadge from '../components/StatusBadge';
import { getDisplayTaskStatus, getDisplayApprovalStatus } from '../utils/statusStyles';
```

2. Replace manual status styling with StatusBadge:
```jsx
// Before
<span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">
  {status}
</span>

// After
<StatusBadge status={status} type="task" size="xs" />
```

3. Use utility functions for status transformation:
```jsx
// Convert backend status to display format
const displayStatus = getDisplayTaskStatus(task.taskStatus);
```

### 2. Adding New Status Types

To add new status types:

1. Update the enum in the backend Task model
2. Add styling in `statusStyles.js`
3. Update display text mappings
4. Add corresponding icons if needed

### 3. Customization

The badge system is designed to be easily customizable:

- **Colors**: Modify color mappings in `statusStyles.js`
- **Sizes**: Add new size variants in `StatusBadge.jsx`
- **Icons**: Update icon mappings in `getStatusIcon()`
- **Variants**: Create new style variants in `getVariantClasses()`

## Benefits

1. **Consistency**: Unified styling across all status displays
2. **Maintainability**: Centralized status logic and styling
3. **Accessibility**: Built-in accessibility features
4. **Flexibility**: Multiple variants and customization options
5. **Performance**: Optimized component with minimal re-renders
6. **Developer Experience**: Easy to use with clear documentation

## Files Modified/Created

### New Files
- `src/components/StatusBadge.jsx`
- `src/utils/statusStyles.js`
- `src/components/StatusBadgeDemo.jsx`
- `docs/TASK_MANAGEMENT_FLOW.md` (this file)

### Updated Files
- `src/pages/TeamTasks.jsx`
- `src/pages/ManageAccounts.jsx`

## Testing

The StatusBadgeDemo component (`src/components/StatusBadgeDemo.jsx`) provides a comprehensive showcase of all badge styles and usage examples. Access it by importing and rendering the component in your application.

## Future Enhancements

1. **Animation**: Add subtle transitions for status changes
2. **Progress Indicators**: Show progress bars for long-running tasks
3. **Batch Operations**: Support for bulk status updates
4. **Notifications**: Real-time status change notifications
5. **Analytics**: Track status change patterns for insights

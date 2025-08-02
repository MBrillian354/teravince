import React, { useState, useEffect } from 'react';
import TasksReportsTabs from '../components/TasksReportsTabs';
import StatsCard        from '../components/StatsCard';
import DataTable        from '../components/DataTable';
import Pagination       from '../components/Pagination';
import DynamicForm      from '../components/DynamicForm';

export default function Tasks() {
  // 1) Tab state
  const [activeTab, setActiveTab] = useState('tasks');

  // 2) Summary cards data
  const summary = [
    { label: 'Tasks to Approve', value: 2 },
    { label: 'Task to Revise',   value: 0 },
    { label: 'Task to Review',   value: 0 },
  ];

  // 3) Dummy table data
  const tasks = [
    {
      id: '3210001',
      title: 'Proofreading',
      status: 'Awaiting Approval',
      approval: 'Awaiting Approval',
      review: 'Awaiting Evidence',
      employeeId: '32100010001',
      employeeName: 'Jane Doe',
      description: 'Fix typos and improve grammar in the May report.',
      start: '01/03/2025',
      end: '07/10/2025',
      supervisorComment: '',
    },
    {
      id: '3210002',
      title: 'Proofreading',
      status: 'Awaiting Approval',
      approval: 'Awaiting Approval',
      review: 'Awaiting Evidence',
      employeeId: '32100010002',
      employeeName: 'Mark Wiens',
      description: 'Proofread the April campaign materials.',
      start: '02/03/2025',
      end: '08/10/2025',
      supervisorComment: '',
    },
  ];

  // 4) Selected row state
  const [selectedTaskId, setSelectedTaskId] = useState(tasks[0].id);
  const selected = tasks.find((t) => t.id === selectedTaskId);

  // 5) Supervisor comment state (editable)
  const [supervisorComment, setSupervisorComment] = useState(
    tasks.find((t) => t.id === selectedTaskId)?.supervisorComment || ''
  );
  useEffect(() => {
    // reset only when the selected ID changes, not on every render
    setSupervisorComment(
      tasks.find((t) => t.id === selectedTaskId)?.supervisorComment || ''
    );
  }, [selectedTaskId]);

  // 6) Form fields configuration for DynamicForm
  const getFormFields = (selectedTask) => {
    if (!selectedTask) return [];
    
    return [
      {
        type: 'text',
        name: 'employeeId',
        label: 'Employee ID',
        defaultValue: selectedTask.employeeId,
        disabled: true,
        group: 'employee'
      },
      {
        type: 'text',
        name: 'employeeName',
        label: 'Employee Name',
        defaultValue: selectedTask.employeeName,
        disabled: true,
        group: 'employee'
      },
      {
        type: 'text',
        name: 'taskId',
        label: 'Task ID',
        defaultValue: selectedTask.id,
        disabled: true,
        group: 'task'
      },
      {
        type: 'text',
        name: 'taskStatus',
        label: 'Task Status',
        defaultValue: selectedTask.status,
        disabled: true,
        group: 'task'
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
        type: 'text',
        name: 'startDate',
        label: 'Start Date',
        defaultValue: selectedTask.start,
        disabled: true,
        group: 'dates'
      },
      {
        type: 'text',
        name: 'finishDate',
        label: 'Finish Date',
        defaultValue: selectedTask.end,
        disabled: true,
        group: 'dates'
      },
      {
        type: 'textarea',
        name: 'supervisorComment',
        label: 'Supervisor Comment',
        defaultValue: supervisorComment,
        rows: 3
      },
      {
        type: 'checkbox',
        name: 'biasReviewCheck',
        label: 'I have properly reviewed the employee\'s task without bias',
        required: true
      }
    ];
  };

  // 7) Handle form submission for approval/revision
  const handleFormSubmit = (formData, action = 'approve') => {
    console.log('Form data:', formData);
    console.log('Action:', action);
    
    // Update the supervisor comment in state
    setSupervisorComment(formData.supervisorComment || '');
    
    // Validate required fields
    if (action === 'approve' && !formData.biasReviewCheck) {
      alert('Please confirm that you have reviewed the task without bias.');
      return;
    }
    
    // Here you would typically make an API call to update the task
    // For now, just log the action
    if (action === 'approve') {
      alert('Task approved successfully!');
    } else if (action === 'revise') {
      alert('Revision requested successfully!');
    }
  };

  // 8) Handle button actions with form reference
  const handleButtonAction = (action) => {
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

  // 9) Pagination state
  const [page, setPage] = useState(1);
  const totalPages = 11;

  // 10) Table column definitions
  const columns = [
    {
      header: '',
      render: (row) => (
        <input
          type="checkbox"
          checked={row.id === selectedTaskId}
          onChange={() => setSelectedTaskId(row.id)}
        />
      ),
      align: 'center',
    },
    { header: 'Task ID',    accessor: 'id'    },
    { header: 'Task Title', accessor: 'title' },
    {
      header: 'Task Status',
      render: (r) => (
        <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">
          {r.status}
        </span>
      ),
    },
    {
      header: 'Task Approval',
      render: (r) => (
        <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">
          {r.approval}
        </span>
      ),
    },
    {
      header: 'Task Review',
      render: (r) => (
        <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">
          {r.review}
        </span>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4">
      {/* Page title */}
      <h1 className="text-3xl font-bold mb-4">Reports, Jobs, and Tasks</h1>

      {/* Tabs */}
      <TasksReportsTabs active={activeTab} onChange={setActiveTab} />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {summary.map((c) => (
          <StatsCard key={c.label} label={c.label} value={c.value} />
        ))}
      </div>

      {/* Tasks Table */}
      <DataTable
        columns={columns}
        data={tasks}
        rowKey="id"
        onRowClick={({ id }) => setSelectedTaskId(id)}
        containerClass="bg-white rounded mb-4"
      />

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* Detail Card with DynamicForm */}
      {selected && (
        <div className="bg-white rounded shadow p-6 mt-6">
          <DynamicForm
            fields={getFormFields(selected)}
            showSubmitButton={false}
            className="space-y-6"
            footer={
              <div className="flex justify-end space-x-2 mt-6">
                <button 
                  type="button"
                  onClick={() => handleButtonAction('revise')}
                  className="btn-outline"
                >
                  Request Revision
                </button>
                <button 
                  type="button"
                  onClick={() => handleButtonAction('approve')}
                  className="btn-secondary"
                >
                  Approve Task
                </button>
              </div>
            }
          />
        </div>
      )}
    </div>
  );
}

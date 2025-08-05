import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DynamicForm from '../components/DynamicForm';

export default function TaskDetails() {
  const { taskId } = useParams();
  const navigate = useNavigate();

  // Dummy task data - matches the structure from Tasks.jsx
  const [task, setTask] = useState(null);
  const [supervisorComment, setSupervisorComment] = useState('');

  // Dummy tasks data
  const tasksData = [
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

  useEffect(() => {
    const foundTask = tasksData.find(t => t.id === taskId);
    if (foundTask) {
      setTask(foundTask);
      setSupervisorComment(foundTask.supervisorComment || '');
    }
  }, [taskId]);

  // Form fields configuration
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

  // Handle form submission for approval/revision
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
      navigate('/reports/tasks');
    } else if (action === 'revise') {
      alert('Revision requested successfully!');
      navigate('/reports/tasks');
    }
  };

  // Handle button actions with form reference
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

  if (!task) {
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
          <h1 className="text-3xl font-bold">Task Details</h1>
          <p className="text-gray-600">Review and manage task: {task.title}</p>
        </div>
        <button 
          onClick={() => navigate('/reports/tasks')}
          className="btn-outline"
        >
          ← Back to Tasks
        </button>
      </div>

      {/* Task Detail Form */}
      <div className="bg-white rounded shadow p-6">
        <DynamicForm
          fields={getFormFields(task)}
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
    </div>
  );
}

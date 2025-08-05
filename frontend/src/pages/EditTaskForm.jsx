import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import DynamicForm from '../components/DynamicForm';
import { updateTask, fetchTaskById, fetchTasks } from '../store/staffSlice';
import { useModal } from '../hooks/useModal';

export default function EditTaskForm() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showSuccess, showError } = useModal();

  const { currentTask, tasks, isLoading } = useSelector(state => state.staff);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get task from current task or tasks array
  const task = currentTask || tasks.find(t => t._id === taskId);

  // Fetch task if not loaded
  useEffect(() => {
    if (!task && !isLoading) {
      dispatch(fetchTaskById(taskId));
    }
  }, [dispatch, task, isLoading, taskId]);

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
        'The task you are trying to edit could not be found.',
        {
          onConfirm: () => {
            navigate('/tasks');
          },
          autoClose: true,
          timeout: 3000
        },
      );
    }
  }, [task, isLoading, showError]);

  const formFields = [
    {
      type: 'text',
      name: 'title',
      label: 'Task Title',
      placeholder: 'Enter task title',
      required: true,
      defaultValue: task ? task.title : ''
    },
    {
      type: 'textarea',
      name: 'description',
      label: 'Task Description',
      placeholder: 'Enter task description',
      required: true,
      rows: 4,
      defaultValue: task ? task.description : ''
    },
    {
      type: 'number',
      name: 'score',
      label: 'Score',
      placeholder: 'Enter task score',
      required: true,
      min: 0,
      max: 100,
      defaultValue: task ? task.score : ''
    },
    {
      type: 'textarea',
      name: 'evidence',
      label: 'Evidence',
      placeholder: 'Enter evidence or proof of completion',
      required: true,
      rows: 3,
      defaultValue: task ? task.evidence : ''
    },
    {
      type: 'date',
      name: 'startDate',
      label: 'Start Date',
      required: false,
      defaultValue: task && task.startDate ? new Date(task.startDate).toISOString().split('T')[0] : ''
    },
    {
      type: 'date',
      name: 'endDate',
      label: 'End Date',
      required: false,
      defaultValue: task && task.endDate ? new Date(task.endDate).toISOString().split('T')[0] : ''
    },
    {
      type: 'select',
      name: 'taskStatus',
      label: 'Task Status',
      options: [
        { value: 'inProgress', label: 'In Progress' },
        { value: 'submitted', label: 'Submitted' },
        { value: 'rejected', label: 'Rejected' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' }
      ],
      required: true,
      defaultValue: task ? task.taskStatus : ''
    },
    {
      type: 'select',
      name: 'approvalStatus',
      label: 'Approval Status',
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'approved', label: 'Approved' },
        { value: 'rejected', label: 'Rejected' }
      ],
      required: true,
      defaultValue: task ? task.approvalStatus : ''
    },
    {
      type: 'textarea',
      name: 'supervisorComment',
      label: 'Supervisor Comment',
      placeholder: 'Enter supervisor comments (optional)',
      required: false,
      rows: 2,
      defaultValue: task ? task.supervisorComment : ''
    }
  ];

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      const taskData = {
        title: formData.title,
        description: formData.description,
        score: parseInt(formData.score),
        evidence: formData.evidence,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
        taskStatus: formData.taskStatus,
        approvalStatus: formData.approvalStatus,
        supervisorComment: formData.supervisorComment || ''
      };

      // For now, using console.log as requested
      console.log('Task update data:', { id: taskId, ...taskData });

      // Commented out dispatch line as requested
      // await dispatch(updateTask({ id: taskId, ...taskData })).unwrap();

      // Show success modal
      showSuccess(
        'Task Updated Successfully!',
        'The task has been updated with the new information.',
        {
          onConfirm: () => {
            navigate('/tasks');
          },
          autoClose: true,
          timeout: 3000
        },
      );


    } catch (error) {
      console.error('Task update failed:', error);
      // Show error modal
      showError(
        'Update Failed',
        error || 'Failed to update task. Please try again.',
        'Error',
        { timeout: 5000, autoClose: false }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading task...</div>
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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <DynamicForm
        title="Edit Task"
        subtitle="Update the task details below"
        fields={formFields}
        onSubmit={handleSubmit}
        submitButtonText={isSubmitting ? 'Updating...' : 'Update Task'}
      />
    </div>
  );
}
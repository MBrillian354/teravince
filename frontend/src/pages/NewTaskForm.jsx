import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DynamicForm from "../components/DynamicForm";
import { useModal } from '../hooks/useModal';
import { useDispatch } from "react-redux";
import { createTask } from '../store/staffSlice';
import authService from '../utils/authService';

export default function NewTaskForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useModal();
  const dispatch = useDispatch();

  // Define form fields configuration
  const formFieldsd = [
    {
      type: 'text',
      name: 'taskTitle',
      label: 'Task Title',
      placeholder: 'Enter task title',
      required: true,
    },
    {
      type: 'textarea',
      name: 'taskDescription',
      label: 'Task Description',
      placeholder: 'Enter task description',
      required: true,
      rows: 3,
    },
    {
      type: 'text',
      name: 'kpiTitle',
      label: 'Indicator Title',
      placeholder: 'Enter indicator title',
      required: false,
      group: 'amounts', // top-level field in the group
      isDynamic: true, // Enable dynamic add/remove functionality
      position: 'top', // Position at the top of the group
    },
    {
      type: 'select',
      name: 'operator',
      label: 'Target',
      options: [
        { value: 'greaterThan', label: 'Equal To/Greater Than' },
        { value: 'lessThan', label: 'Less Than' },
      ],
      group: 'amounts', // low level field in the group
      isDynamic: true, // Enable dynamic add/remove functionality
      position: 'center', // Position in the center of the group (default)
    },
    {
      type: 'number',
      name: 'targetAmount',
      label: 'Target Amount',
      placeholder: 'Enter target amount',
      group: 'amounts', // low level field in the group
      isDynamic: true, // Enable dynamic add/remove functionality
      position: 'center', // Position at the bottom of the group
    },
  ];


  const handleSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      const user = authService.getStoredUser();
      if (!user?._id) {
        throw new Error('User not authenticated');
      }

      const taskData = {
        userId: user._id,
        title: formData.taskTitle,
        description: formData.taskDescription,
        kpis: formData.amounts.map(activity => ({
          kpiTitle: Array.isArray(activity.kpiTitle) ? activity.kpiTitle[0] : activity.kpiTitle,
          targetAmount: Array.isArray(activity.targetAmount) ? activity.targetAmount[0] : activity.targetAmount,
          operator: Array.isArray(activity.operator) ? activity.operator[0] : activity.operator
        })),
        score: 0, // Default score
        evidence: '', // Default empty evidence
        taskStatus: 'draft'
      };

      console.log('Task Data:', taskData);

      // Dispatch action to create the task
      const result = await dispatch(createTask(taskData)).unwrap();

      // Show success modal
      showSuccess(
        'Task Created Successfully!',
        'The task has been created and saved as draft.',
        {
          onConfirm: () => {
            navigate('/tasks');
          },
          autoClose: true,
          timeout: 3000
        }
      );

      navigate('/tasks');

    } catch (error) {
      console.error('Task creation failed:', error);
      // Show error modal
      showError(
        'Creation Failed',
        error.message || 'Failed to create task. Please try again.',
        'Error',
        { timeout: 5000, autoClose: false }
      );
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="bg-background min-h-screen px-4 py-6 text-[#1B1717]">
      <div className="max-w-xl mx-auto card-static border border-primary p-6">
        <DynamicForm
          title="Create New Task"
          subtitle="Fill in the details below to create a new task"
          fields={formFieldsd}
          onSubmit={handleSubmit}
          submitButtonText={isSubmitting ? "Creating..." : "Add Task"}
          className="space-y-4"
        />
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DynamicForm from "../components/DynamicForm";
import { useModal } from '../hooks/useModal';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import { createTask, fetchTaskById, fetchTasks, updateTask } from '../store/staffSlice';
import authService from '../utils/authService';

export default function EditTaskForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useModal();
  const dispatch = useDispatch();

  const { id } = useParams();
  const { currentTask, tasks, isLoading } = useSelector(state => state.staff);

  // console.log('View Task - Current Task:', currentTask);
  // console.log('View Task - Tasks Array:', tasks);
  const task = currentTask || tasks.find(t => t._id === id);


  useEffect(() => {
    if (!task && !isLoading) {
      dispatch(fetchTaskById(id));
    }
  }, [dispatch, task, isLoading, id]);

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
        'The task you are trying to view could not be found.',
        {
          onConfirm: () => {
            navigate('/tasks');
          },
          autoClose: true,
          timeout: 3000
        },
      );
    }
  }, [task, isLoading, showError, navigate]);

  // Define form fields configuration
  const formFieldsd = [
    {
      type: 'text',
      name: 'taskTitle',
      label: 'Task Title',
      placeholder: 'Enter task title',
      defaultValue: task ? task.title : '',
      required: true,
    },
    {
      type: 'textarea',
      name: 'taskDescription',
      label: 'Task Description',
      placeholder: 'Enter task description',
      defaultValue: task ? task.description : '',
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
      defaultValue: task && task.kpis && task.kpis.length > 0
        ? task.kpis.map(kpi => kpi.kpiTitle)
        : [''],
    },
    {
      type: 'select',
      name: 'operator',
      label: 'Target',
      options: [
        { value: 'greaterThan', label: 'Greater Than' },
        { value: 'lessThan', label: 'Less Than' },
      ],
      group: 'amounts', // low level field in the group
      isDynamic: true, // Enable dynamic add/remove functionality
      position: 'center', // Position in the center of the group (default)
      defaultValue: task && task.kpis && task.kpis.length > 0
        ? task.kpis.map(kpi => kpi.operator)
        : [''],
    },
    {
      type: 'number',
      name: 'amount',
      label: 'Amount',
      placeholder: 'Enter amount',
      group: 'amounts', // low level field in the group
      isDynamic: true, // Enable dynamic add/remove functionality
      position: 'center', // Position at the bottom of the group
      defaultValue: task && task.kpis && task.kpis.length > 0
        ? task.kpis.map(kpi => kpi.amount)
        : [''],
    }
  ];


  const handleSubmit = async (formData) => {
    if (!task) {
      showError(
        'Task Not Available',
        'Task data is not available. Please wait for the task to load.',
        'Error',
        { timeout: 3000, autoClose: true }
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const user = authService.getStoredUser();
      if (!user?._id) {
        throw new Error('User not authenticated');
      }

      const taskData = {
        id: task._id, // Include the task ID for updating
        userId: user._id,
        title: formData.taskTitle,
        description: formData.taskDescription,
        kpis: formData.amounts.map(activity => ({
          kpiTitle: Array.isArray(activity.kpiTitle) ? activity.kpiTitle[0] : activity.kpiTitle,
          amount: Array.isArray(activity.amount) ? activity.amount[0] : activity.amount,
          operator: Array.isArray(activity.operator) ? activity.operator[0] : activity.operator
        })),
      };

      console.log('Task Data:', taskData);

      // Dispatch action to update the task
      const result = await dispatch(updateTask(taskData)).unwrap();

      // Show success modal
      showSuccess(
        'Task Updated Successfully!',
        'The task has been updated successfully.',
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
        'Update Failed',
        error.message || 'Failed to update task. Please try again.',
        'Error',
        { timeout: 5000, autoClose: false }
      );
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="bg-[#EEEBDD] min-h-screen px-4 py-6 text-[#1B1717]">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md border border-[#CE1212] p-6">
        {isLoading && !task ? (
          <div className="text-center py-8">
            <p>Loading task data...</p>
          </div>
        ) : (
          <DynamicForm
            title="Edit Task"
            subtitle="Update the details below to modify the task"
            fields={formFieldsd}
            onSubmit={handleSubmit}
            submitButtonText={isSubmitting ? "Updating..." : "Update Task"}
            className="space-y-4"
          />
        )}
      </div>
    </div>
  );
}

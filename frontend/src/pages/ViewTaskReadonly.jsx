import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import DynamicForm from '../components/DynamicForm';
import { fetchTaskById, fetchTasks } from '../store/staffSlice';
import { useModal } from '../hooks/useModal';
import StatusNotification from "@/components/StatusNotification";
import {
  getTaskFromParams,
  createBaseFormFields,
  addCompletedTaskFields,
  createViewKpiFields,
  createEvidenceLinkField
} from '../utils/taskUtils';

export default function ViewTaskReadonly() {
  const { id, taskId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showError } = useModal();

  const { currentTask, tasks, isLoading } = useSelector(state => state.staff);

  // Get task from current task or tasks array
  const task = getTaskFromParams(taskId, id, currentTask, tasks);

  // Fetch task if not loaded
  useEffect(() => {
    if (!task && !isLoading) {
      taskId ? dispatch(fetchTaskById(taskId)) : dispatch(fetchTasks(id));
    }
  }, [dispatch, task, isLoading, id, taskId]);

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

  // Create form fields for viewing
  const formFields = [
    ...createBaseFormFields(task),
    ...addCompletedTaskFields(task),
    ...createViewKpiFields(task),
    ...createEvidenceLinkField(task)
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-[#810000]">Loading task...</div>
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
    <div className="bg-background min-h-screen px-4 py-6 text-[#1B1717]">
      <div className="max-w-4xl mx-auto card-static border border-primary">
        {/* Announcement for Under Review Status */}
        {task.taskStatus === "submitted" && (
          <StatusNotification
            type="info"
            message="Task is being Reviewed. Please kindly wait."
          />
        )}

        <DynamicForm
          title="Task details"
          fields={formFields}
          showSubmitButton={false}
          footer={
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => navigate('/tasks')}
                className="btn-outline"
              >
                Back to Tasks
              </button>

              <div className="flex gap-3">
                {(task.taskStatus === 'draft' || task.taskStatus === 'approvalRejected') && (
                  <button
                    onClick={() => navigate(`/tasks/${task._id}/edit`)}
                    className="btn-outline"
                  >
                    Edit Task
                  </button>
                )}
                
                {(task.taskStatus === 'inProgress' || 
                  task.taskStatus === 'draft' || 
                  task.taskStatus === 'approvalRejected' || 
                  task.taskStatus === 'submissionRejected' || 
                  task.taskStatus === 'inProgress') && (
                  <button
                    onClick={() => navigate(`/tasks/${task._id}?mode=submit`)}
                    className="btn-primary"
                  >
                    Submit Task
                  </button>
                )}
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
}

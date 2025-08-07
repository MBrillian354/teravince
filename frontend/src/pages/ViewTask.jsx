import React, { useEffect, useState } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import ViewTaskReadonly from './ViewTaskReadonly';
import SubmitInProgressTask from './SubmitInProgressTask';
import SubmitRejectedTask from './SubmitRejectedTask';
import { fetchTaskById, fetchTasks } from '../store/staffSlice';
import { getTaskFromParams } from '../utils/taskUtils';

export default function ViewTask() {
  const [searchParams] = useSearchParams();
  const { id, taskId } = useParams();
  const dispatch = useDispatch();
  const { currentTask, tasks, isLoading } = useSelector(state => state.staff);
  
  // Check if we're in submission mode
  const isSubmissionMode = searchParams.get('mode') === 'submit';

  // Get task from current task or tasks array
  const task = getTaskFromParams(taskId, id, currentTask, tasks);

  // Fetch task if not loaded
  useEffect(() => {
    if (!task && !isLoading) {
      taskId ? dispatch(fetchTaskById(taskId)) : dispatch(fetchTasks(id));
    }
  }, [dispatch, task, isLoading, id, taskId]);

  // If not in submission mode, show readonly view
  if (!isSubmissionMode) {
    return <ViewTaskReadonly />;
  }

  // If loading, show loading state
  if (isLoading || !task) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-[#810000]">Loading task...</div>
      </div>
    );
  }

  // Route to appropriate submission component based on task status
  switch (task.taskStatus) {
    case 'inProgress':
      return <SubmitInProgressTask />;
    case 'submissionRejected':
      return <SubmitRejectedTask />;
    default:
      // For other statuses (draft, approvalRejected, revisionInProgress), show readonly view
      return <ViewTaskReadonly />;
  }
}
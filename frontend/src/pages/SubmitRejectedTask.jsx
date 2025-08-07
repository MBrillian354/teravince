import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import DynamicForm from '../components/DynamicForm';
import { fetchTaskById, fetchTasks, fetchTasksByUserId } from '../store/staffSlice';
import { useModal } from '../hooks/useModal';
import { tasksAPI } from "../utils/api";
import authService from "../utils/authService";
import StatusNotification from "@/components/StatusNotification";
import {
    getTaskFromParams,
    createBaseFormFields,
    addCompletedTaskFields,
    getDisplayTaskStatus,
    createEvidenceLinkField
} from '../utils/taskUtils';
import {
    handleTaskSubmission,
    handleEvidenceUpload,
    validateKpiAmounts,
    createEditableKpiFields,
    initializeKpiAmounts,
    updateKpiData
} from '../utils/submissionUtils';

export default function SubmitRejectedTask() {
    const { id, taskId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { showError, showSuccess } = useModal();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploadingEvidence, setIsUploadingEvidence] = useState(false);
    const [kpiAchievedAmounts, setKpiAchievedAmounts] = useState({});

    const user = authService.getStoredUser();
    const { currentTask, tasks, isLoading } = useSelector(state => state.staff);

    // Get task from current task or tasks array
    const task = getTaskFromParams(taskId, id, currentTask, tasks);

    // Redirect if task status is not submissionRejected
    useEffect(() => {
        if (task && task.taskStatus !== 'submissionRejected') {
            showError(
                'Invalid Task Status',
                'This component is only for submission rejected tasks.',
                {
                    onConfirm: () => {
                        navigate('/tasks');
                    },
                    autoClose: true,
                    timeout: 3000
                }
            );
        }
    }, [task, showError, navigate]);

    // Fetch task if not loaded
    useEffect(() => {
        if (!task && !isLoading) {
            taskId ? dispatch(fetchTaskById(taskId)) : dispatch(fetchTasks(id));
        }
    }, [dispatch, task, isLoading, id, taskId]);

    // Initialize KPI achieved amounts when task is loaded
    useEffect(() => {
        if (task && task.kpis && task.kpis.length > 0) {
            setKpiAchievedAmounts(initializeKpiAmounts(task));
        }
    }, [task]);

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
                'The task you are trying to resubmit could not be found.',
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

    // Handle task resubmission for submissionRejected tasks
    const handleResubmitTask = async () => {
        if (!task) return;

        // Validate KPI achieved amounts (allow KPI editing for rejected tasks)
        const { isValid, missingKpis } = validateKpiAmounts(task, kpiAchievedAmounts);
        if (!isValid) {
            showError(
                'Missing KPI Data',
                `Please fill in the achieved amount for all KPIs: ${missingKpis.join(', ')}`,
                {
                    autoClose: true,
                    timeout: 10000
                }
            );
            return;
        }

        setIsSubmitting(true);
        try {
            let updateData = {
                taskStatus: 'submittedAndAwaitingReview',
                submittedDate: new Date(),
                completedDate: new Date(),
                bias_check: null
            };

            // Update KPI data (allow editing for rejected tasks)
            updateData = updateKpiData(task, kpiAchievedAmounts, updateData);

            await handleTaskSubmission(task, updateData, tasksAPI, user, dispatch, fetchTasksByUserId);

            showSuccess(
                'Task Resubmitted Successfully',
                `Your task has been resubmitted and is ${getDisplayTaskStatus('submittedAndAwaitingReview')}.`,
                {
                    onConfirm: () => {
                        navigate('/tasks');
                    },
                }
            );
        } catch (err) {
            console.error('Error resubmitting task:', err);
            showError(
                'Resubmission Failed',
                'Failed to resubmit task. Please try again.',
                {
                    onConfirm: () => { },
                    autoClose: true,
                    timeout: 3000
                }
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle evidence file re-upload for rejected tasks
    const handleEvidenceReupload = async (file) => {
        if (!file || !task) return;

        setIsUploadingEvidence(true);
        try {
            await handleEvidenceUpload(file, task, tasksAPI, taskId, dispatch, fetchTaskById);

            showSuccess(
                'Evidence Re-uploaded',
                'New evidence file has been uploaded successfully.',
                {
                    autoClose: true,
                    timeout: 3000
                }
            );
        } catch (err) {
            console.error('Error re-uploading evidence:', err);
            showError(
                'Re-upload Failed',
                'Failed to re-upload evidence file. Please try again.',
                {
                    autoClose: true,
                    timeout: 3000
                }
            );
        } finally {
            setIsUploadingEvidence(false);
        }
    };

    // Handle KPI achieved amount changes
    const handleKpiAchievedAmountChange = (index, value) => {
        setKpiAchievedAmounts(prev => ({
            ...prev,
            [index]: value
        }));
    };

    // Handle form submission (for evidence file re-upload)
    const handleFormSubmit = (formData) => {
        if (formData.evidence && formData.evidence instanceof File) {
            handleEvidenceReupload(formData.evidence);
        }
    };

    // Create evidence re-upload field for rejected tasks
    const createEvidenceReuploadField = (task) => {
        return [{
            type: 'file',
            name: 'evidence',
            label: 'Replace Evidence',
            defaultValue: '',
            disabled: false,
            accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt,.xlsx,.xls',
            hint: 'Upload new evidence file to replace the rejected submission'
        }];
    };

    // Create form fields for rejected task resubmission
    const formFields = [
        ...createBaseFormFields(task),
        ...addCompletedTaskFields(task),
        ...createEvidenceLinkField(task), // Show current evidence link
        ...createEditableKpiFields(task, kpiAchievedAmounts, handleKpiAchievedAmountChange),
        ...createEvidenceReuploadField(task)
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

    if (task.taskStatus !== 'submissionRejected') {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-red-500">This component is only for submission rejected tasks.</p>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen px-4 py-6 text-[#1B1717]">
            <div className="max-w-4xl mx-auto card-static border border-primary">
                {/* Announcement for Rejected Task */}
                <StatusNotification
                    type="warning"
                    message="This task submission was rejected. Please review feedback, update KPIs if needed, upload new evidence, and resubmit."
                />

                <DynamicForm
                    title="Resubmit Rejected Task"
                    subtitle="Address feedback and upload new evidence before resubmission"
                    fields={formFields}
                    onSubmit={handleFormSubmit}
                    showSubmitButton={!isUploadingEvidence}
                    submitButtonText={isUploadingEvidence ? 'Uploading...' : 'Upload New Evidence'}
                    footer={
                        <div className="flex justify-between items-center mt-6">
                            <button
                                onClick={() => navigate('/tasks')}
                                className="btn-outline"
                            >
                                Back to Tasks
                            </button>

                            <div className="flex gap-3">
                                {task?.evidence ? (
                                    <span className="text-blue-600 font-medium">
                                        ℹ Current evidence available - You can upload new evidence to replace it
                                    </span>
                                ) : (
                                    <span className="text-red-600 font-medium">
                                        ⚠ No evidence found - Please upload evidence before resubmitting
                                    </span>
                                )}
                                <button
                                    onClick={handleResubmitTask}
                                    disabled={isSubmitting || !task?.evidence}
                                    className={`btn-primary ${!task?.evidence ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isSubmitting ? 'Resubmitting...' : 'Resubmit Task'}
                                </button>
                            </div>
                        </div>
                    }
                />
            </div>
        </div>
    );
}

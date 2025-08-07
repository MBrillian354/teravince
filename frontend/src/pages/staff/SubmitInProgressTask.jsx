import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import DynamicForm from '../../components/DynamicForm';
import { fetchTaskById, fetchTasks, fetchTasksByUserId } from '../../store/staffSlice';
import { useModal } from '../../hooks/useModal';
import { tasksAPI } from "../../utils/api";
import authService from "../../utils/authService";
import StatusNotification from "@/components/StatusNotification";
import {
    getTaskFromParams,
    createBaseFormFields,
    addCompletedTaskFields,
    getDisplayTaskStatus
} from '../../utils/taskUtils';
import {
    handleTaskSubmission,
    handleEvidenceUpload,
    validateKpiAmounts,
    createEditableKpiFields,
    initializeKpiAmounts,
    updateKpiData
} from '../../utils/submissionUtils';

export default function SubmitInProgressTask() {
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

    // Redirect if task status is not inProgress
    useEffect(() => {
        if (task && task.taskStatus !== 'inProgress') {
            showError(
                'Invalid Task Status',
                'This component is only for tasks in progress.',
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
                'The task you are trying to submit could not be found.',
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

    // Handle task submission for inProgress tasks
    const handleSubmitTask = async () => {
        if (!task) return;

        // Validate KPI achieved amounts
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

            // Update KPI data
            updateData = updateKpiData(task, kpiAchievedAmounts, updateData);

            await handleTaskSubmission(task, updateData, tasksAPI, user, dispatch, fetchTasksByUserId);

            showSuccess(
                'Task Submitted Successfully',
                `Your task has been submitted and is ${getDisplayTaskStatus('submittedAndAwaitingReview')}.`,
                {
                    onConfirm: () => {
                        navigate('/tasks');
                    },
                }
            );
        } catch (err) {
            console.error('Error submitting task:', err);
            showError(
                'Submission Failed',
                'Failed to submit task. Please try again.',
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

    // Handle evidence file upload for inProgress tasks (first-time upload)
    const handleEvidenceFileUpload = async (file) => {
        if (!file || !task) return;

        setIsUploadingEvidence(true);
        try {
            await handleEvidenceUpload(file, task, tasksAPI, taskId, dispatch, fetchTaskById);

            showSuccess(
                'Evidence Uploaded',
                'Evidence file has been uploaded successfully.',
                {
                    autoClose: true,
                    timeout: 3000
                }
            );
        } catch (err) {
            console.error('Error uploading evidence:', err);
            showError(
                'Upload Failed',
                'Failed to upload evidence file. Please try again.',
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

    // Handle form submission (for evidence file upload)
    const handleFormSubmit = (formData) => {
        if (formData.evidence && formData.evidence instanceof File) {
            handleEvidenceFileUpload(formData.evidence);
        }
    };

    // Create evidence upload field for inProgress tasks
    const createEvidenceUploadField = (task) => {
        return [{
            type: 'file',
            name: 'evidence',
            label: 'Evidence',
            defaultValue: '',
            disabled: false,
            accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt,.xlsx,.xls',
            hint: 'Upload files as evidence for this task (PDF, DOC, images, etc.)'
        }];
    };

    // Create form fields for inProgress task submission
    const formFields = [
        ...createBaseFormFields(task),
        ...addCompletedTaskFields(task),
        ...createEditableKpiFields(task, kpiAchievedAmounts, handleKpiAchievedAmountChange),
        ...createEvidenceUploadField(task)
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

    if (task.taskStatus !== 'inProgress') {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-red-500">This component is only for tasks in progress.</p>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen px-4 py-6 text-[#1B1717]">
            <div className="max-w-4xl mx-auto card-static border border-primary">
                {/* Announcement for InProgress Task */}
                <StatusNotification
                    type="info"
                    message="Please complete your task details, upload evidence, and submit when ready."
                />

                <DynamicForm
                    title="Submit In-Progress Task"
                    subtitle="Complete task details and upload evidence before submission"
                    fields={formFields}
                    onSubmit={handleFormSubmit}
                    showSubmitButton={!task?.evidence && !isUploadingEvidence}
                    submitButtonText={isUploadingEvidence ? 'Uploading...' : 'Upload Evidence'}
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
                                    <span className="text-green-600 font-medium">
                                        ✓ Evidence uploaded - Task ready for submission
                                    </span>
                                ) : (
                                    <span className="text-orange-600 font-medium">
                                        ⚠ Please upload evidence before submitting
                                    </span>
                                )}
                                <button
                                    onClick={handleSubmitTask}
                                    disabled={isSubmitting || !task?.evidence}
                                    className={`btn-primary ${!task?.evidence ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Task'}
                                </button>
                            </div>
                        </div>
                    }
                />
            </div>
        </div>
    );
}

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import DynamicForm from '../../components/ui/DynamicForm';
import { fetchTaskById, fetchTasks, fetchTasksByUserId } from '../../store/staffSlice';
import { useModal } from '../../hooks/useModal';
import { tasksAPI } from "../../utils/api";
import authService from "../../utils/authService";
import StatusNotification from "@/components/ui/StatusNotification";
import {
    getTaskFromParams,
    createBaseFormFields,
    addCompletedTaskFields,
    getDisplayTaskStatus,
    canSubmitTask
} from '../../utils/taskUtils';

export default function SubmitTask() {
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

    // Fetch task if not loaded
    useEffect(() => {
        if (!task && !isLoading) {
            taskId ? dispatch(fetchTaskById(taskId)) : dispatch(fetchTasks(id));
        }
    }, [dispatch, task, isLoading, id, taskId]);

    // Initialize KPI achieved amounts when task is loaded
    useEffect(() => {
        if (task && task.kpis && task.kpis.length > 0) {
            const initialKpiAmounts = {};
            task.kpis.forEach((kpi, index) => {
                initialKpiAmounts[index] = kpi.achievedAmount || '';
            });
            setKpiAchievedAmounts(initialKpiAmounts);
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

    // Handle task submission
    const handleSubmitTask = async () => {
        if (!task) return;

        // Validate KPI achieved amounts for tasks in progress
        if (task.taskStatus === 'inProgress' && task.kpis && task.kpis.length > 0) {
            const missingKpis = [];
            task.kpis.forEach((kpi, index) => {
                if (!kpiAchievedAmounts[index] || kpiAchievedAmounts[index].toString().trim() === '') {
                    missingKpis.push(kpi.kpiTitle);
                }
            });

            if (missingKpis.length > 0) {
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
        }

        setIsSubmitting(true);
        try {
            // Determine the appropriate status based on current state
            let newTaskStatus = 'submittedAndAwaitingApproval'; // Default for new tasks

            // If task was previously rejected, determine the appropriate submitted status
            if (task.taskStatus === 'approvalRejected') {
                newTaskStatus = 'submittedAndAwaitingApproval';
            } else if (task.taskStatus === 'submissionRejected' || task.taskStatus === 'revisionInProgress' || task.taskStatus === 'inProgress') {
                newTaskStatus = 'submittedAndAwaitingReview';
            }

            const updateData = {
                taskStatus: newTaskStatus,
                submittedDate: new Date(),
                ...(newTaskStatus === 'submittedAndAwaitingReview' ? { completedDate: new Date() } : {}),
                bias_check: null
            };

            // Include updated KPI data for tasks in progress
            if (task.taskStatus === 'inProgress' && task.kpis && task.kpis.length > 0) {
                const updatedKpis = task.kpis.map((kpi, index) => ({
                    ...kpi,
                    achievedAmount: parseFloat(kpiAchievedAmounts[index]) || 0
                }));
                updateData.kpis = updatedKpis;
            }
            console.log('Submitting task with data:', updateData);
            await tasksAPI.update(task._id, updateData);

            // Refresh tasks after submission
            if (user?._id) {
                dispatch(fetchTasksByUserId(user._id));
            }

            showSuccess(
                'Task Submitted Successfully',
                `Your task has been submitted and is ${getDisplayTaskStatus(newTaskStatus)}.`,
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

    // Handle evidence file upload
    const handleEvidenceUpload = async (file) => {
        if (!file || !task) return;

        setIsUploadingEvidence(true);
        try {
            const formData = new FormData();
            formData.append('evidence', file);

            await tasksAPI.uploadEvidence(task._id, formData);

            // Refresh task data
            if (taskId) {
                dispatch(fetchTaskById(taskId));
            } else {
                dispatch(fetchTaskById(task._id));
            }

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
            handleEvidenceUpload(formData.evidence);
        }
    };

    // Create KPI fields for submission mode
    const createSubmissionKpiFields = (task, kpiAchievedAmounts, handleKpiAchievedAmountChange) => {
        if (task?.taskStatus === 'inProgress' && task?.kpis && task.kpis.length > 0) {
            return task.kpis.map((kpi, index) => ([
                {
                    type: 'text',
                    name: `kpi_title_${index}`,
                    label: `KPI ${index + 1}: ${kpi.kpiTitle}`,
                    defaultValue: `Target: ${kpi.targetAmount} (${kpi.operator})`,
                    disabled: true,
                    group: 'kpis',
                    isDynamic: false,
                    position: 'top'
                },
                {
                    type: 'number',
                    name: `kpi_achieved_${index}`,
                    label: 'Achieved Amount',
                    defaultValue: kpiAchievedAmounts[index] || '',
                    disabled: false,
                    required: true,
                    placeholder: 'Enter achieved amount',
                    group: 'kpis',
                    isDynamic: false,
                    position: 'bottom',
                    min: 0,
                    onChange: (value) => handleKpiAchievedAmountChange(index, value)
                }
            ])).flat();
        }

        return [{
            type: 'textarea',
            name: 'kpis',
            label: 'Key Performance Indicators (KPIs)',
            rows: 3,
            defaultValue: task && task.kpis ? task.kpis.map(kpi =>
                `${kpi.kpiTitle}: Target ${kpi.targetAmount}, Achieved ${kpi.achievedAmount || 0} (${kpi.operator})`
            ).join('\n') : '',
            disabled: true
        }];
    };

    // Create evidence upload field
    const createEvidenceUploadField = (task) => {
        const needsEvidenceUpload = task?.taskStatus === 'submissionRejected' || task?.taskStatus === 'inProgress';

        if (needsEvidenceUpload) {
            const isResubmission = task?.taskStatus === 'submissionRejected';
            return [{
                type: 'file',
                name: 'evidence',
                label: 'Evidence',
                defaultValue: '',
                disabled: false,
                accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt,.xlsx,.xls',
                hint: isResubmission
                    ? 'Upload new evidence file to replace the rejected submission'
                    : 'Upload files as evidence for this task (PDF, DOC, images, etc.)'
            }];
        }

        return [];
    };

    // Create form fields for submission
    const formFields = [
        ...createBaseFormFields(task),
        ...addCompletedTaskFields(task),
        ...createSubmissionKpiFields(task, kpiAchievedAmounts, handleKpiAchievedAmountChange),
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

    return (
        <div className="bg-background min-h-screen px-4 py-6 text-[#1B1717]">
            <div className="max-w-4xl mx-auto card-static border border-primary">
                {/* Announcement for Submission Mode */}
                {canSubmitTask(task) && (
                    <StatusNotification
                        type="info"
                        message="Please review the task details below and submit when ready."
                    />
                )}

                {/* Announcement for Already Submitted Tasks */}
                {!canSubmitTask(task) && (task?.taskStatus === "submittedAndAwaitingReview" || task?.taskStatus === "submittedAndAwaitingApproval") && (
                    <StatusNotification
                        type="info"
                        message="This task has already been submitted and is under review."
                    />
                )}

                <DynamicForm
                    title="Submit Task"
                    subtitle="Review task details before submission"
                    fields={formFields}
                    onSubmit={handleFormSubmit}
                    showSubmitButton={!task?.evidence && !isUploadingEvidence && task?.taskStatus !== 'draft' && task?.taskStatus !== 'approvalRejected'}
                    submitButtonText={isUploadingEvidence ? 'Uploading...' : 'Upload Evidence'}
                    footer={
                        <div className="flex justify-between items-center mt-6">
                            <button
                                onClick={() => navigate('/tasks')}
                                className="btn-outline"
                            >
                                Back to Tasks
                            </button>

                            {canSubmitTask(task) && (
                                <div className="flex gap-3">
                                    {(task?.taskStatus === 'draft' || task?.taskStatus === 'approvalRejected') && (
                                        <button
                                            onClick={() => navigate(`/tasks/${task._id}/edit`)}
                                            className="btn-outline"
                                        >
                                            Edit Task
                                        </button>
                                    )}
                                    {(task?.taskStatus === 'submissionRejected' || task?.taskStatus === 'inProgress') && task?.evidence ? (
                                        <span className="text-green-600 font-medium">
                                            ✓ Evidence uploaded - Task ready for submission
                                        </span>
                                    ) : (task?.taskStatus === 'submissionRejected' || task?.taskStatus === 'inProgress') && (
                                        <span className="text-orange-600 font-medium">
                                            ⚠ Please upload evidence before submitting
                                        </span>
                                    )}
                                    <button
                                        onClick={handleSubmitTask}
                                        disabled={isSubmitting || (!task?.evidence && task?.taskStatus !== 'draft' && task?.taskStatus !== 'approvalRejected')}
                                        className={`btn-primary ${(!task?.evidence && task?.taskStatus !== 'draft' && task?.taskStatus !== 'approvalRejected') ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit Task'}
                                    </button>
                                </div>
                            )}
                        </div>
                    }
                />
            </div>
        </div>
    );
}

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import { fetchJobDetails, clearCurrentJob } from '../store/adminSlice';
import {
    getDisplayTaskStatus,
} from '../utils/statusStyles'; export default function JobDetails() {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Get data from Redux store
    const { currentJob, currentJobTasks, isLoading, error } = useSelector((state) => state.admin);

    // Fetch job details when component mounts
    useEffect(() => {
        if (jobId) {
            dispatch(fetchJobDetails(jobId));
        }

        // Cleanup when component unmounts
        return () => {
            dispatch(clearCurrentJob());
        };
    }, [dispatch, jobId]);

    // Task table columns
    const taskColumns = [
        { header: 'Staff Name', accessor: 'staffName' },
        { header: 'Task ID', accessor: 'id', render: (row) => row.id?.toString().slice(-8) || 'N/A' },
        { header: 'Task Title', accessor: 'title' },
        { header: 'Start Date', accessor: 'startDate' },
        { header: 'Finish Date', accessor: 'endDate' },
        {
            header: 'Submission Status',
            render: (r) => (
                <StatusBadge
                    status={getDisplayTaskStatus(r.taskStatus)}
                    type="task"
                    size="xs"
                    showIcon={false}
                />
            ),
        },
        {
            header: 'Task Status',
            render: (r) => (
                <StatusBadge
                    status={getDisplayTaskStatus(r.taskStatus)}
                    type="task"
                    size="xs"
                    showIcon={false}
                />
            ),
        },
    ];

    // Loading state
    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg">Loading job details...</div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    Error loading job details: {error}
                </div>
                <button
                    onClick={() => navigate('/reports/job-description')}
                    className="btn-secondary mt-4"
                >
                    Back to Job Descriptions
                </button>
            </div>
        );
    }

    if (!currentJob) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
                    <p className="text-gray-600 mb-4">The requested job description could not be found.</p>
                    <button
                        onClick={() => navigate('/reports/job-description')}
                        className="btn-secondary"
                    >
                        Back to Job Descriptions
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
                    <h1 className="text-3xl font-bold">Job Description Details</h1>
                    <p className="text-gray-600">View tasks for: {currentJob.title}</p>
                </div>
                <button
                    onClick={() => navigate('/reports/job-description')}
                    className="btn-outline flex gap-2 items-center"
                >
                    ←  Back to Job Descriptions
                </button>
            </div>

            {/* Job and Employee Information */}
            <div className="card-static mb-6">
                <h2 className="text-xl font-bold mb-4">Job Information</h2>
                <div className="flex flex-col gap-6">
                    <div>
                        <p className="font-medium text-gray-600">Job ID</p>
                        <p className="text-lg font-semibold">{currentJob.id?.toString().slice(-8) || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="font-medium text-gray-600">Job Title</p>
                        <p className="text-lg font-semibold">{currentJob.title}</p>
                    </div>
                    <div>
                        <p className="font-medium text-gray-600">Description</p>
                        <p className="text-lg font-semibold whitespace-pre-line">{currentJob.description || 'No description'}</p>
                    </div>
                    <div>
                        <p className="font-medium text-gray-600">Assigned Employees</p>
                        <p className="text-lg font-semibold">{currentJob.staffs}</p>
                    </div>
                    <div>
                        <p className="font-medium text-gray-600">Status</p>
                        <div className="mt-1">
                            <StatusBadge
                                status={currentJob.status}
                                type="task"
                                size="sm"
                                showIcon={false}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tasks Table */}
            <div className="bg-white rounded shadow mb-6">
                <DataTable
                    title={`Tasks for this Job (${currentJobTasks.length})`}
                    columns={taskColumns}
                    data={currentJobTasks}
                    rowKey="id"
                    containerClass="bg-white rounded"
                    variant='gradient'
                />
            </div>
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DataTable from '../components/DataTable';

export default function JobDetails() {
    const { jobId } = useParams();
    const navigate = useNavigate();

    // Dummy job data - matches the structure from JobDescription.jsx
    const [job, setJob] = useState(null);

    // Dummy jobs data
    const jobsData = [
        { id: '1230001', employeeId: '3210001', employeeName: 'Jane Doe', description: 'Proofreading', activeTasks: 2 },
        { id: '1230002', employeeId: '3210001', employeeName: 'Jane Doe', description: 'Content Creation', activeTasks: 1 },
        { id: '1230003', employeeId: '3210002', employeeName: 'Mark Wiens', description: 'KOL Partnership', activeTasks: 3 },
        { id: '1230004', employeeId: '3210002', employeeName: 'Mark Wiens', description: 'Get new clients', activeTasks: 2 },
        { id: '1230005', employeeId: '3210003', employeeName: 'Max Verstappen', description: 'Sign partnerships', activeTasks: 1 },
    ];

    // All tasks, filtered by selected job
    const allTasks = [
        { id: '32100010001', jobId: '1230001', employeeId: '3210001', employeeName: 'Jane Doe', title: 'Proofreading', start: '01/03/2025', end: '07/10/2025', status: 'Awaiting Review' },
        { id: '32100010002', jobId: '1230001', employeeId: '3210001', employeeName: 'Jane Doe', title: 'Proofreading', start: '01/03/2025', end: '07/10/2025', status: 'Awaiting Review' },
        { id: '32100020001', jobId: '1230002', employeeId: '3210001', employeeName: 'Jane Doe', title: 'Content Creation', start: '05/03/2025', end: '10/10/2025', status: 'Done' },
        { id: '32100030001', jobId: '1230003', employeeId: '3210002', employeeName: 'Mark Wiens', title: 'KOL Partnership', start: '10/03/2025', end: '15/10/2025', status: 'Done' },
        { id: '32100030002', jobId: '1230003', employeeId: '3210002', employeeName: 'Mark Wiens', title: 'Partnership Meeting', start: '12/03/2025', end: '18/10/2025', status: 'In Progress' },
        { id: '32100030003', jobId: '1230003', employeeId: '3210002', employeeName: 'Mark Wiens', title: 'Contract Review', start: '15/03/2025', end: '20/10/2025', status: 'Pending' },
        { id: '32100040001', jobId: '1230004', employeeId: '3210002', employeeName: 'Mark Wiens', title: 'Client Outreach', start: '20/03/2025', end: '25/10/2025', status: 'In Progress' },
        { id: '32100040002', jobId: '1230004', employeeId: '3210002', employeeName: 'Mark Wiens', title: 'Lead Follow-up', start: '22/03/2025', end: '27/10/2025', status: 'Pending' },
        { id: '32100050001', jobId: '1230005', employeeId: '3210003', employeeName: 'Max Verstappen', title: 'Contract Signing', start: '25/03/2025', end: '30/10/2025', status: 'Done' },
    ];

    const [tasksForJob, setTasksForJob] = useState([]);

    useEffect(() => {
        const foundJob = jobsData.find(j => j.id === jobId);
        if (foundJob) {
            setJob(foundJob);
            setTasksForJob(allTasks.filter(t => t.jobId === jobId));
        }
    }, [jobId]);

    // Task table columns
    const taskColumns = [
        { header: 'Employee Name', accessor: 'employeeName' },
        { header: 'Task ID', accessor: 'id' },
        { header: 'Task Title', accessor: 'title' },
        { header: 'Start Date', accessor: 'start' },
        { header: 'Finish Date', accessor: 'end' },
        {
            header: 'Task Status',
            render: r => (
                <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">
                    {r.status}
                </span>
            ),
        },
    ];

    if (!job) {
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
                    <p className="text-gray-600">View tasks for: {job.description}</p>
                </div>
                <button
                    onClick={() => navigate('/reports/job-description')}
                    className="btn-outline flex gap-2 items-center"
                >
                    ←  Back to Job Descriptions
                </button>
            </div>

            {/* Job and Employee Information */}
            <div className="bg-white rounded shadow p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Job Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    <div>
                        <p className="font-medium text-gray-600">Employee Name</p>
                        <p className="text-lg font-semibold">{job.employeeName}</p>
                    </div>
                    <div>
                        <p className="font-medium text-gray-600">Job Description ID</p>
                        <p className="text-lg font-semibold">{job.id}</p>
                    </div>
                    <div>
                        <p className="font-medium text-gray-600">Job Description</p>
                        <p className="text-lg font-semibold">{job.description}</p>
                    </div>
                    <div>
                        <p className="font-medium text-gray-600">Active Tasks</p>
                        <p className="text-lg font-semibold">{job.activeTasks}</p>
                    </div>
                </div>
            </div>

            {/* Tasks Table */}
            <div className="bg-white rounded shadow mb-6">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold">Tasks for this Job ({tasksForJob.length})</h2>
                </div>
                <DataTable
                    columns={taskColumns}
                    data={tasksForJob}
                    rowKey="id"
                    containerClass="bg-white rounded"
                />
            </div>
        </div>
    );
}

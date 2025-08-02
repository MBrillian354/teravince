// src/pages/StaffReport.jsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import StatsCard from '../components/StatsCard';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import DynamicForm from '../components/DynamicForm';

export default function StaffReport() {
  const { reportId } = useParams();
  const navigate = useNavigate();

  // ─── Dummy report data ─────────────────────────────────────────
  const report = {
    reportId,
    employeeId: '3210001',
    name: 'Jane Doe',
    jobTitle: 'Social Media Trainee',
    month: 'May 2025',
    employeeScore: '80/100',
    supervisorReview: 'Looks good overall.',
  };

  // ─── Local state for supervisor review ──────────────────────────
  const [supervisorReview, setSupervisorReview] = useState(report.supervisorReview);

  // ─── Dummy tasks under this report ──────────────────────────────
  const tasks = [
    {
      jobDescId: '32100010001',
      jobDesc: 'Proofreading',
      taskId: '32100010001',
      title: 'Review Social Media Post',
      status: 'Awaiting Review',
      score: '100/100',
      start: '01/03/2025',
      end: '07/10/2025',
      evidence: [
        { name: 'report-may.pdf', url: '/assets/report-may.pdf' },
        { name: 'screenshots-may.zip', url: '/assets/screenshots-may.zip' },
      ],
    },
    // …add more rows if you need…
  ];

  const [page, setPage] = useState(1);
  const totalPages = 3;

  // ─── Form configuration for supervisor review ────────────────────
  const supervisorReviewFields = [
    {
      type: 'textarea',
      name: 'supervisorReview',
      label: 'Review',
      defaultValue: supervisorReview,
      placeholder: 'Enter your review...',
      rows: 4,
      className: 'w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700'
    },
    {
      type: 'checkbox',
      name: 'confirmReview',
      label: 'I have properly reviewed the employee\'s report',
      required: true,
      className: 'form-checkbox mr-2'
    }
  ];

  // ─── Form configuration for task details ────────────────────────
  const taskDetailFields = [
    {
      type: 'text',
      name: 'jobDescId',
      label: 'Job Description ID',
      defaultValue: tasks[0]?.jobDescId || '',
      disabled: true,
      group: 'row1'
    },
    {
      type: 'text',
      name: 'jobDesc',
      label: 'Job Description',
      defaultValue: tasks[0]?.jobDesc || '',
      disabled: true,
      group: 'row1'
    },
    {
      type: 'text',
      name: 'taskId',
      label: 'Task ID',
      defaultValue: tasks[0]?.taskId || '',
      disabled: true,
      group: 'row2'
    },
    {
      type: 'text',
      name: 'score',
      label: 'Task Score',
      defaultValue: tasks[0]?.score || '',
      disabled: true,
      group: 'row2'
    },
    {
      type: 'text',
      name: 'title',
      label: 'Task Title',
      defaultValue: tasks[0]?.title || '',
      disabled: true
    },
    {
      type: 'textarea',
      name: 'description',
      label: 'Task Description',
      defaultValue: tasks[0]?.title || '', // Note: This seems to be using title instead of description in original
      disabled: true,
      rows: 3
    },
    {
      type: 'text',
      name: 'status',
      label: 'Task Status',
      defaultValue: tasks[0]?.status || '',
      disabled: true,
      group: 'row3'
    },
    {
      type: 'text',
      name: 'start',
      label: 'Start Date',
      defaultValue: tasks[0]?.start || '',
      disabled: true,
      group: 'row3'
    },
    {
      type: 'text',
      name: 'end',
      label: 'Finish Date',
      defaultValue: tasks[0]?.end || '',
      disabled: true,
      group: 'row3'
    },
    // Evidence links
    ...(tasks[0]?.evidence?.map((file, index) => ({
      type: 'link',
      name: `evidence_${index}`,
      label: file.name,
      href: file.url,
      className: 'justify-start'
    })) || [])
  ];

  const handleSupervisorReviewSubmit = (formData) => {
    console.log('Supervisor review submitted:', formData);
    setSupervisorReview(formData.supervisorReview);
    // Add logic to save the review
  };

  const handleTaskDetailSubmit = (formData) => {
    // Handle form submission if needed
    console.log('Task detail form data:', formData);
  };

  const taskColumns = [
    {
      header: '',
      render: () => <input type="checkbox" className="form-checkbox" />,
      align: 'center',
    },
    { header: 'Job Description ID', accessor: 'jobDescId' },
    { header: 'Job Description', accessor: 'jobDesc' },
    { header: 'Task ID', accessor: 'taskId' },
    { header: 'Task Title', accessor: 'title' },
    {
      header: 'Task Status',
      render: r => (
        <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">
          {r.status}
        </span>
      ),
    },
    { header: 'Task Score', accessor: 'score', align: 'right' },
    {
      header: '',
      render: () => <span className="cursor-pointer">•••</span>,
      align: 'right',
    },
  ];

  return (
    <div className="container mx-auto px-4">
      {/* ← Back & Page Title */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Staff Report</h1>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-1 bg-gray-700 text-white px-3 py-2 rounded text-sm hover:bg-gray-800 hover:cursor-pointer"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Back to Reports</span>
        </button>
      </div>

      {/* Top Summary Card */}
      <div className="bg-white rounded shadow p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-gray-400 text-2xl">👤</span>
          </div>
          <div>
            <p className="font-semibold">{report.name}</p>
            <p className="text-sm text-gray-600">{report.employeeId}</p>
            <p className="text-sm text-gray-600">{report.jobTitle}</p>
            <p className="text-sm text-gray-500">{report.month}</p>
          </div>
        </div>
        <StatsCard
          label="Employee Score"
          value={report.employeeScore}
          colorClass="bg-white"
        />
      </div>

      {/* Supervisor Review */}
      <div className="flex flex-col bg-white rounded shadow p-6 mb-6">
        <p className="font-medium text-gray-600 mb-4">Supervisor Review</p>
        <DynamicForm
          fields={supervisorReviewFields}
          onSubmit={handleSupervisorReviewSubmit}
          showSubmitButton={false}
          // submitButtonText="Send Review"
          className="space-y-4"
        />
        <button className="btn-secondary self-end">
          Send Review
        </button>
      </div>

      {/* Employee Status + Continue */}
      <div className="flex justify-between items-center mb-2">
        <p className="font-medium text-gray-700">Employee Status</p>
        <button className="border border-gray-300 px-4 py-1 text-sm rounded hover:bg-gray-100">
          Continue
        </button>
      </div>

      {/* Tasks Table */}
      <DataTable
        columns={taskColumns}
        data={tasks}
        rowKey="taskId"
        containerClass="bg-white rounded mb-4"
      />

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* Bottom Detail Card */}
      <div className="bg-white rounded shadow p-6 mt-6">
        <div className="staff-report-form">
          <DynamicForm
            fields={taskDetailFields}
            onSubmit={handleTaskDetailSubmit}
            showSubmitButton={false}
            className="space-y-6"
          />
        </div>
      </div>
    </div>
  );
}

// src/pages/StaffReport.jsx

import React, { useState }         from 'react';
import { useParams, useNavigate }  from 'react-router-dom';
import { ArrowLeftIcon }           from '@heroicons/react/24/outline';
import StatsCard                   from '../components/StatsCard';
import DataTable                   from '../components/DataTable';
import Pagination                  from '../components/Pagination';

export default function StaffReport() {
  const { reportId } = useParams();
  const navigate     = useNavigate();

  // ─── Dummy report data ─────────────────────────────────────────
  const report = {
    reportId,
    employeeId:      '3210001',
    name:            'Jane Doe',
    jobTitle:        'Social Media Trainee',
    month:           'May 2025',
    employeeScore:   '80/100',
    supervisorReview:'Looks good overall.',
  };

  // ─── Local state for supervisor review ──────────────────────────
  const [supervisorReview, setSupervisorReview] = useState(report.supervisorReview);

  // ─── Dummy tasks under this report ──────────────────────────────
  const tasks = [
    {
      jobDescId:    '32100010001',
      jobDesc:      'Proofreading',
      taskId:       '32100010001',
      title:        'Review Social Media Post',
      status:       'Awaiting Review',
      score:        '100/100',
      start:        '01/03/2025',
      end:          '07/10/2025',
      evidence: [
        { name: 'report-may.pdf',      url: '/assets/report-may.pdf'      },
        { name: 'screenshots-may.zip', url: '/assets/screenshots-may.zip' },
      ],
    },
    // …add more rows if you need…
  ];

  const [page, setPage] = useState(1);
  const totalPages      = 3;

  const taskColumns = [
    {
      header: '',
      render: () => <input type="checkbox" className="form-checkbox" />,
      align: 'center',
    },
    { header: 'Job Description ID', accessor: 'jobDescId' },
    { header: 'Job Description',    accessor: 'jobDesc'   },
    { header: 'Task ID',            accessor: 'taskId'    },
    { header: 'Task Title',         accessor: 'title'     },
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
          className="flex items-center space-x-1 bg-gray-700 text-white px-3 py-1 rounded text-sm hover:bg-gray-800"
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
      <div className="bg-white rounded shadow p-6 mb-6">
        <p className="font-medium text-gray-600 mb-2">Supervisor Review</p>
        <textarea
          value={supervisorReview}
          onChange={e => setSupervisorReview(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 h-28 text-sm text-gray-700 mb-4"
          placeholder="Enter your review..."
        />
        <div className="flex justify-end items-center space-x-4">
          <label className="flex items-center text-sm">
            <input type="checkbox" className="form-checkbox mr-2" />
            I have properly reviewed the employee’s report
          </label>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            Send Review
          </button>
        </div>
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
      <div className="bg-white rounded shadow p-6 mt-6 space-y-6">
        {/* Row 1: Job Description ID & Job Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-600">Job Description ID</label>
            <input
              readOnly
              value={tasks[0]?.jobDescId || ''}
              className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Job Description</label>
            <input
              readOnly
              value={tasks[0]?.jobDesc || ''}
              className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700"
            />
          </div>
        </div>

        {/* Row 2: Task ID & Task Score */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-600">Task ID</label>
            <input
              readOnly
              value={tasks[0]?.taskId || ''}
              className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Task Score</label>
            <input
              readOnly
              value={tasks[0]?.score || ''}
              className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700"
            />
          </div>
        </div>

        {/* Row 3: Task Title */}
        <div>
          <label className="block text-sm text-gray-600">Task Title</label>
          <input
            readOnly
            value={tasks[0]?.title || ''}
            className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700"
          />
        </div>

        {/* Row 4: Task Description */}
        <div>
          <label className="block text-sm text-gray-600">Task Description</label>
          <textarea
            readOnly
            value={tasks[0]?.title || ''}
            className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 h-24"
          />
        </div>

        {/* Row 5: Task Status / Start Date / Finish Date */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm text-gray-600">Task Status</label>
            <input
              readOnly
              value={tasks[0]?.status || ''}
              className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Start Date</label>
            <input
              readOnly
              value={tasks[0]?.start || ''}
              className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Finish Date</label>
            <input
              readOnly
              value={tasks[0]?.end || ''}
              className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700"
            />
          </div>
        </div>

        {/* Row 6: Evidence */}
        <div>
          <label className="block text-sm text-gray-600">Evidence</label>
          {tasks[0]?.evidence?.map(file => (
            <a
              key={file.url}
              href={file.url}
              download={file.name}
              className="block text-indigo-600 hover:underline text-sm"
            >
              {file.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

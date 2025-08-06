// src/pages/StaffReport.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import StatsCard from '../components/StatsCard';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';

export default function StaffReport() {
  const { reportId } = useParams();
  const navigate = useNavigate();

  // 1) initial data from reports
  const reportData = {
    r1: { staffId: '3210001', name: 'Jane Doe', month: 'May 2025', jobTitle: 'Social Media Trainee', score: '0/100' },
    r2: { staffId: '3210002', name: 'John Smith', month: 'March 2025', jobTitle: 'Marketing Intern', score: '75/100' },
    r3: { staffId: '3210003', name: 'Lisa Ray', month: 'January 2025', jobTitle: 'Design Assistant', score: '85/100' },
    r4: { staffId: '3210004', name: 'Alan Kim', month: 'April 2025', jobTitle: 'Community Intern', score: '60/100' },
  };

  const spvPlaceholder = "Enter your review...";

  // 2) Look up the current report; fallback to r1
  const report = reportData[reportId] || reportData.r1;

  // 3) Editable supervisor review
  const [supervisorReview, setSupervisorReview] = useState('');
  useEffect(() => {
    setSupervisorReview('');  // reset when reportId changes
  }, [reportId]);

  // 4) Dummy tasks keyed by reportId
  const allTasks = [
    {
      reportId: 'r1',
      jobDescId: '32100010001',
      jobDesc: 'Proofreading',
      taskId: '32100010001',
      title: 'Review Social Media Post',
      status: 'Awaiting Review',
      score: '100/100',
      start: '01/03/2025',
      end: '07/10/2025',
      evidence: [{ name: 'report-may.pdf', url: '/assets/report-may.pdf' }],
    },
    {
      reportId: 'r2',
      jobDescId: '32100020001',
      jobDesc: 'Draft Campaign Copy',
      taskId: '32100020001',
      title: 'Write blog post',
      status: 'Completed',
      score: '75/100',
      start: '10/03/2025',
      end: '15/10/2025',
      evidence: [{ name: 'blog-draft.docx', url: '/assets/blog-draft.docx' }],
    },
    {
      reportId: 'r3',
      jobDescId: '32100030001',
      jobDesc: 'Design Layout',
      taskId: '32100030001',
      title: 'Create flyer',
      status: 'Completed',
      score: '85/100',
      start: '05/01/2025',
      end: '20/01/2025',
      evidence: [],
    },
    {
      reportId: 'r4',
      jobDescId: '32100040001',
      jobDesc: 'Community Engagement',
      taskId: '32100040001',
      title: 'Host webinar',
      status: 'Awaiting Review',
      score: '60/100',
      start: '15/04/2025',
      end: '30/04/2025',
      evidence: [],
    },
  ];

  // 5) Filter tasks for this report
  const tasks = allTasks.filter(t => t.reportId === reportId);

  // 6) Which task is selected?
  const [selectedTaskId, setSelectedTaskId] = useState(tasks[0]?.taskId);
  const selectedTask = tasks.find(t => t.taskId === selectedTaskId) || tasks[0];

  // reset selectedTask when reportId changes
  useEffect(() => {
    setSelectedTaskId(tasks[0]?.taskId);
  }, [reportId]);

  // 7) Pagination
  const [page, setPage] = useState(1);
  const totalPages = 3;

  // 8) Columns for the tasks table
  const taskColumns = [
    { header: '', render: () => <input type="checkbox" className="form-checkbox" />, align: 'center' },
    { header: 'Job Description ID', accessor: 'jobDescId' },
    { header: 'Job Description', accessor: 'jobDesc' },
    { header: 'Task ID', accessor: 'taskId' },
    { header: 'Task Title', accessor: 'title' },
    {
      header: 'Task Status',
      render: r => <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">
        {r.status}
      </span>,
    },
    { header: 'Task Score', accessor: 'score', align: 'right' },
  ];

  return (
    <div className="container mx-auto px-4">
      {/* Back & Title */}
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
      <div className="bg-surface rounded shadow p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
            <span className="text-gray-400 text-2xl">👤</span>
          </div>
          <div>
            <p className="font-semibold">{report.name}</p>
            <p className="text-sm text-gray-600">{report.staffId}</p>
            <p className="text-sm text-gray-600">{report.jobTitle}</p>
            <p className="text-sm text-gray-500">{report.month}</p>
          </div>
        </div>
        <StatsCard
          label="Staff Score"
          value={report.score}
          colorClass="bg-white"
        />
      </div>

      {/* Supervisor Review */}
      <div className="bg-surface rounded shadow p-6 mb-6">
        <p className="font-medium text-gray-600 mb-2">Supervisor Review</p>
        <textarea
          value={supervisorReview}
          onChange={e => setSupervisorReview(e.target.value)}
          className="w-full bg-muted border border-gray-200 rounded px-3 py-2 h-28 text-sm text-gray-700 mb-4"
          placeholder={spvPlaceholder}
        />
        <div className="flex justify-end items-center space-x-4">
          <label className="flex items-center text-sm">
            <input type="checkbox" className="form-checkbox mr-2" />
            I have properly reviewed the staff's report
          </label>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            Send Review
          </button>
        </div>
      </div>

      {/* Tasks Table */}
      <DataTable
        columns={taskColumns}
        data={tasks}
        rowKey="taskId"
        containerClass="bg-white rounded mb-4"
        onRowClick={({ taskId }) => setSelectedTaskId(taskId)}
        variant='gradient'
      />

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* Bottom Detail Card */}
      {selectedTask && (
        <div className="bg-white rounded shadow p-6 mt-6 space-y-6">
          {/* JobDesc ID & Desc */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[['Job Description ID', selectedTask.jobDescId],
            ['Job Description', selectedTask.jobDesc]].map(([label, val]) => (
              <div key={label}>
                <label className="block text-sm text-gray-600">{label}</label>
                <input
                  readOnly
                  value={val}
                  className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700"
                />
              </div>
            ))}
          </div>

          {/* Task ID & Score */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[['Task ID', selectedTask.taskId],
            ['Task Score', selectedTask.score]].map(([label, val]) => (
              <div key={label}>
                <label className="block text-sm text-gray-600">{label}</label>
                <input
                  readOnly
                  value={val}
                  className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700"
                />
              </div>
            ))}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm text-gray-600">Task Title</label>
            <input
              readOnly
              value={selectedTask.title}
              className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-gray-600">Task Description</label>
            <textarea
              readOnly
              value={selectedTask.title}
              className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 h-24"
            />
          </div>

          {/* Status / Dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[['Task Status', selectedTask.status],
            ['Start Date', selectedTask.start],
            ['Finish Date', selectedTask.end]].map(([label, val]) => (
              <div key={label}>
                <label className="block text-sm text-gray-600">{label}</label>
                <input
                  readOnly
                  value={val}
                  className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700"
                />
              </div>
            ))}
          </div>

          {/* Evidence */}
          <div>
            <label className="block text-sm text-gray-600">Evidence</label>
            {selectedTask.evidence.length > 0
              ? selectedTask.evidence.map(f => (
                <a
                  key={f.url}
                  href={f.url}
                  download={f.name}
                  className="block text-indigo-600 hover:underline text-sm"
                >
                  {f.name}
                </a>
              ))
              : <p className="text-gray-500 text-sm">No evidence uploaded</p>
            }
          </div>
        </div>
      )}
    </div>
  );
}

// src/pages/Tasks.jsx

import React, { useState, useEffect } from 'react';
import TasksReportsTabs from '../components/TasksReportsTabs';
import StatsCard        from '../components/StatsCard';
import DataTable        from '../components/DataTable';
import Pagination       from '../components/Pagination';

export default function Tasks() {
  // 1) Tab state
  const [activeTab, setActiveTab] = useState('tasks');

  // 2) Summary cards data
  const summary = [
    { label: 'Tasks to Approve', value: 2 },
    { label: 'Task to Revise',   value: 0 },
    { label: 'Task to Review',   value: 0 },
  ];

  // 3) Dummy table data
  const tasks = [
    {
      id: '3210001',
      title: 'Proofreading',
      status: 'Awaiting Approval',
      approval: 'Awaiting Approval',
      review: 'Awaiting Evidence',
      employeeId: '32100010001',
      employeeName: 'Jane Doe',
      description: 'Fix typos and improve grammar in the May report.',
      start: '01/03/2025',
      end: '07/10/2025',
      supervisorComment: '',
    },
    {
      id: '3210002',
      title: 'Proofreading',
      status: 'Awaiting Approval',
      approval: 'Awaiting Approval',
      review: 'Awaiting Evidence',
      employeeId: '32100010002',
      employeeName: 'Mark Wiens',
      description: 'Proofread the April campaign materials.',
      start: '02/03/2025',
      end: '08/10/2025',
      supervisorComment: '',
    },
    // ...add more rows as needed
  ];

  // 4) Selected row state
  const [selectedTaskId, setSelectedTaskId] = useState(tasks[0].id);
  const selected = tasks.find((t) => t.id === selectedTaskId);

  // 5) Supervisor comment state (editable)
  const [supervisorComment, setSupervisorComment] = useState(
    tasks.find((t) => t.id === selectedTaskId)?.supervisorComment || ''
  );
  useEffect(() => {
    // reset only when the selected ID changes, not on every render
    setSupervisorComment(
      tasks.find((t) => t.id === selectedTaskId)?.supervisorComment || ''
    );
  }, [selectedTaskId]);

  // 6) Pagination state
  const [page, setPage] = useState(1);
  const totalPages = 11;

  // 7) Table column definitions
  const columns = [
    {
      header: '',
      render: (row) => (
        <input
          type="checkbox"
          checked={row.id === selectedTaskId}
          onChange={() => setSelectedTaskId(row.id)}
        />
      ),
      align: 'center',
    },
    { header: 'Task ID',    accessor: 'id'    },
    { header: 'Task Title', accessor: 'title' },
    {
      header: 'Task Status',
      render: (r) => (
        <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">
          {r.status}
        </span>
      ),
    },
    {
      header: 'Task Approval',
      render: (r) => (
        <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">
          {r.approval}
        </span>
      ),
    },
    {
      header: 'Task Review',
      render: (r) => (
        <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">
          {r.review}
        </span>
      ),
    },
    {
      header: '',
      render: () => <span className="cursor-pointer">•••</span>,
      align: 'right',
    },
  ];

  return (
    <div className="container mx-auto px-4">
      {/* Page title */}
      <h1 className="text-3xl font-bold mb-4">Reports, Jobs, and Tasks</h1>

      {/* Tabs */}
      <TasksReportsTabs active={activeTab} onChange={setActiveTab} />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {summary.map((c) => (
          <StatsCard key={c.label} label={c.label} value={c.value} />
        ))}
      </div>

      {/* Tasks Table */}
      <DataTable
        columns={columns}
        data={tasks}
        rowKey="id"
        onRowClick={({ id }) => setSelectedTaskId(id)}
        containerClass="bg-white rounded mb-4"
      />

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* Detail Card */}
      {selected && (
        <div className="bg-white rounded shadow p-6 mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Employee ID (read-only, grey) */}
            <div>
              <label className="block text-sm text-gray-600">Employee ID</label>
              <input
                readOnly
                value={selected.employeeId}
                className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700"
              />
            </div>
            {/* Employee Name (read-only, grey) */}
            <div>
              <label className="block text-sm text-gray-600">Employee Name</label>
              <input
                readOnly
                value={selected.employeeName}
                className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700"
              />
            </div>
            {/* Task ID (read-only, grey) */}
            <div>
              <label className="block text-sm text-gray-600">Task ID</label>
              <input
                readOnly
                value={selected.id}
                className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700"
              />
            </div>
            {/* Task Status (read-only, grey) */}
            <div>
              <label className="block text-sm text-gray-600">Task Status</label>
              <input
                readOnly
                value={selected.status}
                className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700"
              />
            </div>
          </div>

          {/* Task Title */}
          <div>
            <label className="block text-sm text-gray-600">Task Title</label>
            <input
              readOnly
              value={selected.title}
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700"
            />
          </div>

          {/* Task Description */}
          <div>
            <label className="block text-sm text-gray-600">Task Description</label>
            <textarea
              readOnly
              value={selected.description}
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-sm h-24 text-gray-700"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Date */}
            <div>
              <label className="block text-sm text-gray-600">Start Date</label>
              <input
                readOnly
                value={selected.start}
                className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700"
              />
            </div>
            {/* Finish Date */}
            <div>
              <label className="block text-sm text-gray-600">Finish Date</label>
              <input
                readOnly
                value={selected.end}
                className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700"
              />
            </div>
          </div>

          {/* Supervisor Comment (editable, white) */}
          <div>
            <label className="block text-sm text-gray-600">Supervisor Comment</label>
            <textarea
              value={supervisorComment}
              onChange={(e) => setSupervisorComment(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm h-20 text-gray-900"
            />
          </div>

          {/* Checklist + Buttons (right-aligned) */}
          <div className="flex flex-col items-end space-y-2">
            <label className="flex items-center text-sm">
              <input type="checkbox" className="form-checkbox mr-2" />
              I have properly reviewed the employee’s task without bias
            </label>
            <div className="space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-100">
                Request Revision
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700">
                Approve Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

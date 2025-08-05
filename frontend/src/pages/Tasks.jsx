import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TasksReportsTabs from '../components/TasksReportsTabs';
import StatsCard from '../components/StatsCard';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';

export default function Tasks() {
  const navigate = useNavigate();

  // 1) Tab state
  const [activeTab, setActiveTab] = useState('tasks');

  // 2) Summary cards data
  const summary = [
    { label: 'Tasks to Approve', value: 2 },
    { label: 'Task to Revise', value: 0 },
    { label: 'Task to Review', value: 0 },
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
  ];

  // 4) Selected row state
  const [selectedTaskId, setSelectedTaskId] = useState(tasks[0].id);

  // 5) Handle task view
  const handleViewTask = (taskId) => {
    navigate(`/reports/tasks/${taskId}`);
  };

  // 6) Pagination state
  const [page, setPage] = useState(1);
  const totalPages = 11;

  // 7) Table column definitions
  const columns = [
    { header: 'Task ID', accessor: 'id' },
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
      header: 'Actions',
      render: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewTask(row.id)}
            className="btn-secondary text-xs"
          >
            View Details
          </button>
        </div>
      ),
      align: 'center',
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
    </div>
  );
}

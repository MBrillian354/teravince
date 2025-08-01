// src/pages/Reports.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronDownIcon }   from '@heroicons/react/24/outline';
import TasksReportsTabs      from '../components/TasksReportsTabs';
import StatsCard             from '../components/StatsCard';
import DataTable             from '../components/DataTable';
import Pagination            from '../components/Pagination';

export default function Reports() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const totalPages = 11;

  const cards = [
    { label: 'Upcoming Reviews',      value: 3 },
    { label: 'Finished Review',       value: 0 },
    { label: "This Month’s Deadline", value: '31 May 2025' },
  ];

  const reportData = [
    {
      reportId:    'r1',
      employeeId:  '3210001',
      name:        'Jane Doe',
      month:       'May',
      jobTitle:    'Social Media Trainee',
      score:       '0/100',
      status:      'Awaiting Review',
    },
    // …etc
  ];

  const columns = [
    {
      header: '',
      render: () => <input type="checkbox" className="form-checkbox" />,
      align: 'center'
    },
    {
      header: 'Employee Name',
      render: row => (
        <Link
          to={`/spv-report/${row.reportId}`}
          className="flex items-center space-x-2 hover:underline"
        >
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-400">👤</span>
          </div>
          <span>{row.name}</span>
        </Link>
      )
    },
    {
      header: () => (
        <div className="flex items-center space-x-1">
          <span>Month</span>
          <ChevronDownIcon className="w-4 h-4 text-gray-500" />
        </div>
      ),
      accessor: 'month',
      align: 'center'
    },
    { header: 'Job Title',       accessor: 'jobTitle' },
    { header: 'Employee Score',  accessor: 'score', align: 'right' },
    {
      header: 'Report Status',
      render: row => (
        <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">
          {row.status}
        </span>
      ),
      align: 'right'
    },
    {
      header: '',
      render: () => <span className="cursor-pointer">•••</span>,
      align: 'right'
    }
  ];

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-4">Reports, Jobs, and Tasks</h1>
      <TasksReportsTabs />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {cards.map(c => <StatsCard key={c.label} {...c} />)}
      </div>

      <DataTable
        columns={columns}
        data={reportData}
        rowKey="reportId"
        containerClass="bg-white rounded mb-4"
        onRowClick={({ reportId }) => navigate(`/spv-report/${reportId}`)}
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}

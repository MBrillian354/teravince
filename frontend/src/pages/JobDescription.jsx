// src/pages/JobDescription.jsx

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TasksReportsTabs from '../components/TasksReportsTabs'
import DataTable        from '../components/DataTable'
import Pagination       from '../components/Pagination'

export default function JobDescription() {
  const navigate = useNavigate();

  // list of job descriptions
  const jobList = [
    { id: '1230001', employeeId: '3210001', employeeName: 'Jane Doe',       description: 'Proofreading',      activeTasks: 2 },
    { id: '1230002', employeeId: '3210001', employeeName: 'Jane Doe',       description: 'Content Creation',  activeTasks: 1 },
    { id: '1230003', employeeId: '3210002', employeeName: 'Mark Wiens',     description: 'KOL Partnership',   activeTasks: 3 },
    { id: '1230004', employeeId: '3210002', employeeName: 'Mark Wiens',     description: 'Get new clients',   activeTasks: 2 },
    { id: '1230005', employeeId: '3210003', employeeName: 'Max Verstappen', description: 'Sign partnerships', activeTasks: 1 },
  ]

  // currently selected job description
  const [selectedJobId, setSelectedJobId] = useState(jobList[0].id)

  // Handle job view
  const handleViewJob = (jobId) => {
    navigate(`/reports/job-description/${jobId}`);
  };

  // pagination
  const [page, setPage] = useState(1)
  const totalPages = 11

  // top‐table columns (employeeId removed)
  const jobColumns = [
    {
      header: '',
      render: () => <input type="checkbox" className="form-checkbox" />,
      align: 'center',
    },
    { header: 'Job Description ID', accessor: 'id' },
    { header: 'Job Description',    accessor: 'description' },
    {
      header: 'Number of Active Task',
      accessor: 'activeTasks'
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => handleViewJob(row.id)}
            className="btn-secondary text-xs"
          >
            View Details
          </button>
        </div>
      ),
      align: 'center',
    },
  ]

  return (
    <div className="container mx-auto px-4">
      {/* Page title */}
      <h1 className="text-3xl font-bold mb-4">Reports, Jobs, and Tasks</h1>

      {/* Tab bar */}
      <TasksReportsTabs />

      {/* Job Description table */}
      <DataTable
        columns={jobColumns}
        data={jobList}
        rowKey="id"
        onRowClick={({ id }) => setSelectedJobId(id)}
        containerClass="bg-white rounded mb-4"
      />

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  )
}

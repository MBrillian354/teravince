// src/pages/JobDescription.jsx

import React, { useState } from 'react'
import TasksReportsTabs from '../components/TasksReportsTabs'
import DataTable        from '../components/DataTable'
import Pagination       from '../components/Pagination'

export default function JobDescription() {
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
  const selectedJob = jobList.find(j => j.id === selectedJobId)

  // all tasks, filtered by selected job
  const allTasks = [
    { id: '32100010001', jobId: '1230001', employeeId: '3210001', employeeName: 'Jane Doe',       title: 'Proofreading',     start: '01/03/2025', end: '07/10/2025', status: 'Awaiting Review' },
    { id: '32100010002', jobId: '1230001', employeeId: '3210001', employeeName: 'Jane Doe',       title: 'Proofreading',     start: '01/03/2025', end: '07/10/2025', status: 'Awaiting Review' },
    { id: '32100020001', jobId: '1230002', employeeId: '3210001', employeeName: 'Jane Doe',       title: 'Content Creation', start: '05/03/2025', end: '10/10/2025', status: 'Done' },
    { id: '32100030001', jobId: '1230003', employeeId: '3210002', employeeName: 'Mark Wiens',     title: 'KOL Partnership',  start: '10/03/2025', end: '15/10/2025', status: 'Done' },
    // …etc…
  ]
  const tasksForJob = allTasks.filter(t => t.jobId === selectedJobId)

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
  ]

  // bottom‐table columns (include employee info)
  const taskColumns = [
    {
      header: '',
      render: () => <input type="checkbox" className="form-checkbox" />,
      align: 'center',
    },
    { header: 'Employee ID',   accessor: 'employeeId'   },
    { header: 'Employee Name', accessor: 'employeeName' },
    { header: 'Task ID',       accessor: 'id'           },
    { header: 'Task Title',    accessor: 'title'        },
    { header: 'Start Date',    accessor: 'start'        },
    { header: 'Finish Date',   accessor: 'end'          },
    {
      header: 'Task Status',
      render: r => (
        <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">
          {r.status}
        </span>
      ),
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

      {/* Detail card (side-by-side layout) */}
      {selectedJob && (
        <div className="bg-white rounded shadow p-6 mb-6 flex flex-col md:flex-row md:space-x-12">
          {/* ID */}
          <div className="flex-1">
            <p className="font-medium text-gray-600">Job Description ID</p>
            <p className="text-xl font-semibold">{selectedJob.id}</p>
          </div>
          {/* Description */}
          <div className="flex-1 mt-4 md:mt-0">
            <p className="font-medium text-gray-600">Job Description</p>
            <p className="text-xl font-semibold">{selectedJob.description}</p>
          </div>
        </div>
      )}

      {/* Tasks under this job */}
      <DataTable
        columns={taskColumns}
        data={tasksForJob}
        rowKey="id"
        containerClass="bg-white rounded mb-6"
      />
    </div>
  )
}

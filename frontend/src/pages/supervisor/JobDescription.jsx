// src/pages/JobDescription.jsx

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import TasksReportsTabs from '../../components/TasksReportsTabs'
import DataTable from '../../components/DataTable'
import { fetchJobs } from '../../store/adminSlice'

export default function JobDescription() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get data from Redux store
  const { jobsData, isLoading, error } = useSelector((state) => state.admin);
  // console.log('Jobs Data:', jobsData);

  // Selected job state
  const [selectedJobId, setSelectedJobId] = useState(null);

  // Fetch jobs on component mount
  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  // Set first job as selected when jobs are loaded
  useEffect(() => {
    if (jobsData.length > 0 && !selectedJobId) {
      setSelectedJobId(jobsData[0].id);
    }
  }, [jobsData, selectedJobId]);

  // Handle job view
  const handleViewJob = (jobId) => {
    navigate(`/reports/job-description/${jobId}`);
  };

  // top‐table columns
  const jobColumns = [
    { header: 'Job ID', accessor: 'id', render: (row) => row.id?.toString().slice(0, 5) || 'N/A' },
    { header: 'Job Title', accessor: 'title' },
    {
      header: 'Active Tasks',
      render: (row) => {
        const count = row.taskCounts?.inProgress;
        // Handle both number and array cases for robustness
        if (Array.isArray(count)) {
          return count.reduce((sum, val) => sum + val, 0);
        }
        return count || 0;
      }
    },
    {
      header: 'Completed Tasks',
      render: (row) => {
        const count = row.taskCounts?.completed;
        // Handle both number and array cases for robustness
        if (Array.isArray(count)) {
          return count.reduce((sum, val) => sum + val, 0);
        }
        return count || 0;
      }
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

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4">Reports, Jobs, and Tasks</h1>
        <TasksReportsTabs />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading jobs...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4">Reports, Jobs, and Tasks</h1>
        <TasksReportsTabs />
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading jobs: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      {/* Page title */}
      <h1 className="text-3xl font-bold mb-4">Reports, Jobs, and Tasks</h1>

      {/* Tab bar */}
      <TasksReportsTabs />

      {/* Job Description table */}
      <DataTable
        title="Job Details"
        columns={jobColumns}
        data={jobsData}
        rowKey="id"
        onRowClick={({ id }) => setSelectedJobId(id)}
        containerClass="bg-white rounded mb-4"
        variant='gradient'
      />
    </div>
  )
}

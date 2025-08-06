import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import StatsCard from '../components/StatsCard';
import DataTable from '../components/DataTable';
import DynamicForm from '@/components/DynamicForm';

export default function StaffReport() {
  const { reportId } = useParams();
  const navigate = useNavigate();

  // 1) Single dummy report data
  const report = { userId: '3210001', userName: 'Jane Doe', month: 'May 2025', jobTitle: 'Social Media Trainee', score: '0/100' };

  // 2) Single dummy task
  const tasks = [
    {
      taskId: '32100010001',
      title: 'Review Social Media Post',
      taskStatus: 'Awaiting Review',
      score: '100/100',
      startDate: '01/03/2025',
      endDate: '07/10/2025',
      evidence: [{ name: 'report-may.pdf', url: '/assets/report-may.pdf' }],
    },
  ];

  const selectedTask = tasks[0];

  const taskColumns = [
    { header: 'Task ID', accessor: 'taskId' },
    { header: 'Task Title', accessor: 'title' },
    {
      header: 'Task Status',
      render: r => <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">
        {r.taskStatus}
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
          className="btn-outline flex items-center gap-2"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Back to Reports</span>
        </button>
      </div>

      {/* Top Summary Card */}
      <div className="card-static flex gap-2 justify-between mb-6">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
            <span className="text-gray-400 text-2xl">👤</span>
          </div>
          <div>
            <h1 className=" text-lg font-semibold">{report.userName}</h1>
            <p className="text-gray-600">{report.userId}</p>
            <p className="text-gray-600">{report.jobTitle}</p>
            <p className="text-gray-500">{report.month}</p>
          </div>
        </div>
        <StatsCard
          label="Staff Score"
          value={report.score}
          colorClass="bg-white"
        />
      </div>

      {/* Supervisor Review using DynamicForm */}
      <div className="card-static mb-6">
        <DynamicForm
          fields={[
            {
              label: 'Supervisor Review',
              name: 'supervisorReview',
              type: 'textarea',
              placeholder: "Enter your review ...",
            },
            {
              label: 'I have properly reviewed the staff\'s report',
              name: 'reviewed',
              type: 'checkbox',
            },
          ]}
          submitButtonText="Send Review"
        />
      </div>

      {/* Tasks Table */}
      <DataTable
        title={`Monthly Tasks for ${report.userName}`}
        columns={taskColumns}
        data={tasks}
        rowKey="taskId"
        containerClass="bg-white rounded mb-4"
        // Only one task, so no row click needed
        variant='gradient'
      />

      {/* Bottom Detail Card using DynamicForm */}
      {selectedTask && (
        <div className="card-static mb-6">
          <DynamicForm
            fields={[
              { label: 'Task ID', name: 'taskId', type: 'text', defaultValue: selectedTask.taskId, disabled: true, group: 'taskDetails' },
              { label: 'Task Score', name: 'score', type: 'text', defaultValue: selectedTask.score, disabled: true, group: 'taskDetails' },
              { label: 'Task Title', name: 'title', type: 'text', defaultValue: selectedTask.title, disabled: true },
              { label: 'Task Description', name: 'description', type: 'textarea', defaultValue: selectedTask.title, disabled: true },
              { label: 'Task Status', name: 'taskStatus', type: 'text', defaultValue: selectedTask.taskStatus, disabled: true, group: 'status' },
              { label: 'Start Date', name: 'startDate', type: 'text', defaultValue: selectedTask.startDate, disabled: true, group: 'status' },
              { label: 'Finish Date', name: 'endDate', type: 'text', defaultValue: selectedTask.endDate, disabled: true, group: 'status' },
              {
                label: 'Evidence',
                name: 'evidence',
                type: 'link',
                defaultValue: selectedTask.evidence,
                className: 'justify-start',
                disabled: true,
              },
            ]}
            showSubmitButton={false}
          />
        </div>
      )}
    </div>
  );
}

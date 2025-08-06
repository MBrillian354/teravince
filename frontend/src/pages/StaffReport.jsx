import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import StatsCard from '../components/StatsCard';
import DataTable from '../components/DataTable';
import DynamicForm from '@/components/DynamicForm';

export default function StaffReport() {
  const { reportId } = useParams();
  const navigate = useNavigate();

  // 1) initial data from reports
  const reportData = {
    r1: { userId: '3210001', name: 'Jane Doe', month: 'May 2025', jobTitle: 'Social Media Trainee', score: '0/100' },
    r2: { userId: '3210002', name: 'John Smith', month: 'March 2025', jobTitle: 'Marketing Intern', score: '75/100' },
    r3: { userId: '3210003', name: 'Lisa Ray', month: 'January 2025', jobTitle: 'Design Assistant', score: '85/100' },
    r4: { userId: '3210004', name: 'Alan Kim', month: 'April 2025', jobTitle: 'Community Intern', score: '60/100' },
  };

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
      taskId: '32100010001',
      title: 'Review Social Media Post',
      taskStatus: 'Awaiting Review',
      score: '100/100',
      startDate: '01/03/2025',
      endDate: '07/10/2025',
      evidence: [{ name: 'report-may.pdf', url: '/assets/report-may.pdf' }],
    },
    {
      reportId: 'r2',
      taskId: '32100020001',
      title: 'Write blog post',
      taskStatus: 'Completed',
      score: '75/100',
      startDate: '10/03/2025',
      endDate: '15/10/2025',
      evidence: [{ name: 'blog-draft.docx', url: '/assets/blog-draft.docx' }],
    },
    {
      reportId: 'r3',
      taskId: '32100030001',
      title: 'Create flyer',
      taskStatus: 'Completed',
      score: '85/100',
      startDate: '05/01/2025',
      endDate: '20/01/2025',
      evidence: [],
    },
    {
      reportId: 'r4',
      taskId: '32100040001',
      title: 'Host webinar',
      taskStatus: 'Awaiting Review',
      score: '60/100',
      startDate: '15/04/2025',
      endDate: '30/04/2025',
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

  // 8) Columns for the tasks table
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
            <p className="font-semibold">{report.name}</p>
            <p className="text-sm text-gray-600">{report.userId}</p>
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

      {/* Supervisor Review using DynamicForm */}
      <div className="card-static mb-6">
        <DynamicForm
          fields={[
            {
              label: 'Supervisor Review',
              name: 'supervisorReview',
              type: 'textarea',
              value: supervisorReview,
              onChange: e => setSupervisorReview(e.target.value),
              placeholder: "Enter your review ...",
              disabled: false,
            },
            {
              label: 'I have properly reviewed the staff\'s report',
              name: 'reviewed',
              type: 'checkbox',
              disabled: false,
            },
          ]}
          submitButton={{
            label: 'Send Review',
            className: 'bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700',
          }}
        />
      </div>

      {/* Tasks Table */}
      <DataTable
        title={`Monthly Tasks for ${report.name}`}
        columns={taskColumns}
        data={tasks}
        rowKey="taskId"
        containerClass="bg-white rounded mb-4"
        onRowClick={({ taskId }) => setSelectedTaskId(taskId)}
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

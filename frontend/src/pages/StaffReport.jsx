import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import StatsCard from '../components/StatsCard';
import DataTable from '../components/DataTable';
import DynamicForm from '../components/DynamicForm';
import { fetchReportTasks, updateReport, clearCurrentReport } from '../store/supervisorSlice';

export default function StaffReport() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { 
    currentReport, 
    currentReportTasks, 
    currentReportLoading, 
    currentReportError 
  } = useSelector(state => state.supervisor);

  const [selectedTaskId, setSelectedTaskId] = useState(null);

  useEffect(() => {
    if (reportId) {
      dispatch(fetchReportTasks(reportId));
    }

    return () => {
      dispatch(clearCurrentReport());
    };
  }, [dispatch, reportId]);

  // Select first task by default when tasks are loaded
  useEffect(() => {
    if (currentReportTasks && currentReportTasks.length > 0 && !selectedTaskId) {
      setSelectedTaskId(currentReportTasks[0]._id);
    }
  }, [currentReportTasks, selectedTaskId]);

  const handleSubmitReview = async (formData) => {
    try {
      await dispatch(updateReport({
        reportId,
        updateData: {
          review: formData.supervisorReview,
          status: formData.reviewed ? 'done' : 'awaitingReview'
        }
      })).unwrap();
      
      // Show success message or redirect
      alert('Review submitted successfully!');
    } catch (error) {
      alert('Failed to submit review: ' + error);
    }
  };

  if (currentReportLoading) {
    return (
      <div className="container mx-auto px-4">
        <div className="text-center py-10">Loading report...</div>
      </div>
    );
  }

  if (currentReportError) {
    return (
      <div className="container mx-auto px-4">
        <div className="text-center py-10 text-red-500">
          Error: {currentReportError}
        </div>
      </div>
    );
  }

  if (!currentReport) {
    return (
      <div className="container mx-auto px-4">
        <div className="text-center py-10">No report found</div>
      </div>
    );
  }

  const selectedTask = currentReportTasks.find(task => task._id === selectedTaskId);

  const formatPeriod = (period) => {
    const [year, month] = period.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  };

  const taskColumns = [
    { header: 'Task ID', render: row => row._id.slice(-8) },
    { header: 'Task Title', accessor: 'title' },
    {
      header: 'Task Status',
      render: r => <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">
        {r.taskStatus.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
      </span>,
    },
    { header: 'Task Score', render: row => `${row.score || 0}/100`, align: 'right' },
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
            <h1 className=" text-lg font-semibold">
              {`${currentReport.userId?.firstName || ''} ${currentReport.userId?.lastName || ''}`}
            </h1>
            <p className="text-gray-600">{currentReport.userId?._id}</p>
            <p className="text-gray-600">{currentReport.userId?.jobTitle || 'N/A'}</p>
            <p className="text-gray-500">{formatPeriod(currentReport.period)}</p>
          </div>
        </div>
        <StatsCard
          label="Staff Score"
          value={`${currentReport.score}/100`}
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
              defaultValue: currentReport.review || '',
            },
            {
              label: 'I have properly reviewed the staff\'s report',
              name: 'reviewed',
              type: 'checkbox',
              defaultValue: currentReport.status === 'done',
            },
          ]}
          submitButtonText="Send Review"
          onSubmit={handleSubmitReview}
        />
      </div>

      {/* Tasks Table */}
      <DataTable
        title={`Monthly Tasks for ${currentReport.userId?.firstName || ''} ${currentReport.userId?.lastName || ''}`}
        columns={taskColumns}
        data={currentReportTasks}
        rowKey="_id"
        containerClass="bg-white rounded mb-4"
        onRowClick={(task) => setSelectedTaskId(task._id)}
        variant='gradient'
      />

      {/* Bottom Detail Card using DynamicForm */}
      {selectedTask && (
        <div className="card-static mb-6">
          <DynamicForm
            fields={[
              { 
                label: 'Task ID', 
                name: 'taskId', 
                type: 'text', 
                defaultValue: selectedTask._id.slice(-8), 
                disabled: true, 
                group: 'taskDetails' 
              },
              { 
                label: 'Task Score', 
                name: 'score', 
                type: 'text', 
                defaultValue: `${selectedTask.score || 0}/100`, 
                disabled: true, 
                group: 'taskDetails' 
              },
              { 
                label: 'Task Title', 
                name: 'title', 
                type: 'text', 
                defaultValue: selectedTask.title, 
                disabled: true 
              },
              { 
                label: 'Task Description', 
                name: 'description', 
                type: 'textarea', 
                defaultValue: selectedTask.description, 
                disabled: true 
              },
              { 
                label: 'Start Date', 
                name: 'startDate', 
                type: 'text', 
                defaultValue: selectedTask.startDate ? new Date(selectedTask.startDate).toLocaleDateString() : 'N/A', 
                disabled: true, 
                group: 'status' 
              },
              { 
                label: 'Completion Date', 
                name: 'completedDate', 
                type: 'text', 
                defaultValue: selectedTask.completedDate ? new Date(selectedTask.completedDate).toLocaleDateString() : 'N/A', 
                disabled: true, 
                group: 'status' 
              },
              { 
                label: 'Deadline', 
                name: 'deadline', 
                type: 'text', 
                defaultValue: selectedTask.deadline ? new Date(selectedTask.deadline).toLocaleDateString() : 'N/A', 
                disabled: true, 
                group: 'status' 
              },
              {
                label: 'Evidence',
                name: 'evidence',
                type: 'link',
                defaultValue: selectedTask.evidence ? [{ name: 'Evidence File', url: `/uploads/${selectedTask.evidence}` }] : [],
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

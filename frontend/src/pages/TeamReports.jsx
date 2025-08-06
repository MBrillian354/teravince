import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReports, generateMonthlyReports } from '../store/supervisorSlice';
import { useNavigate } from 'react-router-dom';
import TasksReportsTabs from '../components/TasksReportsTabs';
import StatsCard from '../components/StatsCard';
import DataTable from '../components/DataTable';
import { useModal } from '../hooks/useModal';
import { getTaskStatusStyles, getDisplayTaskStatus } from '../utils/statusStyles';

export default function TeamReports() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showSuccess, showError } = useModal();
  const {
    reports,
    reportsLoading,
    reportsError,
    generateLoading,
    generateError,
    generateResult
  } = useSelector(state => state.supervisor);

  // Track if user triggered report generation
  const [reportGenerationTriggered, setReportGenerationTriggered] = useState(false);

  console.log('Reports:', reports);

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  // Show modal notification only if user triggered report generation
  useEffect(() => {
    if (reportGenerationTriggered && generateResult && !generateLoading) {
      showSuccess(
        'Reports Generated Successfully!',
        `Generated ${generateResult.generatedCount} new reports for ${generateResult.period}` +
        (generateResult.generatedCount === 0 ? ' (All staff already have reports for this month)' : ''),
        {
          autoClose: true,
          timeout: 5000
        }
      );
      setReportGenerationTriggered(false); // Reset after showing
    }
  }, [reportGenerationTriggered, generateResult, generateLoading, showSuccess]);

  const handleRefreshReports = async () => {
    try {
      setReportGenerationTriggered(true);
      await dispatch(generateMonthlyReports()).unwrap();
      // Refresh the reports list after generating new ones
      dispatch(fetchReports());
    } catch (error) {
      setReportGenerationTriggered(false);
      console.error('Failed to generate reports:', error);
      showError(
        'Error generating reports',
        error?.message || 'Failed to generate reports. Please try again.',
        'Error',
        { timeout: 5000, autoClose: false }
      );
    }
  };

  const upcomingCount = reports.filter(r => r.status === 'awaitingReview').length;
  const finishedCount = reports.filter(r => r.status === 'done').length;
  const biasDetectedCount = reports.filter(r => r.bias_check?.is_bias === true).length;

  const today = new Date();
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const cards = [
    { label: 'Upcoming Reviews', value: upcomingCount },
    { label: 'Finished Review', value: finishedCount },
    { label: 'Reports with Bias', value: biasDetectedCount },
  ];

  const columns = [
    {
      header: 'Staff Name',
      render: row => (
        <span>{`${row.userId?.firstName || ''} ${row.userId?.lastName || ''}`}</span>
      ),
    },
    {
      header: 'Month',
      render: row => {
        const date = new Date(row.period);
        return date.toLocaleString('en-US', { month: 'long' });
      },
      align: 'center',
    },
    {
      header: 'Job Title',
      render: row => row.userId?.jobId?.title || 'N/A',
    },
    {
      header: 'Staff Score',
      render: row => `${row.score}/100`,
      align: 'right',
    },
    {
      header: 'Report Status',
      render: row => {
        const statusStyle = getTaskStatusStyles(row.status);
        console.log('Report Status:', row.status, 'Style:', statusStyle);
        return (
          <span className={`px-2 py-0.5 text-xs rounded-full ${statusStyle} whitespace-nowrap`}>
            {getDisplayTaskStatus(row.status)}
          </span>
        );
      },
      align: 'right',
    },
    {
      header: 'Bias Status',
      render: row => {
        const biasStatus = row.bias_check?.is_bias ? 'biasDetected' : row.bias_check ? 'noBias' : 'notChecked';
        const biasStyle = getTaskStatusStyles(biasStatus);

        return (
          <span className={`px-2 py-1 text-xs rounded-full ${biasStyle} whitespace-nowrap`}>
            {getDisplayTaskStatus(biasStatus)}
          </span>
        );
      },
      align: 'center',
    }
  ];

  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Reports, Jobs, and Tasks</h1>
        <button
          onClick={handleRefreshReports}
          disabled={generateLoading}
          className={`btn-primary ${generateLoading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-primary text-white hover:bg-primary/50'
            }`}
        >
          {generateLoading ? 'Generating...' : 'Refresh Reports'}
        </button>
      </div>

      <TasksReportsTabs />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {cards.map((c) => (
          <StatsCard key={c.label} {...c} />
        ))}
      </div>

      {reportsLoading ? (
        <div className="text-center py-10">Loading reports...</div>
      ) : reportsError ? (
        <div className="text-center py-10 text-red-500">{reportsError}</div>
      ) : (
        <DataTable
          title="Team Reports"
          columns={columns}
          data={reports}
          rowKey="_id"
          containerClass="bg-white rounded mb-4"
          onRowClick={({ _id }) => navigate(`/report/${_id}`)}
          variant='gradient'
        />
      )}
    </div>
  );
}

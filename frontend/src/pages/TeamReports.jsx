import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReports } from '../store/supervisorSlice';
import { useNavigate } from 'react-router-dom';
import TasksReportsTabs from '../components/TasksReportsTabs';
import StatsCard from '../components/StatsCard';
import DataTable from '../components/DataTable';

export default function TeamReports() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { reports, reportsLoading, reportsError } = useSelector(state => state.supervisor);

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  const upcomingCount = reports.filter(r => r.status === 'awaitingReview').length;
  const finishedCount = reports.filter(r => r.status === 'done').length;

  const today = new Date();
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const formattedDeadline = endOfMonth.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const cards = [
    { label: 'Upcoming Reviews', value: upcomingCount },
    { label: 'Finished Review', value: finishedCount },
    { label: "This Month’s Deadline", value: formattedDeadline },
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
        const date = new Date(`${row.period}-01`);
        return date.toLocaleString('en-US', { month: 'long' });
      },
      align: 'center',
    },
    {
      header: 'Job Title',
      render: row => row.userId?.jobTitle || 'N/A',
    },
    {
      header: 'Staff Score',
      render: row => `${row.score}/100`,
      align: 'right',
    },
    {
      header: 'Report Status',
      render: row => (
        <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">
          {row.status === 'awaitingReview' ? 'Awaiting Review' : 'Completed'}
        </span>
      ),
      align: 'right',
    },
  ];

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-4">Reports, Jobs, and Tasks</h1>
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

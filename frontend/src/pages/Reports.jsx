import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import TasksReportsTabs from '../components/TasksReportsTabs';
import StatsCard from '../components/StatsCard';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import axios from 'axios';

export default function Reports() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const totalPages = 11;
  const [selectedMonth, setSelectedMonth] = useState('All');

  // ─── Fetch Data from Backend ─────────────────────────────
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/reports', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReports(response.data);
      } catch (error) {
        console.error('Failed to fetch reports', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Statistik dari laporan
  const upcomingCount = reports.filter(r => r.status === 'awaitingReview').length;
  const finishedCount = reports.filter(r => r.status === 'completed').length;

  // Ambil tanggal terakhir di bulan ini sebagai deadline
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


  // ─── Transform Data for Table ─────────────────────────────
  const monthOrder = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const transformedData = reports
    .map((r) => {
      const date = new Date(`${r.period}-01`);
      const monthName = date.toLocaleString('default', { month: 'long' });
      return {
        reportId: r._id,
        employeeId: r.userId?._id || '',
        name: `${r.userId?.firstName || ''} ${r.userId?.lastName || ''}`,
        month: monthName,
        jobTitle: r.userId?.jobTitle || 'N/A',
        score: `${r.score}/100`,
        status: r.status === 'awaitingReview' ? 'Awaiting Review' : 'Completed',
      };
    })
    .filter((item) => selectedMonth === 'All' || item.month === selectedMonth);

  // ─── Sorting Logic ────────────────────────────────────────
  const sortedData = [...transformedData].sort((a, b) => {
    if (sortBy === 'month') {
      const aIndex = monthOrder.indexOf(a.month);
      const bIndex = monthOrder.indexOf(b.month);
      return sortDirection === 'asc' ? aIndex - bIndex : bIndex - aIndex;
    }
    return 0;
  });

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  // ─── Table Columns ───────────────────────────────────────
  const columns = [
    {
      header: '',
      render: () => <input type="checkbox" className="form-checkbox" />,
      align: 'center',
    },
    {
      header: 'Employee Name',
      render: row => (
        <Link
          to={`/report/${row.reportId}`}
          className="flex items-center space-x-2 hover:underline"
        >
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-400">👤</span>
          </div>
          <span>{row.name}</span>
        </Link>
      ),
    },
    {
      header: () => (
        <button
          onClick={() => toggleSort('month')}
          className="flex items-center space-x-1 group"
        >
          <span>Month</span>
          {sortBy === 'month' ? (
            sortDirection === 'asc' ? (
              <ChevronUpIcon className="w-4 h-4 text-gray-500 group-hover:text-black" />
            ) : (
              <ChevronDownIcon className="w-4 h-4 text-gray-500 group-hover:text-black" />
            )
          ) : (
            <ChevronDownIcon className="w-4 h-4 text-gray-300 group-hover:text-black" />
          )}
        </button>
      ),
      accessor: 'month',
      align: 'center',
    },
    { header: 'Job Title', accessor: 'jobTitle' },
    { header: 'Employee Score', accessor: 'score', align: 'right' },
    {
      header: 'Report Status',
      render: row => (
        <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">
          {row.status}
        </span>
      ),
      align: 'right',
    },
  ];

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-4">Reports, Jobs, and Tasks</h1>
      <TasksReportsTabs />

      <div className="mb-4 flex justify-end">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
        >
          <option value="All">All Months</option>
          {monthOrder.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {cards.map((c) => (
          <StatsCard key={c.label} {...c} />
        ))}
      </div>

      {loading ? (
        <div className="text-center py-10">Loading reports...</div>
      ) : (
        <DataTable
          columns={columns}
          data={sortedData}
          rowKey="reportId"
          containerClass="bg-white rounded mb-4"
          onRowClick={({ reportId }) => navigate(`/report/${reportId}`)}
        />
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}

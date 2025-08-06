import { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateMonthlyReports } from '../store/supervisorSlice';
import { useNavigate } from 'react-router-dom';
import TasksReportsTabs from '../components/TasksReportsTabs';
import StatsCard from '../components/StatsCard';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import SearchInput from '../components/SearchInput';
import FilterSelect from '../components/FilterSelect';
import { useModal } from '../hooks/useModal';
import { useServerTable } from '../hooks/useServerTable';
import { reportsAPI } from '../utils/api';
import { getTaskStatusStyles, getDisplayTaskStatus } from '../utils/statusStyles';

export default function TeamReports() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showSuccess, showError } = useModal();
  const {
    generateLoading,
    generateError,
    generateResult
  } = useSelector(state => state.supervisor);

  // Track if user triggered report generation
  const [reportGenerationTriggered, setReportGenerationTriggered] = useState(false);

  // Use server table hook for data management
  const {
    data: rawReports,
    loading,
    error,
    pagination,
    params,
    updateSearch,
    updateFilter,
    changePage,
    updateSort,
    resetFilters,
    refetch
  } = useServerTable(reportsAPI.getAll, {
    page: 1,
    limit: 10,
    sortBy: 'period',
    sortOrder: 'desc'
  });

  // Transform backend data to match component's expected format using useMemo
  const reports = useMemo(() =>
    rawReports.map(report => ({
      id: report._id,
      userId: report.userId,
      period: report.period,
      score: report.score || 0,
      status: report.status,
      review: report.review || '',
      bias_check: report.bias_check,
      originalReport: report // Keep original data for detailed view
    })), [rawReports]
  );

  console.log('Reports:', reports);

  // Calculate summary statistics - memoize to prevent recreation
  const [summary, setSummary] = useState([
    { label: 'Upcoming Reviews', value: 0 },
    { label: 'Finished Review', value: 0 },
    { label: 'Reports with Bias', value: 0 },
  ]);

  // Fetch summary statistics - memoize to prevent recreation
  const fetchSummary = useCallback(async () => {
    try {
      // Get all reports for summary calculation (without pagination)
      const response = await reportsAPI.getAll({ limit: 1000, page: 1 });
      if (response.data.success) {
        const allReports = response.data.data;

        const upcomingCount = allReports.filter(r => r.status === 'needReview').length;
        const finishedCount = allReports.filter(r => r.status === 'done').length;
        const biasDetectedCount = allReports.filter(r => r.bias_check?.is_bias === true).length;

        setSummary([
          { label: 'Upcoming Reviews', value: upcomingCount },
          { label: 'Finished Review', value: finishedCount },
          { label: 'Reports with Bias', value: biasDetectedCount },
        ]);
      }
    } catch (err) {
      console.error('Error fetching summary:', err);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

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
      refetch();
      // Refresh summary as well
      fetchSummary();
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

  // Filter options - memoize to prevent recreation
  const statusOptions = useMemo(() => [
    { value: 'needReview', label: 'Need Review' },
    { value: 'done', label: 'Done' },
  ], []);

  const biasStatusOptions = useMemo(() => [
    { value: 'not-checked', label: 'Not Checked' },
    { value: 'bias-detected', label: 'Bias Detected' },
    { value: 'no-bias', label: 'No Bias' },
    { value: 'pending', label: 'Pending' }
  ], []);

  // Generate month/year filter options
  const monthOptions = useMemo(() => [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ], []);

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 5; i--) {
      years.push({ value: i.toString(), label: i.toString() });
    }
    return years;
  }, []);

  const columns = useMemo(() => [
    {
      header: 'Staff Name',
      render: row => (
        <span>{`${row.userId?.firstName || ''} ${row.userId?.lastName || ''}`}</span>
      ),
      sortable: false,
    },
    {
      header: 'Month',
      render: row => {
        const date = new Date(row.period);
        return date.toLocaleString('en-US', { month: 'long' });
      },
      align: 'center',
      sortable: true,
      accessor: 'period'
    },
    {
      header: 'Job Title',
      render: row => row.userId?.jobId?.title || 'N/A',
      sortable: false,
    },
    {
      header: 'Staff Score',
      render: row => `${row.score}/100`,
      align: 'right',
      sortable: true,
      accessor: 'score'
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
      sortable: true,
      accessor: 'status'
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
      sortable: false,
    }
  ], []);

  // Loading state
  if (loading && reports.length === 0) {
    return (
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4">Reports, Jobs, and Tasks</h1>
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-600">Loading reports...</div>
        </div>
      </div>
    );
  }

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
        {summary.map((c) => (
          <StatsCard key={c.label} {...c} />
        ))}
      </div>

      {/* Search and Filters */}
      <div className="card-static border border-primary mb-4 p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <SearchInput
              id="team-reports-search"
              name="teamReportsSearch"
              value={params.search}
              onChange={updateSearch}
              placeholder="Search staff names or job titles..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="flex gap-3">
            <FilterSelect
              id="team-reports-status-filter"
              name="teamReportsStatusFilter"
              value={params.status}
              onChange={(value) => updateFilter('status', value)}
              options={statusOptions}
              placeholder="All Statuses"
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />

            <FilterSelect
              id="team-reports-bias-filter"
              name="teamReportsBiasFilter"
              value={params.biasStatus}
              onChange={(value) => updateFilter('biasStatus', value)}
              options={biasStatusOptions}
              placeholder="All Bias Status"
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />

            <FilterSelect
              id="team-reports-month-filter"
              name="teamReportsMonthFilter"
              value={params.month}
              onChange={(value) => updateFilter('month', value)}
              options={monthOptions}
              placeholder="All Months"
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />

            <FilterSelect
              id="team-reports-year-filter"
              name="teamReportsYearFilter"
              value={params.year}
              onChange={(value) => updateFilter('year', value)}
              options={yearOptions}
              placeholder="All Years"
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />

            <button
              onClick={resetFilters}
              className="btn-primary"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Results info */}
        <div className="mt-3 text-sm text-gray-600">
          {loading ? (
            'Loading...'
          ) : (
            `Showing ${reports.length} of ${pagination.totalReports} reports`
          )}
        </div>
      </div>

      {error ? (
        <div className="text-center py-10 text-red-500">{error}</div>
      ) : (
        <DataTable
          title="Team Reports"
          columns={columns}
          data={reports}
          rowKey="id"
          containerClass="card-static mb-4"
          onRowClick={({ id }) => navigate(`/report/${id}`)}
          variant='gradient'
          sortBy={params.sortBy}
          sortOrder={params.sortOrder}
          onSort={updateSort}
        />
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={changePage}
        />
      )}

      {/* Show message if no reports */}
      {reports.length === 0 && !loading && (
        <div className="card-static text-center">
          <p className="text-gray-600">No reports found.</p>
          {(params.search || params.status || params.biasStatus || params.month || params.year) && (
            <button
              onClick={resetFilters}
              className="mt-2 text-primary hover:underline"
            >
              Clear filters to see all reports
            </button>
          )}
        </div>
      )}
    </div>
  );
}

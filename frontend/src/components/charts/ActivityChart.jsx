import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

// Default data for when no data is provided
const defaultData = [
  { status: 'Draft', count: 0 },
  { status: 'In Progress', count: 0 },
  { status: 'Completed', count: 0 },
  { status: 'Submitted', count: 0 },
  { status: 'Under Review', count: 0 },
];

const ActivityChart = ({ data = [] }) => {
  // Status mapping function to make labels more readable
  const mapStatusLabel = (status) => {
    const statusMap = {
      'draft': 'Draft',
      'inProgress': 'In Progress',
      'submittedAndAwaitingReview': 'Under Review',
      'submittedAndAwaitingApproval': 'Awaiting Approval',
      'completed': 'Completed',
      'submissionRejected': 'Rejected',
      'approvalRejected': 'Approval Rejected'
    };
    return statusMap[status] || status || 'Unknown';
  };

  // Transform the backend activityRecap data to chart format
  const chartData = data.length > 0 ? data.map(item => ({
    status: mapStatusLabel(item._id),
    count: item.count || 0
  })) : defaultData;

  return (
    <div className="card-static border">
      <div className="text-lg font-semibold mb-4 text-primary">Activity Recap</div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey="status" tick={{ fill: 'primary', fontSize: 12 }} />
          <YAxis tick={{ fill: 'primary', fontSize: 12 }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#ffffff', borderColor: '#eee' }}
            labelStyle={{ color: 'primary', fontWeight: '500' }}
            cursor={{ stroke: 'primary', strokeWidth: 1 }}
          />
          <Legend />
          <Bar
            dataKey="count"
            name="Task Count"
            fill="#008161"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityChart;

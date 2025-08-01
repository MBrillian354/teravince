import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const data = [
  { month: 'Jan', current: 400, past: 240 },
  { month: 'Feb', current: 500, past: 300 },
  { month: 'Mar', current: 540, past: 320 },
  { month: 'Apr', current: 560, past: 400 },
  { month: 'May', current: 530, past: 390 },
  { month: 'Jun', current: 520, past: 370 },
  { month: 'Jul', current: 580, past: 420 },
  { month: 'Aug', current: 600, past: 450 },
  { month: 'Sep', current: 620, past: 470 },
  { month: 'Oct', current: 640, past: 490 },
  { month: 'Nov', current: 660, past: 510 },
  { month: 'Dec', current: 750, past: 580 },
];

const ActivityChart = () => {
  return (
    <div className="bg-[#F8F8F8] p-4 rounded-lg shadow">
      <div className="text-lg font-semibold mb-4 text-[#1B1717]">Activity Recap</div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey="month" tick={{ fill: '#1B1717', fontSize: 12 }} />
          <YAxis tick={{ fill: '#1B1717', fontSize: 12 }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#ffffff', borderColor: '#eee' }}
            labelStyle={{ color: '#1B1717', fontWeight: '500' }}
            cursor={{ stroke: '#CE1212', strokeWidth: 1 }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="current"
            name="Current Year"
            stroke="#CE1212"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="past"
            name="Past Year"
            stroke="#810000"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityChart;

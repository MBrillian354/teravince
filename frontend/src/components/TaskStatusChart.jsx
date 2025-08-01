import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';

ChartJS.register(ArcElement, Tooltip);

// Values and colors in parallel arrays
const dataValues = [21, 42, 19, 3];
const dataColors = ['#374151', '#6B7280', '#9CA3AF', '#D1D5DB'];

export default function TaskStatusChart() {
  return (
    // Bigger donut
    <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56">
      <Doughnut
        data={{
          datasets: [{ data: dataValues, backgroundColor: dataColors }]
        }}
        options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }}
      />
    </div>
  );
}
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';

ChartJS.register(ArcElement, Tooltip);

export default function TaskStatusChart({ data = [] }) {
  // Extract values and colors from the data prop
  const dataValues = data.map(item => item.value);
  const dataColors = data.map(item => item.color);

  // Fallback to default values if no data provided
  const defaultValues = [21, 42, 19, 3];
  const defaultColors = ['#374151', '#6B7280', '#9CA3AF', '#D1D5DB'];

  return (
    // Bigger donut
    <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56">
      <Doughnut
        data={{
          datasets: [{ 
            data: dataValues.length > 0 ? dataValues : defaultValues, 
            backgroundColor: dataColors.length > 0 ? dataColors : defaultColors 
          }]
        }}
        options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }}
      />
    </div>
  );
}
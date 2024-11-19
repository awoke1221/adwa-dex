import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PoolChartProps {
  data: {
    labels: string[];
    values: number[];
  };
  label: string;
  color: string;
}

const PoolChart: React.FC<PoolChartProps> = ({ data, label, color }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label,
        data: data.values,
        fill: true,
        borderColor: color,
        backgroundColor: `${color}20`,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
        titleColor: isDark ? '#FFFFFF' : '#111827',
        bodyColor: isDark ? '#D1D5DB' : '#4B5563',
        borderColor: isDark ? '#374151' : '#E5E7EB',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        grid: {
          color: isDark ? '#374151' : '#E5E7EB',
        },
        ticks: {
          color: isDark ? '#D1D5DB' : '#4B5563',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: isDark ? '#D1D5DB' : '#4B5563',
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{label}</h3>
      </div>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default PoolChart;
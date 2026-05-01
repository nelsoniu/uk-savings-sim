'use client';

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
import { Line } from 'react-chartjs-2';
import { StrategyResult } from '@/types';
import { useTheme } from './ThemeProvider';
import { formatCurrency } from '@/utils/calculations';

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

interface ProjectionChartProps {
  optimised: StrategyResult;
  oneSavings: StrategyResult;
  allIndex: StrategyResult;
  custom: StrategyResult;
}

export function ProjectionChart({
  optimised,
  oneSavings,
  allIndex,
  custom,
}: ProjectionChartProps) {
  const { theme } = useTheme();

  const labels = Array.from({ length: 10 }, (_, i) => `Year ${i + 1}`);

  const data = {
    labels,
    datasets: [
      {
        label: 'Optimised Split',
        data: optimised.yearByYearProjection,
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: false,
        tension: 0.3,
      },
      {
        label: 'One Savings Account',
        data: oneSavings.yearByYearProjection,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: false,
        tension: 0.3,
      },
      {
        label: 'All Index Fund',
        data: allIndex.yearByYearProjection,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: false,
        tension: 0.3,
      },
      {
        label: 'My Own Mix',
        data: custom.yearByYearProjection,
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        fill: false,
        tension: 0.3,
        borderDash: [5, 5],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: theme === 'dark' ? '#e5e7eb' : '#374151',
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
        titleColor: theme === 'dark' ? '#f3f4f6' : '#111827',
        bodyColor: theme === 'dark' ? '#d1d5db' : '#4b5563',
        borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function (context: { dataset: { label?: string }; parsed: { y: number | null } }) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${formatCurrency(value || 0)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: theme === 'dark' ? '#374151' : '#e5e7eb',
        },
        ticks: {
          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
        },
      },
      y: {
        grid: {
          color: theme === 'dark' ? '#374151' : '#e5e7eb',
        },
        ticks: {
          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
          callback: function (tickValue: string | number) {
            const value = typeof tickValue === 'string' ? parseFloat(tickValue) : tickValue;
            if (value >= 1000000) {
              return `£${(value / 1000000).toFixed(1)}M`;
            } else if (value >= 1000) {
              return `£${(value / 1000).toFixed(0)}k`;
            }
            return `£${value}`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        10-Year Projection Comparison
      </h3>
      <div className="h-[400px]">
        <Line data={data} options={options} />
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
        * Index fund projections assume 10% average annual return. Past performance does not guarantee future results.
      </p>
    </div>
  );
}

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
import { StrategyResult, AllocationItem } from '@/types';
import { useTheme } from './ThemeProvider';
import { formatCurrency, calculateSavingsGrowth, calculateIndexGrowth } from '@/utils/calculations';
import { useMemo } from 'react';

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
  monthlyAmount: number;
}

function getDecomposedProjection(
  allocation: AllocationItem[],
  years: number
): { total: number[]; regular: number[]; easyAccess: number[] } {
  const total: number[] = [];
  const regular: number[] = [];
  const easyAccess: number[] = [];

  for (let y = 1; y <= years; y++) {
    let regSum = 0;
    let eaSum = 0;

    for (const item of allocation) {
      if (item.type === 'regular') {
        regSum += calculateSavingsGrowth(item.monthlyAmount, item.rate, y);
      } else if (item.type === 'easyAccess') {
        eaSum += calculateSavingsGrowth(item.monthlyAmount, item.rate, y);
      } else if (item.type === 'index') {
        eaSum += calculateIndexGrowth(item.monthlyAmount, item.rate, y);
      }
    }

    regular.push(Math.round(regSum));
    easyAccess.push(Math.round(eaSum));
    total.push(Math.round(regSum + eaSum));
  }

  return { total, regular, easyAccess };
}

export function ProjectionChart({
  optimised,
  monthlyAmount,
}: ProjectionChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const labels = Array.from({ length: 10 }, (_, i) => `Year ${i + 1}`);

  // Decompose the optimised projection into regular vs easy-access contributions
  const decomposed = useMemo(() => {
    if (!optimised.allocation) {
      return { total: optimised.yearByYearProjection, regular: [], easyAccess: [] };
    }
    return getDecomposedProjection(optimised.allocation, 10);
  }, [optimised.allocation, optimised.yearByYearProjection]);

  const data = {
    labels,
    datasets: [
      {
        label: 'Total Pot',
        data: decomposed.total,
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: false,
        tension: 0.3,
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Regular Saver Growth',
        data: decomposed.regular,
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.05)',
        fill: false,
        tension: 0.3,
        borderWidth: 2,
        borderDash: [6, 3],
        pointRadius: 2,
        pointHoverRadius: 4,
      },
      {
        label: 'Easy Access / Index Growth',
        data: decomposed.easyAccess,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.05)',
        fill: false,
        tension: 0.3,
        borderWidth: 2,
        borderDash: [6, 3],
        pointRadius: 2,
        pointHoverRadius: 4,
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
          color: isDark ? '#e5e7eb' : '#374151',
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: { size: 13 },
        },
      },
      tooltip: {
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        titleColor: isDark ? '#f3f4f6' : '#111827',
        bodyColor: isDark ? '#d1d5db' : '#4b5563',
        borderColor: isDark ? '#374151' : '#e5e7eb',
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
          color: isDark ? '#374151' : '#e5e7eb',
        },
        ticks: {
          color: isDark ? '#9ca3af' : '#6b7280',
        },
      },
      y: {
        grid: {
          color: isDark ? '#374151' : '#e5e7eb',
        },
        ticks: {
          color: isDark ? '#9ca3af' : '#6b7280',
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

  // Summary stats from the projection
  const finalTotal = decomposed.total[decomposed.total.length - 1] || 0;
  const totalDeposits = monthlyAmount * 12 * 10;
  const totalGrowth = finalTotal - totalDeposits;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex flex-wrap items-baseline justify-between mb-4 gap-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          10-Year Optimised Projection
        </h3>
        <div className="flex gap-4 text-sm">
          <div className="text-right">
            <p className="text-gray-500 dark:text-gray-400 text-xs">Final Pot</p>
            <p className="font-bold text-indigo-600 dark:text-indigo-400">
              {formatCurrency(finalTotal)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 dark:text-gray-400 text-xs">Total Deposits</p>
            <p className="font-bold text-gray-700 dark:text-gray-300">
              {formatCurrency(totalDeposits)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 dark:text-gray-400 text-xs">Growth</p>
            <p className="font-bold text-green-600 dark:text-green-400">
              +{formatCurrency(totalGrowth)}
            </p>
          </div>
        </div>
      </div>
      <div className="h-[400px]">
        <Line data={data} options={options} />
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
        Solid line = total pot. Dashed lines = breakdown by account type.
      </p>
    </div>
  );
}

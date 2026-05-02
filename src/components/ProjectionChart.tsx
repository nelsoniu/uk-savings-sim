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
        backgroundColor: (context: { chart: { ctx: CanvasRenderingContext2D } }) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, 'rgba(99, 102, 241, 0.25)');
          gradient.addColorStop(1, 'rgba(99, 102, 241, 0.02)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: 'rgb(99, 102, 241)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
      {
        label: 'Regular Savers',
        data: decomposed.regular,
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.05)',
        fill: false,
        tension: 0.4,
        borderWidth: 2,
        borderDash: [5, 3],
        pointRadius: 3,
        pointHoverRadius: 5,
      },
      {
        label: 'Easy Access / Index',
        data: decomposed.easyAccess,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.05)',
        fill: false,
        tension: 0.4,
        borderWidth: 2,
        borderDash: [5, 3],
        pointRadius: 3,
        pointHoverRadius: 5,
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
        align: 'end' as const,
        labels: {
          color: isDark ? '#cbd5e1' : '#475569',
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 24,
          font: { size: 12, weight: 500 as const },
          boxWidth: 8,
          boxHeight: 8,
        },
      },
      tooltip: {
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        titleColor: isDark ? '#f1f5f9' : '#0f172a',
        bodyColor: isDark ? '#cbd5e1' : '#475569',
        borderColor: isDark ? '#334155' : '#e2e8f0',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        titleFont: { weight: 600 as const, size: 13 },
        bodyFont: { size: 12 },
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
          color: isDark ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.8)',
          drawBorder: false,
        },
        ticks: {
          color: isDark ? '#94a3b8' : '#64748b',
          font: { size: 11 },
        },
      },
      y: {
        grid: {
          color: isDark ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.8)',
          drawBorder: false,
        },
        ticks: {
          color: isDark ? '#94a3b8' : '#64748b',
          font: { size: 11 },
          padding: 8,
          callback: function (tickValue: string | number) {
            const value = typeof tickValue === 'string' ? parseFloat(tickValue) : tickValue;
            if (value >= 1000000) return `£${(value / 1000000).toFixed(1)}M`;
            if (value >= 1000) return `£${(value / 1000).toFixed(0)}k`;
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
    <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex flex-wrap items-baseline justify-between mb-4 gap-2">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          10-Year Projection
        </h3>
        <div className="flex gap-5 text-sm">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold">Final Pot</p>
            <p className="font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
              {formatCurrency(finalTotal)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold">Deposits</p>
            <p className="font-bold text-gray-700 dark:text-gray-300 tabular-nums">
              {formatCurrency(totalDeposits)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold">Growth</p>
            <p className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
              +{formatCurrency(totalGrowth)}
            </p>
          </div>
        </div>
      </div>
      <div className="h-[380px]">
        <Line data={data} options={options} />
      </div>
      <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-4 text-center">
        Solid area = total pot. Dashed lines = breakdown by account type.
      </p>
    </div>
  );
}

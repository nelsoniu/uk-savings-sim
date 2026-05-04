'use client';

import { StrategyResult } from '@/types';
import { formatCurrency } from '@/utils/calculations';

interface ProjectionSummaryProps {
  result: StrategyResult;
  monthlyAmount: number;
}

export function ProjectionSummary({ result, monthlyAmount }: ProjectionSummaryProps) {
  const oneYearDeposits = monthlyAmount * 12;
  const oneYearGrowth = result.oneYearProjectedPot - oneYearDeposits;
  const monthlyInterestAvg = Math.round(result.estimatedAnnualInterest / 12);

  return (
    <div className="sm:hidden">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Your First Year
      </h2>

      {/* Hero number - 1 year focus */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl p-6 mb-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          After 12 months you'll have
        </p>
        <p className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums mb-1">
          {formatCurrency(result.oneYearProjectedPot)}
        </p>
        <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
          +{formatCurrency(oneYearGrowth)} in interest
        </p>
      </div>

      {/* Supporting stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">You put in</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white tabular-nums">
            {formatCurrency(oneYearDeposits)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Growth</p>
          <p className="text-lg font-bold text-green-600 dark:text-green-400 tabular-nums">
            +{result.oneYearGrowthPercent.toFixed(1)}%
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Monthly</p>
          <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
            +£{monthlyInterestAvg}
          </p>
        </div>
      </div>

      {/* Teaser for long-term */}
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
        Keep going for 10 years → <span className="font-semibold text-indigo-600 dark:text-indigo-400">{formatCurrency(result.tenYearProjectedPot)}</span>
      </p>
    </div>
  );
}

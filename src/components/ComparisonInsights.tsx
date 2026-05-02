'use client';

import { StrategyResult } from '@/types';
import { formatCurrency } from '@/utils/calculations';

interface ComparisonInsightsProps {
  optimised: StrategyResult;
  oneSavings: StrategyResult;
  allIndex: StrategyResult;
  monthlyAmount: number;
}

export function ComparisonInsights({
  optimised,
  oneSavings,
  allIndex,
  monthlyAmount,
}: ComparisonInsightsProps) {
  // Calculate comparisons
  const optimisedVsSimple = optimised.estimatedAnnualInterest - oneSavings.estimatedAnnualInterest;
  const indexVsOptimised10yr = allIndex.tenYearProjectedPot - optimised.tenYearProjectedPot;

  const optimisedAccounts = optimised.allocation?.filter(a => a.monthlyAmount > 0).length || 3;

  // Risk-adjusted comparison
  const guaranteedMax = Math.max(optimised.tenYearProjectedPot, oneSavings.tenYearProjectedPot);
  const indexUpside = allIndex.tenYearProjectedPot - guaranteedMax;

  return (
    <div className="mb-6 space-y-4">
      {/* Quick recommendation cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Best for effort */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-100 dark:border-green-800">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">⚡</span>
            <span className="text-xs font-bold text-green-700 dark:text-green-300 uppercase tracking-wide">
              Least Effort
            </span>
          </div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            One Savings Account
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            1 account · {formatCurrency(oneSavings.estimatedAnnualInterest)}/yr
          </p>
        </div>

        {/* Best balance */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">⚖️</span>
            <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
              Best Balance
            </span>
          </div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            Optimised Split
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {optimisedAccounts} accounts · +{formatCurrency(optimisedVsSimple)}/yr extra
          </p>
        </div>

        {/* Highest potential */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-amber-100 dark:border-amber-800">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">📈</span>
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wide">
              Highest Potential
            </span>
          </div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            All Index Fund
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            +{formatCurrency(indexUpside)} in 10yrs · has risk
          </p>
        </div>
      </div>

      {/* Trade-off visualization */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            10-Year Comparison
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {formatCurrency(monthlyAmount)}/mo deposits
          </span>
        </div>

        <div className="space-y-3">
          {/* One Savings */}
          <div className="flex items-center gap-3">
            <div className="w-24 sm:w-32 text-xs font-medium text-gray-600 dark:text-gray-400 truncate">
              One Savings
            </div>
            <div className="flex-1 h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-green-500 rounded-full flex items-center justify-end pr-2"
                style={{ width: `${(oneSavings.tenYearProjectedPot / allIndex.tenYearProjectedPot) * 100}%` }}
              >
                <span className="text-[10px] font-bold text-white">
                  {formatCurrency(oneSavings.tenYearProjectedPot)}
                </span>
              </div>
            </div>
            <div className="w-16 text-right">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 font-medium">
                Guaranteed
              </span>
            </div>
          </div>

          {/* Optimised */}
          <div className="flex items-center gap-3">
            <div className="w-24 sm:w-32 text-xs font-medium text-gray-600 dark:text-gray-400 truncate">
              Optimised Split
            </div>
            <div className="flex-1 h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-blue-500 rounded-full flex items-center justify-end pr-2"
                style={{ width: `${(optimised.tenYearProjectedPot / allIndex.tenYearProjectedPot) * 100}%` }}
              >
                <span className="text-[10px] font-bold text-white">
                  {formatCurrency(optimised.tenYearProjectedPot)}
                </span>
              </div>
            </div>
            <div className="w-16 text-right">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 font-medium">
                Guaranteed
              </span>
            </div>
          </div>

          {/* All Index */}
          <div className="flex items-center gap-3">
            <div className="w-24 sm:w-32 text-xs font-medium text-gray-600 dark:text-gray-400 truncate">
              All Index Fund
            </div>
            <div className="flex-1 h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-end pr-2"
                style={{ width: '100%' }}
              >
                <span className="text-[10px] font-bold text-white">
                  {formatCurrency(allIndex.tenYearProjectedPot)}
                </span>
              </div>
            </div>
            <div className="w-16 text-right">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-800 text-amber-700 dark:text-amber-300 font-medium">
                Projected
              </span>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-3 text-center">
          Index fund returns are projected based on historical averages and not guaranteed
        </p>
      </div>

      {/* Quick facts */}
      <div className="flex flex-wrap gap-2 justify-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Optimised earns +{formatCurrency(optimisedVsSimple)}/yr more than simple
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Extra {optimisedAccounts - 1} accounts = ~{(optimisedAccounts - 1) * 8} mins setup
        </div>
      </div>
    </div>
  );
}

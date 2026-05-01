'use client';

import { StrategyResult } from '@/types';
import { formatCurrency } from '@/utils/calculations';

interface StrategyCardProps {
  title: string;
  description: string;
  result: StrategyResult;
  affiliateUrl: string;
  affiliateText: string;
  children?: React.ReactNode;
}

export function StrategyCard({
  title,
  description,
  result,
  affiliateUrl,
  affiliateText,
  children,
}: StrategyCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>

      {children && <div className="mb-6">{children}</div>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
            Deposits/Year
          </p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(result.guaranteedDepositsPerYear)}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
            Est. Annual Interest
          </p>
          <p className="text-xl font-bold text-green-600 dark:text-green-400">
            +{formatCurrency(result.estimatedAnnualInterest)}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
            1yr Projected Pot
          </p>
          <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
            {formatCurrency(result.oneYearProjectedPot)}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
            10yr Projected Pot
          </p>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(result.tenYearProjectedPot)}
          </p>
        </div>
      </div>

      <a
        href={affiliateUrl}
        className="inline-flex items-center justify-center w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
      >
        {affiliateText}
        <svg
          className="w-4 h-4 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </a>
    </div>
  );
}

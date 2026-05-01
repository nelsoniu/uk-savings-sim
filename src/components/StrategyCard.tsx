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
          <div className="flex items-center text-xs text-green-600 dark:text-green-400 mt-1">
            +{(result.guaranteedDepositsPerYear > 0 ? (result.estimatedAnnualInterest / result.guaranteedDepositsPerYear) * 100 : 0).toFixed(1)}% growth
            <div className="group relative ml-1 inline-flex cursor-help">
              <svg className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 opacity-0 transition-opacity group-hover:opacity-100 z-10 bg-gray-800 dark:bg-gray-700 shadow-xl text-white text-xs rounded-md py-2 px-3 text-center font-normal leading-relaxed">
                Because deposits are spread monthly rather than added as a lump sum upfront, the effective yield is roughly half the headline interest rate.
                <svg className="absolute left-1/2 top-full -mt-px -translate-x-1/2 text-gray-800 dark:text-gray-700 h-2 w-full" x="0px" y="0px" viewBox="0 0 255 255">
                  <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center gap-1 mb-1">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              1yr Projected Pot
            </p>
            <div className="group relative inline-flex cursor-help">
              <svg className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 opacity-0 transition-opacity group-hover:opacity-100 z-10 bg-gray-800 dark:bg-gray-700 shadow-xl text-white text-xs rounded-md py-2 px-3 text-center font-normal leading-relaxed normal-case tracking-normal">
                Uses exact month-by-month compounding, which often yields slightly higher exact returns compared to the simple "Est. Annual Interest" average.
                <svg className="absolute left-1/2 top-full -mt-px -translate-x-1/2 text-gray-800 dark:text-gray-700 h-2 w-full" x="0px" y="0px" viewBox="0 0 255 255">
                  <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
                </svg>
              </div>
            </div>
          </div>
          <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
            {formatCurrency(result.oneYearProjectedPot)}
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
            <span>+{formatCurrency(result.oneYearProjectedPot - result.guaranteedDepositsPerYear)}</span>
            <span className="opacity-80 tracking-tight">({result.oneYearGrowthPercent.toFixed(1)}%)</span>
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
            10yr Projected Pot
          </p>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(result.tenYearProjectedPot)}
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
            <span>+{formatCurrency(result.tenYearProjectedPot - (result.guaranteedDepositsPerYear * 10))}</span>
            <span className="opacity-80 tracking-tight">({result.tenYearGrowthPercent.toFixed(1)}%)</span>
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

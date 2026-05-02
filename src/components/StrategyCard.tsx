'use client';

import { StrategyResult } from '@/types';
import { formatCurrency } from '@/utils/calculations';

interface BadgeConfig {
  text: string;
  subLabel: string;
  color: 'amber' | 'blue' | 'green' | 'purple';
}

interface StrategyCardProps {
  title: string;
  description: string;
  result: StrategyResult;
  affiliateUrl: string;
  affiliateText: string;
  children?: React.ReactNode;
  highlighted?: boolean;
  rank?: number;
  badge?: BadgeConfig;
}

function InfoTooltip({ text }: { text: string }) {
  return (
    <div className="group relative inline-flex cursor-help">
      <svg className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 opacity-0 transition-opacity group-hover:opacity-100 z-20 bg-gray-900 dark:bg-gray-700 shadow-xl text-white text-xs rounded-lg py-2 px-3 text-center font-normal leading-relaxed">
        {text}
        <svg className="absolute left-1/2 top-full -mt-px -translate-x-1/2 text-gray-900 dark:text-gray-700 h-2 w-full" x="0px" y="0px" viewBox="0 0 255 255">
          <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
        </svg>
      </div>
    </div>
  );
}

const badgeStyles = {
  amber: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
  blue: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
  green: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
  purple: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300',
};

export function StrategyCard({
  title,
  description,
  result,
  affiliateUrl,
  affiliateText,
  children,
  highlighted = false,
  rank,
  badge,
}: StrategyCardProps) {
  return (
    <div
      className={`relative bg-white dark:bg-gray-800/80 rounded-2xl border transition-all ${
        highlighted
          ? 'border-indigo-400 dark:border-indigo-500 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/20'
          : 'border-gray-200 dark:border-gray-700 card-hover'
      }`}
    >
      {badge && (
        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-semibold rounded-full shadow-md ${badgeStyles[badge.color]}`}>
          {badge.text}
        </div>
      )}

      {rank !== undefined && (
        <div className="absolute -top-2.5 -left-2.5 w-7 h-7 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400 shadow-sm">
          {rank}
        </div>
      )}

      <div className="p-5 pt-4">
        {badge && (
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-3">
            {badge.subLabel}
          </p>
        )}
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
          {title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
          {description}
        </p>

        {children && <div className="mb-5">{children}</div>}

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold mb-0.5">
              Deposits / yr
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-white tabular-nums">
              {formatCurrency(result.guaranteedDepositsPerYear)}
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3">
            <div className="flex items-center gap-1 mb-0.5">
              <p className="text-[10px] uppercase tracking-wider text-green-600 dark:text-green-400 font-semibold">
                Interest / yr
              </p>
              <InfoTooltip text="Because deposits are spread monthly rather than added as a lump sum upfront, the effective yield is roughly half the headline interest rate." />
            </div>
            <p className="text-lg font-bold text-green-600 dark:text-green-400 tabular-nums">
              +{formatCurrency(result.estimatedAnnualInterest)}
            </p>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-3">
            <div className="flex items-center gap-1 mb-0.5">
              <p className="text-[10px] uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold">
                1 yr pot
              </p>
              <InfoTooltip text="Uses exact month-by-month compounding, which often yields slightly higher exact returns compared to the simple annual estimate." />
            </div>
            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
              {formatCurrency(result.oneYearProjectedPot)}
            </p>
            <p className="text-[10px] text-green-600 dark:text-green-400 mt-0.5 font-medium">
              +{result.oneYearGrowthPercent.toFixed(1)}%
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3">
            <p className="text-[10px] uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold mb-0.5">
              10 yr pot
            </p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400 tabular-nums">
              {formatCurrency(result.tenYearProjectedPot)}
            </p>
            <p className="text-[10px] text-green-600 dark:text-green-400 mt-0.5 font-medium">
              +{result.tenYearGrowthPercent.toFixed(1)}%
            </p>
          </div>
        </div>

        <a
          href={affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center justify-center w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            highlighted
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/25'
              : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200'
          }`}
        >
          {affiliateText}
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </div>
  );
}

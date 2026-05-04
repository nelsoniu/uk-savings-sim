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
  affiliateUrl?: string;
  affiliateText: string;
  children?: React.ReactNode;
  badge?: BadgeConfig;
  onCtaClick?: () => void;
  compact?: boolean; // Mobile compact view - shows only 2 key metrics
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
  badge,
  onCtaClick,
  compact = false,
}: StrategyCardProps) {
  return (
    <div className="relative bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700 card-hover transition-all h-full">
      {/* Badge: inline on mobile compact, absolute on desktop */}
      {badge && !compact && (
        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-semibold rounded-full shadow-md ${badgeStyles[badge.color]}`}>
          {badge.text}
        </div>
      )}

      <div className={compact ? 'p-4' : 'p-5 pt-4'}>
        {/* Inline badge for compact mode */}
        {badge && compact && (
          <div className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full mb-3 ${badgeStyles[badge.color]}`}>
            {badge.text}
          </div>
        )}
        {badge && !compact && (
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-3">
            {badge.subLabel}
          </p>
        )}
        <h3 className={`font-semibold text-gray-900 dark:text-white mb-1 ${compact ? 'text-base' : 'text-base'}`}>
          {title}
        </h3>
        <p className={`text-gray-500 dark:text-gray-400 leading-relaxed ${compact ? 'text-xs mb-4' : 'text-xs mb-5'}`}>
          {description}
        </p>

        {children && <div className="mb-5">{children}</div>}

        {/* Compact mode: 2 key metrics - 1yr focus for young professionals */}
        {compact ? (
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-3">
              <p className="text-[10px] uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold mb-0.5">
                1 yr pot
              </p>
              <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                {formatCurrency(result.oneYearProjectedPot)}
              </p>
              <p className="text-[10px] text-green-600 dark:text-green-400 mt-0.5 font-medium">
                +{result.oneYearGrowthPercent.toFixed(1)}%
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3">
              <p className="text-[10px] uppercase tracking-wider text-green-600 dark:text-green-400 font-semibold mb-0.5">
                Interest / yr
              </p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400 tabular-nums">
                +{formatCurrency(result.estimatedAnnualInterest)}
              </p>
            </div>
          </div>
        ) : (
          /* Full mode: 1-year focus for desktop too */
          <div className="space-y-3 mb-5">
            {/* Hero metric: 1-year pot */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-indigo-100 dark:border-indigo-800/50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <p className="text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold">
                      After 1 year
                    </p>
                    <InfoTooltip text="Your total savings after 12 months, including interest earned" />
                  </div>
                  <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums">
                    {formatCurrency(result.oneYearProjectedPot)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Interest earned</p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400 tabular-nums">
                    +{formatCurrency(result.estimatedAnnualInterest)}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                    +{result.oneYearGrowthPercent.toFixed(1)}% growth
                  </p>
                </div>
              </div>
            </div>
            {/* Supporting metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold mb-0.5">
                  You deposit / yr
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white tabular-nums">
                  {formatCurrency(result.guaranteedDepositsPerYear)}
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3">
                <p className="text-[10px] uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold mb-0.5">
                  10 yr potential
                </p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                  {formatCurrency(result.tenYearProjectedPot)}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                  +{result.tenYearGrowthPercent.toFixed(0)}% growth
                </p>
              </div>
            </div>
          </div>
        )}

        {onCtaClick ? (
          <button
            onClick={onCtaClick}
            className="inline-flex items-center justify-center w-full px-4 py-3 sm:py-2.5 rounded-xl text-sm font-semibold transition-all bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white shadow-md shadow-indigo-500/25 min-h-[48px] sm:min-h-0"
          >
            {affiliateText}
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        ) : (
          <a
            href={affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full px-4 py-3 sm:py-2.5 rounded-xl text-sm font-semibold transition-all bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-[0.98] text-gray-700 dark:text-gray-200 min-h-[48px] sm:min-h-0"
          >
            {affiliateText}
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}

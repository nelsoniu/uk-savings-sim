'use client';

import { AllocationItem, AllocationOverrides } from '@/types';
import { formatCurrency } from '@/utils/calculations';

interface AllocationBreakdownProps {
  allocation: AllocationItem[];
  monthlyTotal: number;
  overrides?: AllocationOverrides;
  onOverrideChange?: (provider: string, val: number) => void;
}

const TYPE_COLORS = {
  regular: { bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-700', text: 'text-purple-700 dark:text-purple-300', bar: 'bg-purple-500', badge: 'bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-300' },
  easyAccess: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-700', text: 'text-emerald-700 dark:text-emerald-300', bar: 'bg-emerald-500', badge: 'bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300' },
  index: { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-700', text: 'text-blue-700 dark:text-blue-300', bar: 'bg-blue-500', badge: 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300' },
};

const TYPE_LABELS: Record<AllocationItem['type'], string> = {
  regular: 'Regular Saver',
  easyAccess: 'Easy Access',
  index: 'Index Fund',
};

export function AllocationBreakdown({ allocation, monthlyTotal, overrides, onOverrideChange }: AllocationBreakdownProps) {
  if (!allocation || allocation.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
        Allocation Breakdown
      </h4>

      {allocation.map((item, index) => {
        const nativeMax = item.nativeMonthlyMax || item.monthlyMax || 0;
        const isAtMax = item.monthlyAmount > 0 && nativeMax > 0 && item.monthlyAmount >= nativeMax;
        const fillPercent = nativeMax > 0 ? Math.min((item.monthlyAmount / nativeMax) * 100, 100) : 0;
        const c = TYPE_COLORS[item.type];

        return (
          <div
            key={index}
            className={`rounded-xl border ${c.border} ${c.bg} p-3`}
          >
            {/* Top row: provider, type badge, rate */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {item.provider}
                </span>
                <span className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded-full ${c.badge} font-medium`}>
                  {TYPE_LABELS[item.type]}
                </span>
                {isAtMax && (
                  <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-800 text-amber-700 dark:text-amber-300 font-bold">
                    MAX
                  </span>
                )}
              </div>
              <span className={`shrink-0 text-sm font-bold ${c.text}`}>
                {item.rate}%
              </span>
            </div>

            {/* Amount + capacity bar */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-600 dark:text-gray-400 tabular-nums w-20 shrink-0">
                {formatCurrency(item.monthlyAmount)}/mo
              </span>
              {nativeMax > 0 && item.type !== 'index' && (
                <>
                  <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${isAtMax ? 'bg-amber-500' : c.bar}`}
                      style={{ width: `${fillPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 tabular-nums w-14 text-right shrink-0">
                    {Math.round(fillPercent)}% full
                  </span>
                </>
              )}
            </div>

            {/* Per-account slider (only when overrides enabled) */}
            {onOverrideChange && nativeMax > 0 && (
              <input
                type="range"
                min="0"
                max={nativeMax}
                step="10"
                value={item.monthlyAmount}
                onChange={(e) => onOverrideChange(item.provider, Number(e.target.value))}
                className="w-full mb-2"
              />
            )}

            {/* Interest estimate */}
            {item.type === 'regular' && nativeMax > 0 && (
              <p className="text-[10px] text-gray-400 dark:text-gray-500">
                ~{formatCurrency(Math.round(nativeMax * 12 * (item.rate / 100) * 0.5))}/yr if maxed
              </p>
            )}

            {/* Bonus note */}
            {item.bonusNote && (
              <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium mt-1">
                💰 {item.bonusNote}
              </p>
            )}

            {/* Affiliate link */}
            {item.affiliateUrl && item.monthlyAmount > 0 && (
              <a
                href={item.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-2 inline-flex items-center gap-1 text-[11px] font-medium ${c.text} hover:underline`}
              >
                Open {item.provider} Account
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
        );
      })}

      <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-3">
        * Projected return, not guaranteed. Filled highest rate first.
      </p>
    </div>
  );
}

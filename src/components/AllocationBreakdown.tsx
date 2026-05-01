'use client';

import { AllocationItem, AllocationOverrides } from '@/types';
import { formatCurrency } from '@/utils/calculations';

interface AllocationBreakdownProps {
  allocation: AllocationItem[];
  monthlyTotal: number;
  overrides?: AllocationOverrides;
  onOverrideChange?: (provider: string, val: number) => void;
}

export function AllocationBreakdown({ allocation, monthlyTotal, overrides, onOverrideChange }: AllocationBreakdownProps) {
  if (!allocation || allocation.length === 0) return null;

  const getTypeColor = (type: AllocationItem['type'], isAtMax: boolean) => {
    if (isAtMax) {
      switch (type) {
        case 'regular':
          return 'bg-purple-200 dark:bg-purple-800/50 border-purple-400 dark:border-purple-600';
        case 'easyAccess':
          return 'bg-green-200 dark:bg-green-800/50 border-green-400 dark:border-green-600';
        case 'index':
          return 'bg-blue-200 dark:bg-blue-800/50 border-blue-400 dark:border-blue-600';
      }
    }
    switch (type) {
      case 'regular':
        return 'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700';
      case 'easyAccess':
        return 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700';
      case 'index':
        return 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700';
    }
  };

  const getTypeLabel = (type: AllocationItem['type']) => {
    switch (type) {
      case 'regular':
        return 'Regular Saver';
      case 'easyAccess':
        return 'Easy Access';
      case 'index':
        return 'Index Fund';
    }
  };

  const getTypeTooltip = (type: AllocationItem['type']) => {
    switch (type) {
      case 'regular':
        return 'Fixed monthly deposit, higher rates, 12-month term. FSCS protected up to £85k.';
      case 'easyAccess':
        return 'Withdraw anytime, no fixed term. Lower rate but flexible. FSCS protected up to £85k.';
      case 'index':
        return 'Invests in global stocks. Higher potential returns but value can go down.';
    }
  };

  const getRateColor = (type: AllocationItem['type']) => {
    switch (type) {
      case 'regular':
        return 'text-purple-600 dark:text-purple-400';
      case 'easyAccess':
        return 'text-green-600 dark:text-green-400';
      case 'index':
        return 'text-blue-600 dark:text-blue-400';
    }
  };

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Monthly Allocation Breakdown
      </h4>
      <div className="space-y-2">
        {allocation.map((item, index) => {
          const nativeMax = item.nativeMonthlyMax || item.monthlyMax || 0;
          const isAtMax = item.monthlyAmount > 0 && nativeMax > 0 && item.monthlyAmount >= nativeMax;
          // Progress bar width = contribution amount as % of native max
          const fillPercent = nativeMax > 0 ? (item.monthlyAmount / nativeMax) * 100 : 0;

          return (
            <div
              key={index}
              className={`rounded-lg border p-3 ${getTypeColor(item.type, isAtMax)}`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {item.provider}
                  </span>
                  <div className="group relative inline-flex items-center">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/50 dark:bg-black/20 text-gray-600 dark:text-gray-300 cursor-help">
                      {getTypeLabel(item.type)}
                    </span>
                    <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 opacity-0 transition-opacity group-hover:opacity-100 z-20 bg-gray-800 dark:bg-gray-700 shadow-xl text-white text-xs rounded-md py-2 px-3 text-center font-normal leading-relaxed">
                      {getTypeTooltip(item.type)}
                      <svg className="absolute left-1/2 top-full -mt-px -translate-x-1/2 text-gray-800 dark:text-gray-700 h-2 w-full" x="0px" y="0px" viewBox="0 0 255 255">
                        <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
                      </svg>
                    </div>
                  </div>
                  {isAtMax && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-500 text-white font-medium">
                      MAXED
                    </span>
                  )}
                </div>
                <span className={`font-bold ${getRateColor(item.type)}`}>
                  {item.rate}% {item.type === 'index' ? 'proj.*' : 'AER'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {formatCurrency(item.monthlyAmount)}/mo
                  {nativeMax > 0 && item.type !== 'index' && (
                    <span className="text-gray-400 dark:text-gray-500">
                      {' '}of {formatCurrency(nativeMax)} max
                    </span>
                  )}
                </span>
              </div>
              {/* Capacity bar with slider - slider controls contribution amount directly */}
              {nativeMax > 0 && (
                <div className="mt-2">
                  {onOverrideChange ? (
                    <div className="relative pt-1 flex items-center gap-2">
                      <div className="relative w-full h-4 flex items-center">
                        {/* Progress bar background */}
                        <div className="absolute inset-x-0 h-2 bg-white/50 dark:bg-black/20 rounded-full overflow-hidden pointer-events-none">
                          {/* Fill bar - synced with slider value */}
                          <div
                            className={`h-full rounded-full transition-all ${isAtMax
                              ? 'bg-green-500'
                              : item.type === 'regular'
                                ? 'bg-purple-500'
                                : item.type === 'easyAccess'
                                  ? 'bg-green-500'
                                  : 'bg-blue-500'
                              }`}
                            style={{ width: `${Math.min(fillPercent, 100)}%` }}
                          />
                        </div>
                        {/* Slider - controls contribution amount, synced with progress bar */}
                        <input
                          type="range"
                          min="0"
                          max={nativeMax}
                          step="10"
                          value={item.monthlyAmount}
                          onChange={(e) => onOverrideChange(item.provider, Number(e.target.value))}
                          className={`absolute inset-0 w-full h-full cursor-pointer z-10 m-0 transparent-track bg-transparent ${item.type === 'regular'
                            ? 'accent-purple-500'
                            : item.type === 'easyAccess'
                              ? 'accent-green-500'
                              : 'accent-blue-500'
                            }`}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="h-2 bg-white/50 dark:bg-black/20 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${isAtMax
                          ? 'bg-green-500'
                          : item.type === 'regular'
                            ? 'bg-purple-500'
                            : item.type === 'easyAccess'
                              ? 'bg-green-500'
                              : 'bg-blue-500'
                          }`}
                        style={{ width: `${Math.min(fillPercent, 100)}%` }}
                      />
                    </div>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">
                    {Math.round(fillPercent)}% of account capacity
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        * Projected return, not guaranteed. Accounts are filled highest rate first.
      </p>
    </div>
  );
}

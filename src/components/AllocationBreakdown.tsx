'use client';

import { AllocationItem } from '@/types';
import { formatCurrency } from '@/utils/calculations';

interface AllocationBreakdownProps {
  allocation: AllocationItem[];
  monthlyTotal: number;
}

export function AllocationBreakdown({ allocation, monthlyTotal }: AllocationBreakdownProps) {
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
          const isAtMax = item.monthlyMax !== undefined && item.monthlyAmount >= item.monthlyMax;
          const capacityPercent = item.monthlyMax
            ? (item.monthlyAmount / item.monthlyMax) * 100
            : 100;

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
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/50 dark:bg-black/20 text-gray-600 dark:text-gray-300">
                    {getTypeLabel(item.type)}
                  </span>
                  {isAtMax && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-500 text-white font-medium">
                      MAXED
                    </span>
                  )}
                </div>
                <span className={`font-bold ${getRateColor(item.type)}`}>
                  {item.rate}%{item.type === 'index' ? '*' : ''}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {formatCurrency(item.monthlyAmount)}/mo
                  {item.monthlyMax && (
                    <span className="text-gray-400 dark:text-gray-500">
                      {' '}of {formatCurrency(item.monthlyMax)} max
                    </span>
                  )}
                </span>
              </div>
              {/* Capacity bar - shows how full this account is */}
              {item.monthlyMax && (
                <div className="mt-2">
                  <div className="h-2 bg-white/50 dark:bg-black/20 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isAtMax
                          ? 'bg-green-500'
                          : item.type === 'regular'
                          ? 'bg-purple-500'
                          : item.type === 'easyAccess'
                          ? 'bg-green-500'
                          : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(capacityPercent, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                    {capacityPercent.toFixed(0)}% of account capacity
                  </p>
                </div>
              )}
              {/* Index funds have no max */}
              {!item.monthlyMax && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  No monthly limit
                </p>
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

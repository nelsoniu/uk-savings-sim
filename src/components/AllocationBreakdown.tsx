'use client';

import { useState } from 'react';
import { AllocationItem, AllocationOverrides } from '@/types';
import { formatCurrency } from '@/utils/calculations';

interface AllocationBreakdownProps {
  allocation: AllocationItem[];
  monthlyTotal: number;
  overrides?: AllocationOverrides;
  onOverrideChange?: (provider: string, val: number) => void;
}

const TYPE_CONFIG = {
  regular: {
    label: 'Regular Savers',
    color: 'purple',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    border: 'border-purple-200 dark:border-purple-800',
    text: 'text-purple-700 dark:text-purple-300',
    badge: 'bg-purple-100 dark:bg-purple-800/60 text-purple-700 dark:text-purple-300',
    bar: 'bg-purple-500',
    headerBg: 'bg-purple-100 dark:bg-purple-900/40',
  },
  easyAccess: {
    label: 'Easy Access',
    color: 'emerald',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    border: 'border-emerald-200 dark:border-emerald-800',
    text: 'text-emerald-700 dark:text-emerald-300',
    badge: 'bg-emerald-100 dark:bg-emerald-800/60 text-emerald-700 dark:text-emerald-300',
    bar: 'bg-emerald-500',
    headerBg: 'bg-emerald-100 dark:bg-emerald-900/40',
  },
  index: {
    label: 'Index Funds',
    color: 'blue',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-700 dark:text-blue-300',
    badge: 'bg-blue-100 dark:bg-blue-800/60 text-blue-700 dark:text-blue-300',
    bar: 'bg-blue-500',
    headerBg: 'bg-blue-100 dark:bg-blue-900/40',
  },
};

type AccountType = keyof typeof TYPE_CONFIG;

function AccountRow({
  item,
  onOverrideChange,
  isExpanded,
  onToggleExpand,
}: {
  item: AllocationItem;
  onOverrideChange?: (provider: string, val: number) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}) {
  const c = TYPE_CONFIG[item.type];
  const nativeMax = item.nativeMonthlyMax || item.monthlyMax || 0;
  const isAtMax = item.monthlyAmount > 0 && nativeMax > 0 && item.monthlyAmount >= nativeMax;
  const fillPercent = nativeMax > 0 ? Math.min((item.monthlyAmount / nativeMax) * 100, 100) : 0;
  const isFunded = item.monthlyAmount > 0;

  return (
    <div className={`border-b border-gray-100 dark:border-gray-700/50 last:border-0 ${!isFunded ? 'opacity-50' : ''}`}>
      {/* Compact row */}
      <div className="flex items-center gap-2 py-2.5 px-3">
        {/* Expand button */}
        <button
          onClick={onToggleExpand}
          className="shrink-0 p-1 -ml-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        >
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Provider name */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {item.provider}
            </span>
            {isAtMax && (
              <span className="shrink-0 text-[9px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-800 text-amber-700 dark:text-amber-300 font-bold">
                MAX
              </span>
            )}
          </div>
        </div>

        {/* Amount */}
        <div className="w-16 sm:w-20 text-right">
          <span className={`text-sm font-semibold tabular-nums ${isFunded ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
            {formatCurrency(item.monthlyAmount)}
          </span>
          <span className="text-[10px] text-gray-400 dark:text-gray-500">/mo</span>
        </div>

        {/* Progress bar (desktop only) */}
        {nativeMax > 0 && item.type !== 'index' && (
          <div className="hidden md:flex items-center gap-2 w-24">
            <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${isAtMax ? 'bg-amber-500' : c.bar}`}
                style={{ width: `${fillPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 tabular-nums w-8">
              {Math.round(fillPercent)}%
            </span>
          </div>
        )}

        {/* Rate */}
        <div className="w-10 sm:w-12 text-right">
          <span className={`text-sm font-bold ${c.text}`}>
            {item.rate}%
          </span>
        </div>

        {/* Affiliate CTA button - always visible */}
        {item.affiliateUrl ? (
          <a
            href={item.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={`shrink-0 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
              isFunded
                ? `${c.badge} hover:opacity-80`
                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <span className="hidden sm:inline">Open</span>
            <svg className="w-3.5 h-3.5 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        ) : (
          <div className="w-12 sm:w-14" />
        )}
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className="px-3 pb-3 pt-1 bg-gray-50/50 dark:bg-gray-800/30">
          {/* Mobile progress bar */}
          {nativeMax > 0 && item.type !== 'index' && (
            <div className="sm:hidden flex items-center gap-2 mb-2">
              <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${isAtMax ? 'bg-amber-500' : c.bar}`}
                  style={{ width: `${fillPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 tabular-nums">
                {Math.round(fillPercent)}% full
              </span>
            </div>
          )}

          {/* Slider for overrides */}
          {onOverrideChange && nativeMax > 0 && (
            <div className="mb-2">
              <input
                type="range"
                min="0"
                max={nativeMax}
                step="10"
                value={item.monthlyAmount}
                onChange={(e) => {
                  e.stopPropagation();
                  onOverrideChange(item.provider, Number(e.target.value));
                }}
                onClick={(e) => e.stopPropagation()}
                className="w-full h-2 accent-purple-500"
              />
              <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                <span>£0</span>
                <span>{formatCurrency(nativeMax)}/mo max</span>
              </div>
            </div>
          )}

          {/* Interest estimate */}
          {item.type === 'regular' && nativeMax > 0 && (
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-1">
              ~{formatCurrency(Math.round(nativeMax * 12 * (item.rate / 100) * 0.5))}/yr interest if maxed
            </p>
          )}

          {/* Bonus note */}
          {item.bonusNote && (
            <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
              💰 {item.bonusNote}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function TypeSection({
  type,
  items,
  onOverrideChange,
  expandedItems,
  onToggleItem,
  defaultCollapsed = false,
}: {
  type: AccountType;
  items: AllocationItem[];
  onOverrideChange?: (provider: string, val: number) => void;
  expandedItems: Set<string>;
  onToggleItem: (provider: string) => void;
  defaultCollapsed?: boolean;
}) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const c = TYPE_CONFIG[type];

  const totalAmount = items.reduce((sum, item) => sum + item.monthlyAmount, 0);
  const fundedCount = items.filter(i => i.monthlyAmount > 0).length;
  const avgRate = items.length > 0
    ? (items.reduce((sum, item) => sum + item.rate, 0) / items.length).toFixed(1)
    : '0';

  if (items.length === 0) return null;

  return (
    <div className={`rounded-xl border ${c.border} overflow-hidden`}>
      {/* Section header */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`w-full flex items-center justify-between gap-3 px-4 py-3 ${c.headerBg} transition-colors hover:opacity-90`}
      >
        <div className="flex items-center gap-3">
          <span className={`text-sm font-bold ${c.text}`}>
            {c.label}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {fundedCount}/{items.length} active
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {formatCurrency(totalAmount)}
            </span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400">/mo</span>
          </div>
          <span className={`text-xs font-semibold ${c.text}`}>
            ~{avgRate}% avg
          </span>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${isCollapsed ? '' : 'rotate-180'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Account rows */}
      {!isCollapsed && (
        <div className="bg-white dark:bg-gray-800/50">
          {items.map((item) => (
            <AccountRow
              key={item.provider}
              item={item}
              onOverrideChange={onOverrideChange}
              isExpanded={expandedItems.has(item.provider)}
              onToggleExpand={() => onToggleItem(item.provider)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function AllocationBreakdown({ allocation, monthlyTotal, overrides, onOverrideChange }: AllocationBreakdownProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  if (!allocation || allocation.length === 0) return null;

  // Group by type
  const grouped = {
    regular: allocation.filter(i => i.type === 'regular'),
    easyAccess: allocation.filter(i => i.type === 'easyAccess'),
    index: allocation.filter(i => i.type === 'index'),
  };

  // Sort each group: funded first, then by rate descending
  Object.keys(grouped).forEach(key => {
    grouped[key as AccountType].sort((a, b) => {
      if ((a.monthlyAmount > 0) !== (b.monthlyAmount > 0)) {
        return b.monthlyAmount > 0 ? 1 : -1;
      }
      return b.rate - a.rate;
    });
  });

  const toggleItem = (provider: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(provider)) {
        next.delete(provider);
      } else {
        next.add(provider);
      }
      return next;
    });
  };

  const totalAllocated = allocation.reduce((sum, i) => sum + i.monthlyAmount, 0);

  return (
    <div className="space-y-3">
      {/* Summary bar */}
      <div className="flex items-center justify-between px-1">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          Allocation Breakdown
        </h4>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(totalAllocated)}</span>
          <span>/mo across {allocation.filter(i => i.monthlyAmount > 0).length} accounts</span>
        </div>
      </div>

      {/* Type sections */}
      <div className="space-y-3">
        <TypeSection
          type="regular"
          items={grouped.regular}
          onOverrideChange={onOverrideChange}
          expandedItems={expandedItems}
          onToggleItem={toggleItem}
        />
        <TypeSection
          type="easyAccess"
          items={grouped.easyAccess}
          onOverrideChange={onOverrideChange}
          expandedItems={expandedItems}
          onToggleItem={toggleItem}
        />
        <TypeSection
          type="index"
          items={grouped.index}
          onOverrideChange={onOverrideChange}
          expandedItems={expandedItems}
          onToggleItem={toggleItem}
        />
      </div>

      <p className="text-[10px] text-gray-400 dark:text-gray-500 px-1">
        * Projected return, not guaranteed. Tap any row to see details & open account.
      </p>
    </div>
  );
}

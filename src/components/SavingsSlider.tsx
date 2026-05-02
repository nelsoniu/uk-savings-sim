'use client';

import { formatCurrency } from '@/utils/calculations';

interface SavingsSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  effectiveMonthlyAmount?: number;
}

const presets = [250, 500, 1000, 2000, 3500];

export function SavingsSlider({
  value,
  onChange,
  min = 100,
  max = 5000,
  step = 50,
  effectiveMonthlyAmount,
}: SavingsSliderProps) {
  const isReduced = effectiveMonthlyAmount !== undefined && effectiveMonthlyAmount < value;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Monthly Savings
        </label>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-gray-900 dark:text-white tabular-nums">
            {formatCurrency(value)}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">/ month</span>
        </div>
      </div>

      {/* Preset chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {presets.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              value === p
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            £{p}
          </button>
        ))}
        <span className="text-xs text-gray-400 dark:text-gray-500 self-center ml-2">or drag</span>
      </div>

      {/* Slider */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full cursor-pointer"
      />

      {/* Labels */}
      <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-2">
        <span>{formatCurrency(min)}</span>
        <span>{formatCurrency(max)}</span>
      </div>

      {isReduced && (
        <div className="mt-3 flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3 py-2">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          Effective: {formatCurrency(effectiveMonthlyAmount!)}/mo — increase caps below to save more
        </div>
      )}
    </div>
  );
}

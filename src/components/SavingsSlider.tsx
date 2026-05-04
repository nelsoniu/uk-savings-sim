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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <label className="text-base sm:text-sm font-semibold text-gray-700 dark:text-gray-300 sm:uppercase sm:tracking-wider sm:text-gray-500 sm:dark:text-gray-400">
          How much can you save each month?
        </label>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl sm:text-3xl font-bold text-gray-900 dark:text-white tabular-nums">
            {formatCurrency(value)}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">/ month</span>
        </div>
      </div>

      {/* Preset chips - horizontal scroll on mobile */}
      <div className="flex overflow-x-auto gap-2 sm:gap-2 mb-4 pb-2 -mx-2 px-2 sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-hide">
        {presets.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`flex-shrink-0 px-4 py-2.5 sm:px-3 sm:py-1.5 rounded-full text-sm sm:text-xs font-medium transition-all min-h-[44px] sm:min-h-0 active:scale-95 ${
              value === p
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            £{p.toLocaleString()}
          </button>
        ))}
        <span className="hidden sm:inline text-xs text-gray-400 dark:text-gray-500 self-center ml-2">or drag</span>
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
        <div className="mt-3 flex items-start gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3 py-2.5">
          <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            <strong>Heads up:</strong> Some accounts have monthly limits. You can actually save {formatCurrency(effectiveMonthlyAmount!)}/mo with the Smart Split strategy.
          </span>
        </div>
      )}
    </div>
  );
}

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
    <div className="w-full max-w-xl mx-auto">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Monthly Savings Amount
      </label>
      <div className="flex items-center gap-4">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 cursor-pointer accent-blue-600"
        />
        <div className="min-w-[100px] text-right">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(value)}
          </span>
          <span className="text-gray-500 dark:text-gray-400 text-sm">/mo</span>
        </div>
      </div>
      {isReduced && (
        <p className="text-sm text-amber-600 dark:text-amber-500 mt-1 font-medium">
          Effective: {formatCurrency(effectiveMonthlyAmount!)}/mo — increase caps below to save more
        </p>
      )}
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
        <span>{formatCurrency(min)}</span>
        <span>{formatCurrency(max)}</span>
      </div>
    </div>
  );
}

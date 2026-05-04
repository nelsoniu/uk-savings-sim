'use client';

import { StrategyResult } from '@/types';
import { formatCurrency } from '@/utils/calculations';

interface QuickRecommendationProps {
  monthlyAmount: number;
  optimisedResult: StrategyResult;
  oneSavingsResult: StrategyResult;
  defaultEasyAccessRate: number;
  onShowOptions: () => void;
}

export function QuickRecommendation({
  monthlyAmount,
  optimisedResult,
  oneSavingsResult,
  defaultEasyAccessRate,
  onShowOptions,
}: QuickRecommendationProps) {
  // Recommend "Keep It Simple" for amounts under £500, "Smart Split" for higher amounts
  const useSimple = monthlyAmount <= 500;
  const recommended = useSimple ? oneSavingsResult : optimisedResult;
  const monthlyInterest = Math.round(recommended.estimatedAnnualInterest / 12);

  return (
    <div className="sm:hidden bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-5 text-white shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg">
          {useSimple ? '✨' : '💡'}
        </span>
        <span className="text-sm font-medium text-white/80">
          Your quick answer
        </span>
      </div>

      {/* Main recommendation */}
      <h2 className="text-xl font-bold mb-2">
        {useSimple ? 'Keep It Simple' : 'Smart Split'}
      </h2>
      <p className="text-white/90 text-sm mb-4 leading-relaxed">
        {useSimple
          ? `Put your £${monthlyAmount}/mo in a Trading 212 ISA — one account, zero hassle`
          : `Spread £${monthlyAmount}/mo across top-rate accounts for the best returns`}
      </p>

      {/* Key benefits */}
      <div className="flex flex-wrap gap-2 mb-5">
        {useSimple ? (
          <>
            <span className="px-3 py-1.5 bg-white/20 rounded-full text-xs font-medium">
              Tax-free
            </span>
            <span className="px-3 py-1.5 bg-white/20 rounded-full text-xs font-medium">
              {defaultEasyAccessRate}% interest
            </span>
            <span className="px-3 py-1.5 bg-white/20 rounded-full text-xs font-medium">
              Instant access
            </span>
          </>
        ) : (
          <>
            <span className="px-3 py-1.5 bg-white/20 rounded-full text-xs font-medium">
              Up to 7% rates
            </span>
            <span className="px-3 py-1.5 bg-white/20 rounded-full text-xs font-medium">
              FSCS protected
            </span>
            <span className="px-3 py-1.5 bg-white/20 rounded-full text-xs font-medium">
              Guaranteed returns
            </span>
          </>
        )}
      </div>

      {/* Key numbers */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-white/10 rounded-xl p-3">
          <p className="text-xs text-white/70 mb-1">In 10 years</p>
          <p className="text-2xl font-extrabold tabular-nums">
            {formatCurrency(recommended.tenYearProjectedPot)}
          </p>
          <p className="text-xs text-green-300 font-medium">
            +{recommended.tenYearGrowthPercent.toFixed(0)}% growth
          </p>
        </div>
        <div className="bg-white/10 rounded-xl p-3">
          <p className="text-xs text-white/70 mb-1">Monthly interest</p>
          <p className="text-2xl font-extrabold tabular-nums">
            +£{monthlyInterest}
          </p>
          <p className="text-xs text-white/70">
            avg. per month
          </p>
        </div>
      </div>

      {/* CTAs */}
      <div className="space-y-3">
        <a
          href={useSimple ? '#trading212' : '#optimised-accounts'}
          className="flex items-center justify-center w-full py-3.5 bg-white text-indigo-600 rounded-xl font-semibold text-sm shadow-md active:scale-[0.98] transition-transform"
        >
          Get Started
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
        <button
          onClick={onShowOptions}
          className="w-full py-3 text-white/90 text-sm font-medium hover:text-white transition-colors"
        >
          See other options
        </button>
      </div>
    </div>
  );
}

'use client';

import { StrategyResult } from '@/types';
import { formatCurrency } from '@/utils/calculations';

interface DesktopHeroProps {
  monthlyAmount: number;
  optimisedResult: StrategyResult;
  oneSavingsResult: StrategyResult;
  defaultEasyAccessRate: number;
  onShowDetails: () => void;
}

export function DesktopHero({
  monthlyAmount,
  optimisedResult,
  oneSavingsResult,
  defaultEasyAccessRate,
  onShowDetails,
}: DesktopHeroProps) {
  // Recommend "Keep It Simple" for amounts under £500, "Smart Split" for higher amounts
  const useSimple = monthlyAmount <= 500;
  const recommended = useSimple ? oneSavingsResult : optimisedResult;
  const monthlyInterest = Math.round(recommended.estimatedAnnualInterest / 12);
  const oneYearDeposits = monthlyAmount * 12;
  const oneYearGrowth = recommended.oneYearProjectedPot - oneYearDeposits;

  return (
    <div className="hidden sm:block">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Answer Card - spans 2 columns on large screens */}
        <div className="lg:col-span-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
                {useSimple ? '✨' : '💡'}
              </span>
              <div>
                <p className="text-sm text-white/80">Your quick answer</p>
                <h2 className="text-xl font-bold">
                  {useSimple ? 'Keep It Simple' : 'Smart Split'}
                </h2>
              </div>
            </div>
            <div className="flex gap-2">
              {useSimple ? (
                <>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                    Tax-free
                  </span>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                    {defaultEasyAccessRate}% rate
                  </span>
                </>
              ) : (
                <>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                    Up to 7% rates
                  </span>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                    FSCS protected
                  </span>
                </>
              )}
            </div>
          </div>

          <p className="text-white/90 text-sm mb-6 max-w-lg">
            {useSimple
              ? `Put your £${monthlyAmount}/mo in a Trading 212 ISA — one account, zero hassle`
              : `Spread £${monthlyAmount}/mo across top-rate accounts for the best guaranteed returns`}
          </p>

          {/* Key metrics - horizontal on desktop */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-xs text-white/70 mb-1">After 1 year</p>
              <p className="text-2xl font-extrabold tabular-nums">
                {formatCurrency(recommended.oneYearProjectedPot)}
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-xs text-white/70 mb-1">Interest earned</p>
              <p className="text-2xl font-extrabold tabular-nums text-green-300">
                +{formatCurrency(oneYearGrowth)}
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-xs text-white/70 mb-1">Monthly interest</p>
              <p className="text-2xl font-extrabold tabular-nums">
                +£{monthlyInterest}
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-xs text-white/70 mb-1">Growth rate</p>
              <p className="text-2xl font-extrabold tabular-nums text-green-300">
                +{recommended.oneYearGrowthPercent.toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <a
              href={useSimple ? '#trading212' : '#optimised-accounts'}
              className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold text-sm hover:bg-white/90 transition-colors inline-flex items-center"
            >
              Get Started
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
            <button
              onClick={onShowDetails}
              className="px-6 py-3 bg-white/10 text-white rounded-xl font-semibold text-sm hover:bg-white/20 transition-colors"
            >
              Compare all strategies
            </button>
          </div>
        </div>

        {/* 10-Year Teaser Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
            Long-term potential
          </h3>

          <div className="text-center py-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Keep saving for 10 years
            </p>
            <p className="text-4xl font-extrabold text-gray-900 dark:text-white tabular-nums mb-1">
              {formatCurrency(recommended.tenYearProjectedPot)}
            </p>
            <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
              +{recommended.tenYearGrowthPercent.toFixed(0)}% total growth
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500 dark:text-gray-400">You deposit</span>
              <span className="font-semibold text-gray-900 dark:text-white tabular-nums">
                {formatCurrency(monthlyAmount * 12 * 10)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Interest earned</span>
              <span className="font-semibold text-green-600 dark:text-green-400 tabular-nums">
                +{formatCurrency(recommended.tenYearProjectedPot - (monthlyAmount * 12 * 10))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

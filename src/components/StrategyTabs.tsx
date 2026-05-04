'use client';

import { useState } from 'react';
import { StrategyType, AccountsData, CustomMix, StrategyResult, AllocationOverrides } from '@/types';
import { StrategyCard } from './StrategyCard';
import { CustomMixSliders } from './CustomMixSliders';
import { AllocationBreakdown } from './AllocationBreakdown';
import { AllocationInsights } from './AllocationInsights';
import { ComparisonInsights } from './ComparisonInsights';
import {
  calculateOptimisedSplit,
  calculateOneSavingsAccount,
  calculateAllIndexFund,
  calculateCustomMix,
} from '@/utils/calculations';

interface StrategyTabsProps {
  monthlyAmount: number;
  accounts: AccountsData;
  customMix: CustomMix;
  onCustomMixChange: (mix: CustomMix) => void;
  onResultsChange: (results: {
    optimised: StrategyResult;
    oneSavings: StrategyResult;
    allIndex: StrategyResult;
    custom: StrategyResult;
  }) => void;
  overrides: AllocationOverrides;
  onOverrideChange: (provider: string, val: number) => void;
}

type TabId = 'comparison' | 'details';

export function StrategyTabs({
  monthlyAmount,
  accounts,
  customMix,
  onCustomMixChange,
  overrides,
  onOverrideChange,
}: StrategyTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('comparison');
  const [expandedStrategy, setExpandedStrategy] = useState<StrategyType>('optimised');

  const optimisedResult = calculateOptimisedSplit(monthlyAmount, accounts, overrides);
  const oneSavingsResult = calculateOneSavingsAccount(monthlyAmount, accounts);
  const allIndexResult = calculateAllIndexFund(monthlyAmount, accounts);
  const customResult = calculateCustomMix(monthlyAmount, customMix, accounts);

  const totalRegularCapacity = accounts.regularSavers.reduce(
    (sum, acc) => sum + acc.monthlyMax,
    0
  );

  const strategies = {
    optimised: {
      title: 'Smart Split',
      description: 'Spreads your money across top-rate accounts for the best returns',
      result: optimisedResult,
      affiliateUrl: '#optimised-accounts',
      affiliateText: 'Open These Accounts',
      badge: {
        text: '💡 Best Value',
        subLabel: 'Guaranteed returns · a few accounts to set up',
        color: 'blue' as const,
      },
    },
    oneSavings: {
      title: 'Keep It Simple',
      description: `One account, zero hassle — ${accounts.defaultEasyAccessRate}% tax-free`,
      result: oneSavingsResult,
      affiliateUrl: '#trading212',
      affiliateText: 'Open Trading 212 ISA',
      badge: {
        text: '✨ Easiest',
        subLabel: 'Guaranteed returns · one account, done',
        color: 'green' as const,
      },
    },
    allIndex: {
      title: 'Go For Growth',
      description: `Invest in global stocks — ${accounts.defaultIndexReturn}% expected yearly growth`,
      result: allIndexResult,
      affiliateUrl: '#vwra',
      affiliateText: 'Start Investing',
      badge: {
        text: '📈 Most Growth',
        subLabel: 'Market risk · not guaranteed',
        color: 'amber' as const,
      },
    },
    custom: {
      title: 'Build Your Own',
      description: 'Mix savings accounts and investments your way',
      result: customResult,
      affiliateUrl: '#custom-accounts',
      affiliateText: 'Get Started',
      badge: {
        text: '✎ Custom',
        subLabel: 'You choose your risk level',
        color: 'purple' as const,
      },
    },
  };

  const tabKeys: StrategyType[] = ['optimised', 'oneSavings', 'allIndex', 'custom'];
  // Show only 3 main strategies on mobile (hide Custom)
  const mobileTabKeys: StrategyType[] = ['optimised', 'oneSavings', 'allIndex'];

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Strategy Comparison
        </h2>
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-4 py-2.5 sm:px-3 sm:py-1.5 rounded-md text-sm sm:text-xs font-medium transition-all min-h-[44px] sm:min-h-0 ${
              activeTab === 'comparison'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Compare
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2.5 sm:px-3 sm:py-1.5 rounded-md text-sm sm:text-xs font-medium transition-all min-h-[44px] sm:min-h-0 ${
              activeTab === 'details'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Details
          </button>
        </div>
      </div>

      {activeTab === 'comparison' ? (
        <>
          <ComparisonInsights
            optimised={optimisedResult}
            oneSavings={oneSavingsResult}
            allIndex={allIndexResult}
            monthlyAmount={monthlyAmount}
          />
          {/* Mobile: Horizontal scroll carousel (3 strategies) */}
          <div className="sm:hidden flex overflow-x-auto gap-4 pb-4 scroll-snap-x scrollbar-hide -mx-4 px-4">
            {mobileTabKeys.map((key) => {
              const s = strategies[key];
              return (
                <div key={key} className="flex-shrink-0 w-[85vw] max-w-[320px]">
                  <StrategyCard
                    title={s.title}
                    description={s.description}
                    result={s.result}
                    affiliateUrl={key !== 'optimised' ? s.affiliateUrl : undefined}
                    affiliateText={key === 'optimised' ? 'See How It Works' : s.affiliateText}
                    badge={s.badge}
                    onCtaClick={key === 'optimised' ? () => {
                      setActiveTab('details');
                      setExpandedStrategy('optimised');
                    } : undefined}
                    compact
                  />
                </div>
              );
            })}
          </div>
          {/* Desktop: 2x2 grid (all 4 strategies) */}
          <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 gap-5">
            {tabKeys.map((key) => {
              const s = strategies[key];
              return (
                <StrategyCard
                  key={key}
                  title={s.title}
                  description={s.description}
                  result={s.result}
                  affiliateUrl={key !== 'optimised' ? s.affiliateUrl : undefined}
                  affiliateText={key === 'optimised' ? 'View Allocation Split' : s.affiliateText}
                  badge={s.badge}
                  onCtaClick={key === 'optimised' ? () => {
                    setActiveTab('details');
                    setExpandedStrategy('optimised');
                  } : undefined}
                >
                  {key === 'custom' && (
                    <CustomMixSliders mix={customMix} onChange={onCustomMixChange} />
                  )}
                </StrategyCard>
              );
            })}
          </div>
        </>
      ) : (
        /* Detail view with tabs */
        <div>
          {/* Mobile: Horizontal scroll for strategy tabs */}
          <div className="flex overflow-x-auto gap-2 mb-6 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-hide">
            {tabKeys.map((key) => (
              <button
                key={key}
                onClick={() => setExpandedStrategy(key)}
                className={`flex-shrink-0 px-5 py-3 sm:px-4 sm:py-2 rounded-lg text-sm font-medium transition-all min-h-[44px] ${
                  expandedStrategy === key
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {strategies[key].title}
              </button>
            ))}
          </div>

          <StrategyCard
            title={strategies[expandedStrategy].title}
            description={strategies[expandedStrategy].description}
            result={strategies[expandedStrategy].result}
            affiliateUrl={strategies[expandedStrategy].affiliateUrl}
            affiliateText={strategies[expandedStrategy].affiliateText}
            badge={strategies[expandedStrategy].badge}
          >
            {expandedStrategy === 'optimised' && optimisedResult.allocation && (
              <>
                <AllocationInsights
                  allocation={optimisedResult.allocation}
                  result={optimisedResult}
                  monthlyAmount={monthlyAmount}
                />
                <AllocationBreakdown
                  allocation={optimisedResult.allocation}
                  monthlyTotal={monthlyAmount}
                  overrides={overrides}
                  onOverrideChange={onOverrideChange}
                />
              </>
            )}
            {expandedStrategy === 'custom' && (
              <CustomMixSliders mix={customMix} onChange={onCustomMixChange} />
            )}
          </StrategyCard>
        </div>
      )}
    </div>
  );
}

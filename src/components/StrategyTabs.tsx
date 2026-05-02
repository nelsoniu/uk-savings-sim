'use client';

import { useState } from 'react';
import { StrategyType, AccountsData, CustomMix, StrategyResult, AllocationOverrides } from '@/types';
import { StrategyCard } from './StrategyCard';
import { CustomMixSliders } from './CustomMixSliders';
import { AllocationBreakdown } from './AllocationBreakdown';
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

  const allResults = [
    { key: 'optimised' as const, result: optimisedResult },
    { key: 'oneSavings' as const, result: oneSavingsResult },
    { key: 'allIndex' as const, result: allIndexResult },
    { key: 'custom' as const, result: customResult },
  ];
  const bestKey = allResults.reduce((best, curr) =>
    curr.result.tenYearProjectedPot > allResults.find(r => r.key === best)!.result.tenYearProjectedPot
      ? curr.key
      : best,
    'optimised' as StrategyType
  );

  const strategies = {
    optimised: {
      title: 'Optimised Split',
      description: `Fills high-rate regular savers (up to £${totalRegularCapacity.toLocaleString()}/mo) first, then overflows to easy access at ${accounts.defaultEasyAccessRate}%`,
      result: optimisedResult,
      affiliateUrl: '#optimised-accounts',
      affiliateText: 'Open These Accounts',
      badge: {
        text: '⚖ Balanced',
        subLabel: 'Guaranteed returns · multiple accounts to set up',
        color: 'blue' as const,
      },
    },
    oneSavings: {
      title: 'One Savings Account',
      description: `All into Trading 212 Cash ISA at ${accounts.defaultEasyAccessRate}% — simple, tax-free, FSCS protected`,
      result: oneSavingsResult,
      affiliateUrl: '#trading212',
      affiliateText: 'Open Trading 212 ISA',
      badge: {
        text: '✓ Simplest',
        subLabel: 'Guaranteed returns · one account, zero effort',
        color: 'green' as const,
      },
    },
    allIndex: {
      title: 'All Index Fund',
      description: `All into VWRA global index ETF at ${accounts.defaultIndexReturn}% projected annual return`,
      result: allIndexResult,
      affiliateUrl: '#vwra',
      affiliateText: 'Start Investing in VWRA',
      badge: {
        text: '★ Highest Return',
        subLabel: 'Market risk involved · not guaranteed',
        color: 'amber' as const,
      },
    },
    custom: {
      title: 'My Own Mix',
      description: 'Customise your allocation between regular savers, easy access, and index funds',
      result: customResult,
      affiliateUrl: '#custom-accounts',
      affiliateText: 'Get Started with This Mix',
      badge: {
        text: '✎ Custom',
        subLabel: 'You choose your risk level',
        color: 'purple' as const,
      },
    },
  };

  const ranked = [...allResults].sort((a, b) => b.result.tenYearProjectedPot - a.result.tenYearProjectedPot);
  const rankMap = new Map(ranked.map((r, i) => [r.key, i + 1]));

  const tabKeys: StrategyType[] = ['optimised', 'oneSavings', 'allIndex', 'custom'];

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
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'comparison'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Compare All
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
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
        /* 2x2 comparison grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {tabKeys.map((key) => {
            const s = strategies[key];
            return (
              <StrategyCard
                key={key}
                title={s.title}
                description={s.description}
                result={s.result}
                affiliateUrl={s.affiliateUrl}
                affiliateText={s.affiliateText}
                highlighted={key === bestKey}
                rank={rankMap.get(key)}
                badge={s.badge}
              >
                {key === 'custom' && (
                  <CustomMixSliders mix={customMix} onChange={onCustomMixChange} />
                )}
              </StrategyCard>
            );
          })}
        </div>
      ) : (
        /* Detail view with tabs */
        <div>
          <div className="flex flex-wrap gap-2 mb-6">
            {tabKeys.map((key) => (
              <button
                key={key}
                onClick={() => setExpandedStrategy(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
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
            highlighted={expandedStrategy === bestKey}
            badge={strategies[expandedStrategy].badge}
          >
            {expandedStrategy === 'optimised' && optimisedResult.allocation && (
              <AllocationBreakdown
                allocation={optimisedResult.allocation}
                monthlyTotal={monthlyAmount}
                overrides={overrides}
                onOverrideChange={onOverrideChange}
              />
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

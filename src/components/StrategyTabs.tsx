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

const tabs: { id: StrategyType; label: string }[] = [
  { id: 'optimised', label: 'Optimised Split' },
  { id: 'oneSavings', label: 'One Savings Account' },
  { id: 'allIndex', label: 'All Index Fund' },
  { id: 'custom', label: 'My Own Mix' },
];

export function StrategyTabs({
  monthlyAmount,
  accounts,
  customMix,
  onCustomMixChange,
  overrides,
  onOverrideChange,
}: StrategyTabsProps) {
  const [activeTab, setActiveTab] = useState<StrategyType>('optimised');

  // Calculate all strategy results
  const optimisedResult = calculateOptimisedSplit(monthlyAmount, accounts, overrides);
  const oneSavingsResult = calculateOneSavingsAccount(monthlyAmount, accounts);
  const allIndexResult = calculateAllIndexFund(monthlyAmount, accounts);
  const customResult = calculateCustomMix(monthlyAmount, customMix, accounts);

  // Calculate total regular saver capacity for description
  const totalRegularCapacity = accounts.regularSavers.reduce(
    (sum, acc) => sum + acc.monthlyMax,
    0
  );

  const strategies = {
    optimised: {
      title: 'Optimised Split',
      description: `Fills high-rate regular savers (up to £${totalRegularCapacity}/mo) first, then overflows to easy access at ${accounts.defaultEasyAccessRate}%`,
      result: optimisedResult,
      affiliateUrl: '#optimised-accounts',
      affiliateText: 'Open These Accounts',
    },
    oneSavings: {
      title: 'One Savings Account',
      description: `All savings into Trading 212 Cash ISA at ${accounts.defaultEasyAccessRate}% — simple, tax-free, and FSCS protected`,
      result: oneSavingsResult,
      affiliateUrl: '#trading212',
      affiliateText: 'Open Trading 212 ISA',
    },
    allIndex: {
      title: 'All Index Fund',
      description: `All into VWRA global index ETF at ${accounts.defaultIndexReturn}% projected annual return`,
      result: allIndexResult,
      affiliateUrl: '#vwra',
      affiliateText: 'Start Investing in VWRA',
    },
    custom: {
      title: 'My Own Mix',
      description: 'Customise your allocation between regular savers, easy access, and index funds',
      result: customResult,
      affiliateUrl: '#custom-accounts',
      affiliateText: 'Get Started with This Mix',
    },
  };

  const current = strategies[activeTab];

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Strategy Card */}
      <StrategyCard
        title={current.title}
        description={current.description}
        result={current.result}
        affiliateUrl={current.affiliateUrl}
        affiliateText={current.affiliateText}
        hideMainCta={activeTab === 'optimised'}
      >
        {activeTab === 'optimised' && optimisedResult.allocation && (
          <AllocationBreakdown
            allocation={optimisedResult.allocation}
            monthlyTotal={monthlyAmount}
            overrides={overrides}
            onOverrideChange={onOverrideChange}
          />
        )}
        {activeTab === 'custom' && (
          <CustomMixSliders mix={customMix} onChange={onCustomMixChange} />
        )}
      </StrategyCard>
    </div>
  );
}

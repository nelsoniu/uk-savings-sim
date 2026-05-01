'use client';

import { useState, useMemo } from 'react';
import { AccountsData, CustomMix, AllocationOverrides } from '@/types';
import { SavingsSlider } from './SavingsSlider';
import { StrategyTabs } from './StrategyTabs';
import { ProjectionChart } from './ProjectionChart';
import { ThemeToggle } from './ThemeToggle';
import {
  calculateOptimisedSplit,
} from '@/utils/calculations';

interface SavingsSimulatorProps {
  accounts: AccountsData;
}

export function SavingsSimulator({ accounts }: SavingsSimulatorProps) {
  const [monthlyAmount, setMonthlyAmount] = useState(500);
  const [customMix, setCustomMix] = useState<CustomMix>({
    regularSaverPercent: 30,
    easyAccessPercent: 30,
    indexPercent: 40,
  });
  const [overrides, setOverrides] = useState<AllocationOverrides>({});

  // Calculate results for the chart using all accounts (no eligibility filter)
  const optimisedResult = useMemo(() => {
    return calculateOptimisedSplit(monthlyAmount, accounts, overrides);
  }, [monthlyAmount, accounts, overrides]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              UK Savings Simulator
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Compare savings strategies and maximise your returns
            </p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Savings Amount Slider */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <SavingsSlider
            value={monthlyAmount}
            onChange={setMonthlyAmount}
            effectiveMonthlyAmount={optimisedResult.actualMonthlySaved}
          />
        </section>

        {/* Strategy Tabs */}
        <section>
          <StrategyTabs
            monthlyAmount={monthlyAmount}
            accounts={accounts}
            customMix={customMix}
            onCustomMixChange={setCustomMix}
            overrides={overrides}
            onOverrideChange={(provider, val) =>
              setOverrides((prev) => ({ ...prev, [provider]: val }))
            }
            onResultsChange={() => { }}
          />
        </section>

        {/* 10 Year Projection Chart */}
        <section>
          <ProjectionChart
            optimised={optimisedResult}
            monthlyAmount={monthlyAmount}
          />
        </section>

        {/* Account Info */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Current Account Rates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Regular Savers
              </h4>
              <ul className="space-y-1">
                {accounts.regularSavers.map((acc) => (
                  <li
                    key={acc.id}
                    className="text-sm text-gray-600 dark:text-gray-400"
                  >
                    {acc.provider}: {acc.rate}% (up to £{acc.monthlyMax}/mo)
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Easy Access
              </h4>
              <ul className="space-y-1">
                {accounts.easyAccess.map((acc) => (
                  <li
                    key={acc.id}
                    className="text-sm text-gray-600 dark:text-gray-400"
                  >
                    {acc.provider}: {acc.rate}%
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Index Funds
              </h4>
              <ul className="space-y-1">
                {accounts.indexFunds.map((fund) => (
                  <li
                    key={fund.id}
                    className="text-sm text-gray-600 dark:text-gray-400"
                  >
                    {fund.name}: {fund.projectedReturn}% projected
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            Rates last updated: {accounts.lastUpdated}
          </p>
        </section>

        {/* Disclaimer */}
        <footer className="text-center text-xs text-gray-500 dark:text-gray-400 py-4">
          <p>
            This tool is for illustrative purposes only. Interest rates and investment returns can change.
            Past performance does not guarantee future results. Always do your own research.
          </p>
        </footer>
      </main>
    </div>
  );
}

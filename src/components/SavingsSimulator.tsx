'use client';

import { useState, useMemo } from 'react';
import { AccountsData, CustomMix, AllocationOverrides } from '@/types';
import { SavingsSlider } from './SavingsSlider';
import { StrategyTabs } from './StrategyTabs';
import { ProjectionChart } from './ProjectionChart';
import { ThemeToggle } from './ThemeToggle';
import { calculateOptimisedSplit } from '@/utils/calculations';
import { formatCurrency } from '@/utils/calculations';

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

  const optimisedResult = useMemo(() => {
    return calculateOptimisedSplit(monthlyAmount, accounts, overrides);
  }, [monthlyAmount, accounts, overrides]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* ---- Header ---- */}
      <header className="sticky top-0 z-30 backdrop-blur-lg bg-white/80 dark:bg-gray-950/80 border-b border-gray-200/60 dark:border-gray-800/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <span className="text-white font-bold text-sm">£</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                UK Savings Simulator
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Compare strategies & maximise returns
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* ---- Main Content ---- */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        {/* Hero Slider Section */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 shadow-sm">
          <SavingsSlider
            value={monthlyAmount}
            onChange={setMonthlyAmount}
            effectiveMonthlyAmount={optimisedResult.actualMonthlySaved}
          />
        </section>

        {/* Strategy Comparison */}
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
            onResultsChange={() => {}}
          />
        </section>

        {/* Chart */}
        <section>
          <ProjectionChart
            optimised={optimisedResult}
            monthlyAmount={monthlyAmount}
          />
        </section>

        {/* Account Rates */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">
            Current Account Rates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Regular Savers */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-sm">
                  🏦
                </span>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                  Regular Savers
                </h3>
              </div>
              <ul className="space-y-3">
                {accounts.regularSavers.slice(0, 6).map((acc) => (
                  <li key={acc.id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400 truncate mr-2">
                      {acc.provider}
                    </span>
                    <span className="font-semibold text-purple-600 dark:text-purple-400 shrink-0 tabular-nums">
                      {acc.rate}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Easy Access */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-sm">
                  💳
                </span>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                  Easy Access
                </h3>
              </div>
              <ul className="space-y-3">
                {accounts.easyAccess.map((acc) => (
                  <li key={acc.id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400 truncate mr-2">
                      {acc.provider}
                    </span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 shrink-0 tabular-nums">
                      {acc.rate}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Index Funds */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-sm">
                  📈
                </span>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                  Index Funds
                </h3>
              </div>
              <ul className="space-y-3">
                {accounts.indexFunds.map((fund) => (
                  <li key={fund.id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400 truncate mr-2">
                      {fund.name}
                    </span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400 shrink-0 tabular-nums">
                      {fund.projectedReturn}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-4 text-center">
            Rates last updated: {accounts.lastUpdated} · Projected returns, not guaranteed
          </p>
        </section>

        {/* Footer */}
        <footer className="text-center text-xs text-gray-400 dark:text-gray-500 py-6 border-t border-gray-200 dark:border-gray-800">
          <p>
            This tool is for illustrative purposes only. Interest rates and investment returns can change.
            Past performance does not guarantee future results. Always do your own research.
          </p>
        </footer>
      </main>
    </div>
  );
}

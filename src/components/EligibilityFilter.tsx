'use client';

import { AccountsData } from '@/types';
import { useMemo } from 'react';

interface EligibilityFilterProps {
  accounts: AccountsData;
  selectedProviders: string[];
  onChange: (providers: string[]) => void;
}

export function EligibilityFilter({
  accounts,
  selectedProviders,
  onChange,
}: EligibilityFilterProps) {
  // Extract unique providers that require an existing relationship
  const gatedProviders = useMemo(() => {
    const providers = new Map<string, { eligibility: string; topRate: number }>();
    for (const acc of accounts.regularSavers) {
      if (acc.eligibility === 'open-to-all') continue;
      if (
        !providers.has(acc.provider) ||
        acc.rate > providers.get(acc.provider)!.topRate
      ) {
        providers.set(acc.provider, {
          eligibility: acc.eligibility,
          topRate: acc.rate,
        });
      }
    }
    return Array.from(providers.entries())
      .sort((a, b) => b[1].topRate - a[1].topRate)
      .map(([provider, info]) => ({ provider, ...info }));
  }, [accounts]);

  const openToAllCount = accounts.regularSavers.filter(
    (a) => a.eligibility === 'open-to-all'
  ).length;

  const toggleProvider = (provider: string) => {
    if (selectedProviders.includes(provider)) {
      onChange(selectedProviders.filter((p) => p !== provider));
    } else {
      onChange([...selectedProviders, provider]);
    }
  };

  const getEligibilityLabel = (eligibility: string) => {
    switch (eligibility) {
      case 'existing-customer':
        return 'Needs current account';
      case 'existing-member':
        return 'Needs membership';
      default:
        return '';
    }
  };

  const getEligibilityColor = (eligibility: string, isSelected: boolean) => {
    if (isSelected) {
      return 'bg-green-600 text-white border-green-600';
    }
    switch (eligibility) {
      case 'existing-customer':
        return 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-amber-400 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20';
      case 'existing-member':
        return 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-red-400 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20';
      default:
        return 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300';
    }
  };

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          🏦 I have accounts with:
        </span>
        {/* Always-active open-to-all indicator */}
        <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700 font-medium">
          ✅ {openToAllCount} open to all
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {gatedProviders.map(({ provider, eligibility, topRate }) => {
          const isSelected = selectedProviders.includes(provider);
          return (
            <button
              key={provider}
              onClick={() => toggleProvider(provider)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${getEligibilityColor(eligibility, isSelected)}`}
            >
              {isSelected ? (
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <span className="text-xs">+</span>
              )}
              <span>{provider}</span>
              <span className="opacity-70 tabular-nums">{topRate}%</span>
              {!isSelected && (
                <span className="hidden sm:inline text-[10px] opacity-60">
                  ({getEligibilityLabel(eligibility)})
                </span>
              )}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
        Select who you bank with to unlock their higher-rate regular savers. Open-to-all accounts are always available.
      </p>
    </div>
  );
}

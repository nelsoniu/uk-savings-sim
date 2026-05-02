'use client';

import { useState } from 'react';
import { AllocationItem, StrategyResult } from '@/types';
import { formatCurrency } from '@/utils/calculations';

interface AllocationInsightsProps {
  allocation: AllocationItem[];
  result: StrategyResult;
  monthlyAmount: number;
}

export function AllocationInsights({ allocation, result, monthlyAmount }: AllocationInsightsProps) {
  const [showShareToast, setShowShareToast] = useState(false);

  if (!allocation || allocation.length === 0) return null;

  // Calculate insights
  const fundedAccounts = allocation.filter(a => a.monthlyAmount > 0);
  const accountsToOpen = fundedAccounts.length;
  const estimatedSetupMins = accountsToOpen * 8; // ~8 mins per account

  // Tax calculation (UK Personal Savings Allowance)
  // Basic rate: £1,000, Higher rate: £500, Additional rate: £0
  const annualInterest = result.estimatedAnnualInterest;
  const psaAllowance = 1000; // Assume basic rate taxpayer
  const psaUsed = Math.min(annualInterest, psaAllowance);
  const psaPercent = Math.round((psaUsed / psaAllowance) * 100);
  const exceedsPSA = annualInterest > psaAllowance;

  // FSCS calculation
  const fscsLimit = 85000;
  const totalYearlyDeposits = monthlyAmount * 12;
  const isFullyProtected = totalYearlyDeposits <= fscsLimit;

  // Baseline comparison (vs typical current account at 0.1%)
  const baselineRate = 0.001; // 0.1%
  const baselineInterest = Math.round(monthlyAmount * 12 * baselineRate * 0.5);
  const extraEarnings = annualInterest - baselineInterest;

  // Monthly interest
  const monthlyInterest = Math.round(annualInterest / 12);

  // Priority accounts (funded, sorted by rate)
  const priorityAccounts = [...fundedAccounts]
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 3);

  // Withdrawal flexibility
  const instantAccessCount = fundedAccounts.filter(a =>
    a.type === 'easyAccess' || a.allowsWithdrawals
  ).length;
  const lockedCount = fundedAccounts.filter(a =>
    a.type === 'regular' && !a.allowsWithdrawals
  ).length;

  const handleShare = async () => {
    const shareText = `My UK Savings Plan:\n` +
      `💰 ${formatCurrency(monthlyAmount)}/mo across ${accountsToOpen} accounts\n` +
      `📈 +${formatCurrency(annualInterest)}/yr interest\n` +
      `🎯 ${formatCurrency(result.tenYearProjectedPot)} projected in 10 years\n\n` +
      `Built with UK Savings Simulator`;

    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
      } catch {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2000);
    }
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Key stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Monthly interest */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 border border-green-100 dark:border-green-800">
          <p className="text-[10px] uppercase tracking-wider text-green-600 dark:text-green-400 font-semibold mb-0.5">
            Monthly Interest
          </p>
          <p className="text-lg font-bold text-green-600 dark:text-green-400 tabular-nums">
            +{formatCurrency(monthlyInterest)}
          </p>
          <p className="text-[10px] text-green-600/70 dark:text-green-400/70">
            {formatCurrency(annualInterest)}/yr
          </p>
        </div>

        {/* Extra vs baseline */}
        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-3 border border-indigo-100 dark:border-indigo-800">
          <p className="text-[10px] uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold mb-0.5">
            vs Current Account
          </p>
          <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
            +{formatCurrency(extraEarnings)}
          </p>
          <p className="text-[10px] text-indigo-600/70 dark:text-indigo-400/70">
            extra per year
          </p>
        </div>

        {/* Setup effort */}
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 border border-amber-100 dark:border-amber-800">
          <p className="text-[10px] uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold mb-0.5">
            Setup Required
          </p>
          <p className="text-lg font-bold text-amber-600 dark:text-amber-400 tabular-nums">
            {accountsToOpen} accounts
          </p>
          <p className="text-[10px] text-amber-600/70 dark:text-amber-400/70">
            ~{estimatedSetupMins} mins total
          </p>
        </div>

        {/* Tax status */}
        <div className={`rounded-xl p-3 border ${
          exceedsPSA
            ? 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800'
            : 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700'
        }`}>
          <p className={`text-[10px] uppercase tracking-wider font-semibold mb-0.5 ${
            exceedsPSA
              ? 'text-red-600 dark:text-red-400'
              : 'text-gray-500 dark:text-gray-400'
          }`}>
            Tax-Free (PSA)
          </p>
          <p className={`text-lg font-bold tabular-nums ${
            exceedsPSA
              ? 'text-red-600 dark:text-red-400'
              : 'text-gray-700 dark:text-gray-300'
          }`}>
            {psaPercent}% used
          </p>
          <p className={`text-[10px] ${
            exceedsPSA
              ? 'text-red-600/70 dark:text-red-400/70'
              : 'text-gray-500 dark:text-gray-400'
          }`}>
            {exceedsPSA ? `£${annualInterest - psaAllowance} taxable` : `£${psaAllowance - psaUsed} remaining`}
          </p>
        </div>
      </div>

      {/* Info badges row */}
      <div className="flex flex-wrap gap-2">
        {/* FSCS badge */}
        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
          isFullyProtected
            ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
            : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
        }`}>
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {isFullyProtected ? 'FSCS Protected (£85k)' : 'Check FSCS limits'}
        </div>

        {/* Withdrawal flexibility */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {instantAccessCount} instant · {lockedCount} locked
        </div>

        {/* Share button */}
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share Plan
        </button>

        {showShareToast && (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">
            Copied to clipboard!
          </span>
        )}
      </div>

      {/* Next steps checklist */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-indigo-100 dark:border-indigo-800">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-gray-900 dark:text-white">
            Next Steps
          </h4>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Open in order of priority
          </span>
        </div>
        <div className="space-y-2">
          {priorityAccounts.map((account, index) => (
            <div
              key={account.provider}
              className="flex items-center gap-3 bg-white dark:bg-gray-800/50 rounded-lg p-2.5"
            >
              <span className="shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300 text-xs font-bold flex items-center justify-center">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {account.provider}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                  {formatCurrency(account.monthlyAmount)}/mo · {account.rate}% rate
                </p>
              </div>
              {account.affiliateUrl && (
                <a
                  href={account.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                >
                  Open
                </a>
              )}
            </div>
          ))}
          {fundedAccounts.length > 3 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center pt-1">
              +{fundedAccounts.length - 3} more accounts below
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

import { AccountsData, StrategyResult, CustomMix, AllocationItem, AllocationOverrides } from '@/types';

// Calculate compound interest for savings accounts
function calculateSavingsGrowth(
  monthlyDeposit: number,
  annualRate: number,
  years: number
): number {
  const monthlyRate = annualRate / 100 / 12;
  let total = 0;

  for (let month = 0; month < years * 12; month++) {
    total = (total + monthlyDeposit) * (1 + monthlyRate);
  }

  return total;
}

// Calculate projected growth for index funds (compound growth)
function calculateIndexGrowth(
  monthlyDeposit: number,
  annualReturn: number,
  years: number
): number {
  const monthlyReturn = annualReturn / 100 / 12;
  let total = 0;

  for (let month = 0; month < years * 12; month++) {
    total = (total + monthlyDeposit) * (1 + monthlyReturn);
  }

  return total;
}

// Get year by year projection
function getYearByYearProjection(
  monthlyDeposit: number,
  regularSaverAmount: number,
  easyAccessAmount: number,
  indexAmount: number,
  accounts: AccountsData,
  years: number = 10
): number[] {
  const projection: number[] = [];

  const avgRegularRate = accounts.regularSavers.reduce((sum, acc) => sum + acc.rate, 0) / accounts.regularSavers.length;
  const easyAccessRate = accounts.defaultEasyAccessRate;
  const indexReturn = accounts.defaultIndexReturn;

  for (let year = 1; year <= years; year++) {
    const regularTotal = calculateSavingsGrowth(regularSaverAmount, avgRegularRate, year);
    const easyAccessTotal = calculateSavingsGrowth(easyAccessAmount, easyAccessRate, year);
    const indexTotal = calculateIndexGrowth(indexAmount, indexReturn, year);

    projection.push(Math.round(regularTotal + easyAccessTotal + indexTotal));
  }

  return projection;
}

// Strategy 1: Optimised Split - fills regular savers first, then easy access
export function calculateOptimisedSplit(
  monthlyAmount: number,
  accounts: AccountsData,
  overrides?: AllocationOverrides
): StrategyResult {
  // Separate pinned accounts (user slider) from unpinned (auto-cascade)
  const sortedRegularSavers = [...accounts.regularSavers].sort((a, b) => b.rate - a.rate);

  const pinnedAmount = accounts.regularSavers.reduce((sum, acc) => {
    if (overrides?.[acc.provider] !== undefined) {
      return sum + Math.min(overrides[acc.provider], acc.monthlyMax);
    }
    return sum;
  }, 0);

  let remainingAfterPinned = Math.max(0, monthlyAmount - pinnedAmount);

  // Build allocation breakdown
  const allocation: AllocationItem[] = [];
  let weightedRateSum = 0;
  let totalRegularAllocated = 0;

  for (const acc of sortedRegularSavers) {
    let allocated: number;
    if (overrides?.[acc.provider] !== undefined) {
      // Pinned: exactly what the user chose (capped to account native max)
      allocated = Math.min(overrides[acc.provider], acc.monthlyMax);
    } else {
      // Unpinned: cascade from remaining budget
      allocated = Math.max(0, Math.min(remainingAfterPinned, acc.monthlyMax));
      remainingAfterPinned -= allocated;
    }

    allocation.push({
      name: acc.name,
      provider: acc.provider,
      monthlyAmount: allocated,
      monthlyMax: acc.monthlyMax,
      nativeMonthlyMax: acc.monthlyMax,
      rate: acc.rate,
      type: 'regular',
      affiliateUrl: acc.affiliateUrl,
      eligibility: acc.eligibility,
      linkedProduct: acc.linkedProduct,
      allowsWithdrawals: acc.allowsWithdrawals,
      allowsSkippedMonths: acc.allowsSkippedMonths,
      bonusNote: acc.bonusNote,
    });

    if (allocated > 0) {
      weightedRateSum += allocated * acc.rate;
      totalRegularAllocated += allocated;
    }
  }

  // Remaining budget goes to easy access (FSCS protected, guaranteed rate)
  const easyAccessRate = accounts.defaultEasyAccessRate;
  const remainingForEasyAccess = Math.max(0, monthlyAmount - totalRegularAllocated);

  // Get easy access account details
  const easyAccessAccount = accounts.easyAccess[0];
  const easyAccessOverride = overrides?.[easyAccessAccount?.provider];
  const easyAccessAmount = easyAccessOverride !== undefined
    ? Math.min(easyAccessOverride, remainingForEasyAccess)
    : remainingForEasyAccess;

  // Add easy access account if there's overflow
  if (easyAccessAccount) {
    allocation.push({
      name: easyAccessAccount.name,
      provider: easyAccessAccount.provider,
      monthlyAmount: easyAccessAmount,
      nativeMonthlyMax: monthlyAmount, // No hard limit, but use budget as reference
      rate: easyAccessRate,
      type: 'easyAccess',
      affiliateUrl: easyAccessAccount.affiliateUrl,
    });
  }

  // Guaranteed deposits per year from actual accepted amounts
  const actualMonthlySaved = totalRegularAllocated + easyAccessAmount;
  const guaranteedDepositsPerYear = actualMonthlySaved * 12;

  // Estimated annual interest (first year)
  const regularInterest = allocation.filter(a => a.type === 'regular').reduce((sum, acc) => sum + (acc.monthlyAmount * 12 * (acc.rate / 100) * 0.5), 0);
  const easyAccessInterest = easyAccessAmount * 12 * (easyAccessRate / 100) * 0.5;
  const estimatedAnnualInterest = Math.round(regularInterest + easyAccessInterest);

  // 1 year projection
  const regularTotal1yr = allocation.filter(a => a.type === 'regular').reduce((sum, acc) => sum + calculateSavingsGrowth(acc.monthlyAmount, acc.rate, 1), 0);
  const easyAccessTotal1yr = calculateSavingsGrowth(easyAccessAmount, easyAccessRate, 1);
  const oneYearProjectedPot = Math.round(regularTotal1yr + easyAccessTotal1yr);

  // 10 year projection
  const regularTotal = allocation.filter(a => a.type === 'regular').reduce((sum, acc) => sum + calculateSavingsGrowth(acc.monthlyAmount, acc.rate, 10), 0);
  const easyAccessTotal = calculateSavingsGrowth(easyAccessAmount, easyAccessRate, 10);
  const tenYearProjectedPot = Math.round(regularTotal + easyAccessTotal);

  // Year by year
  const actualRegularTotal = allocation.filter(a => a.type === 'regular').reduce((s, a) => s + a.monthlyAmount, 0);
  const yearByYearProjection = getYearByYearProjection(
    actualMonthlySaved,
    actualRegularTotal,
    easyAccessAmount,
    0,
    accounts
  );

  // Growth percentages
  const oneYearDeposits = guaranteedDepositsPerYear;
  const tenYearDeposits = guaranteedDepositsPerYear * 10;
  const oneYearGrowthPercent = calculateGrowthPercent(oneYearProjectedPot, oneYearDeposits);
  const tenYearGrowthPercent = calculateGrowthPercent(tenYearProjectedPot, tenYearDeposits);

  return {
    guaranteedDepositsPerYear,
    estimatedAnnualInterest,
    oneYearProjectedPot,
    oneYearGrowthPercent,
    tenYearProjectedPot,
    tenYearGrowthPercent,
    yearByYearProjection,
    allocation,
    actualMonthlySaved,
  };
}

// Strategy 2: One Savings Account - all into Marcus at 4.75%
export function calculateOneSavingsAccount(
  monthlyAmount: number,
  accounts: AccountsData
): StrategyResult {
  const rate = accounts.defaultEasyAccessRate;

  const guaranteedDepositsPerYear = monthlyAmount * 12;
  const estimatedAnnualInterest = Math.round(
    monthlyAmount * 12 * (rate / 100) * 0.5
  );
  const oneYearProjectedPot = Math.round(
    calculateSavingsGrowth(monthlyAmount, rate, 1)
  );
  const tenYearProjectedPot = Math.round(
    calculateSavingsGrowth(monthlyAmount, rate, 10)
  );

  const yearByYearProjection = getYearByYearProjection(
    monthlyAmount,
    0,
    monthlyAmount,
    0,
    accounts
  );

  // Growth percentages
  const oneYearDeposits = guaranteedDepositsPerYear;
  const tenYearDeposits = guaranteedDepositsPerYear * 10;
  const oneYearGrowthPercent = calculateGrowthPercent(oneYearProjectedPot, oneYearDeposits);
  const tenYearGrowthPercent = calculateGrowthPercent(tenYearProjectedPot, tenYearDeposits);

  return {
    guaranteedDepositsPerYear,
    estimatedAnnualInterest,
    oneYearProjectedPot,
    oneYearGrowthPercent,
    tenYearProjectedPot,
    tenYearGrowthPercent,
    yearByYearProjection,
  };
}

// Strategy 3: All Index Fund - all into VWRA at 10% projected
export function calculateAllIndexFund(
  monthlyAmount: number,
  accounts: AccountsData
): StrategyResult {
  const rate = accounts.defaultIndexReturn;

  const guaranteedDepositsPerYear = monthlyAmount * 12;
  const estimatedAnnualInterest = Math.round(
    monthlyAmount * 12 * (rate / 100) * 0.5
  );
  const oneYearProjectedPot = Math.round(
    calculateIndexGrowth(monthlyAmount, rate, 1)
  );
  const tenYearProjectedPot = Math.round(
    calculateIndexGrowth(monthlyAmount, rate, 10)
  );

  const yearByYearProjection = getYearByYearProjection(
    monthlyAmount,
    0,
    0,
    monthlyAmount,
    accounts
  );

  // Growth percentages
  const oneYearDeposits = guaranteedDepositsPerYear;
  const tenYearDeposits = guaranteedDepositsPerYear * 10;
  const oneYearGrowthPercent = calculateGrowthPercent(oneYearProjectedPot, oneYearDeposits);
  const tenYearGrowthPercent = calculateGrowthPercent(tenYearProjectedPot, tenYearDeposits);

  return {
    guaranteedDepositsPerYear,
    estimatedAnnualInterest,
    oneYearProjectedPot,
    oneYearGrowthPercent,
    tenYearProjectedPot,
    tenYearGrowthPercent,
    yearByYearProjection,
  };
}

// Strategy 4: Custom Mix
export function calculateCustomMix(
  monthlyAmount: number,
  mix: CustomMix,
  accounts: AccountsData
): StrategyResult {
  const regularSaverAmount = monthlyAmount * (mix.regularSaverPercent / 100);
  const easyAccessAmount = monthlyAmount * (mix.easyAccessPercent / 100);
  const indexAmount = monthlyAmount * (mix.indexPercent / 100);

  const avgRegularRate =
    accounts.regularSavers.reduce((sum, acc) => sum + acc.rate, 0) /
    accounts.regularSavers.length;
  const easyAccessRate = accounts.defaultEasyAccessRate;
  const indexReturn = accounts.defaultIndexReturn;

  const guaranteedDepositsPerYear = monthlyAmount * 12;

  // First year interest
  const regularInterest = regularSaverAmount * 12 * (avgRegularRate / 100) * 0.5;
  const easyAccessInterest = easyAccessAmount * 12 * (easyAccessRate / 100) * 0.5;
  const indexGain = indexAmount * 12 * (indexReturn / 100) * 0.5;
  const estimatedAnnualInterest = Math.round(
    regularInterest + easyAccessInterest + indexGain
  );

  // 1 year projection
  const regularTotal1yr = calculateSavingsGrowth(regularSaverAmount, avgRegularRate, 1);
  const easyAccessTotal1yr = calculateSavingsGrowth(easyAccessAmount, easyAccessRate, 1);
  const indexTotal1yr = calculateIndexGrowth(indexAmount, indexReturn, 1);
  const oneYearProjectedPot = Math.round(
    regularTotal1yr + easyAccessTotal1yr + indexTotal1yr
  );

  // 10 year projection
  const regularTotal = calculateSavingsGrowth(regularSaverAmount, avgRegularRate, 10);
  const easyAccessTotal = calculateSavingsGrowth(easyAccessAmount, easyAccessRate, 10);
  const indexTotal = calculateIndexGrowth(indexAmount, indexReturn, 10);
  const tenYearProjectedPot = Math.round(
    regularTotal + easyAccessTotal + indexTotal
  );

  const yearByYearProjection = getYearByYearProjection(
    monthlyAmount,
    regularSaverAmount,
    easyAccessAmount,
    indexAmount,
    accounts
  );

  // Growth percentages
  const oneYearDeposits = guaranteedDepositsPerYear;
  const tenYearDeposits = guaranteedDepositsPerYear * 10;
  const oneYearGrowthPercent = calculateGrowthPercent(oneYearProjectedPot, oneYearDeposits);
  const tenYearGrowthPercent = calculateGrowthPercent(tenYearProjectedPot, tenYearDeposits);

  return {
    guaranteedDepositsPerYear,
    estimatedAnnualInterest,
    oneYearProjectedPot,
    oneYearGrowthPercent,
    tenYearProjectedPot,
    tenYearGrowthPercent,
    yearByYearProjection,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Calculate growth percentage
function calculateGrowthPercent(finalValue: number, totalDeposits: number): number {
  if (totalDeposits === 0) return 0;
  return ((finalValue - totalDeposits) / totalDeposits) * 100;
}

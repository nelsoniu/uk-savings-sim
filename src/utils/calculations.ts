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

// Strategy 1: Optimised Split - fills regular savers first, then index fund
export function calculateOptimisedSplit(
  monthlyAmount: number,
  accounts: AccountsData,
  overrides?: AllocationOverrides
): StrategyResult {
  // Calculate total monthly capacity for regular savers applying overrides where applicable
  const totalRegularCapacity = accounts.regularSavers.reduce(
    (sum, acc) => sum + (overrides?.[acc.provider] ?? acc.monthlyMax),
    0
  );

  // How much goes to regular savers vs overflow to index
  const regularSaverAmount = Math.min(monthlyAmount, totalRegularCapacity);
  const indexAmount = Math.max(0, monthlyAmount - totalRegularCapacity);

  // Build allocation breakdown and calculate weighted rate
  const allocation: AllocationItem[] = [];
  let weightedRateSum = 0;
  let remainingToAllocate = regularSaverAmount;

  // Sort by rate descending and allocate
  const sortedRegularSavers = [...accounts.regularSavers].sort((a, b) => b.rate - a.rate);

  for (const acc of sortedRegularSavers) {
    const customMax = overrides?.[acc.provider] ?? acc.monthlyMax;
    const allocated = Math.max(0, Math.min(remainingToAllocate, customMax));

    allocation.push({
      name: acc.name,
      provider: acc.provider,
      monthlyAmount: allocated,
      monthlyMax: customMax,
      nativeMonthlyMax: acc.monthlyMax,
      rate: acc.rate,
      type: 'regular',
    });

    if (allocated > 0) {
      weightedRateSum += allocated * acc.rate;
      remainingToAllocate -= allocated;
    }
  }

  const avgRegularRate = regularSaverAmount > 0 ? weightedRateSum / regularSaverAmount : 0;

  // Add index fund allocation if there's overflow
  let indexAmountActual = 0;
  if (indexAmount > 0) {
    const indexFund = accounts.indexFunds[0];
    const indexCap = overrides?.[indexFund.provider];
    indexAmountActual = indexCap !== undefined ? Math.min(indexAmount, indexCap) : indexAmount;

    // Always render index fund in the allocation list
    allocation.push({
      name: indexFund.name,
      provider: indexFund.provider,
      monthlyAmount: indexAmountActual,
      monthlyMax: indexCap,
      nativeMonthlyMax: monthlyAmount, // Allow slider up to the total original input
      rate: indexFund.projectedReturn,
      type: 'index',
    });
  }

  const indexReturn = accounts.defaultIndexReturn;

  // Guaranteed deposits per year from actual accepted amounts
  const actualMonthlySaved = (regularSaverAmount > 0 ? Array.from(allocation).filter(a => a.type === 'regular').reduce((s, a) => s + a.monthlyAmount, 0) : 0) + indexAmountActual;
  const guaranteedDepositsPerYear = actualMonthlySaved * 12;

  // Estimated annual interest (first year)
  const regularInterest = allocation.filter(a => a.type === 'regular').reduce((sum, acc) => sum + (acc.monthlyAmount * 12 * (acc.rate / 100) * 0.5), 0);
  const indexGain = indexAmountActual * 12 * (indexReturn / 100) * 0.5;
  const estimatedAnnualInterest = Math.round(regularInterest + indexGain);

  // 1 year projection
  const regularTotal1yr = allocation.filter(a => a.type === 'regular').reduce((sum, acc) => sum + calculateSavingsGrowth(acc.monthlyAmount, acc.rate, 1), 0);
  const indexTotal1yr = calculateIndexGrowth(indexAmountActual, indexReturn, 1);
  const oneYearProjectedPot = Math.round(regularTotal1yr + indexTotal1yr);

  // 10 year projection
  const regularTotal = allocation.filter(a => a.type === 'regular').reduce((sum, acc) => sum + calculateSavingsGrowth(acc.monthlyAmount, acc.rate, 10), 0);
  const indexTotal = calculateIndexGrowth(indexAmountActual, indexReturn, 10);
  const tenYearProjectedPot = Math.round(regularTotal + indexTotal);

  // Year by year
  const actualRegularTotal = allocation.filter(a => a.type === 'regular').reduce((s, a) => s + a.monthlyAmount, 0);
  const yearByYearProjection = getYearByYearProjection(
    actualMonthlySaved,
    actualRegularTotal,
    0,
    indexAmountActual,
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

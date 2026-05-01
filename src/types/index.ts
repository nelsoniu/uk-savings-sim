export interface RegularSaver {
  id: string;
  name: string;
  provider: string;
  rate: number;
  monthlyMax: number;
  annualMax: number;
  term: number;
  requirements: string;
  affiliateUrl: string;
}

export interface EasyAccessAccount {
  id: string;
  name: string;
  provider: string;
  rate: number;
  minDeposit: number;
  maxBalance: number | null;
  requirements: string;
  affiliateUrl: string;
}

export interface IndexFund {
  id: string;
  name: string;
  fullName: string;
  provider: string;
  projectedReturn: number;
  expenseRatio: number;
  description: string;
  affiliateUrl: string;
}

export interface AccountsData {
  lastUpdated: string;
  regularSavers: RegularSaver[];
  easyAccess: EasyAccessAccount[];
  indexFunds: IndexFund[];
  defaultEasyAccessRate: number;
  defaultIndexReturn: number;
}

export type AllocationOverrides = { [provider: string]: number };

export interface AllocationItem {
  name: string;
  provider: string;
  monthlyAmount: number;
  monthlyMax?: number;
  nativeMonthlyMax?: number;
  rate: number;
  type: 'regular' | 'easyAccess' | 'index';
}

export interface StrategyResult {
  guaranteedDepositsPerYear: number;
  estimatedAnnualInterest: number;
  oneYearProjectedPot: number;
  oneYearGrowthPercent: number;
  tenYearProjectedPot: number;
  tenYearGrowthPercent: number;
  yearByYearProjection: number[];
  allocation?: AllocationItem[];
  actualMonthlySaved?: number;
}

export interface CustomMix {
  regularSaverPercent: number;
  easyAccessPercent: number;
  indexPercent: number;
}

export type StrategyType = 'optimised' | 'oneSavings' | 'allIndex' | 'custom';

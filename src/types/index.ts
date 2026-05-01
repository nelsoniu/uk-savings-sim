export type EligibilityType = 'open-to-all' | 'existing-customer' | 'existing-member';
export type RateType = 'fixed' | 'variable';
export type InterestPayout = 'monthly' | 'annually' | 'daily' | 'on-maturity';

export interface RegularSaver {
  id: string;
  name: string;
  provider: string;
  rate: number;
  rateType: RateType;
  interestPayout: InterestPayout;
  monthlyMax: number;
  annualMax: number;
  term: number;
  eligibility: EligibilityType;
  linkedProduct?: string;
  allowsWithdrawals: boolean;
  allowsSkippedMonths: boolean;
  requirements: string;
  affiliateUrl: string;
  bonusNote?: string;
}

export interface EasyAccessAccount {
  id: string;
  name: string;
  provider: string;
  rate: number;
  rateType: RateType;
  interestPayout: InterestPayout;
  minDeposit: number;
  maxBalance: number | null;
  eligibility: EligibilityType;
  linkedProduct?: string;
  requirements: string;
  bonusNote?: string;
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
  affiliateUrl?: string;
  eligibility?: EligibilityType;
  linkedProduct?: string;
  allowsWithdrawals?: boolean;
  allowsSkippedMonths?: boolean;
  bonusNote?: string;
  interestPayout?: InterestPayout;
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

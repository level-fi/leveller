export type QueryResult<T> = {
  data: T;
  message: string;
};

export interface TradingInfo {
  totalTrading: number;
  totalPnl: number;
  totalNetProfit: number;
  totalFee: number;
}

export interface WalletInfo {
  votingPower: bigint;
  lvlBalance: bigint;
}

export interface LiquidityInfo {
  amount: bigint;
  value: bigint;
  rewardAmount: bigint;
  rewardValue: bigint;
}

export interface StakingInfo {
  stakeAmount: bigint;
  claimableStakeRewardAmount: bigint;
  lvlStakeAmount: bigint;
  claimableLvlStakeRewardAmount: bigint;
  lgoStakeAmount: bigint;
  claimableLgoStakeRewardAmount: bigint;
  slpPrice: bigint;
  lvlPrice: bigint;
  lgoRedeemPrice: bigint;
  lgoIntrinsicPrice: bigint;
}

export interface LoyaltyInfo {
  balance: bigint;
  estimatedRewardAmount: bigint;
  totalRewardAmount: bigint;
}

export interface LoyaltyInfoHistory {
  allocatedTime: number;
  balance: bigint;
  rewardAmount: bigint;
}

export interface ReferralInfo {
  referralPoint: bigint;
  tradingPoint: bigint;
  referrer: string;
  referralTier: number;
  tradeTier: number;
  referrerTierInfo: TierInfo;
  userTierInfo: TierInfo;
  totalRewardAmount: bigint;
  referralRewardAmount: bigint;
  tradingRewardAmount: bigint;
}

export interface ReferralInfoHistory {
  epoch: number;
  allocatedTime: number;
  referralTier: number;
  referralPoint: bigint;
  tradeTier: number;
  tradingPoint: bigint;
  reward: bigint;
}

export interface TierInfo {
  minTrader: number;
  minEpochReferralPoint: bigint;
  discountForTrader: bigint;
  rebateForReferrer: bigint;
}

export interface TopLPInfo {
  wallet: string;
  slpAmount: number;
  mlpAmount: number;
  jlpAmount: number;
  totalValue: number;
  rewardAmount: number;
}

export interface TopLVLHolderInfo {
  wallet: string;
  totalAmount: number;
  walletAmount: number;
  daoStakingAmount: number;
  lvlStakingAmount: number;
}

export interface TopLGOHolderInfo {
  wallet: string;
  totalAmount: number;
  walletAmount: number;
  stakingAmount: number;
}

export interface TopLyLvlReceiverInfo {
  wallet: string;
  rewardAmount: number;
}

export interface TopReferralInfo {
  wallet: string;
  rewardAmount: number;
}

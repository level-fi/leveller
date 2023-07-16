export type ChainConfig = {
  chainId: number;
  chainName: string;
  etherscanName: string;
  rpcUrl: string;
  multicall: string;
  terminalApi: string;
  analyticsApi: string;
  v2Api: string;
  explorerUrl: string;
  rewardToken: string;
  governanceToken: string;
  loyaltyToken: string;
  incentiveController: string;
  staking: {
    dao: string;
    votingPowerView: string;
    lvlStaking: string;
    lgoStaking: string;
    stakingView: string;
  };
  treasury: {
    address: string;
    treasuryReserve: string;
    auctionTreasury: string;
  };
  referral: ReferralConfig;
  tranches: TrancheConfig[];
  pool: string;
  minichef: string;
  tokens: {
    [symbol: string]: TokenInfo;
  };
};

export type TokenInfo = {
  symbol?: string;
  address: string;
  name?: string;
  shortName?: string;
  decimals: number;
  logo?: string;
  threshold?: number;
  priceThreshold?: number;
  fractionDigits?: number;
  priceFractionDigits?: number;
};

export type TokenInfoProps = TokenInfo & {
  symbol: string;
};

export type TrancheConfig = {
  id: number;
  address: string;
  name: string;
  lp: string;
  slug: string;
};

export type ReferralConfig = {
  registry: string;
  histories: {
    startEpoch: number;
    numberOfTier: number;
    controller: string;
    oracle: string;
    active: boolean;
  }[];
};

import { JsonRpcProvider } from 'ethers';
import { config } from '../config';
import {
  LiquidityInfo,
  LoyaltyInfo,
  LoyaltyInfoHistory,
  ReferralInfo,
  ReferralInfoHistory,
  StakingInfo,
  TierInfo,
  TopLGOHolderInfo,
  TopLPInfo,
  TopLVLHolderInfo,
  TopLyLvlReceiverInfo,
  TopReferralInfo,
  TradingInfo,
  WalletInfo,
} from '../models';
import { ProtocolTokenResponseSchema, TreasuryResponseSchema } from '../models/Treasury';
import { isAddress } from './addresses';
import { Precision } from './constant';
import { Call, createMulticall } from './multicall';

const rpcProvider = new JsonRpcProvider(config.rpcUrl);

const multicall = createMulticall(rpcProvider, config.multicall);

export const QUERY_TREASURY = () => {
  return {
    queryKey: ['treasury'],
    enabled: true,
    queryFn: async () => {
      const res = await fetch(`${config.v2Api}/treasury`);
      if (!res.ok) {
        throw new Error(await res.text());
      }

      const parsed = TreasuryResponseSchema.parse(await res.json());
      return parsed;
    },
    refetchInterval: 60000,
  };
};

export const QUERY_PROTOCOL_TOKENS = () => {
  return {
    queryKey: ['protocol_tokens'],
    enabled: true,
    queryFn: async () => {
      const res = await fetch(`${config.v2Api}/token`);
      if (!res.ok) {
        throw new Error(await res.text());
      }

      const parsed = ProtocolTokenResponseSchema.parse(await res.json());
      return parsed;
    },
    refetchInterval: 60000,
  };
};

export const QUERY_TRADING_INFO = (account: string) => ({
  queryKey: ['fetch', 'trading', account],
  enable: !!account && isAddress(account),
  queryFn: async () => {
    const res = await fetch(`${config.terminalApi}/accounts/${account}`);
    if (!res.ok) {
      throw new Error('API request failed');
    }
    const data = await res.json();
    return {
      totalTrading: data?.data?.totalTrading || 0,
      totalPnl: data?.data?.totalPnl || 0,
      totalNetProfit: data?.data?.totalNetProfit || 0,
      totalFee: data?.data?.totalFee || 0,
    } as TradingInfo;
  },
});

export const QUERY_WALLET_INFO = (wallet: string) => ({
  queryKey: ['fetch', 'wallet', wallet],
  enable: !!wallet && isAddress(wallet),
  queryFn: async () => {
    const lvl = config.tokens.LVL;

    const calls: Call[] = [
      {
        target: lvl.address,
        signature: 'balanceOf(address) returns (uint256)',
        params: [wallet],
      },
      {
        target: config.staking.votingPowerView,
        signature: 'balanceOf(address) returns (uint256)',
        params: [wallet],
      },
    ];

    const res = await multicall(calls);

    const [[lvlBalance], [votingPower]] = res;

    return {
      lvlBalance,
      votingPower,
    } as WalletInfo;
  },
});

export const QUERY_LIQUIDITY_INFO = (wallet: string) => ({
  queryKey: ['fetch', 'liquidity', wallet],
  enable: !!wallet && isAddress(wallet),
  queryFn: async () => {
    const LVL_BNB_LP = config.tokens.LVL_BNB_LP;
    const USDT_BNB_LP = config.tokens.USDT_BNB_LP;
    const USDT = config.tokens.USDT;
    const LVL = config.tokens.LVL;
    const WBNB = config.tokens.WBNB;
    const calls = [
      ...[
        {
          target: USDT.address,
          signature: 'balanceOf(address) returns (uint256 amount)',
          params: [USDT_BNB_LP.address],
        },
        {
          target: WBNB.address,
          signature: 'balanceOf(address) returns (uint256 amount)',
          params: [USDT_BNB_LP.address],
        },
        {
          target: WBNB.address,
          signature: 'balanceOf(address) returns (uint256 amount)',
          params: [LVL_BNB_LP.address],
        },
        {
          target: LVL.address,
          signature: 'balanceOf(address) returns (uint256 amount)',
          params: [LVL_BNB_LP.address],
        },
      ],
      ...config.tranches.flatMap((tranche) => [
        {
          target: config.minichef,
          signature: 'userInfo(uint256,address) returns (uint256 amount, int256 rewardDebt)',
          params: [tranche.id, wallet],
        },
        {
          target: tranche.address,
          signature: 'balanceOf(address) returns (uint256)',
          params: [wallet],
        },
        {
          target: config.minichef,
          signature: 'pendingReward(uint256,address) returns (uint256)',
          params: [tranche.id, wallet],
        },
        {
          target: config.pool,
          signature: 'getTrancheValue(address,bool) returns (uint256 amount)',
          params: [tranche.address, true],
        },
        {
          target: config.pool,
          signature: 'getTrancheValue(address,bool) returns (uint256 amount)',
          params: [tranche.address, false],
        },
        {
          target: tranche.address,
          signature: 'totalSupply() returns (uint256 amount)',
          params: [],
        },
      ]),
    ];

    const [
      [usdtBalanceInStableLp],
      [bnbBalanceInStableLp],
      [bnbBalanceInNativeLp],
      [lvlBalanceInNativeLp],
      ...trancheResponse
    ] = await multicall(calls);

    const lvlPrice =
      (BigInt(1e30) * usdtBalanceInStableLp * bnbBalanceInNativeLp) /
      lvlBalanceInNativeLp /
      bnbBalanceInStableLp /
      BigInt(1e18);

    const pairs = Object.fromEntries(
      config.tranches.map((tranche, i) => {
        const [[depositAmount], [walletBalance], [rewardAmount], [minTrancheValue], [maxTrancheValue], [llpSupply]] =
          trancheResponse.slice(6 * i, 6 * (i + 1));
        return [
          tranche.address,
          {
            amount: depositAmount + walletBalance,
            rewardAmount,
            rewardValue: rewardAmount * lvlPrice,
            value:
              ((BigInt(depositAmount) + BigInt(walletBalance)) * (minTrancheValue + maxTrancheValue)) /
              (2n * llpSupply),
          } as LiquidityInfo,
        ];
      }),
    );

    return pairs;
  },
});

export const QUERY_STAKING_INFO = (wallet: string) => ({
  queryKey: ['fetch', 'staking', wallet],
  enable: !!wallet && isAddress(wallet),
  queryFn: async () => {
    const SLP = config.tokens.SLP;
    const LVL_BNB_LP = config.tokens.LVL_BNB_LP;
    const USDT_BNB_LP = config.tokens.USDT_BNB_LP;
    const LVL_USDT_LP = config.tokens.LVL_USDT_LP;
    const USDT = config.tokens.USDT;
    const LVL = config.tokens.LVL;
    const WBNB = config.tokens.WBNB;

    const calls: Call[] = [
      {
        target: config.staking.dao,
        signature: 'userInfo(address) returns (uint256 amount, int256 rewardDebt, uint256 cooldowns)',
        params: [wallet],
      },
      {
        target: config.staking.dao,
        signature: 'pendingReward(address) returns (uint256 amount)',
        params: [wallet],
      },
      {
        target: config.staking.lvlStaking,
        signature: 'userInfo(address) returns (uint256 amount, int256 rewardDebt)',
        params: [wallet],
      },
      {
        target: config.staking.lvlStaking,
        signature: 'pendingRewards(address) returns (uint256 amount)',
        params: [wallet],
      },
      {
        target: config.staking.lgoStaking,
        signature: 'userInfo(address) returns (uint256 amount, int256 rewardDebt)',
        params: [wallet],
      },
      {
        target: config.staking.lgoStaking,
        signature: 'pendingRewards(address) returns (uint256 amount)',
        params: [wallet],
      },
      {
        target: config.pool,
        signature: 'getTrancheValue(address,bool) returns (uint256 amount)',
        params: [SLP.address, true],
      },
      {
        target: config.pool,
        signature: 'getTrancheValue(address,bool) returns (uint256 amount)',
        params: [SLP.address, false],
      },
      {
        target: SLP.address,
        signature: 'totalSupply() returns (uint256 amount)',
        params: [],
      },
      {
        target: USDT.address,
        signature: 'balanceOf(address) returns (uint256 amount)',
        params: [USDT_BNB_LP.address],
      },
      {
        target: WBNB.address,
        signature: 'balanceOf(address) returns (uint256 amount)',
        params: [USDT_BNB_LP.address],
      },
      {
        target: WBNB.address,
        signature: 'balanceOf(address) returns (uint256 amount)',
        params: [LVL_BNB_LP.address],
      },
      {
        target: LVL.address,
        signature: 'balanceOf(address) returns (uint256 amount)',
        params: [LVL_BNB_LP.address],
      },
    ];

    const res = await multicall(calls);

    const [
      [stakeAmount],
      [claimableStakeRewardAmount],
      [lvlStakeAmount],
      [claimableLvlStakeRewardAmount],
      [lgoStakeAmount],
      [claimableLgoStakeRewardAmount],
      [maxSeniorTrancheValue],
      [minSeniorTrancheValue],
      [seniorTrancheSupply],
      [usdtBalanceInStableLp],
      [bnbBalanceInStableLp],
      [bnbBalanceInNativeLp],
      [lvlBalanceInNativeLp],
    ] = res;

    const slpPrice = (maxSeniorTrancheValue + minSeniorTrancheValue) / (2n * seniorTrancheSupply);
    const lvlPrice =
      (BigInt(1e30) * usdtBalanceInStableLp * bnbBalanceInNativeLp) /
      lvlBalanceInNativeLp /
      bnbBalanceInStableLp /
      BigInt(1e18);

    return {
      stakeAmount,
      claimableStakeRewardAmount,
      lvlStakeAmount,
      claimableLvlStakeRewardAmount,
      lgoStakeAmount,
      claimableLgoStakeRewardAmount,
      slpPrice,
      lvlPrice,
    } as StakingInfo;
  },
});

export const QUERY_LOYALTY_INFO = (wallet: string) => ({
  queryKey: ['fetch', 'loyalty', wallet],
  enable: !!wallet && isAddress(wallet),
  queryFn: async () => {
    const lyLvl = config.tokens.LY_LVL;
    const incentiveController = config.incentiveController;
    const [[lyLvlBalance], [totalSupply], [loyaltyCap], [currentBatchId]] = await multicall([
      {
        target: lyLvl.address,
        signature: 'balanceOf(address) returns (uint256)',
        params: [wallet],
      },
      {
        target: lyLvl.address,
        signature: 'totalSupply() returns (uint256)',
        params: [],
      },
      {
        target: incentiveController,
        signature: 'AMOUNT_LOYALTY_REWARD() returns (uint256)',
        params: [],
      },
      {
        target: lyLvl.address,
        signature: 'currentBatchId() returns (uint256)',
        params: [],
      },
    ]);

    const calls: Call[][] = Array.from({ length: Number(currentBatchId) }, (_, index) => [
      {
        target: lyLvl.address,
        signature: 'batches(uint256) returns (uint256,uint256,uint256)',
        params: [index],
      },
      {
        target: lyLvl.address,
        signature: '_balances(uint256, address) returns (uint256)',
        params: [index, wallet],
      },
    ]);

    const response = await multicall(calls.flat());

    const totalRewardAmount = calls.reduce(
      (acc, _, i) => acc + (BigInt(response[2 * i + 1][0]) * response[2 * i][0]) / Precision,
      0n,
    );

    const estimatedReward = totalSupply > 0 ? (lyLvlBalance * loyaltyCap) / totalSupply : 0n;

    return {
      balance: lyLvlBalance,
      estimatedReward,
      totalRewardAmount,
    } as LoyaltyInfo;
  },
});

export const QUERY_LOYALTY_INFO_HISTORY = (wallet: string) => ({
  queryKey: ['fetch', 'loyalty', 'history', wallet],
  enable: !!wallet && isAddress(wallet),
  queryFn: async () => {
    const lyLvl = config.tokens.LY_LVL;
    const [[currentBatchId]] = await multicall([
      {
        target: lyLvl.address,
        signature: 'currentBatchId() returns (uint256)',
        params: [],
      },
    ]);

    const calls: Call[][] = Array.from({ length: Number(currentBatchId) }, (_, index) => [
      {
        target: lyLvl.address,
        signature: 'batches(uint256) returns (uint256,uint256,uint256)',
        params: [index],
      },
      {
        target: lyLvl.address,
        signature: '_balances(uint256, address) returns (uint256)',
        params: [index, wallet],
      },
    ]);

    const response = (await multicall(calls.flat())) as bigint[][];

    return calls
      .map<LoyaltyInfoHistory>((_, i) => ({
        allocatedTime: Number(response[2 * i][2]),
        balance: response[2 * i + 1][0],
        rewardAmount: (response[2 * i + 1][0] * response[2 * i][0]) / Precision,
      }))
      .filter((r) => r.rewardAmount > 0)
      .reverse();
  },
});

export const QUERY_REFERRAL_INFO = (wallet: string) => ({
  queryKey: ['fetch', 'referral', wallet],
  enable: !!wallet && isAddress(wallet),
  queryFn: async () => {
    const lvl = config.tokens.LVL;
    const activeReferral = config.referral.histories.find((r) => r.active);
    const inActiveReferral = config.referral.histories.find((r) => !r.active);
    const registry = config.referral.registry;
    const [[currentEpochId], [referrer], ...tiersInfo] = await multicall([
      {
        target: activeReferral.controller,
        signature: 'currentEpoch() returns (uint256)',
        params: [],
      },
      {
        target: registry,
        signature: 'referredBy(address) returns (address)',
        params: [wallet],
      },
      ...Array.from({ length: activeReferral.numberOfTier }, (_, index) => ({
        target: activeReferral.controller,
        signature: 'tiers(uint256) returns (uint256, uint256, uint256, uint256)',
        params: [index],
      })),
    ]);

    const tiers = tiersInfo.map(
      (t) =>
        ({
          minTrader: Number(t[0]),
          minEpochReferralPoint: t[1],
          discountForTrader: t[2],
          rebateForReferrer: t[3],
        } as TierInfo),
    );

    const calls: Call[] = [
      {
        target: activeReferral.controller,
        signature: 'users(uint256,address) returns (uint256, uint256, uint256, uint256)',
        params: [currentEpochId, wallet],
      },
      {
        target: activeReferral.controller,
        signature: 'users(uint256,address) returns (uint256, uint256, uint256, uint256)',
        params: [currentEpochId, referrer],
      },
      {
        target: activeReferral.oracle,
        signature: 'getCurrentTWAP() returns (uint256)',
        params: [],
      },
    ];

    const res = await multicall(calls);

    const [[referralTier, tradingPoint, referralPoint], [tradeTier], [currentTwap]] = res;

    const referrerTierInfo = tiers[Number(tradeTier)];

    const userTierInfo = tiers[Number(referralTier)];

    const inActiveReferralTierCalls: Call[][] = Array.from({ length: activeReferral.startEpoch }, (_, index) => [
      {
        target: inActiveReferral.controller,
        signature: 'getUserTier(uint256,address) returns (uint256)',
        params: [index, wallet],
      },
      {
        target: inActiveReferral.controller,
        signature: 'getUserTier(uint256,address) returns (uint256)',
        params: [index, referrer],
      },
      {
        target: inActiveReferral.controller,
        signature: 'users(uint256,address) returns (uint256, uint256, uint256)',
        params: [index, wallet],
      },
      {
        target: inActiveReferral.controller,
        signature: 'epochs(uint256) returns (uint256, uint256)',
        params: [index],
      },
    ]);

    const inActiveReferralTierResponse = (await multicall(inActiveReferralTierCalls.flat())) as bigint[][];

    const inActiveWalletReferralReward = inActiveReferralTierCalls.map((_, i) => {
      const referrerTier = tiers[Number(inActiveReferralTierResponse[4 * i + 1][0])];
      const userTier = tiers[Number(inActiveReferralTierResponse[4 * i][0])];
      const referralPoint = inActiveReferralTierResponse[4 * i + 2][1];
      const tradingPoint = inActiveReferralTierResponse[4 * i + 2][0];
      const twap = inActiveReferralTierResponse[4 * i + 3][0];
      const allocatedTime = Number(inActiveReferralTierResponse[4 * i + 3][1]);
      const reward =
        (referralPoint * userTier.rebateForReferrer + tradingPoint * referrerTier.discountForTrader) / twap / Precision;
      return reward;
    });

    const activeReferralTierCalls: Call[][] = Array.from(
      { length: Number(currentEpochId) - activeReferral.startEpoch },
      (_, index) => [
        {
          target: activeReferral.controller,
          signature: 'users(uint256,address) returns (uint256, uint256, uint256, uint256)',
          params: [index + activeReferral.startEpoch, wallet],
        },
        {
          target: activeReferral.controller,
          signature: 'users(uint256,address) returns (uint256, uint256, uint256, uint256)',
          params: [index + activeReferral.startEpoch, referrer],
        },
        {
          target: activeReferral.controller,
          signature: 'epochs(uint256) returns (uint256, uint256, uint256)',
          params: [index + activeReferral.startEpoch],
        },
      ],
    );

    const activeReferralTierResponse = (await multicall(activeReferralTierCalls.flat())) as bigint[][];

    const activeWalletReferralReward = activeReferralTierCalls.map((_, i) => {
      const referrerTier = tiers[Number(activeReferralTierResponse[3 * i + 1][0])];
      const userTier = tiers[Number(activeReferralTierResponse[3 * i][0])];
      const referralPoint = activeReferralTierResponse[3 * i][2];
      const tradingPoint = activeReferralTierResponse[3 * i][1];
      const twap = activeReferralTierResponse[3 * i + 2][0];
      const reward =
        (referralPoint * userTier.rebateForReferrer + tradingPoint * referrerTier.discountForTrader) / twap / Precision;
      return reward;
    });

    const totalRewardAmount = inActiveWalletReferralReward
      .concat(activeWalletReferralReward)
      .reduce((acc, curr) => acc + curr, 0n);

    return {
      referralPoint,
      tradingPoint,
      userTierInfo,
      referrerTierInfo,
      referrer,
      referralTier: Number(referralTier),
      tradeTier: Number(tradeTier),
      referralRewardAmount: (referralPoint * userTierInfo?.rebateForReferrer) / currentTwap / Precision,
      tradingRewardAmount: (tradingPoint * referrerTierInfo?.discountForTrader) / currentTwap / Precision,
      totalRewardAmount,
    } as ReferralInfo;
  },
});

export const QUERY_REFERRAL_INFO_HISTORY = (wallet: string) => ({
  queryKey: ['fetch', 'referral', 'history', wallet],
  enable: !!wallet && isAddress(wallet),
  queryFn: async () => {
    const activeReferral = config.referral.histories.find((r) => r.active);
    const inActiveReferral = config.referral.histories.find((r) => !r.active);
    const registry = config.referral.registry;
    const [[currentEpochId], [referrer], ...tiersInfo] = await multicall([
      {
        target: activeReferral.controller,
        signature: 'currentEpoch() returns (uint256)',
        params: [],
      },
      {
        target: registry,
        signature: 'referredBy(address) returns (address)',
        params: [wallet],
      },
      ...Array.from({ length: activeReferral.numberOfTier }, (_, index) => ({
        target: activeReferral.controller,
        signature: 'tiers(uint256) returns (uint256, uint256, uint256, uint256)',
        params: [index],
      })),
    ]);

    const tiers = tiersInfo.map(
      (t) =>
        ({
          minTrader: Number(t[0]),
          minEpochReferralPoint: t[1],
          discountForTrader: t[2],
          rebateForReferrer: t[3],
        } as TierInfo),
    );

    const inActiveReferralTierCalls: Call[][] = Array.from({ length: activeReferral.startEpoch }, (_, index) => [
      {
        target: inActiveReferral.controller,
        signature: 'getUserTier(uint256,address) returns (uint256)',
        params: [index, wallet],
      },
      {
        target: inActiveReferral.controller,
        signature: 'getUserTier(uint256,address) returns (uint256)',
        params: [index, referrer],
      },
      {
        target: inActiveReferral.controller,
        signature: 'users(uint256,address) returns (uint256, uint256, uint256)',
        params: [index, wallet],
      },
      {
        target: inActiveReferral.controller,
        signature: 'epochs(uint256) returns (uint256, uint256)',
        params: [index],
      },
    ]);

    const inActiveReferralTierResponse = (await multicall(inActiveReferralTierCalls.flat())) as bigint[][];

    const inActiveWalletReferralInfo = inActiveReferralTierCalls.map((_, i) => {
      const referrerTier = tiers[Number(inActiveReferralTierResponse[4 * i + 1][0])];
      const userTier = tiers[Number(inActiveReferralTierResponse[4 * i][0])];
      const referralPoint = inActiveReferralTierResponse[4 * i + 2][1];
      const tradingPoint = inActiveReferralTierResponse[4 * i + 2][0];
      const twap = inActiveReferralTierResponse[4 * i + 3][0];
      const allocatedTime = Number(inActiveReferralTierResponse[4 * i + 3][1]);
      const reward =
        (referralPoint * userTier.rebateForReferrer + tradingPoint * referrerTier.discountForTrader) / twap / Precision;
      return {
        epoch: i,
        allocatedTime,
        referralTier: Number(inActiveReferralTierResponse[4 * i][0]),
        tradeTier: Number(inActiveReferralTierResponse[4 * i + 1][0]),
        referralPoint,
        tradingPoint,
        reward,
      } as ReferralInfoHistory;
    });

    const activeReferralTierCalls: Call[][] = Array.from(
      { length: Number(currentEpochId) - activeReferral.startEpoch },
      (_, index) => [
        {
          target: activeReferral.controller,
          signature: 'users(uint256,address) returns (uint256, uint256, uint256, uint256)',
          params: [index + activeReferral.startEpoch, wallet],
        },
        {
          target: activeReferral.controller,
          signature: 'users(uint256,address) returns (uint256, uint256, uint256, uint256)',
          params: [index + activeReferral.startEpoch, referrer],
        },
        {
          target: activeReferral.controller,
          signature: 'epochs(uint256) returns (uint256, uint256, uint256)',
          params: [index + activeReferral.startEpoch],
        },
      ],
    );

    const activeReferralTierResponse = (await multicall(activeReferralTierCalls.flat())) as bigint[][];

    const activeWalletReferralInfo = activeReferralTierCalls.map((_, i) => {
      const referrerTier = tiers[Number(activeReferralTierResponse[3 * i + 1][0])];
      const userTier = tiers[Number(activeReferralTierResponse[3 * i][0])];
      const referralPoint = activeReferralTierResponse[3 * i][2];
      const tradingPoint = activeReferralTierResponse[3 * i][1];
      const twap = activeReferralTierResponse[3 * i + 2][0];
      const allocatedTime = Number(activeReferralTierResponse[3 * i + 2][1]);
      const reward =
        (referralPoint * userTier.rebateForReferrer + tradingPoint * referrerTier.discountForTrader) / twap / Precision;
      return {
        epoch: i + activeReferral.startEpoch,
        allocatedTime,
        referralTier: Number(activeReferralTierResponse[3 * i][0]),
        tradeTier: Number(activeReferralTierResponse[3 * i + 1][0]),
        referralPoint,
        tradingPoint,
        reward,
      } as ReferralInfoHistory;
    });

    return inActiveWalletReferralInfo
      .concat(activeWalletReferralInfo)
      .filter((r) => r.reward > 0)
      .reverse();
  },
});

export const QUERY_TOP_LP_INFO = () => ({
  queryKey: ['fetch', 'top-lp'],
  queryFn: async () => {
    const res = await fetch(`${config.analyticsApi}/top-llp-holders`);
    if (!res.ok) {
      throw new Error('API request failed');
    }
    const data = await res.json();
    return data?.map((r) => ({
      wallet: r?.wallet,
      slpAmount: r?.slp_amount,
      mlpAmount: r?.mlp_amount,
      jlpAmount: r?.jlp_amount,
      totalValue: r?.total_value,
      rewardAmount: r?.reward_amount,
    })) as TopLPInfo[];
  },
});

export const QUERY_TOP_LVL_HOLDER_INFO = () => ({
  queryKey: ['fetch', 'top-lvl-holder'],
  queryFn: async () => {
    const lvl = config.tokens.LVL;
    const res = await fetch(`${config.analyticsApi}/top-lvl-holders`);
    if (!res.ok) {
      throw new Error('API request failed');
    }
    const data = await res.json();
    return data?.map((r) => ({
      wallet: r?.address,
      totalAmount: r?.total,
      daoStakingAmount: r?.dao_staking,
      lvlStakingAmount: r?.lvl_staking,
      walletAmount: r?.wallet,
    })) as TopLVLHolderInfo[];
  },
});

export const QUERY_TOP_LGO_HOLDER_INFO = () => ({
  queryKey: ['fetch', 'top-lgo-holder'],
  queryFn: async () => {
    const lgo = config.tokens.LGO;
    const res = await fetch(`${config.analyticsApi}/top-lgo-holders`);
    if (!res.ok) {
      throw new Error('API request failed');
    }
    const data = await res.json();
    return data?.map((r) => ({
      wallet: r?.address,
      totalAmount: r?.total,
      stakingAmount: r?.lgo_staking,
      walletAmount: r?.wallet,
    })) as TopLGOHolderInfo[];
  },
});

export const QUERY_TOP_LY_LVL_RECEIVER_INFO = () => ({
  queryKey: ['fetch', 'top-ly-lvl-receivers'],
  queryFn: async () => {
    const lvl = config.tokens.LVL;
    const res = await fetch(`${config.analyticsApi}/top-ly-lvl-receivers`);
    if (!res.ok) {
      throw new Error('API request failed');
    }
    const data = await res.json();
    return data?.map((r) => ({
      wallet: r?.address,
      rewardAmount: r?.amount,
    })) as TopLyLvlReceiverInfo[];
  },
});

export const QUERY_TOP_REFERRER_INFO = () => ({
  queryKey: ['fetch', 'top-referrer'],
  queryFn: async () => {
    const lvl = config.tokens.LVL;
    const res = await fetch(`${config.analyticsApi}/top-referrers`);
    if (!res.ok) {
      throw new Error('API request failed');
    }
    const data = await res.json();
    return data?.map((r) => ({
      wallet: r?.address,
      rewardAmount: r?.reward,
    })) as TopReferralInfo[];
  },
});

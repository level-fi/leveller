import { ChainConfig } from './type';

export const Config: ChainConfig = {
  chainId: 56,
  chainName: 'BNB Chain',
  etherscanName: 'BscScan',
  rpcUrl: 'https://bsc-dataseed1.binance.org/',
  explorerUrl: 'https://bscscan.com',
  multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
  terminalApi: 'https://terminal-api.level.finance/v7',
  analyticsApi: 'https://stats-api.level.finance',
  v2Api: 'https://api.level.finance/v2',
  pool: '0xA5aBFB56a78D2BD4689b25B8A77fd49Bb0675874',
  minichef: '0x5aE081b6647aEF897dEc738642089D4BDa93C0e7',
  rewardToken: 'LVL',
  governanceToken: 'LGO',
  loyaltyToken: 'LY_LVL',
  incentiveController: '0x2Ed6ceD074B2E822d3Afc1949A4433Bf4654A43A',
  staking: {
    dao: '0x87CC04d6FE59859cB7eB6d970EBc22dCdCBc9368',
    lvlStaking: '0x08A12FFedf49fa5f149C73B07E31f99249e40869',
    lgoStaking: '0xe5f3b669fd58AF914111759da054f3029734678C',
    votingPowerView: '0x4aa34261769BA17FAA10B99BaCF63Baca4238205',
    stakingView: '0x8e532B2dBa81C4474e1ee2e0a35cd25347f2ad3B',
  },
  treasury: {
    address: '0x8BFf27E9Fa1C28934554e6B5239Fb52776573619',
    treasuryReserve: '0xB07953F23545796710957faec97F05B21146AC2d',
    auctionTreasury: '0x712A2e08C67cD7153f04FdB3037d4696300921d0',
  },
  referral: {
    registry: '0x4980c82cF6A4bf0A3265985d4bC01120A0C6bb22',
    histories: [
      {
        startEpoch: 0,
        numberOfTier: 4,
        controller: '0x22E7F559bE09B6A758F02A84dDC64f45642206a1',
        oracle: '0xf4bd28b3f29f910c3519382f8aedc8d60b98301a',
        active: false,
      },
      {
        startEpoch: 4,
        numberOfTier: 4,
        controller: '0x977087422C008233615b572fBC3F209Ed300063a',
        oracle: '0x03D5c199c4Abf2451D7b64b73A8078fC5a05eBa9',
        active: true,
      },
    ],
  },
  tranches: [
    {
      id: 0,
      address: '0xB5C42F84Ab3f786bCA9761240546AA9cEC1f8821',
      name: 'Senior Tranche',
      lp: 'SLP',
      slug: 'senior',
    },
    {
      id: 1,
      address: '0x4265af66537F7BE1Ca60Ca6070D97531EC571BDd',
      name: 'Mezzanine Tranche',
      lp: 'MLP',
      slug: 'mezzanine',
    },
    {
      id: 2,
      address: '0xcC5368f152453D497061CB1fB578D2d3C54bD0A0',
      name: 'Junior Tranche',
      lp: 'JLP',
      slug: 'junior',
    },
  ],
  tokens: {
    SLP: {
      address: '0xB5C42F84Ab3f786bCA9761240546AA9cEC1f8821',
      decimals: 18,
      fractionDigits: 2,
      priceFractionDigits: 3,
      name: 'Senior LLP',
      shortName: 'SnrLLP',
      threshold: 0.01,
      priceThreshold: 0.001,
      logo: 'https://raw.githubusercontent.com/level-fi/assets/main/LLP-256.png',
    },
    MLP: {
      address: '0x4265af66537F7BE1Ca60Ca6070D97531EC571BDd',
      decimals: 18,
      fractionDigits: 2,
      priceFractionDigits: 3,
      name: 'Mezzanine LLP',
      shortName: 'MzeLLP',
      threshold: 0.01,
      priceThreshold: 0.001,
      logo: 'https://raw.githubusercontent.com/level-fi/assets/main/LLP-256.png',
    },
    JLP: {
      address: '0xcC5368f152453D497061CB1fB578D2d3C54bD0A0',
      decimals: 18,
      fractionDigits: 2,
      priceFractionDigits: 3,
      name: 'Junior LLP',
      shortName: 'JnrLLP',
      threshold: 0.01,
      priceThreshold: 0.001,
      logo: 'https://raw.githubusercontent.com/level-fi/assets/main/LLP-256.png',
    },
    LVL: {
      address: '0xB64E280e9D1B5DbEc4AcceDb2257A87b400DB149',
      decimals: 18,
      fractionDigits: 2,
      priceFractionDigits: 4,
      threshold: 0.01,
      logo: 'https://raw.githubusercontent.com/level-fi/assets/main/LVL-256.png',
    },
    LGO: {
      address: '0xBe2B6C5E31F292009f495DDBda88e28391C9815E',
      decimals: 18,
      fractionDigits: 4,
      priceFractionDigits: 2,
      threshold: 0.0001,
      logo: 'https://raw.githubusercontent.com/level-fi/assets/main/LGO-256.png',
    },
    LY_LVL: {
      address: '0x95883611685a20936EC935B0A33F82e11D478e3D',
      decimals: 18,
      fractionDigits: 2,
      priceFractionDigits: 3,
      threshold: 0.01,
      name: 'lyLVL',
    },
    WBNB: {
      address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
      decimals: 18,
      fractionDigits: 4,
      priceFractionDigits: 2,
      threshold: 0.0001,
    },
    USDT: {
      address: '0x55d398326f99059fF775485246999027B3197955',
      decimals: 18,
      fractionDigits: 2,
      priceFractionDigits: 3,
      threshold: 0.01,
    },
    LVL_BNB_LP: {
      address: '0x70f16782010fa7ddf032a6aacdeed05ac6b0bc85',
      decimals: 18,
      name: 'LVL/BNB LP',
    },
    USDT_BNB_LP: {
      address: '0x16b9a82891338f9ba80e2d6970fdda79d1eb0dae',
      decimals: 18,
      name: 'USDT/BNB LP',
    },
    LVL_USDT_LP: {
      address: '0x69d6B9a5709eEad2C6568c1F636B32707eA55A7e',
      decimals: 18,
      name: 'LVL/USDT LP',
    },
  },
};

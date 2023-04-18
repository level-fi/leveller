import { useQuery } from '@tanstack/react-query';
import { FC } from 'react';
import { BigNumberValue } from '../../../components/BigNumberValue';
import { config, getTokenConfig } from '../../../config';
import { VALUE_DECIMALS } from '../../../utils/constant';
import { QUERY_STAKING_INFO } from '../../../utils/queries';

const StakingBox: FC<{ wallet: string }> = ({ wallet }) => {
  const info = useQuery(QUERY_STAKING_INFO(wallet));
  const rewardToken = getTokenConfig(config.rewardToken);
  const governanceToken = getTokenConfig(config.governanceToken);
  const slpToken = config.tokens.SLP;

  return (
    <div className="staking mt-20px">
      <div className="flex items-center justify-between">
        <div className="text-#000 px-18px font-bold lg-text-18px text-16px trapezoid-right relative">
          <div className="leading-6 my-5px font-800">STAKING</div>
        </div>
      </div>
      <div className="2xl-grid grid-cols-3 gap-x-22px b-t-1px b-t-solid b-t-#53FF8A pt-8px">
        <div className="py-22px px-16px mt-7px 2xl-mt-0 bg-#161E1C relative">
          <div className="trapezoid" />
          <span className="font-bold">DAO Staking</span>
          <div className="mt-20px flex justify-between items-start text-#ADABAB">
            <span className="triangle relative pl-16px text-13px lg-text-14px">Staked</span>
            <div className="flex flex-col items-end">
              <span className="text-12px">
                <span className="text-#fff font-bold text-16px">
                  <BigNumberValue
                    value={info.data?.stakeAmount}
                    decimals={rewardToken?.decimals}
                    fractionDigits={rewardToken.fractionDigits}
                    threshold={rewardToken.threshold}
                  />
                </span>{' '}
                {config.rewardToken}
              </span>
              <span className="mt-8px text-12px">
                <BigNumberValue
                  value={info.data?.stakeAmount && info.data?.lvlPrice && info.data?.stakeAmount * info.data?.lvlPrice}
                  decimals={VALUE_DECIMALS}
                  fractionDigits={2}
                  currency="USD"
                  prefix="~"
                />
              </span>
            </div>
          </div>
          <div className="my-16px b-t-1px b-t-dashed b-t-#4c4e4e"></div>
          <div className="flex justify-between items-start text-#ADABAB">
            <span className="triangle relative pl-16px text-13px lg-text-14px">Reward</span>
            <div className="flex flex-col items-end">
              <span className="text-12px">
                <span className="text-#fff font-bold text-16px">
                  <BigNumberValue
                    value={info.data?.claimableStakeRewardAmount}
                    decimals={governanceToken?.decimals}
                    fractionDigits={governanceToken.fractionDigits}
                    threshold={governanceToken.threshold}
                  />
                </span>{' '}
                {config.governanceToken}
              </span>
              <span className="mt-8px text-12px">
                <BigNumberValue
                  value={
                    info.data?.claimableStakeRewardAmount &&
                    info.data?.lgoIntrinsicPrice &&
                    info.data?.claimableStakeRewardAmount * info.data?.lgoIntrinsicPrice
                  }
                  decimals={VALUE_DECIMALS}
                  fractionDigits={2}
                  currency="USD"
                  prefix="~"
                />
              </span>
            </div>
          </div>
        </div>
        <div className="py-22px px-16px mt-7px 2xl-mt-0 bg-#161E1C relative">
          <div className="trapezoid" />
          <span className="font-bold">LVL Staking</span>
          <div className="mt-20px flex justify-between items-start text-#ADABAB">
            <span className="triangle relative pl-16px text-13px lg-text-14px">Deposited</span>
            <div className="flex flex-col items-end">
              <span className="text-12px">
                <span className="text-#fff font-bold text-16px">
                  <BigNumberValue
                    value={info.data?.lvlStakeAmount}
                    decimals={rewardToken?.decimals}
                    fractionDigits={rewardToken.fractionDigits}
                    threshold={rewardToken.threshold}
                  />
                </span>{' '}
                {config.rewardToken}
              </span>
              <span className="mt-8px text-12px">
                <BigNumberValue
                  value={
                    info.data?.lvlStakeAmount && info.data?.lvlPrice && info.data?.lvlStakeAmount * info.data?.lvlPrice
                  }
                  decimals={VALUE_DECIMALS}
                  fractionDigits={2}
                  currency="USD"
                  prefix="~"
                />
              </span>
            </div>
          </div>
          <div className="my-16px b-t-1px b-t-dashed b-t-#4c4e4e"></div>
          <div className="flex justify-between items-start text-#ADABAB">
            <span className="triangle relative pl-16px text-13px lg-text-14px">Reward</span>
            <div className="flex flex-col items-end">
              <span className="text-12px">
                <span className="text-#fff font-bold text-16px">
                  <BigNumberValue
                    value={info.data?.claimableLvlStakeRewardAmount}
                    decimals={slpToken?.decimals}
                    fractionDigits={slpToken.fractionDigits}
                    threshold={slpToken.threshold}
                  />
                </span>{' '}
                {slpToken.name}
              </span>
              <span className="mt-8px text-12px">
                <BigNumberValue
                  value={
                    info.data?.claimableLvlStakeRewardAmount &&
                    info.data?.slpPrice &&
                    info.data?.claimableLvlStakeRewardAmount * info.data?.slpPrice
                  }
                  decimals={VALUE_DECIMALS}
                  fractionDigits={2}
                  currency="USD"
                  prefix="~"
                />
              </span>
            </div>
          </div>
        </div>
        <div className="py-22px px-16px mt-7px 2xl-mt-0 bg-#161E1C relative">
          <div className="trapezoid" />
          <span className="font-bold">LGO Staking</span>
          <div className="mt-20px flex justify-between items-start text-#ADABAB">
            <span className="triangle relative pl-16px text-13px lg-text-14px">Deposited</span>
            <div className="flex flex-col items-end ">
              <span className="text-12px">
                <span className="text-#fff font-bold text-16px">
                  <BigNumberValue
                    value={info.data?.lgoStakeAmount}
                    decimals={governanceToken?.decimals}
                    fractionDigits={governanceToken.fractionDigits}
                    threshold={governanceToken.threshold}
                  />
                </span>{' '}
                {config.governanceToken}
              </span>
              <span className="mt-8px text-12px">
                <BigNumberValue
                  value={
                    info.data?.lgoStakeAmount &&
                    info.data?.lgoRedeemPrice &&
                    info.data?.lgoStakeAmount * info.data?.lgoRedeemPrice
                  }
                  decimals={VALUE_DECIMALS}
                  fractionDigits={2}
                  currency="USD"
                  prefix="~"
                />
              </span>
            </div>
          </div>
          <div className="my-16px b-t-1px b-t-dashed b-t-#4c4e4e"></div>
          <div className="flex justify-between items-start text-#ADABAB">
            <span className="triangle relative pl-16px text-13px lg-text-14px">Reward</span>
            <div className="flex flex-col items-end">
              <span className="text-12px">
                <span className="text-#fff font-bold text-16px">
                  <BigNumberValue
                    value={info.data?.claimableLgoStakeRewardAmount}
                    decimals={slpToken?.decimals}
                    fractionDigits={slpToken.fractionDigits}
                    threshold={slpToken.threshold}
                  />
                </span>{' '}
                {slpToken.name}
              </span>
              <span className="mt-8px text-12px">
                <BigNumberValue
                  value={
                    info.data?.claimableLgoStakeRewardAmount &&
                    info.data?.slpPrice &&
                    info.data?.claimableLgoStakeRewardAmount * info.data?.slpPrice
                  }
                  decimals={VALUE_DECIMALS}
                  fractionDigits={2}
                  currency="USD"
                  prefix="~"
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakingBox;

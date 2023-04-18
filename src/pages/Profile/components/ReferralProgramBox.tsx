import { useQuery } from '@tanstack/react-query';
import { FC, useState } from 'react';
import { BigNumberValue } from '../../../components/BigNumberValue';
import Tooltip from '../../../components/Tooltip';
import { config, getTokenConfig } from '../../../config';
import { PERCENTAGE_DECIMALS, VALUE_DECIMALS } from '../../../utils/constant';
import { QUERY_REFERRAL_INFO } from '../../../utils/queries';
import ReferralProgramHistoryBox from './ReferralProgramHistoryBox';

const ReferralProgramBox: FC<{ wallet: string }> = ({ wallet }) => {
  const info = useQuery(QUERY_REFERRAL_INFO(wallet));
  const rewardToken = getTokenConfig(config.rewardToken);
  const [isOpenModal, setIsOpenModal] = useState(false);

  return (
    <div className="referral 2xl-mt-0 mt-20px">
      <div className="flex items-center justify-between">
        <div className="text-#000 px-18px font-bold lg-text-18px text-16px trapezoid-right relative">
          <div className="leading-6 my-5px font-800">REFERRAL PROGRAM</div>
        </div>
      </div>
      <div className="b-t-1px b-t-solid b-t-#53FF8A bg-#161E1C relative">
        <div className="parallelogram skew-45 w-100px h-8px absolute bg-#53ff8a top-0 right-16px" />
        <div className="px-15px pt-25px pb-30px">
          <span className="triangle-down relative pl-20px text-13px lg-text-14px">Current Allocation</span>
          <div className="flex items-center justify-between text-#ADABAB mt-18px text-13px lg-text-14px min-h-25px">
            <div className="flex items-center">
              <span className="mr-1 truncate">Referral Reward </span>
              <Tooltip
                content={
                  <div className="flex flex-col text-11px">
                    <span>
                      Referral point:{' '}
                      <BigNumberValue value={info.data?.referralPoint} decimals={VALUE_DECIMALS} fractionDigits={2} />{' '}
                      RP
                    </span>
                    <span className="mt-5px">
                      <BigNumberValue
                        value={info?.data?.userTierInfo?.rebateForReferrer}
                        decimals={PERCENTAGE_DECIMALS}
                        percentage
                        fractionDigits={2}
                        threshold={0.01}
                      />{' '}
                      rebate (
                      <BigNumberValue
                        value={info?.data?.userTierInfo?.rebateForReferrer}
                        decimals={PERCENTAGE_DECIMALS}
                        fractionDigits={2}
                        threshold={0.01}
                        currency="USD"
                      />{' '}
                      per RP)
                    </span>
                  </div>
                }
              ></Tooltip>
            </div>
            <div className="flex items-center">
              <span>
                <span className="text-#fff font-bold text-14px lg-text-16px">
                  <BigNumberValue
                    value={info.data?.referralRewardAmount}
                    decimals={rewardToken.decimals}
                    fractionDigits={rewardToken.fractionDigits}
                    threshold={rewardToken.threshold}
                  />
                </span>{' '}
                {config.rewardToken}
              </span>
              {info.data?.referralTier !== undefined ? (
                <div className="b-1px b-solid b-#53FF8A py-3px px-9px lg-ml-16px ml-8px font-800">
                  <span className="text-#53FF8A">Tier{info.data?.referralTier}</span>
                </div>
              ) : undefined}
            </div>
          </div>
          <div className="flex items-center justify-between text-#ADABAB mt-18px text-13px lg-text-14px min-h-25px">
            <div className="flex items-center">
              <span className="mr-1 truncate">Trader Reward</span>
              <Tooltip
                content={
                  <div className="flex flex-col text-11px">
                    <span>
                      Trading point:{' '}
                      <BigNumberValue value={info.data?.tradingPoint} decimals={VALUE_DECIMALS} fractionDigits={2} /> TP
                    </span>
                    <span className="mt-5px">
                      <BigNumberValue
                        value={info?.data?.referrerTierInfo?.discountForTrader}
                        decimals={PERCENTAGE_DECIMALS}
                        percentage
                        fractionDigits={2}
                        threshold={0.01}
                      />{' '}
                      discount (
                      <BigNumberValue
                        value={info?.data?.referrerTierInfo?.discountForTrader}
                        decimals={PERCENTAGE_DECIMALS}
                        fractionDigits={2}
                        threshold={0.01}
                        currency="USD"
                      />{' '}
                      per TP)
                    </span>
                  </div>
                }
              ></Tooltip>
            </div>
            <div className="flex items-center">
              <span>
                <span className="text-#fff font-bold text-14px lg-text-16px">
                  <BigNumberValue
                    value={info.data?.tradingRewardAmount}
                    decimals={rewardToken.decimals}
                    fractionDigits={rewardToken.fractionDigits}
                    threshold={rewardToken.threshold}
                  />
                </span>{' '}
                {config.rewardToken}
              </span>
              {info.data?.referralTier !== undefined ? (
                <div className="b-1px b-solid b-#53FF8A py-3px px-9px lg-ml-16px ml-8px font-800">
                  <span className="text-#53FF8A">Tier{info.data?.tradeTier}</span>
                </div>
              ) : null}
            </div>
          </div>
          <div className="mt-28px mb-23px b-t-1px b-t-dashed b-t-#4c4e4e" />
          <div className="flex items-start justify-between text-#ADABAB text-13px lg-text-14px">
            <div className="flex flex-col triangle-down relative pl-20px">
              <span className="text-#fff">Total Reward</span>
              <span className="mt-12px">
                <span className="text-#fff font-bold text-16px">
                  <BigNumberValue
                    value={info.data?.totalRewardAmount}
                    decimals={rewardToken?.decimals}
                    fractionDigits={rewardToken.fractionDigits}
                    threshold={rewardToken.threshold}
                  />
                </span>{' '}
                {config.rewardToken}
              </span>
            </div>
            <span
              className="font-800 text-#53FF8A cursor-pointer hover:color-#52ff8999"
              onClick={() => setIsOpenModal(true)}
            >
              VIEW HISTORY
            </span>
          </div>
        </div>
      </div>
      <ReferralProgramHistoryBox
        wallet={wallet}
        referrer={info?.data?.referrer}
        tradeTier={info?.data?.tradeTier}
        isOpen={isOpenModal}
        dismiss={() => setIsOpenModal(false)}
      />
    </div>
  );
};

export default ReferralProgramBox;

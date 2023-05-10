import { useQuery } from '@tanstack/react-query';
import { FC, useState } from 'react';
import { BigNumberValue } from '../../../components/BigNumberValue';
import { config, getTokenConfig } from '../../../config';
import { QUERY_LOYALTY_INFO } from '../../../utils/queries';
import LoyaltyProgramHistoryBox from './LoyaltyProgramHistoryBox';
import { VALUE_DECIMALS } from '../../../utils/constant';

const LoyaltyProgramBox: FC<{ wallet: string }> = ({ wallet }) => {
  const info = useQuery(QUERY_LOYALTY_INFO(wallet));
  const loyaltyToken = getTokenConfig(config.loyaltyToken);
  const rewardToken = getTokenConfig(config.rewardToken);
  const [isOpenModal, setIsOpenModal] = useState(false);

  return (
    <div className="loyalty">
      <div className="flex items-center justify-between">
        <div className="text-#000 px-18px font-bold lg-text-18px text-16px trapezoid-right relative">
          <div className="leading-6 my-5px font-800">LOYALTY PROGRAM</div>
        </div>
      </div>
      <div className="b-t-1px b-t-solid b-t-#53FF8A bg-#161E1C relative">
        <div className="parallelogram skew-45 w-100px h-8px absolute bg-#53ff8a top-0 right-16px" />
        <div className="px-15px pt-25px pb-30px">
          <span className="triangle-down relative pl-20px text-13px lg-text-14px">Current Batch</span>
          <div className="flex items-center justify-between text-#ADABAB mt-18px text-13px lg-text-14px min-h-25px">
            <span>lyLVL Balance</span>
            <span>
              <span className="text-#fff font-bold text-16px">
                <BigNumberValue
                  value={info.data?.balance}
                  decimals={loyaltyToken?.decimals}
                  fractionDigits={loyaltyToken.fractionDigits}
                  threshold={loyaltyToken.threshold}
                />
              </span>{' '}
              {loyaltyToken.name}
            </span>
          </div>
          <div className="flex items-center justify-between text-#ADABAB mt-18px text-13px lg-text-14px min-h-25px">
            <span>Estimated Reward</span>
            <span>
              <span className="text-#fff font-bold text-16px">
                <BigNumberValue
                  value={info.data?.estimatedReward}
                  decimals={rewardToken?.decimals}
                  fractionDigits={rewardToken.fractionDigits}
                  threshold={rewardToken.threshold}
                />
              </span>{' '}
              {config.rewardToken}
            </span>
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
      <LoyaltyProgramHistoryBox wallet={wallet} isOpen={isOpenModal} dismiss={() => setIsOpenModal(false)} />
    </div>
  );
};

export default LoyaltyProgramBox;

import { useQuery } from '@tanstack/react-query';
import { FC } from 'react';
import { ReactComponent as IconExternalLink } from '../../../assets/icons/ic_explorer.svg';
import { BigNumberValue } from '../../../components/BigNumberValue';
import { config, getTokenConfig } from '../../../config';
import { VALUE_DECIMALS } from '../../../utils/constant';
import { QUERY_LIQUIDITY_INFO } from '../../../utils/queries';

const LiquidityBox: FC<{ wallet: string }> = ({ wallet }) => {
  const info = useQuery(QUERY_LIQUIDITY_INFO(wallet));
  const rewardToken = getTokenConfig(config.rewardToken);

  return (
    <div className="liquidity mt-20px">
      <div className="flex items-center justify-between">
        <div className="text-#000 px-18px font-bold lg-text-18px text-16px trapezoid-right relative">
          <div className="leading-6 my-5px font-800">LIQUIDITY</div>
        </div>
        <a
          className="text-#53FF8A hover:color-#52ff8999 text-13px lg-text-14px flex items-center font-bold"
          href={`https://llp.level.finance/${wallet}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          <span>LLP Tracker</span>
          <IconExternalLink className="ml-10px mb-2px h-12px lg-h-14px" />
        </a>
      </div>
      <div className="b-t-1px b-t-solid b-t-#53FF8A 2xl-grid grid-cols-3 relative">
        <div className="parallelogram skew-45 w-100px h-8px absolute bg-#53ff8a top-0 right-16px" />
        {config.tranches.map((t) => {
          const llp = getTokenConfig(t.lp);
          return (
            <div
              className="b-r-1px b-r-solid b-r-#242424 bg-#161E1C flex flex-col 2xl-pt-22px 2xl-pb-20px mt-7px 2xl-mt-0 px-16px py-15px text-#ADABAB text-14px"
              key={`tranche-${t.lp}`}
            >
              <span className="triangle relative pl-16px text-#fff text-14px font-bold">{t.name}</span>
              <div className="mt-20px flex justify-between text-13px lg-text-14px">
                <span> {llp.name}</span>
                <div className="flex flex-col items-end">
                  <span className="text-12px">
                    <span className="text-#fff font-bold text-16px">
                      <BigNumberValue
                        value={info.data?.[llp.address]?.amount}
                        decimals={llp?.decimals}
                        fractionDigits={llp.fractionDigits}
                        threshold={llp.threshold}
                      />
                    </span>{' '}
                  </span>
                  <span className="mt-8px text-12px">
                    <BigNumberValue
                      value={info.data?.[llp.address]?.value}
                      decimals={VALUE_DECIMALS}
                      fractionDigits={2}
                      currency="USD"
                      prefix="~"
                    />
                  </span>
                </div>
              </div>
              <div className="my-18px b-t-1px b-t-dashed b-t-#4c4e4e"></div>
              <div className="flex justify-between text-13px lg-text-14px">
                <span>Reward</span>
                <div className="flex flex-col items-end">
                  <span className="text-12px">
                    <span className="text-#fff font-bold text-16px">
                      <BigNumberValue
                        value={info.data?.[llp.address]?.rewardAmount}
                        decimals={rewardToken.decimals}
                        fractionDigits={rewardToken.fractionDigits}
                        threshold={rewardToken.threshold}
                      />
                    </span>{' '}
                    {config.rewardToken}
                  </span>
                  <span className="mt-8px text-12px">
                    <BigNumberValue
                      value={info.data?.[llp.address]?.rewardValue}
                      decimals={VALUE_DECIMALS}
                      fractionDigits={2}
                      currency="USD"
                      prefix="~"
                    />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LiquidityBox;

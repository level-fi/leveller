import { useQuery } from '@tanstack/react-query';
import { FC } from 'react';
import { ReactComponent as IconExternalLink } from '../../../assets/icons/ic_explorer.svg';
import { CurrencyFractionDigits, CurrencyThreshold } from '../../../utils/constant';
import { formatNumberWithThreshold } from '../../../utils/numbers';
import { QUERY_TRADING_INFO } from '../../../utils/queries';

const TradingBox: FC<{ wallet: string }> = ({ wallet }) => {
  const info = useQuery(QUERY_TRADING_INFO(wallet));
  return (
    <div className="trading flex flex-col lg-mt-0 mt-20px">
      <div className="flex items-center justify-between">
        <div className="text-#000 px-18px font-bold lg-text-18px text-16px trapezoid-right relative">
          <div className="leading-6 my-5px font-800">TRADING</div>
        </div>
        <a
          className="text-#53FF8A hover:color-#52ff8999 text-13px lg-text-14px flex items-center font-bold"
          href={`https://terminal.level.finance/traders/${wallet}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          <span className="truncate">Terminal</span>
          <IconExternalLink className="ml-10px mb-2px h-12px lg-h-14px" />
        </a>
      </div>
      <div className="lg-grid grid-cols-2 b-t-1px b-t-solid b-t-#53FF8A bg-#161E1C relative">
        <div className="parallelogram skew-45 w-100px h-8px absolute bg-#53ff8a top-0 right-16px" />
        <div className="flex flex-col justify-center items-center lg-py-30px lg-px-15px py-20px px-20px">
          <span className="text-#ADABAB lg-text-14px text-13px">Total Trading Volume</span>
          <span className="mt-14px lg-text-28px text-20px font-800 leading-8">
            {info.data?.totalTrading === undefined
              ? '-'
              : formatNumberWithThreshold(
                  info.data.totalTrading,
                  {
                    currency: 'USD',
                    fractionDigits: CurrencyFractionDigits,
                  },
                  CurrencyThreshold,
                )}
          </span>
        </div>
        <div className="b-t-1px b-t-solid b-t-#4c4e4e display-block lg-display-none" />
        <div className="flex flex-col justify-between lg-pt-27px lg-pb-35px p-15px px-20px b-l-1px b-l-solid b-l-#242424">
          <div className="flex items-center justify-between">
            <span className="text-#ADABAB text-13px lg-text-14px">Total Net Profit</span>
            <span
              className={`lg-text-16px text-14px font-800 ${
                !info.data?.totalNetProfit
                  ? 'text-#fff'
                  : info.data.totalNetProfit > 0
                  ? 'text-#53FF8A'
                  : 'text-#f6475d'
              }`}
            >
              {info.data?.totalNetProfit === undefined
                ? '-'
                : formatNumberWithThreshold(
                    info.data.totalNetProfit,
                    {
                      currency: 'USD',
                      fractionDigits: CurrencyFractionDigits,
                    },
                    CurrencyThreshold,
                  )}
            </span>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-#ADABAB text-13px lg-text-14px">Total Fee Paid</span>
            <span className="font-800 lg-text-16px text-14px">
              {info.data?.totalFee === undefined
                ? '-'
                : formatNumberWithThreshold(
                    info.data.totalFee,
                    {
                      currency: 'USD',
                      fractionDigits: CurrencyFractionDigits,
                    },
                    CurrencyThreshold,
                  )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingBox;

import { useQuery } from '@tanstack/react-query';
import { FC } from 'react';
import { BigNumberValue } from '../components/BigNumberValue';
import { CurrencyFractionDigits, CurrencyThreshold, TOKEN_DECIMALS, VALUE_DECIMALS } from '../utils/constant';
import { QUERY_TOP_LP_INFO } from '../utils/queries';
import { ReactComponent as IconTop } from '../assets/icons/ic-top.svg';
import { shortenAddress } from '../utils/addresses';
import { useNavigate } from 'react-router-dom';
import { config, getTokenConfig } from '../config';
import { formatNumberWithThreshold } from '../utils/numbers';

const TopLP: FC = () => {
  const info = useQuery(QUERY_TOP_LP_INFO());
  const navigate = useNavigate();

  const goToProfile = (wallet: string) => {
    navigate(`/${wallet}`);
  };

  return (
    <div className="max-w-1170px lg-my-30px mx-auto px-15px">
      <div className="display-none lg-flex items-center justify-between">
        <div className="text-#000 px-18px font-bold lg-text-20px text-16px trapezoid-right relative">
          <div className="my-5px font-800">Top Liquidity Providers</div>
        </div>
      </div>
      <table className="w-100% border-separate border-spacing-y-6px border-spacing-x-0 display-none lg-display-table b-t-1px b-t-solid b-t-#53FF8A text-14px">
        <thead className="color-#ADABAB text-12px">
          <tr>
            <th></th>
            <th className="leading-5 font-400 py-20px pb-6px px-12px text-center w-5%">#</th>
            <th className="leading-5 font-400 py-20px pb-6px px-12px text-left w-30%">Wallet</th>
            <th className="leading-5 font-400 py-20px pb-6px px-12px text-left w-15%">
              <span className="ic-sort relative pr-15px">Total Liquidity</span>
            </th>
            <th className="leading-5 font-400 py-20px pb-6px px-12px text-left">Senior LLP</th>
            <th className="leading-5 font-400 py-20px pb-6px px-12px text-left">Mezzanine LLP</th>
            <th className="leading-5 font-400 py-20px pb-6px px-12px text-left">Junior LLP</th>
            <th className="leading-5 font-400 py-20px pb-6px px-12px text-left w-15%">Claimed Reward</th>
          </tr>
        </thead>
        <tbody>
          {info?.data?.map((row, i) => (
            <tr key={i} className="row relative" onClick={() => goToProfile(row.wallet)}>
              <td className="absolute top-0 right-16px">
                <div className={i === 0 ? 'b-none w-100px parallelogram skew--45 h-8px bg-#53ff8a ' : ''}></div>
              </td>
              <td className="text-center text-#53FF8A py-14px px-12px bg-#161E1C">
                {i === 0 ? <IconTop /> : <span className="leading-24px font-800">{i + 1}</span>}
              </td>
              <td className="font-500 py-20px px-12px bg-#161E1C">{row.wallet}</td>
              <td className="py-20px px-12px bg-#161E1C text-#53ff8a">
                {formatNumberWithThreshold(
                  row?.totalValue,
                  {
                    currency: 'USD',
                    fractionDigits: CurrencyFractionDigits,
                  },
                  CurrencyThreshold,
                )}
              </td>
              <td className="py-20px px-12px bg-#161E1C">
                {formatNumberWithThreshold(
                  row?.slpAmount,
                  {
                    fractionDigits: CurrencyFractionDigits,
                  },
                  CurrencyThreshold,
                )}
              </td>
              <td className="py-20px px-12px bg-#161E1C">
                {formatNumberWithThreshold(
                  row?.mlpAmount,
                  {
                    fractionDigits: CurrencyFractionDigits,
                  },
                  CurrencyThreshold,
                )}
              </td>
              <td className="py-20px px-12px bg-#161E1C">
                {formatNumberWithThreshold(
                  row?.jlpAmount,
                  {
                    fractionDigits: CurrencyFractionDigits,
                  },
                  CurrencyThreshold,
                )}
              </td>
              <td className="py-20px px-12px bg-#161E1C">
                {formatNumberWithThreshold(
                  row?.rewardAmount,
                  {
                    fractionDigits: CurrencyFractionDigits,
                  },
                  CurrencyThreshold,
                )}{' '}
                {config.rewardToken}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="display-block lg-display-none px-16px">
        <div className="font-bold mb-16px text-14px">Top Liquidity Providers</div>
        {info?.data?.map((row, i) => (
          <div className={`text-12px p-16px mb-10px bg-#161E1C`} key={i} onClick={() => goToProfile(row.wallet)}>
            <div className="py-5px flex justify-between">
              <div className="text-#53FF8A font-bold">
                {i === 0 ? <IconTop height="20px" /> : <span>#{i + 1}</span>}
              </div>
            </div>
            <div className="py-5px flex justify-between">
              <div>Wallet</div>
              <a className="text-#53FF8A hover:color-#53ff8a">{shortenAddress(row.wallet)}</a>
            </div>
            <div className="py-5px flex justify-between">
              <div>Liquidity</div>
              <div>
                {formatNumberWithThreshold(
                  row?.totalValue,
                  {
                    currency: 'USD',
                    fractionDigits: CurrencyFractionDigits,
                  },
                  CurrencyThreshold,
                )}
              </div>
            </div>
            <div className="py-5px flex justify-between">
              <div>Senior LLP</div>
              <div>
                {formatNumberWithThreshold(
                  row?.slpAmount,
                  {
                    fractionDigits: CurrencyFractionDigits,
                  },
                  CurrencyThreshold,
                )}
              </div>
            </div>
            <div className="py-5px flex justify-between">
              <div>Mezzanine LLP</div>
              <div>
                {formatNumberWithThreshold(
                  row?.mlpAmount,
                  {
                    fractionDigits: CurrencyFractionDigits,
                  },
                  CurrencyThreshold,
                )}
              </div>
            </div>
            <div className="py-5px flex justify-between">
              <div>Junior LLP</div>
              <div>
                {formatNumberWithThreshold(
                  row?.jlpAmount,
                  {
                    fractionDigits: CurrencyFractionDigits,
                  },
                  CurrencyThreshold,
                )}
              </div>
            </div>
            <div className="py-5px flex justify-between">
              <div>Claimed Reward</div>
              <div>
                {formatNumberWithThreshold(
                  row?.rewardAmount,
                  {
                    fractionDigits: CurrencyFractionDigits,
                  },
                  CurrencyThreshold,
                )}{' '}
                {config.rewardToken}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopLP;

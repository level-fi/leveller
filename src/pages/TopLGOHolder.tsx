import { useQuery } from '@tanstack/react-query';
import { FC } from 'react';
import { QUERY_TOP_LGO_HOLDER_INFO } from '../utils/queries';
import { ReactComponent as IconTop } from '../assets/icons/ic-top.svg';
import { BigNumberValue } from '../components/BigNumberValue';
import { config, getTokenConfig } from '../config';
import { useNavigate } from 'react-router-dom';
import { shortenAddress } from '../utils/addresses';
import { formatNumberWithThreshold } from '../utils/numbers';

const TopLGOHolder: FC = () => {
  const info = useQuery(QUERY_TOP_LGO_HOLDER_INFO());
  const governanceToken = getTokenConfig(config.governanceToken);
  const navigate = useNavigate();

  const goToProfile = (wallet: string) => {
    navigate(`/${wallet}`);
  };

  return (
    <div className="max-w-1170px lg-my-30px mx-auto">
      <div className="display-none lg-flex items-center justify-between">
        <div className="text-#000 px-18px font-bold lg-text-20px text-16px trapezoid-right relative">
          <div className="my-5px font-800">Top LGO Holders</div>
        </div>
      </div>
      <table className="w-100% border-separate border-spacing-y-6px border-spacing-x-0 display-none lg-display-table b-t-1px b-t-solid b-t-#53FF8A text-14px">
        <thead className="color-#ADABAB text-12px">
          <tr>
            <th></th>
            <th className="font-400 py-20px pb-6px px-12px text-center w-5%">#</th>
            <th className="font-400 py-20px pb-6px px-12px text-left w-40%">Wallet</th>
            <th className="font-400 py-20px pb-6px px-12px text-left">
              <span className="ic-sort relative pr-15px">Total</span>
            </th>
            <th className="font-400 py-20px pb-6px px-12px text-left">In Wallet</th>
            <th className="font-400 py-20px pb-6px px-12px text-left">In LGO Staking</th>
          </tr>
        </thead>
        <tbody>
          {info?.data?.map((row, i) => (
            <tr key={i} className="row relative" onClick={() => goToProfile(row.wallet)}>
              <td className="absolute top-0 right-16px">
                <div className={i === 0 ? 'b-none w-100px parallelogram skew--45 h-8px bg-#53ff8a ' : ''}></div>
              </td>
              <td className="font-800 text-center text-#53FF8A py-14px px-12px bg-#161E1C">
                {i === 0 ? <IconTop /> : <span className="leading-24px font-800">{i + 1}</span>}
              </td>
              <td className="font-500 py-20px px-12px bg-#161E1C">{row.wallet}</td>
              <td className="py-20px px-12px bg-#161E1C text-#53FF8A">
                {formatNumberWithThreshold(
                  row?.totalAmount,
                  {
                    fractionDigits: governanceToken.fractionDigits,
                  },
                  governanceToken.threshold,
                )}
              </td>
              <td className=" py-20px px-12px bg-#161E1C">
                {formatNumberWithThreshold(
                  row?.walletAmount,
                  {
                    fractionDigits: governanceToken.fractionDigits,
                  },
                  governanceToken.threshold,
                )}
              </td>
              <td className=" py-20px px-12px bg-#161E1C">
                {formatNumberWithThreshold(
                  row?.stakingAmount,
                  {
                    fractionDigits: governanceToken.fractionDigits,
                  },
                  governanceToken.threshold,
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="display-block lg-display-none px-16px">
        <div className="font-bold mb-16px text-14px">Top LGO Holders</div>
        {info?.data?.map((row, i) => (
          <div className="text-12px p-16px mb-10px bg-#181818" key={i} onClick={() => goToProfile(row.wallet)}>
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
              <div>Total</div>
              <div>
                {formatNumberWithThreshold(
                  row?.totalAmount,
                  {
                    fractionDigits: governanceToken.fractionDigits,
                  },
                  governanceToken.threshold,
                )}
              </div>
            </div>
            <div className="py-5px flex justify-between">
              <div>In Wallet</div>
              <div>
                {formatNumberWithThreshold(
                  row?.walletAmount,
                  {
                    fractionDigits: governanceToken.fractionDigits,
                  },
                  governanceToken.threshold,
                )}
              </div>
            </div>
            <div className="py-5px flex justify-between">
              <div>In LGO Staking</div>
              <div>
                {formatNumberWithThreshold(
                  row?.stakingAmount,
                  {
                    fractionDigits: governanceToken.fractionDigits,
                  },
                  governanceToken.threshold,
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopLGOHolder;

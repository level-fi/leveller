import { useQuery } from '@tanstack/react-query';
import { FC, useMemo, useState } from 'react';
import { ROWS_PER_PAGE, VALUE_DECIMALS } from '../../../utils/constant';
import { QUERY_REFERRAL_INFO_HISTORY } from '../../../utils/queries';
import { BigNumberValue } from '../../../components/BigNumberValue';
import { config } from '../../../config';
import Pagination from '../../../components/Pagination';
import { DataTableLoader } from '../../../components/DataTableLoader';
import Tooltip from '../../../components/Tooltip';
import { format, fromUnixTime } from 'date-fns';
import { NoData } from '../../../components/NoData';
import Modal from '../../../components/Modal';
import { ZeroAddress } from 'ethers';
import { shortenAddress } from '../../../utils/addresses';

const ReferralProgramHistoryBox: FC<{
  wallet: string;
  referrer: string;
  tradeTier: number;
  isOpen: boolean;
  dismiss: () => void;
}> = ({ wallet, referrer, tradeTier, isOpen, dismiss }) => {
  const info = useQuery(QUERY_REFERRAL_INFO_HISTORY(wallet));
  const lvl = config.tokens.LVL;

  const [page, setPage] = useState<number>(0);

  const rows = useMemo(() => {
    if (!info.data || !info.data.length) {
      return [];
    }
    return info.data.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE);
  }, [info.data, page]);

  return (
    <Modal
      isOpen={isOpen}
      dismiss={dismiss}
      header={
        <div className="flex flex-col">
          <span className="font-bold text-18px triangle relative pl-16px">REFERRAL HISTORY</span>
          {referrer && referrer !== ZeroAddress ? (
            <div className="mt-13px flex items-center text-12px pl-16px">
              <span className="text-#ADABAB">Referrer:</span>
              <a
                href={`${config.explorerUrl}/address/${referrer}`}
                className="text-#fff hover:color-#53FF8A no-underline"
                target="_blank"
                rel="noreferrer noopener"
              >
                {shortenAddress(referrer)}
              </a>
              <span className="ml-7px text-#53FF8A font-800">Tier{tradeTier}</span>
            </div>
          ) : null}
        </div>
      }
    >
      <div className="relative lg-p-15px lg-bg-#181818 mt-7px">
        {info.isLoading && !info.data ? (
          <DataTableLoader />
        ) : info.data.length ? (
          <>
            <table className="w-100% border-collapse display-none lg-display-table">
              <thead className="color-#ADABAB text-12px">
                <tr>
                  <th className="font-400 pb-9px text-left">Batch</th>
                  <th className="font-400 pb-9px text-left ">Referral Tier</th>
                  <th className="font-400 pb-9px text-left ">Referral Point</th>
                  <th className="font-400 pb-9px text-left ">Trade Tier</th>
                  <th className="font-400 pb-9px text-left ">Trading Point</th>
                  <th className="font-400 pb-9px text-right ">Reward</th>
                </tr>
              </thead>
              <tbody>
                {rows?.map((row, i) => (
                  <tr key={i} className="b-t-1 b-#4C4E4E">
                    <td className="b-0 b-t-1px b-solid py-15px b-#4C4E4E text-12px">
                      <Tooltip content={`End date:  ${format(fromUnixTime(row?.allocatedTime), 'MM/dd/y HH:mm O')}`}>
                        <span className="mr-1 leading-1 hover:color-#0AED52 hover:underline">{row.epoch + 1}</span>
                      </Tooltip>
                    </td>
                    <td className="b-0 b-t-1px b-solid py-15px b-#4C4E4E text-12px">Tier {row.referralTier}</td>
                    <td className="b-0 b-t-1px b-solid py-15px b-#4C4E4E text-12px">
                      <BigNumberValue value={row?.referralPoint} decimals={VALUE_DECIMALS} fractionDigits={2} /> RP
                    </td>
                    <td className="b-0 b-t-1px b-solid py-15px b-#4C4E4E text-12px">Tier {row.tradeTier}</td>
                    <td className="b-0 b-t-1px b-solid py-15px b-#4C4E4E text-12px">
                      <BigNumberValue value={row?.tradingPoint} decimals={VALUE_DECIMALS} fractionDigits={2} /> TP
                    </td>
                    <td className="b-0 b-t-1px b-solid py-15px b-#4C4E4E text-12px text-right">
                      <BigNumberValue
                        value={row?.reward}
                        decimals={lvl?.decimals}
                        fractionDigits={lvl.fractionDigits}
                        threshold={lvl.threshold}
                      />{' '}
                      {config.rewardToken}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="display-block lg-display-none text-12px">
              {rows?.map((row, i) => (
                <div className="px-20px py-10px mb-10px bg-#181818" key={i}>
                  <div className="py-5px flex justify-between">
                    <div>Batch</div>
                    <div>{row.epoch + 1}</div>
                  </div>
                  <div className="py-5px flex justify-between">
                    <div>Referral Tier</div>
                    <div>Tier {row.referralTier}</div>
                  </div>
                  <div className="py-5px flex justify-between">
                    <div>Ref Point</div>
                    <div>
                      <BigNumberValue value={row?.referralPoint} decimals={VALUE_DECIMALS} fractionDigits={2} /> RP
                    </div>
                  </div>
                  <div className="py-5px flex justify-between">
                    <div>Trade Tier</div>
                    <div>Tier {row.tradeTier}</div>
                  </div>
                  <div className="py-5px flex justify-between">
                    <div>Trading Point</div>
                    <div>
                      <BigNumberValue value={row?.tradingPoint} decimals={VALUE_DECIMALS} fractionDigits={2} /> RP
                    </div>
                  </div>
                  <div className="py-5px flex justify-between">
                    <div>Reward</div>
                    <div>
                      <BigNumberValue
                        value={row?.reward}
                        decimals={lvl?.decimals}
                        fractionDigits={lvl.fractionDigits}
                        threshold={lvl.threshold}
                      />{' '}
                      {config.rewardToken}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-end">
              <Pagination onPageChange={setPage} totalCount={info?.data?.length} page={page} />
            </div>
          </>
        ) : (
          <NoData>No records found.</NoData>
        )}
      </div>
    </Modal>
  );
};

export default ReferralProgramHistoryBox;

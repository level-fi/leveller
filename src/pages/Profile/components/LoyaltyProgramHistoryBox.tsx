import { useQuery } from '@tanstack/react-query';
import { FC, useMemo, useState } from 'react';
import { BigNumberValue } from '../../../components/BigNumberValue';
import { Timestamp } from '../../../components/Timestamp';
import { config } from '../../../config';
import { QUERY_LOYALTY_INFO_HISTORY } from '../../../utils/queries';
import { ROWS_PER_PAGE } from '../../../utils/constant';
import Pagination from '../../../components/Pagination';
import { DataTableLoader } from '../../../components/DataTableLoader';
import { NoData } from '../../../components/NoData';
import Modal from '../../../components/Modal';

const LoyaltyProgramHistoryBox: FC<{ wallet: string; isOpen: boolean; dismiss: () => void }> = ({
  wallet,
  isOpen,
  dismiss,
}) => {
  const info = useQuery(QUERY_LOYALTY_INFO_HISTORY(wallet));
  const lyLvl = config.tokens.LY_LVL;
  const lvl = config.tokens.LVL;
  const [page, setPage] = useState<number>(0);

  const rows = useMemo(() => {
    if (!info.data || !info.data.length) {
      return [];
    }
    return info.data.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE);
  }, [info.data, page]);

  return (
    <Modal isOpen={isOpen} dismiss={dismiss} header="LOYALTY HISTORY">
      <div className="relative lg-p-15px lg-bg-#181818 mt-7px">
        {info.isLoading && !info.data ? (
          <DataTableLoader />
        ) : info.data.length ? (
          <>
            <table className="w-100% border-collapse display-none lg-display-table">
              <thead className="color-#ADABAB text-12px">
                <tr>
                  <th className="font-400 pt-0 pb-9px text-left w-30%">Batch Ended</th>
                  <th className="font-400 pt-0 pb-9px text-left w-30%">Earned</th>
                  <th className="font-400 pt-0 pb-9px text-right w-10%">Reward</th>
                </tr>
              </thead>
              <tbody>
                {rows?.map((row, i) => (
                  <tr key={i} className="b-t-1 b-#4C4E4E">
                    <td className="b-0 b-t-1px b-solid py-15px b-#4C4E4E text-12px">
                      <Timestamp value={row?.allocatedTime} formatter="MM/dd/y HH:mm O" />
                    </td>
                    <td className="b-0 b-t-1px b-solid py-15px b-#4C4E4E text-12px">
                      <BigNumberValue
                        value={row?.balance}
                        decimals={lyLvl?.decimals}
                        fractionDigits={lyLvl.fractionDigits}
                        threshold={lyLvl.threshold}
                      />{' '}
                      {lyLvl.name}
                    </td>
                    <td className="b-0 b-t-1px b-solid py-15px b-#4C4E4E text-12px text-right">
                      <BigNumberValue
                        value={row?.rewardAmount}
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
                    <div>Batch Ended</div>
                    <Timestamp value={row?.allocatedTime} formatter="MM/dd/y HH:mm O" />
                  </div>
                  <div className="py-5px flex justify-between">
                    <div>Earned</div>
                    <div>
                      <BigNumberValue
                        value={row?.balance}
                        decimals={lyLvl?.decimals}
                        fractionDigits={lyLvl.fractionDigits}
                        threshold={lyLvl.threshold}
                      />{' '}
                      {lyLvl.name}
                    </div>
                  </div>
                  <div className="py-5px flex justify-between">
                    <div>Reward</div>
                    <div>
                      <BigNumberValue
                        value={row?.rewardAmount}
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

export default LoyaltyProgramHistoryBox;

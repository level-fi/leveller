import { useQuery } from '@tanstack/react-query';
import { FC } from 'react';
import { QUERY_WALLET_INFO } from '../../../utils/queries';
import searchImg from '../../../assets/images/img-search.png';
import { ReactComponent as IconExternalLink } from '../../../assets/icons/ic_explorer.svg';
import { config, getTokenConfig } from '../../../config';
import { BigNumberValue } from '../../../components/BigNumberValue';
import ButtonCopy from '../../../components/ButtonCopy';
import { shortenAddress } from '../../../utils/addresses';

const WalletBox: FC<{ wallet: string }> = ({ wallet }) => {
  const info = useQuery(QUERY_WALLET_INFO(wallet));
  const rewardToken = getTokenConfig(config.rewardToken);
  const governanceToken = getTokenConfig(config.governanceToken);

  return (
    <div className="wallet flex flex-col">
      <div className="bg-#161E1C flex flex-col b-1px b-solid b-#53ff8a66 pt-52px pb-28px px-18px relative">
        <div className="parallelogram skew--45 w-100px h-8px absolute bg-#53ff8a top--1px left-42px b-t-1px b-t-#53FF8A b-t-solid" />
        <div className="absolute top--1px left-0 w-50% h-1px bg-#53FF8A"></div>
        <div className="absolute left--4px top--4px bg-#53FF8A w-8px h-8px rd-100%" />
        <div className="absolute right--4px top--4px bg-#53FF8A w-8px h-8px rd-100%" />
        <div className="absolute left--4px bottom--4px bg-#53FF8A w-8px h-8px rd-100%" />
        <div className="absolute right--4px bottom--4px bg-#53FF8A w-8px h-8px rd-100%" />
        <div className=" absolute top-16px right-16px flex items-center">
          <ButtonCopy text={wallet} />
          <a
            href={`${config.explorerUrl}/address/${wallet}`}
            target="_blank"
            rel="noreferrer noopenner"
            className="color-primary hover:color-#52ff8999 mt-3px ml-8px"
          >
            <IconExternalLink height="16px" />
          </a>
        </div>
        <img src={searchImg} className="mx-auto" />
        <span className="mt-22px text-center lg-text-18px text-16px font-bold text-#fff break-words">
          {shortenAddress(wallet, 6, 6, true)}
        </span>

        <div className="triangle relative flex items-center justify-between py-10px pl-18px pr-14px bg-#53ff8a1a mt-24px">
          <span className="text-13px lg-text-14px">Voting Power</span>
          <span className="text-#53FF8A text-14px lg-text-16px">
            <span className="font-bold ">
              <BigNumberValue
                value={info.data?.votingPower}
                decimals={governanceToken?.decimals}
                fractionDigits={governanceToken.fractionDigits}
                threshold={governanceToken.threshold}
              />
            </span>{' '}
            {config.governanceToken}
          </span>
        </div>
        <div className="triangle relative flex items-center justify-between py-10px pl-18px pr-14px bg-#53ff8a1a mt-15px">
          <span className="text-13px lg-text-14px">LVL Balance</span>
          <span className="text-#53FF8A text-14px lg-text-16px">
            <span className="font-bold">
              <BigNumberValue
                value={info.data?.lvlBalance}
                decimals={rewardToken?.decimals}
                fractionDigits={rewardToken.fractionDigits}
                threshold={rewardToken.threshold}
              />
            </span>{' '}
            {config.rewardToken}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WalletBox;

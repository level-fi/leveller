import { FC, useEffect } from 'react';
import LiquidityBox from './components/LiquidityBox';
import LoyaltyProgramBox from './components/LoyaltyProgramBox';
import ReferralProgramBox from './components/ReferralProgramBox';
import TradingBox from './components/TradingBox';
import WalletBox from './components/WalletBox';
import StakingBox from './components/StakingBox';
import { useNavigate, useParams } from 'react-router-dom';
import SearchInput from '../../components/SearchInput';
import { isAddress } from '../../utils/addresses';

const Profile: FC = () => {
  const navigate = useNavigate();
  const { address } = useParams();

  useEffect(() => {
    if (address && !isAddress(address)) {
      navigate('/');
    }
  }, [address]);

  return (
    <div className="profile relative m-4 lg-m-0">
      <div className="lg-display-none display-block mb-2">
        <SearchInput />
      </div>
      {isAddress(address) ? (
        <div className="lg-grid grid-cols-[2fr_5fr] gap-x-40px lg-py-45px py-10px md-container bg-#030303 mx-auto">
          <WalletBox wallet={address} />
          <div>
            <TradingBox wallet={address} />
            <LiquidityBox wallet={address} />
            <StakingBox wallet={address} />
            <div className="2xl-grid grid-cols-2 gap-22px 2xl-mt-25px mt-20px">
              <LoyaltyProgramBox wallet={address} />
              <ReferralProgramBox wallet={address} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Profile;

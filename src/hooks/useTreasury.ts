import { useQuery } from '@tanstack/react-query';
import { QUERY_TREASURY } from '../utils/queries';
import { useGovernanceToken } from './useGovernanceToken';
import { Treasury } from '../models/Treasury';

export const useTreasury = () => {
  const { data: treasuryResponse } = useQuery(QUERY_TREASURY());
  const lgoInfo = useGovernanceToken();

  const result: Treasury = {
    lgoSurrenderValue: undefined,
    lgoIntrinsicValue: undefined,
  };

  if (treasuryResponse && lgoInfo.circulatingSupply) {
    const liquidValue = treasuryResponse.liquidAssets.reduce((current, next) => current + BigInt(next.value), 0n);
    result.lgoSurrenderValue = liquidValue / lgoInfo.circulatingSupply;

    const reserveValue = treasuryResponse.reserve.reduce((current, next) => current + BigInt(next.value), 0n);
    result.lgoIntrinsicValue = (liquidValue + reserveValue) / lgoInfo.circulatingSupply;
  }

  return result;
};

import { useQuery } from '@tanstack/react-query';
import { QUERY_PROTOCOL_TOKENS } from '../utils/queries';

export const useGovernanceToken = () => {
  const { data } = useQuery(QUERY_PROTOCOL_TOKENS());
  const result = {
    byChains: [],
    circulatingSupply: undefined,
    totalSupply: undefined,
  };

  if (data) {
    result.circulatingSupply = 0n;
    result.totalSupply = 0n;
    for (const item of data.lgo.supply) {
      result.circulatingSupply += BigInt(item.circulatingSupply);
      result.totalSupply += BigInt(item.totalSupply);
      result.byChains.push({
        chainId: item.chainId,
        circulatingSupply: BigInt(item.circulatingSupply),
        totalSupply: BigInt(item.totalSupply),
      });
    }
  }
  return result;
};

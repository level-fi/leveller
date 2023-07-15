import { z } from 'zod';

const TreasuryTokenResponse = z.object({
  address: z.string(),
  amount: z.string(),
  decimals: z.number(),
  value: z.string(),
});

export const TreasuryResponseSchema = z.object({
  reserve: z.array(
    z.object({
      chainId: z.number(),
      tokens: z.array(
        z.object({
          address: z.string(),
          amount: z.string(),
          decimals: z.number(),
          value: z.string(),
        }),
      ),
      value: z.string(),
    }),
  ),
  liquidAssets: z.array(
    z.object({
      chainId: z.number(),
      tokens: z.array(TreasuryTokenResponse),
      lp: z.array(
        z.object({
          address: z.string(),
          tokenX: TreasuryTokenResponse,
          tokenY: TreasuryTokenResponse,
          amount: z.string(),
          decimals: z.number(),
          value: z.string(),
        }),
      ),
      value: z.string(),
    }),
  ),
});

export const ProtocolTokenResponseSchema = z.object({
  lvl: z.object({
    supply: z.array(
      z.object({
        chainId: z.number(),
        totalSupply: z.string(),
        circulatingSupply: z.string(),
      }),
    ),
    price: z.object({
      price: z.string(),
      decimals: z.number(),
    }),
  }),
  lgo: z.object({
    supply: z.array(
      z.object({
        chainId: z.number(),
        totalSupply: z.string(),
        circulatingSupply: z.string(),
      }),
    ),
    auctionPrice: z.object({
      amount: z.string(),
      decimals: z.number(),
    }),
  }),
});
export type ProtocolTokenResponse = z.infer<typeof ProtocolTokenResponseSchema>;

export type Treasury = {
  lgoSurrenderValue: bigint | undefined;
  lgoIntrinsicValue: bigint | undefined;
};

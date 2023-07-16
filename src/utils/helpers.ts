export const uniV3SqrtPrice = (tokenDecimals: [number, number], sqrtRatioX96: number) => {
  const [token0Decimals, token1Decimals] = tokenDecimals;
  const scalarNumerator = 10n ** BigInt(token0Decimals);
  const scalarDenominator = 10n ** BigInt(token1Decimals);

  const sqrtRatioX96BI = BigInt(sqrtRatioX96);

  const inputNumerator = sqrtRatioX96BI * sqrtRatioX96BI;
  const inputDenominator = 2n ** 192n;

  const numerator = scalarDenominator * inputDenominator;
  const denominator = scalarNumerator * inputNumerator;

  if (denominator > numerator) {
    return 1 / parseFloat((denominator / numerator).toString());
  }
  return parseFloat((numerator / denominator).toString());
};

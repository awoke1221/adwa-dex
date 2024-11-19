export const calculatePrice = (
  amountIn: string,
  tokenInDecimals: number,
  tokenOutDecimals: number,
  priceRatio: number = 1
): string => {
  if (!amountIn || isNaN(Number(amountIn))) return '';
  
  const amount = parseFloat(amountIn);
  const adjustedAmount = amount * priceRatio;
  const decimalAdjustment = 10 ** (tokenOutDecimals - tokenInDecimals);
  
  return (adjustedAmount * decimalAdjustment).toFixed(tokenOutDecimals);
};

export const calculatePriceImpact = (
  amountIn: number,
  amountOut: number,
  spotPrice: number
): number => {
  const expectedAmountOut = amountIn * spotPrice;
  return ((expectedAmountOut - amountOut) / expectedAmountOut) * 100;
};

export const calculateOptimalRange = (
  currentPrice: number,
  volatility: number = 0.15
): { min: number; max: number } => {
  return {
    min: currentPrice * (1 - volatility),
    max: currentPrice * (1 + volatility)
  };
};

export const formatCurrency = (
  amount: string | number,
  decimals: number = 6
): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '0';
  
  if (num > 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  } else if (num > 1000) {
    return (num / 1000).toFixed(2) + 'K';
  }
  
  return num.toFixed(decimals);
};
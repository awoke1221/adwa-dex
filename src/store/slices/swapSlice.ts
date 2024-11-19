import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Token } from '../../types';

interface SwapState {
  tokenA?: Token;
  tokenB?: Token;
  amountA: string;
  amountB: string;
  slippage: string;
  deadline: string;
  priceImpact: number;
  loading: boolean;
  error: string | null;
}

const initialState: SwapState = {
  amountA: '',
  amountB: '',
  slippage: '0.5',
  deadline: '20',
  priceImpact: 0,
  loading: false,
  error: null,
};

// Mock price calculation function
const calculateSwapAmount = (
  amountIn: string,
  priceA: number,
  priceB: number
): { amountOut: string; priceImpact: number } => {
  if (!amountIn || !priceA || !priceB) {
    return { amountOut: '', priceImpact: 0 };
  }

  const amount = parseFloat(amountIn);
  const spotPrice = priceB / priceA;
  const amountOut = amount * spotPrice;

  // Simulate price impact based on size of the trade
  const priceImpact = Math.min((amount / 1000) * 0.5, 15); // 0.5% impact per 1000 units, max 15%

  return {
    amountOut: amountOut.toFixed(6),
    priceImpact,
  };
};

export const calculateSwap = createAsyncThunk(
  'swap/calculate',
  async (
    { tokenA, tokenB, amount, prices }: 
    { tokenA: Token; tokenB: Token; amount: string; prices: Record<string, number> },
    { rejectWithValue }
  ) => {
    try {
      const priceA = prices[tokenA.symbol];
      const priceB = prices[tokenB.symbol];

      if (!priceA || !priceB) {
        throw new Error('Price not available');
      }

      return calculateSwapAmount(amount, priceA, priceB);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const swapSlice = createSlice({
  name: 'swap',
  initialState,
  reducers: {
    setTokenA: (state, action) => {
      state.tokenA = action.payload;
      state.amountB = '';
      state.priceImpact = 0;
    },
    setTokenB: (state, action) => {
      state.tokenB = action.payload;
      state.amountB = '';
      state.priceImpact = 0;
    },
    setAmountA: (state, action) => {
      state.amountA = action.payload;
    },
    setAmountB: (state, action) => {
      state.amountB = action.payload;
    },
    setSlippage: (state, action) => {
      state.slippage = action.payload;
    },
    setDeadline: (state, action) => {
      state.deadline = action.payload;
    },
    swapTokens: (state) => {
      const tempToken = state.tokenA;
      state.tokenA = state.tokenB;
      state.tokenB = tempToken;
      const tempAmount = state.amountA;
      state.amountA = state.amountB;
      state.amountB = tempAmount;
    },
    resetSwap: (state) => {
      state.amountA = '';
      state.amountB = '';
      state.priceImpact = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(calculateSwap.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(calculateSwap.fulfilled, (state, action) => {
        state.loading = false;
        state.amountB = action.payload.amountOut;
        state.priceImpact = action.payload.priceImpact;
      })
      .addCase(calculateSwap.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setTokenA,
  setTokenB,
  setAmountA,
  setAmountB,
  setSlippage,
  setDeadline,
  swapTokens,
  resetSwap,
} = swapSlice.actions;
export default swapSlice.reducer;
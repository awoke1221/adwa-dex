import { createSlice } from '@reduxjs/toolkit';

interface PriceState {
  prices: Record<string, number>;
}

// Mock initial prices
const initialState: PriceState = {
  prices: {
    'ETH': 3245.43,
    'USDC': 1.00,
    'USDT': 1.00,
  },
};

const priceSlice = createSlice({
  name: 'price',
  initialState,
  reducers: {
    updatePrice: (state, action) => {
      const { symbol, price } = action.payload;
      state.prices[symbol] = price;
    },
  },
});

export const { updatePrice } = priceSlice.actions;
export default priceSlice.reducer;
import { configureStore } from '@reduxjs/toolkit';
import swapReducer from './slices/swapSlice';
import priceReducer from './slices/priceSlice';
import walletReducer from './slices/walletSlice';

export const store = configureStore({
  reducer: {
    swap: swapReducer,
    price: priceReducer,
    wallet: walletReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
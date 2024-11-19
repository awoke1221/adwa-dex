import { configureStore } from '@reduxjs/toolkit';
import walletReducer from './slices/walletSlice';
import swapReducer from './slices/swapSlice';
import poolReducer from './slices/poolSlice';
import priceReducer from './slices/priceSlice';

export const store = configureStore({
  reducer: {
    wallet: walletReducer,
    swap: swapReducer,
    pool: poolReducer,
    price: priceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
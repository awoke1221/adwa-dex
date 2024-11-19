import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Token } from '../../types';

interface PoolPosition {
  tokenA: Token;
  tokenB: Token;
  fee: number;
  liquidity: string;
  range: {
    min: string;
    max: string;
  };
  apr: number;
}

interface PoolState {
  positions: PoolPosition[];
  selectedFee: number;
  priceRange: {
    min: string;
    max: string;
  };
  isFullRange: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: PoolState = {
  positions: [],
  selectedFee: 3000,
  priceRange: {
    min: '',
    max: '',
  },
  isFullRange: false,
  loading: false,
  error: null,
};

export const fetchPoolPositions = createAsyncThunk(
  'pool/fetchPositions',
  async (address: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3000/api/pools?address=${address}`);
      if (!response.ok) throw new Error('Failed to fetch pool positions');
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const poolSlice = createSlice({
  name: 'pool',
  initialState,
  reducers: {
    setSelectedFee: (state, action) => {
      state.selectedFee = action.payload;
    },
    setPriceRange: (state, action) => {
      state.priceRange = action.payload;
    },
    setIsFullRange: (state, action) => {
      state.isFullRange = action.payload;
      if (action.payload) {
        state.priceRange = { min: '0', max: '∞' };
      }
    },
    resetPool: (state) => {
      state.priceRange = { min: '', max: '' };
      state.isFullRange = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPoolPositions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPoolPositions.fulfilled, (state, action) => {
        state.loading = false;
        state.positions = action.payload;
      })
      .addCase(fetchPoolPositions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedFee,
  setPriceRange,
  setIsFullRange,
  resetPool,
} = poolSlice.actions;
export default poolSlice.reducer;
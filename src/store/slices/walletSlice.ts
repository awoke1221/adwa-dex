import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface WalletState {
  address: string;
  balance: string;
  isConnected: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: WalletState = {
  address: '',
  balance: '0',
  isConnected: false,
  loading: false,
  error: null,
};

export const connectWallet = createAsyncThunk(
  'wallet/connect',
  async (_, { rejectWithValue }) => {
    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('Please install MetaMask to use this feature');
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [accounts[0], 'latest'],
      });

      return {
        address: accounts[0],
        balance: (parseInt(balance, 16) / 1e18).toFixed(4),
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    disconnect: (state) => {
      state.address = '';
      state.balance = '0';
      state.isConnected = false;
      state.error = null;
    },
    updateBalance: (state, action) => {
      state.balance = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(connectWallet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(connectWallet.fulfilled, (state, action) => {
        state.loading = false;
        state.address = action.payload.address;
        state.balance = action.payload.balance;
        state.isConnected = true;
      })
      .addCase(connectWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isConnected = false;
      });
  },
});

export const { disconnect, updateBalance } = walletSlice.actions;
export default walletSlice.reducer;
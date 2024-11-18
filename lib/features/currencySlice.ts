import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from "axios";
import { config } from '../config';

interface CurrencyState {
  current: string;
  balance: number;
  isInitialized: boolean;
  error: string | null;
}

const initialState: CurrencyState = {
  current: 'USD',
  balance: 0,
  isInitialized: false,
  error: null,
};

export const fetchBalance = createAsyncThunk(
  'currency/fetchBalance',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${config.server}/api/user/fetchUserBalance/${userId}`
      );
      if (response.data.status) {
        return response.data.userBalance;
      } else {
        return rejectWithValue(response.data.message || 'Failed to fetch balance');
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data || 'An error occurred');
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    setCurrency: (state, action: PayloadAction<string>) => {
      state.current = action.payload;
      state.isInitialized = true;
    },
    setBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBalance.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchBalance.fulfilled, (state, action) => {
        state.balance = action.payload;
        state.isInitialized = true;
      })
      .addCase(fetchBalance.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setCurrency, setBalance } = currencySlice.actions;
export default currencySlice.reducer;

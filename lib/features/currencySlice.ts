import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CurrencyState {
  current: string
  balance: number
  isInitialized: boolean
}

const initialState: CurrencyState = {
  current: 'USD',
  balance: 300000, // Starting with a default balance
  isInitialized: false
}

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    setCurrency: (state, action: PayloadAction<string>) => {
      state.current = action.payload
      state.isInitialized = true
    },
    setBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload
    }
  }
})

export const { setCurrency, setBalance } = currencySlice.actions
export default currencySlice.reducer
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from 'axios';
import { config } from "../config";



interface Bet {
    userId: string;
    amount: number;
    sessionId: string;
    cashedOut: boolean;
    cashOutMultiplier: number;
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    userName: string;
    userImage: string;
}

interface AviatorState {
    isConnected: boolean
    sessionId: string | null
    gameStatus: 'waiting' | 'started' | 'crashed'
    currentMultiplier: number
    finalMultiplier: number | null
    multiplierHistory: number[]
    bets: Bet[]
    isBetting: boolean
    autoCashOut: boolean
    autoCashOutAmount: number
    error: string | null
}

const initialState: AviatorState = {
    isConnected: false,
    sessionId: null,
    gameStatus: 'waiting',
    currentMultiplier: 1,
    finalMultiplier: null,
    multiplierHistory: [],
    bets: [],
    isBetting: false,
    autoCashOut: false,
    autoCashOutAmount: 2,
    error: null,
};

export const placeBet = createAsyncThunk(
    'aviator/placeBet',
    async ({ userId, amount }: { userId: string; amount: number }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${config.server}/aviator/place-bet`, { userId, amount }, {
                headers: { Authorization: `Bearer ${config.token}` }
            })
            return response.data
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                return rejectWithValue(error.response.data)
            }
            return rejectWithValue('An unexpected error occurred')
        }
    }
)

export const cashOut = createAsyncThunk(
    'aviator/cashOut',
    async ({ userId, currentMultiplier }: { userId: string; currentMultiplier: number }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${config.server}/aviator/cash-out`, { userId, currentMultiplier }, {
                headers: { Authorization: `Bearer ${config.token}` }
            })
            return response.data
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                return rejectWithValue(error.response.data)
            }
            return rejectWithValue('An unexpected error occurred')
        }
    }
)

export const fetchUserBets = createAsyncThunk(
    'aviator/fetchUserBets',
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${config.server}/aviator/getBets/${userId}`, {
                headers: { Authorization: `Bearer ${config.token}` }
            })
            return response.data
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                return rejectWithValue(error.response.data)
            }
            return rejectWithValue('An unexpected error occurred')
        }
    }
)

const aviatorSlice = createSlice({
    name: 'aviator',
    initialState,
    reducers: {
        setConnectionStatus: (state, action: PayloadAction<boolean>) => {
            state.isConnected = action.payload;
        },
        setSessionId: (state, action: PayloadAction<string>) => {
            state.sessionId = action.payload;
            state.gameStatus = 'waiting';
        },
        setGameStarted: (state) => {
            state.gameStatus = 'started';
            state.currentMultiplier = 1;
            state.finalMultiplier = null;
        },
        setCurrentMultiplier: (state, action: PayloadAction<number>) => {
            state.currentMultiplier = action.payload;
        },
        setGameCrashed: (state, action: PayloadAction<number>) => {
            state.gameStatus = 'crashed';
            state.finalMultiplier = action.payload;
            state.multiplierHistory.push(action.payload);
        },
        resetGame: (state) => {
            state.gameStatus = 'waiting';
            state.currentMultiplier = 1;
            state.finalMultiplier = null;
            state.isBetting = false;
        },
        setBets: (state, action: PayloadAction<Bet[]>) => {
            state.bets = action.payload
        },
        updateBet: (state, action: PayloadAction<Partial<Bet>>) => {
            const index = state.bets.findIndex(bet => bet.userId === action.payload.userId)
            if (index !== -1) {
                state.bets[index] = { ...state.bets[index], ...action.payload }
            } else {
                state.bets.push(action.payload as Bet)
            }
        },
        setAutoCashOut: (state, action: PayloadAction<{ enabled: boolean; amount: number }>) => {
            state.autoCashOut = action.payload.enabled
            state.autoCashOutAmount = action.payload.amount
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload
        },
        cancelBet: (state, action: PayloadAction<string>) => {
            state.isBetting = false
            state.bets = state.bets.filter(bet => bet.userId !== action.payload)
        },
    },
    extraReducers(builder) {
        builder
            .addCase(placeBet.pending, (state) => {
                state.error = null
            })
            .addCase(placeBet.fulfilled, (state, action) => {
                state.isBetting = true
                state.bets.push(action.payload.bet)
                state.error = null
            })
            .addCase(placeBet.rejected, (state, action) => {
                state.error = action.payload as string
            })
            .addCase(cashOut.pending, (state) => {
                state.error = null
            })
            .addCase(cashOut.fulfilled, (state, action) => {
                state.isBetting = false;
                if (action.payload && action.payload.bet) {
                    const betIndex = state.bets.findIndex(bet => bet.userId === action.payload.bet.userId);
                    if (betIndex !== -1) {
                        state.bets[betIndex].cashedOut = true;
                        state.bets[betIndex].cashOutMultiplier = action.payload.bet.cashOutMultiplier;
                    } else {
                        // If the bet is not found, add it to the bets array
                        state.bets.push(action.payload.bet);
                    }
                }
                state.error = null;
            })
            .addCase(cashOut.rejected, (state, action) => {
                state.error = action.payload as string || 'An error occurred during cash out';
            })
            .addCase(fetchUserBets.pending, (state) => {
                state.error = null
            })
            .addCase(fetchUserBets.fulfilled, (state, action) => {
                state.bets = action.payload.data
                state.error = null
            })
            .addCase(fetchUserBets.rejected, (state, action) => {
                state.error = action.payload as string
            })
    },
})



export const {
    setConnectionStatus,
    setSessionId,
    setGameStarted,
    setCurrentMultiplier,
    setGameCrashed,
    resetGame,
    setBets,
    updateBet,
    setAutoCashOut,
    setError,
    cancelBet,
} = aviatorSlice.actions;

export default aviatorSlice.reducer;
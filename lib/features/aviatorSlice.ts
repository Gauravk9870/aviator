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
            const response = await axios.post('http://88.222.215.60/api/aviator/place-bet', { userId, amount }, {
                headers: { Authorization: config.token }
            })

            if (response.data.status) {
                return response.data.bet;
            } else {
                return rejectWithValue(response.data.error);
            }
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
            const response = await axios.post('http://88.222.215.60/api/aviator/cash-out', { userId, currentMultiplier }, {
                headers: { Authorization: config.token }
            })
            if (response.data.status) {
                return response.data.payout;
            } else {
                return rejectWithValue(response.data.error);
            }
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
            const response = await axios.get(`http://88.222.215.60/api/aviator/getBets/${userId}`, {
                headers: { Authorization: config.token }
            })
            if (response.data.status) {
                return response.data.data;
            } else {
                return rejectWithValue(response.data.message);
            }
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
        setBetPlaced: (state, action: PayloadAction<boolean>) => {
            state.isBetting = action.payload;
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
            state.isBetting = false;
        },
        resetGame: (state) => {
            state.gameStatus = 'waiting';
            state.currentMultiplier = 1;
            state.finalMultiplier = null;
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
    },
    extraReducers(builder) {
        builder
            .addCase(placeBet.pending, (state) => {
                state.error = null
            })
            .addCase(placeBet.fulfilled, (state, action) => {
                state.bets.push(action.payload)
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
                const betIndex = state.bets.findIndex(bet => bet.userId === action.meta.arg.userId);
                if (betIndex !== -1) {
                    state.bets[betIndex].cashedOut = true;
                    state.bets[betIndex].cashOutMultiplier = action.meta.arg.currentMultiplier;
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
                state.bets = action.payload
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
    setBetPlaced
} = aviatorSlice.actions;

export default aviatorSlice.reducer;
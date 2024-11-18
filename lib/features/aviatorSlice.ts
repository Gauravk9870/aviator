import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { config } from "../config";
import showCashoutNotification from "@/components/layout/Notification";


type SetPendingBetPayload = {
  userId: string;
  amount: number;
  sectionId: string;
};

interface Bet {
  userId: string
  amount: number
  sessionId: string
  cashedOut: boolean
  cashOutMultiplier: number
  _id: string
  createdAt: string
  updatedAt: string
  __v: number
  userName: string
  userImage: string
}

interface AviatorState {

  pendingBet: SetPendingBetPayload | null;
  isConnected: boolean
  sessionId: string | null
  gameStatus: "waiting" | "started" | "crashed"
  currentMultiplier: number
  finalMultiplier: number | null
  multiplierHistory: number[]
  bets: Bet[]
  isBetting: string | null
  autoCashOut: boolean
  autoCashOutAmount: number
  error: string | null
  myBets: Bet[];
  topBets: Bet[];

  bet_id: string | null;
}

const initialState: AviatorState = {
  pendingBet: null,
  isConnected: false,
  sessionId: null,
  gameStatus: "waiting",
  currentMultiplier: 1,
  finalMultiplier: null,
  multiplierHistory: [],
  bets: [],
  isBetting: null,
  autoCashOut: false,
  autoCashOutAmount: 2,
  error: null,
  myBets: [],
  topBets: [],
  bet_id: null,
};




export const placeBet = createAsyncThunk(
  "aviator/placeBet",
  async (
    {
      userId,
      amount,
      socket,
      sectionId,
    }: {
      userId: string;
      amount: number;
      socket?: WebSocket | null;
      sectionId: string
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${config.server}/api/aviator/place-bet`,
        { userId, amount },
        {
          headers: { Authorization: config.token },
        }
      );
      if (response.data.status) {
        const bet = response.data.bet;


        return { bet, sectionId };
      } else {
        console.log(response.data.error)
        return rejectWithValue(response.data.error);


      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const cashOut = createAsyncThunk(
  "aviator/cash-out",
  async (
    {
      betId,
      userId,
      currentMultiplier,
      socket,
      sessionId,
      sectionId,
    }: {
      betId: string
      userId: string;
      currentMultiplier: number;
      socket: WebSocket;
      sessionId: string | null;
      sectionId: string;
    },
    { rejectWithValue }
  ) => {
    try {

      const response = await axios.post(
        `${config.server}/api/aviator/cash-out`,
        { betId, userId, currentMultiplier },
        {
          headers: { Authorization: config.token },
        }
      );

      if (response.data.status) {
        const payout = response.data.payout;
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(
            JSON.stringify({
              type: "CASHED_OUT_BETS",
              data: {
                userId,
                amount: payout,
                sessionId,
                cashedOut: true,
                cashOutMultiplier: currentMultiplier,
              },
            })
          );
        }

        return { payout, sectionId };
      } else {
        console.error("API error:", response.data.error);
        return rejectWithValue(response.data.error);
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        // alert(error.response.data.error);
        return rejectWithValue(error.response.data);
      }
      console.error("Unexpected error:", error);
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const fetchUserBets = createAsyncThunk(
  "aviator/fetchUserBets",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${config.server}/api/aviator/getBets/${userId}`,
        {
          headers: { Authorization: config.token },
        }
      );
      if (response.data.status) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const fetchCrashPoints = createAsyncThunk(
  "aviator/fetchCrashPoints",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${config.server}/api/aviator/getCrashPoint`, {
        headers: { Authorization: config.token },
      });

      if (response.data.status) {
        return response.data.data;
      } else {
        console.error("Error fetching crash points:", response.data.message);
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      console.error("Error fetching crash points:", error);
      return rejectWithValue("An error occurred while fetching crash points.");
    }
  }
);

export const fetchTopBets = createAsyncThunk(
  "aviator/fetchTopBets",
  async (
    {
      category,
      filter,
    }: { category: "hugeWins" | "biggestWins" | "multipliers"; filter: "day" | "month" | "year" },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `${config.server}/api/aviator/getTopBets/${category}/${filter}`,
        {
          headers: { Authorization: config.token },
        }
      );

      if (response.data.status) {
        return response.data.data; // Assuming the API returns the top bets in `data`
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An error occurred while fetching top bets.");
    }
  }
);

export const fetchBetsByUser = createAsyncThunk(
  "aviator/fetchBetsByUser",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${config.server}/api/aviator/getBets/${userId}`, {
        headers: { Authorization: config.token },
      });

      if (response.data.status && response.data.data) {
        return response.data.data; // Assuming the API returns the user's bets in `data`
      } else if (!response.data.status && response.data.message === "No bets found") {
        return []; // No bets found for this user
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An error occurred while fetching bets.");
    }
  }
);

const aviatorSlice = createSlice({
  name: "aviator",
  initialState,
  reducers: {
    setPendingBet: (state, action: PayloadAction<SetPendingBetPayload>) => {
      state.pendingBet = action.payload;
    },

    clearPendingBet: (state) => {
      state.pendingBet = null;
    },
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    setBetPlaced: (state, action: PayloadAction<string | null>) => {
      state.isBetting = action.payload
    },
    setWaiting: (state) => {
      state.gameStatus = "waiting"
    },
    setSessionId: (state, action: PayloadAction<string>) => {
      state.sessionId = action.payload;
    },
    setGameStarted: (state) => {
      state.gameStatus = "started";
      state.currentMultiplier = 1;
      state.finalMultiplier = null;
    },
    setCurrentMultiplier: (state, action: PayloadAction<number>) => {
      state.currentMultiplier = action.payload;
    },
    setGameCrashed: (state, action: PayloadAction<number>) => {
      state.gameStatus = "crashed";
      state.finalMultiplier = action.payload;
      state.multiplierHistory.push(action.payload);
      state.isBetting = null;
    },
    resetGame: (state) => {
      state.currentMultiplier = 1;
      state.finalMultiplier = null;
    },
    setBets: (state, action: PayloadAction<Bet[]>) => {
      state.bets = action.payload;
    },
    updateBet: (state, action: PayloadAction<Partial<Bet>>) => {
      const index = state.bets.findIndex(
        (bet) => bet.userId === action.payload.userId
      );
      if (index !== -1) {
        state.bets[index] = { ...state.bets[index], ...action.payload };
      } else {
        state.bets.push(action.payload as Bet);
      }
    },
    setBetId: (state, action: PayloadAction<string | null>) => {
      state.bet_id = action.payload;
    },
    setAutoCashOut: (
      state,
      action: PayloadAction<{ enabled: boolean; amount: number; sectionId: string }>
    ) => {
      if (state.isBetting === action.payload.sectionId) {
        state.autoCashOut = action.payload.enabled
        state.autoCashOutAmount = action.payload.amount
      }
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.gameStatus = "waiting"
    },
  },
  extraReducers(builder) {
    builder
      .addCase(placeBet.pending, (state) => {
        state.error = null;
      })
    builder.addCase(placeBet.fulfilled, (state, action) => {
      state.bets.push(action.payload.bet);
      state.isBetting = action.payload.sectionId;
      state.bet_id = action.payload.bet._id;
      state.error = null;
    })

      .addCase(placeBet.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(cashOut.pending, (state) => {
        state.error = null;
      })
      .addCase(cashOut.fulfilled, (state, action) => {
        state.isBetting = null;
        const betIndex = state.bets.findIndex(
          (bet) => bet.userId === action.meta.arg.userId
        );
        if (betIndex !== -1) {
          const bet = state.bets[betIndex];
          bet.cashedOut = true;
          bet.cashOutMultiplier = action.meta.arg.currentMultiplier;
          state.bet_id = null;
          showCashoutNotification(bet.cashOutMultiplier, action.payload.payout)
        }
        state.error = null;
      })
    builder.addCase(resetGame, (state) => {
      state.bet_id = null;
    })
      .addCase(cashOut.rejected, (state, action) => {
        state.error =
          (action.payload as string) || "An error occurred during cash out";
      })
      .addCase(fetchUserBets.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchUserBets.fulfilled, (state, action) => {
        state.bets = action.payload;
        state.error = null;
      })
      .addCase(fetchUserBets.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(fetchCrashPoints.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchCrashPoints.fulfilled, (state, action) => {
        state.multiplierHistory = action.payload; // Update as needed
        state.error = null;
      })
      .addCase(fetchCrashPoints.rejected, (state, action) => {
        state.error =
          (action.payload as string) || "An error occurred while fetching crash points.";
      })

      // Hanlde fetchUserBets
      .addCase(fetchBetsByUser.pending, (state) => {
        state.error = null; // Clear previous errors
      })
      .addCase(fetchBetsByUser.fulfilled, (state, action) => {
        state.myBets = action.payload; // Update the `myBets` state
        state.error = null;
      })
      .addCase(fetchBetsByUser.rejected, (state, action) => {
        state.error = action.payload as string; // Handle errors
      })

      // Handle fetchTopBets
      .addCase(fetchTopBets.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchTopBets.fulfilled, (state, action) => {
        state.topBets = action.payload;
        state.error = null;
      })
      .addCase(fetchTopBets.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  setPendingBet,
  clearPendingBet,
  setConnectionStatus,
  setSessionId,
  setWaiting,
  setGameStarted,
  setCurrentMultiplier,
  setGameCrashed,
  resetGame,
  setBets,
  updateBet,
  setAutoCashOut,
  setError,
  setBetPlaced,
  setBetId
} = aviatorSlice.actions;

export default aviatorSlice.reducer;

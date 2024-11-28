import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { config } from "../config";
import showCashoutNotification from "@/components/layout/Notification";
import { ActiveSessionBet } from "../utils";


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
  date: string
}



interface AviatorState {
  user: string | null;
  userEmail: string | null,
  token: string | null;
  verified: boolean;
  gameLogo: string | null;
  poweredByLogo: string | null;
  currentMultiplier: number
  gameStatus: "waiting" | "started" | "crashed"
  multipliersStarted: boolean;
  activeBetsBySection: {
    [sectionId: string]: {
      userId: string;
      amount: number;
      sessionId: string;
      cashedOut: boolean;
      cashOutMultiplier: number;
      _id: string;
    };
  };
  pendingBetsBySection: {
    [sectionId: string]: {
      userId: string;
      amount: number;
      token: string;
    };

  };



  isConnected: boolean
  sessionId: string | null
  finalMultiplier: number | null
  multiplierHistory: number[]
  bets: Bet[]
  error: string | null
  myBets: Bet[];
  topBets: Bet[];

  bet_id: string | null;
  loadingMyBets: boolean;
  loadingTopBets: boolean;
  activeSessionBets: ActiveSessionBet[]
}

const initialState: AviatorState = {
  user: null,
  userEmail: null,
  token: null,
  verified: false,
  gameLogo: null,
  poweredByLogo: null,
  currentMultiplier: 1,
  gameStatus: "waiting",
  multipliersStarted: false,
  activeBetsBySection: {},
  pendingBetsBySection: {},
  isConnected: false,
  sessionId: null,
  finalMultiplier: null,
  multiplierHistory: [],
  bets: [],
  error: null,
  myBets: [],
  topBets: [],
  bet_id: null,
  loadingMyBets: false,
  loadingTopBets: false,
  activeSessionBets: []
};

//VERIFY API
export const verifyToken = createAsyncThunk(
  "aviator/verifyToken",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${config.server}/api/user/verifyToken`,
        { token }
      );
      if (response.data.status) {
        return true;
      } else {
        return rejectWithValue(false);
      }
    } catch (error) {
      return rejectWithValue(false);
    }
  }
);

export const fetchGameLogo = createAsyncThunk(
  "aviator/fetchGameLogo",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${config.server}/api/getGameLogo/aviator`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });

      const data = await response.json();
      if (data.status) {
        return {
          gameLogo: data.data.gameLogo,
          poweredByLogo: data.data.poweredByLogo,
        };
      } else {
        return rejectWithValue(data.message || "Failed to fetch game logos.");
      }
    } catch (error) {
      return rejectWithValue("An error occurred while fetching game logos.");
    }
  }
);


export const placeBet = createAsyncThunk(
  "aviator/placeBet",
  async (
    {
      userId,
      amount,
      sectionId,
      token,
    }: {
      userId: string;
      amount: number;
      sectionId: string
      token: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${config.server}/api/aviator/place-bet`,
        { userId, amount },
        {
          headers: { Authorization: token },
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
      sectionId,
      token,
    }: {
      betId: string
      userId: string;
      currentMultiplier: number;
      sectionId: string;
      token: string;
    },
    { rejectWithValue }
  ) => {
    try {

      const response = await axios.post(
        `${config.server}/api/aviator/cash-out`,
        { betId, userId, currentMultiplier },
        {
          headers: { Authorization: token },
        }
      );

      if (response.data.status) {
        const payout = response.data.data.payout;

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
  async ({ userId, token }: {
    userId: string;
    token: string;
  }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${config.server}/api/aviator/getBets/${userId}`,
        {
          headers: { Authorization: token },
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
  async ({ token }: { token: string }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${config.server}/api/aviator/getCrashPoint`, {
        headers: { Authorization: token },
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
      token
    }: { category: "hugeWins" | "biggestWins" | "multipliers"; filter: "day" | "month" | "year", token: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `${config.server}/api/aviator/getTopBets/${category}/${filter}`,
        {
          headers: { Authorization: token },
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
      return rejectWithValue("An error occurred while fetching top bets.");
    }
  }
);

export const fetchBetsByUser = createAsyncThunk(
  "aviator/fetchBetsByUser",
  async ({ userId, token }: { userId: string, token: string }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${config.server}/api/aviator/getBets/${userId}`, {
        headers: { Authorization: token },
      });

      if (response.data.status && response.data.data) {
        return response.data.data;
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

export const fetchActiveSessionBets = createAsyncThunk<
  ActiveSessionBet[],
  { token: string },
  { rejectValue: string }
>(
  "aviator/fetchActiveSessionBets",
  async ({ token }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${config.server}/api/aviator/getActiveSessionBets`,
        {
          headers: { Authorization: token },
        }
      );

      if (response.data.status) {
        return response.data.data as ActiveSessionBet[];
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An error occurred while fetching active session bets.");
    }
  }
);


const aviatorSlice = createSlice({
  name: "aviator",
  initialState,
  reducers: {
    setPendingBetBySection: (
      state,
      action: PayloadAction<{
        sectionId: string;
        userId: string;
        amount: number;
        token: string;
      }>
    ) => {
      const { sectionId, userId, amount, token } = action.payload;
      state.pendingBetsBySection[sectionId] = { userId, amount, token };
    },

    clearPendingBetBySection: (state, action: PayloadAction<string>) => {
      const sectionId = action.payload;
      delete state.pendingBetsBySection[sectionId];
    },

    setGameStarted: (state) => {
      state.gameStatus = "started";
      state.currentMultiplier = 1;
      state.finalMultiplier = null;
    },

    setMultipliersStarted: (state) => {
      state.multipliersStarted = true;
    },
    resetMultipliersStarted: (state) => {
      state.multipliersStarted = false;
    },

    setWaiting: (state) => {
      state.gameStatus = "waiting"
      state.multipliersStarted = false;
    },

    setGameCrashed: (state, action: PayloadAction<number>) => {
      state.gameStatus = "crashed";
      state.finalMultiplier = action.payload;
      state.multiplierHistory.push(action.payload);
      state.multipliersStarted = false;
      state.activeBetsBySection = {}

    },

    removeActiveBetBySection: (state, action: PayloadAction<string>) => {
      const sectionId = action.payload;
      delete state.activeBetsBySection[sectionId];
    },

    removePendingBetBySection: (state, action: PayloadAction<string>) => {
      const sectionId = action.payload;
      delete state.pendingBetsBySection[sectionId];
    },

    //OLD
    setUser: (state, action: PayloadAction<string | null>) => {
      state.user = action.payload;

    },
    setEmail: (state, action: PayloadAction<string | null>) => {
      state.userEmail = action.payload
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;

    },

    clearTopBets: (state) => {
      state.topBets = [];
    },

    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },


    setSessionId: (state, action: PayloadAction<string>) => {
      state.sessionId = action.payload;
    },

    setCurrentMultiplier: (state, action: PayloadAction<number>) => {
      state.currentMultiplier = action.payload;
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

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.gameStatus = "waiting"
    },
  },
  extraReducers(builder) {
    builder
      // PLACE BET
      .addCase(placeBet.pending, (state) => {
        state.error = null;
      })
      .addCase(placeBet.fulfilled, (state, action) => {
        const { bet, sectionId } = action.payload;

        // Add the active bet to the corresponding section
        state.activeBetsBySection[sectionId] = {
          userId: bet.userId,
          amount: bet.amount,
          sessionId: bet.sessionId,
          cashedOut: bet.cashedOut,
          cashOutMultiplier: bet.cashOutMultiplier,
          _id: bet._id,
        };

        console.log("Bet Added to active bet")
        console.log(`${sectionId} : ${bet}`)

        // Add bet to the bets array
        state.bets.push(action.payload.bet);
        state.error = null;
      })

      .addCase(placeBet.rejected, (state, action) => {
        const { sectionId, userId, amount, token } = action.meta.arg;

        // Check if the error is "Please wait for the next game."
        if (
          action.payload &&
          typeof action.payload === "object" &&
          "error" in action.payload &&
          action.payload.error === "Please wait for the next game."
        ) {
          // Store the pending bet for the section
          state.pendingBetsBySection[sectionId] = { userId, amount, token };
          state.error = "Bet is pending. Please wait for the next game."; // Set specific error message
          console.warn("Bet is held, will retry when the game starts.");
        } else {
          state.error = action.payload as string;
        }
      })

      // CASHOUT
      .addCase(cashOut.pending, (state) => {
        state.error = null;
      })
      .addCase(cashOut.fulfilled, (state, action) => {
        const { sectionId, payout } = action.payload;

        // Reset the active bet for the specific section
        if (state.activeBetsBySection[sectionId]) {
          delete state.activeBetsBySection[sectionId];
        }

        showCashoutNotification(action.meta.arg.currentMultiplier, payout);
        state.error = null;
      })
      .addCase(verifyToken.pending, (state) => {
        state.verified = false;
        state.error = null;
      })
      .addCase(verifyToken.fulfilled, (state) => {
        state.verified = true;
      })
      .addCase(verifyToken.rejected, (state) => {
        state.verified = false;
        state.error = "Token verification failed.";
      })
      .addCase(cashOut.rejected, (state, action) => {
        state.error =
          (action.payload as string) || "An error occurred during cash out";
      })
      .addCase(fetchGameLogo.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchGameLogo.fulfilled, (state, action) => {
        state.gameLogo = action.payload.gameLogo;
        state.poweredByLogo = action.payload.poweredByLogo;
        state.error = null;
      })
      .addCase(fetchGameLogo.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // FETCH USER BETS
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

      // FETCH CRASH POINTS
      .addCase(fetchCrashPoints.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchCrashPoints.fulfilled, (state, action) => {
        state.multiplierHistory = action.payload;
        state.error = null;
      })
      .addCase(fetchCrashPoints.rejected, (state, action) => {
        state.error =
          (action.payload as string) || "An error occurred while fetching crash points.";
      })

      // FETCH BETS BY USER
      .addCase(fetchBetsByUser.pending, (state) => {
        state.loadingMyBets = true;
        state.error = null;
      })
      .addCase(fetchBetsByUser.fulfilled, (state, action) => {
        state.myBets = action.payload;
        state.loadingMyBets = false;
        state.error = null;
      })
      .addCase(fetchBetsByUser.rejected, (state, action) => {
        state.loadingMyBets = false;
        state.error = action.payload as string;
      })

      // FETCH TOP BETS
      .addCase(fetchTopBets.pending, (state) => {
        state.loadingTopBets = true;
        state.error = null;
      })
      .addCase(fetchTopBets.fulfilled, (state, action) => {
        state.topBets = Array.isArray(action.payload) ? action.payload : [];
        state.loadingTopBets = false;
        state.error = null;
      })
      .addCase(fetchTopBets.rejected, (state, action) => {
        state.loadingTopBets = false;
        state.error = action.payload as string;
      })
      //FETCH ActiveSessionBets BETS
      .addCase(fetchActiveSessionBets.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchActiveSessionBets.fulfilled, (state, action) => {
        state.activeSessionBets = action.payload;
        state.error = null;
      })
      .addCase(fetchActiveSessionBets.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  setUser,
  setToken,
  setEmail,
  clearTopBets,
  setPendingBetBySection,
  clearPendingBetBySection,
  setConnectionStatus,
  setSessionId,
  setWaiting,
  setGameStarted,
  setCurrentMultiplier,
  setGameCrashed,
  setBets,
  updateBet,
  setError,
  setBetId,
  setMultipliersStarted,
  resetMultipliersStarted,
  removeActiveBetBySection,
  removePendingBetBySection,
} = aviatorSlice.actions;

export default aviatorSlice.reducer;

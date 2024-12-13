import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { config } from "../config";
import showCashoutNotification from "@/components/layout/Notification";
import { ActiveSessionBet } from "../utils";
import {
  placeBet as placeBetServerAction,
  cashOut as cashOutServerAction,
} from "@/lib/actions/actions";
import toast from "react-hot-toast";

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
  date: string;
}

interface AviatorState {
  user: string | null;
  userEmail: string | null;
  userName: string | null;
  token: string | null;
  verified: boolean;

  gameLogo: string | null;
  poweredByLogo: string | null;
  currentMultiplier: number;
  gameStatus: "waiting" | "started" | "crashed";
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

  isConnected: boolean;
  sessionId: string | null;
  finalMultiplier: number | null;
  multiplierHistory: number[];
  bets: Bet[];
  error: string | null;
  myBets: Bet[];
  topBets: Bet[];

  bet_id: string | null;
  loadingMyBets: boolean;
  loadingTopBets: boolean;
  loadingActiveSessionBets: boolean;
  activeSessionBets: ActiveSessionBet[];
}

const initialState: AviatorState = {
  user: null,
  userEmail: null,
  userName: null,
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
  loadingActiveSessionBets: false,

  activeSessionBets: [],
};
let sessionTracking: {
  [sessionId: string]: { [sectionId: string]: { createdTime: number } };
} = {};

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
      console.error(error);
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
      console.error(error);
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
      sessionIds,
    }: {
      userId: string;
      amount: number;
      sectionId: string;
      token: string;
      sessionIds: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const sessionId = sessionIds;
      const currentTime = new Date().getTime();

      if (!sessionTracking[sessionId]) {
        console.log(
          `New session detected: ${sessionId}. Clearing previous sessions.`
        );
        sessionTracking = {};
      }

      if (sessionTracking[sessionId] && sessionTracking[sessionId][sectionId]) {
        const lastCreatedTime =
          sessionTracking[sessionId][sectionId].createdTime;
        const timeDiff = currentTime - lastCreatedTime;

        if (timeDiff < 5000) {
          console.log(
            `API call skipped for sessionId: ${sessionId}, sectionId: ${sectionId}. Time difference is less than 3 seconds.`
          );
          return rejectWithValue({
            message: "Duplicate API call prevented within 5 seconds",
            statusCode: 400,
          });
        } else {
          console.log(`Section created more than 5 seconds ago. Allowing bet.`);
        }
      }

      if (!sessionTracking[sessionId]) {
        sessionTracking[sessionId] = {};
      }

      sessionTracking[sessionId][sectionId] = { createdTime: currentTime };

      const result = await placeBetServerAction(userId, amount, token);
      if (result.success) {
        console.log(`PlaceBet successful for sectionId: ${sectionId}`);
        return { bet: result.bet, sectionId };
      } else {
        return rejectWithValue({
          message: result.error,
          statusCode: result.statusCode,
        });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      return rejectWithValue({
        message: "An unexpected error occurred",
        statusCode: 500,
      });
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
      betId: string;
      userId: string;
      currentMultiplier: number;
      sectionId: string;
      token: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const result = await cashOutServerAction(
        betId,
        userId,
        currentMultiplier,
        sectionId,
        token
      );

      if (result.success) {
        return { data: result.data, sectionId };
      } else {
        return rejectWithValue({
          message: result.error,
          statusCode: result.statusCode,
        });
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
  async (
    {
      userId,
      token,
    }: {
      userId: string;
      token: string;
    },
    { rejectWithValue }
  ) => {
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
      const response = await axios.get(
        `${config.server}/api/aviator/getCrashPoint`,
        {
          headers: { Authorization: token },
        }
      );

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
      token,
    }: {
      category: "hugeWins" | "biggestWins" | "multipliers";
      filter: "day" | "month" | "year";
      token: string;
    },
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
        console.log(response);
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
  async (
    { userId, token }: { userId: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `${config.server}/api/aviator/getBets/${userId}`,
        {
          headers: { Authorization: token },
        }
      );

      if (response.data.status && response.data.data) {
        return response.data.data;
      } else if (
        !response.data.status &&
        response.data.message === "No bets found"
      ) {
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
  { rejectValue: ActiveSessionBet[] }
>("aviator/fetchActiveSessionBets", async ({ token }, { rejectWithValue }) => {
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
      return rejectWithValue([]);
    }
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      console.error("API Error:", error.response.data);
      return rejectWithValue([]);
    }
    return rejectWithValue([]);
  }
});

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
      state.gameStatus = "waiting";
      state.multipliersStarted = false;
    },

    setGameCrashed: (state, action: PayloadAction<number>) => {
      state.gameStatus = "crashed";
      state.finalMultiplier = action.payload;
      state.multiplierHistory.push(action.payload);
      state.multipliersStarted = false;
      state.activeBetsBySection = {};
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
      state.userEmail = action.payload;
    },
    setUserName: (state, action: PayloadAction<string | null>) => {
      state.userName = action.payload;
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
      state.gameStatus = "waiting";
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

        console.log("Bet Added to active bet");
        console.log(`${sectionId} : ${bet}`);

        // Add bet to the bets array
        state.bets.push(action.payload.bet);
        state.error = null;
      })

      .addCase(placeBet.rejected, (state, action) => {
        const { sectionId, userId, amount, token } = action.meta.arg;
        const { message, statusCode } = action.payload as {
          message: string;
          statusCode: number;
        };

        // Handle specific error codes
        switch (statusCode) {
          case 403:
            // Store the pending bet for the section
            state.pendingBetsBySection[sectionId] = { userId, amount, token };
            state.error = "Bet is pending. Please wait for the next game.";
            toast(message, {
              position: "top-center",
              style: {
                backgroundColor: "#dc2626",
                color: "white",
              },
              duration: 3000,
            });
            break;

          default:
            if (message !== "Duplicate API call prevented within 5 seconds") {
              toast(message, {
                position: "top-center",
                style: {
                  backgroundColor: "#dc2626",
                  color: "white",
                },
                duration: 3000,
              });
            }

            delete state.pendingBetsBySection[sectionId];
            delete state.activeBetsBySection[sectionId];

            break;
        }

        console.error("placeBet.rejected :", state.error);
      })

      // CASHOUT
      .addCase(cashOut.pending, (state) => {
        state.error = null;
      })
      .addCase(cashOut.fulfilled, (state, action) => {
        const { sectionId, data } = action.payload;

        // Reset the active bet for the specific section
        if (state.activeBetsBySection[sectionId]) {
          delete state.activeBetsBySection[sectionId];
        }

        // {
        //   "bet": {
        //     "_id": "674db0cc8756bd9d50b72dc7",
        //     "userId": "11565",
        //     "amount": 10,
        //     "sessionId": "674db0cb8756bd9d50b72db5",
        //     "cashedOut": true,
        //     "cashOutMultiplier": 1.18,
        //     "createdAt": "2024-12-02T13:06:20.805Z",
        //     "updatedAt": "2024-12-02T13:06:26.850Z",
        //     "__v": 0
        //   },
        //   "userBalance": 40.4
        // }
        const payout = data.bet.amount * data.bet.cashOutMultiplier;
        showCashoutNotification(action.meta.arg.currentMultiplier, payout);
        delete state.pendingBetsBySection[sectionId];
        delete state.activeBetsBySection[sectionId];

        state.error = null;
      })
      .addCase(cashOut.rejected, (state, action) => {
        const { message, statusCode } = action.payload as {
          message: string;
          statusCode: number;
        };

        state.error = message;
        toast(message, {
          position: "top-center",
          style: {
            backgroundColor: "#dc2626",
            color: "white",
          },
          duration: 3000,
        });

        console.error("cashOut.rejected: ", state.error, statusCode);
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
          (action.payload as string) ||
          "An error occurred while fetching crash points.";
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
      // FETCH ACTIVE SESSION BETS
      .addCase(fetchActiveSessionBets.pending, (state) => {
        state.loadingActiveSessionBets = true;
        state.error = null;
      })
      .addCase(fetchActiveSessionBets.fulfilled, (state, action) => {
        state.loadingActiveSessionBets = false;
        state.activeSessionBets = action.payload;
      })
      .addCase(fetchActiveSessionBets.rejected, (state, action) => {
        state.loadingActiveSessionBets = false;
        state.activeSessionBets = action.payload || [];
        state.error = action.payload ? null : "Failed to fetch session bets.";
      });
  },
});

export const {
  setUser,
  setToken,
  setEmail,
  setUserName,
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

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AviatorState {
    isConnected: boolean;
    sessionId: string | null;
    gameStatus: 'waiting' | 'started' | 'crashed';
    currentMultiplier: string | null;
    finalMultiplier: string | null;
    multiplierHistory: string[]
}

const initialState: AviatorState = {
    isConnected: false,
    sessionId: null,
    gameStatus: 'waiting',
    currentMultiplier: null,
    finalMultiplier: null,
    multiplierHistory: [],
};

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
            state.currentMultiplier = null;
            state.finalMultiplier = null;
        },
        setCurrentMultiplier: (state, action: PayloadAction<string>) => {
            state.currentMultiplier = action.payload;
        },
        setGameCrashed: (state, action: PayloadAction<string>) => {
            state.gameStatus = 'crashed';
            state.finalMultiplier = action.payload;
            state.multiplierHistory.push(action.payload);
        },
        resetGame: (state) => {
            state.gameStatus = 'waiting';
            state.currentMultiplier = null;
            state.finalMultiplier = null;
        },
    }
})



export const {
    setConnectionStatus,
    setSessionId,
    setGameStarted,
    setCurrentMultiplier,
    setGameCrashed,
    resetGame,
} = aviatorSlice.actions;

export default aviatorSlice.reducer;
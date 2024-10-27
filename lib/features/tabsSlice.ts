import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TabState {
  activeTab: string;
}

const initialState: TabState = {
  activeTab: "all-bets",
};

const tabsSlice = createSlice({
  name: "tabs",
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
  },
});

export const { setActiveTab } = tabsSlice.actions;
export default tabsSlice.reducer;

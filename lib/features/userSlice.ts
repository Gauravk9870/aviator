import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  username: string;
  credits: number;
  avatar: string;
}

const initialState: UserState = {
  username: "",
  credits: 0,
  avatar: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      return { ...state, ...action.payload };
    },
    updateCredits: (state, action: PayloadAction<number>) => {
      state.credits = action.payload;
    },
    updateAvatar: (state, action: PayloadAction<string>) => {
      state.avatar = action.payload;
    },
  },
});

export const { setUser, updateCredits, updateAvatar } = userSlice.actions;
export default userSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MenuState {
  isOpen: boolean;
  isTransitioning: boolean;
}

const initialState: MenuState = {
  isOpen: false,
  isTransitioning: false,
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    openMenu: (state) => {
      state.isOpen = true;
    },
    closeMenu: (state) => {
      state.isOpen = false;
    },
    setTransitioning: (state, action: PayloadAction<boolean>) => {
      state.isTransitioning = action.payload;
    },
  },
});

export const { openMenu, closeMenu, setTransitioning } = menuSlice.actions;
export default menuSlice.reducer;

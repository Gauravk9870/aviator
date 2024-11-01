import { combineReducers, configureStore } from "@reduxjs/toolkit";
import tabsReducer from "@/lib/features/tabsSlice";
import menuReducer from "@/lib/features/menuSlice";
import currencyReducer from "@/lib/features/currencySlice";
import aviatorReducer from "@/lib/features/aviatorSlice";

const rootReducer = combineReducers({
  tabs: tabsReducer,
  menu: menuReducer,
  currency: currencyReducer,
  aviator: aviatorReducer,
});

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

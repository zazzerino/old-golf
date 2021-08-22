import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import golf from "./golfSlice";

export const store = configureStore({
  reducer: {
    golf,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

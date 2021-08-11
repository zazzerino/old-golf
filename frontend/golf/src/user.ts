import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./app/store";

export interface User {
  id: number,
  name: string,
}

type UserState = User | null;

const userSlice = createSlice({
  name: 'user',
  initialState: null as UserState,
  reducers: {
    setUser: (_state, action: PayloadAction<User>) => action.payload,
  }
});

export const selectUser = (state: RootState) => state.user;
export const selectUserId = (state: RootState) => state.user?.id;

export const { setUser } = userSlice.actions;

export const userReducer = userSlice.reducer;

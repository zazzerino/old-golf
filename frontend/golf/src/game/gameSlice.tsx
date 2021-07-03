import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { Game } from "./logic";

type GameState = Game | null;

export const gameSlice = createSlice({
  name: 'game',
  initialState: null as GameState,
  reducers: {
    setGame: (_state, action: PayloadAction<Game>) => action.payload,
  }
});

export const selectGame = (state: RootState) => state.game;

export const selectGameId = (state: RootState) => state.game?.id;

export const { setGame } = gameSlice.actions;

export const gameReducer = gameSlice.reducer;

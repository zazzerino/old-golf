import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { Game } from "./logic";

interface GameState {
  currentGame: Game | null;
  games: Game[] | null;
}

const initialState: GameState = {
  currentGame: null,
  games: null,
}

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setGames: (state: GameState, action: PayloadAction<Game[]>) => {
      state.games = action.payload;
    },
    setCurrentGame: (state: GameState, action: PayloadAction<Game>) => {
      state.currentGame = action.payload;
    }
  }
});

export const selectGames = (state: RootState) => state.game.games;
export const selectCurrentGame = (state: RootState) => state.game.currentGame;
export const selectCurrentGameId = (state: RootState) => state.game.currentGame?.id;

export const { setGames, setCurrentGame } = gameSlice.actions;
export const gameReducer = gameSlice.reducer;

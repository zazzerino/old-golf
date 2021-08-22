import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Game } from "./game/game";
import { User } from "./user";

export interface GolfState {
  user?: User;
  games: Game[];
  game?: Game;
}

const initialState: GolfState = {
  games: [],
}

export const golfSlice = createSlice({
  name: 'golf',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setGames: (state, action: PayloadAction<Game[]>) => {
      state.games = action.payload;
    },
    setGame: (state, action: PayloadAction<Game>) => {
      state.game = action.payload;
    },
  },
});

export const { setUser, setGames, setGame } = golfSlice.actions;

export default golfSlice.reducer;

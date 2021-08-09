import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { Game } from "./logic";

// can click the deck, table card, or one of the 6 cards in hand
export type ClickedCard = 'deck' | 'table' | 0 | 1 | 2 | 3 | 4 | 5 | null;

interface GameState {
  currentGame: Game | null;
  games: Game[] | null;
  clickedCard: ClickedCard;
}

const initialState: GameState = {
  currentGame: null,
  games: null,
  clickedCard: null,
}

function updateClickedCard(previousCard: ClickedCard, card: ClickedCard): ClickedCard {
  if (previousCard === card && card != null) {
    return null;
  } else {
    return card;
  }
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
    },
    cardClicked: (state: GameState, action: PayloadAction<ClickedCard>) => {
      const previousCard = state.clickedCard;
      state.clickedCard = updateClickedCard(previousCard, action.payload);
    },
  }
});

export const selectGames = (state: RootState) => state.game.games;
export const selectCurrentGame = (state: RootState) => state.game.currentGame;
export const selectCurrentGameId = (state: RootState) => state.game.currentGame?.id;
export const selectClickedCard = (state: RootState) => state.game.clickedCard;

export const { setGames, setCurrentGame, cardClicked } = gameSlice.actions;
export const gameReducer = gameSlice.reducer;

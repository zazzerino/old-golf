import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { Game } from "./logic";

// can click the deck, table card, or one of the 6 cards in hand
export type ClickedCard = 'deck' | 'table' | 0 | 1 | 2 | 3 | 4 | 5 | null;

interface GameState {
  games: Game[] | null;
  game: Game | null;
  clickedCard: ClickedCard;
  showDeck: boolean;
}

const initialState: GameState = {
  games: null,
  game: null,
  clickedCard: null,
  showDeck: false,
}

function updateClickedCard(previous: ClickedCard, card: ClickedCard): ClickedCard {
  return previous === card && card != null
    ? null
    : card;
}

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setGames: (state: GameState, action: PayloadAction<Game[]>) => {
      state.games = action.payload;
    },
    setGame: (state: GameState, action: PayloadAction<Game>) => {
      state.game = action.payload;
    },
    cardClicked: (state: GameState, action: PayloadAction<ClickedCard>) => {
      const previous = state.clickedCard;
      state.clickedCard = updateClickedCard(previous, action.payload);
    },
  }
});

export const selectGames = (state: RootState) => state.game.games;
export const selectCurrentGame = (state: RootState) => state.game.game;
export const selectCurrentGameId = (state: RootState) => state.game.game?.id;
export const selectClickedCard = (state: RootState) => state.game.clickedCard;
export const selectDeckCard = (state: RootState) => state.game.game?.deckCard;
export const selectShowDeck = (state: RootState) => state.game.game?.showDeck;

export const { setGames, setGame, cardClicked } = gameSlice.actions;
export const gameReducer = gameSlice.reducer;

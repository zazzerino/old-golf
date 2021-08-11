import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { Game } from "./logic";

// can click the deck, table card, or one of the 6 cards in hand
export type ClickedCard = 'deck' | 'table' | 0 | 1 | 2 | 3 | 4 | 5;

interface GameState {
  games: Game[] | null;
  game: Game | null;
  showDeckCard: boolean;
  clickedCard: ClickedCard | null;
}

const initialState: GameState = {
  games: null,
  game: null,
  showDeckCard: false,
  clickedCard: null,
}

function updateClickedCard(previous: ClickedCard | null, card: ClickedCard): ClickedCard | null {
  return previous === card ? null : card;
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
export const selectShowDeckCard = (state: RootState) => state.game.showDeckCard;

export const selectPlayerHand = (state: RootState) => {
  const playerId = state.user?.id;
  const player = state.game.game?.players.find(p => p.id === playerId);
  let cards = player?.cards;

  return cards === undefined ? null : cards;
}

export const { setGames, setGame, cardClicked } = gameSlice.actions;
export const gameReducer = gameSlice.reducer;

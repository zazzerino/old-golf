import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { selectUserId } from "../user";
import { CardLocation, Game } from "./logic";

// can click the deck, table card, or one of the 6 cards in hand
export type ClickedCard = 'deck' | 'table' | 'held' | 0 | 1 | 2 | 3 | 4 | 5;

interface GameSliceState {
  games: Game[] | null;
  current: Game | null;
  showDeckCard: boolean;
  clickedCard: ClickedCard | null;
}

const initialState: GameSliceState = {
  games: null,
  current: null,
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
    setGames: (state: GameSliceState, action: PayloadAction<Game[]>) => {
      state.games = action.payload;
    },
    setCurrent: (state: GameSliceState, action: PayloadAction<Game>) => {
      state.current = action.payload;
    },
    cardClicked: (state: GameSliceState, action: PayloadAction<ClickedCard>) => {
      const previous = state.clickedCard;
      state.clickedCard = updateClickedCard(previous, action.payload);
    },
  }
});

export const selectGames = (state: RootState) => state.game.games;
export const selectCurrentGame = (state: RootState) => state.game.current;
export const selectCurrentGameId = (state: RootState) => state.game.current?.id;
export const selectClickedCard = (state: RootState) => state.game.clickedCard;
export const selectDeckCard = (state: RootState) => state.game.current?.deckCard;
export const selectShowDeckCard = (state: RootState) => state.game.showDeckCard;
export const selectStateType = (state: RootState) => state.game.current?.stateType;
export const selectPlayerTurn = (state: RootState) => state.game.current?.playerTurn;

// export const selectPlayableCards = createSelector(
//   selectCurrentGame,
//   selectUserId,
//   (game, playerId) => {
//     return game.playableCards
//   }
//   // (game, playerId) => game?.playableCards[playerId]
// );

export const selectPlayer = (state: RootState) => {
  const playerId = state.user?.id;
  const players = state.game.current?.players;
  return players?.find(p => p.id === playerId);
}

export const selectPlayerHand = createSelector(
  selectPlayer,
  player => player?.hand
);

export const selectHeldCard = createSelector(
  selectPlayer,
  player => player?.heldCard
);

export const selectPlayerScore = createSelector(
  selectPlayer,
  player => player?.visibleScore
);


export const { setGames, setCurrent, cardClicked } = gameSlice.actions;
export const gameReducer = gameSlice.reducer;

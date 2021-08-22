import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "./store";

export const selectUser = (state: RootState) => state.golf.user;

export const selectUserId = createSelector(
  selectUser,
  user => user?.id
);

export const selectGames = (state: RootState) => state.golf.games;

export const selectGame = (state: RootState) => state.golf.game;

export const selectGameId = createSelector(
  selectGame,
  game => game?.id
);

// export const select

// export const selectPlayer = createSelector(
//   selectGame,
//   game => (id: number) => game?.players.filter(p => p.id === id)
// );

// export const selectPlayerHand = createSelector(
//   selectPlayer,
//   player => player.
// );

// export const selectPlayer = createSelector(
//   selectUserId,
//   selectGame,
//   (userId, game) => game?.players.find(p => userId === p.id)
// );

// export const selectHand = createSelector(
//   selectPlayer,
//   player => player?.hand
// );

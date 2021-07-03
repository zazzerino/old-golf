import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

type Suit =  'CLUBS' | 'DIAMONDS' | 'HEARTS' | 'SPADES';

type Rank = 'ACE' | 'TWO' | 'THREE' | 'FOUR' | 'FIVE' | 'SIX' 
| 'SEVEN' | 'EIGHT' | 'NINE' | 'TEN' | 'JACK' | 'QUEEN' | 'KING';

export interface Card {
  suit: Suit;
  rank: Rank;
}

export interface Deck {
  cards: Card[];
}

export interface Player {
  id: number;
  name: string;
  cards: Card[];
}

export interface Game {
  id: number;
  players: Player[];
  hostId: number;
  deck: Deck;
  tableCard: Card | null;
}

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

export interface Hand {
  cards: string[];
}

export interface Player {
  id: number;
  name: string;
  hand: Hand;
  heldCard: string;
}

export type GameState = 'INIT' | 'PICKUP' | 'DISCARD' | 'FINAL_PICKUP' | 'FINAL_DISCARD' | 'GAME_OVER';

export interface Game {
  id: number;
  state: GameState;
  players: Player[];
  hostId: number;
  hasStarted: boolean;
  tableCard: string | null;
  tableCards: string[];
  deckCard: string | null;
  scores: Record<number, number>;
}

export type ActionType = 'TAKE_FROM_DECK' | 'TAKE_FROM_TABLE' | 'SWAP_CARD' | 'DISCARD';

export interface Action {
  type: ActionType;
  playerId: number;
}

export interface TakeFromDeckAction extends Action {
  type: 'TAKE_FROM_DECK';
}

export function takeFromDeck(playerId: number): TakeFromDeckAction {
  return {
    type: 'TAKE_FROM_DECK',
    playerId,
  }
}

export interface TakeFromTableAction extends Action {
  type: 'TAKE_FROM_TABLE';
}

export function takeFromTable(playerId: number): TakeFromTableAction {
  return {
    type: 'TAKE_FROM_TABLE',
    playerId,
  }
}

export interface SwapCardAction extends Action {
  type: 'SWAP_CARD';
  index: number;
}

export function swapCard(playerId: number, index: number): SwapCardAction {
  return {
    type: 'SWAP_CARD',
    playerId,
    index,
  }
}

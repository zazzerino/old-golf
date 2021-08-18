export const HAND_SIZE = 6;

export interface Hand {
  cards: string[];
  uncoveredCards: number[];
}

export interface Player {
  id: number;
  name: string;
  hand: Hand;
  heldCard: string;
  visibleScore: number;
}

export type StateType =
  'INIT' | 'UNCOVER_TWO' | 'TAKE' | 'DISCARD' | 'UNCOVER' | 'FINAL_PICKUP' | 'FINAL_DISCARD' | 'GAME_OVER';

export type CardLocation = 'DECK' | 'TABLE' | 'HELD' | 'HAND0' | 'HAND1' | 'HAND2' | 'HAND3' | 'HAND4' | 'HAND5';

export interface Game {
  id: number;
  stateType: StateType;
  hostId: number;
  players: Player[];
  deckCard: string;
  tableCard: string;
  turn: number;
  playerTurn: number;
  hasStarted: boolean;
}

export type EventType = 'TAKE_FROM_DECK' | 'TAKE_FROM_TABLE' | 'SWAP_CARD' | 'DISCARD';

export interface Event {
  type: EventType;
  playerId: number;
}

export interface TakeFromDeckEvent extends Event {
  type: 'TAKE_FROM_DECK';
}

export function takeFromDeck(playerId: number): TakeFromDeckEvent {
  return {
    type: 'TAKE_FROM_DECK',
    playerId,
  }
}

export interface TakeFromTableEvent extends Event {
  type: 'TAKE_FROM_TABLE';
}

export function takeFromTable(playerId: number): TakeFromTableEvent {
  return {
    type: 'TAKE_FROM_TABLE',
    playerId,
  }
}

export interface SwapCardEvent extends Event {
  type: 'SWAP_CARD';
  handIndex: number;
}

export function swapCard(playerId: number, index: number): SwapCardEvent {
  return {
    type: 'SWAP_CARD',
    playerId,
    handIndex: index,
  }
}

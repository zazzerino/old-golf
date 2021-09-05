export interface User {
  id: number;
  name: string;
}

export interface Hand {
  cards: string[];
  uncoveredCards: number[];
  visibleScore: number;
}

export interface Player {
  id: number;
  name: string;
  hand: Hand;
  heldCard: string | null;
}

export type StateType =
  'INIT' | 'UNCOVER_TWO' | 'TAKE' | 'DISCARD' | 'UNCOVER' | 'FINAL_TAKE' | 'FINAL_DISCARD' | 'GAME_OVER';

export type CardLocation = 'DECK' | 'TABLE' | 'HELD' | 'H0' | 'H1' | 'H2' | 'H3' | 'H4' | 'H5';

export type PlayerId = number;

export type PlayableCards = Record<PlayerId, CardLocation[]>;

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
  playableCards: PlayableCards;
  playerOrders: Record<PlayerId, PlayerId[]>;
}

export type HandPosition = 'BOTTOM' | 'LEFT' | 'TOP' | 'RIGHT';

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

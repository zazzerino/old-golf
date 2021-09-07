export interface User {
  id: number;
  name: string;
}

export interface Player {
  id: number;
  name: string;
  handPosition: HandPosition;
  cards: string[];
  uncoveredCards: number[];
  heldCard: string | null;
  score: number;
}

export type StateType =
  | 'INIT' 
  | 'UNCOVER_TWO' 
  | 'TAKE' 
  | 'DISCARD' 
  | 'UNCOVER' 
  | 'FINAL_TAKE' 
  | 'FINAL_DISCARD' 
  | 'GAME_OVER'
  ;

export type CardLocation = 'DECK' | 'TABLE' | 'HELD' | 'H0' | 'H1' | 'H2' | 'H3' | 'H4' | 'H5';

export type PlayerId = number;

export interface Game {
  id: number;
  userId: number;
  hostId: number;
  players: Player[];
  stateType: StateType;
  turn: number;
  playerTurn: number;
  tableCards: string[];
  playableCards: CardLocation[];
  events: Event[];
}

export type HandPosition = 'BOTTOM' | 'LEFT' | 'TOP' | 'RIGHT';

export type EventType = 'TAKE_FROM_DECK' | 'TAKE_FROM_TABLE' | 'SWAP_CARD' | 'DISCARD' | 'UNCOVER';

export interface Event {
  type: EventType;
  playerId: number;
}

export interface TakeFromDeckEvent extends Event {
  type: 'TAKE_FROM_DECK';
}

export interface TakeFromTableEvent extends Event {
  type: 'TAKE_FROM_TABLE';
}

export interface SwapCardEvent extends Event {
  type: 'SWAP_CARD';
  handIndex: number;
}

export interface DiscardEvent extends Event {
  type: 'DISCARD';
}

export interface UncoverEvent extends Event {
  type: 'UNCOVER';
  handIndex: number;
}

export interface ChatMessage {
  gameId: number;
  userId: number;
  userName: string;
  text: string;
}

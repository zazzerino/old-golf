import { send } from './websocket';

type MessageType = 'LOGIN' | 'CREATE_GAME' | 'START_GAME' | 'EVENT';

export interface Message {
  type: MessageType;
}

export interface CreateGameMessage extends Message {
  type: 'CREATE_GAME';
}

export function createGameMessage(): CreateGameMessage {
  return { type: 'CREATE_GAME' };
}

export function sendCreateGame() {
  send(createGameMessage());
}

export interface StartGameMessage extends Message {
  type: 'START_GAME';
  gameId: number;
}

export function startGameMessage(gameId: number): StartGameMessage {
  return { 
    type: 'START_GAME',
    gameId,
 };
}

export function sendStartGame(gameId: number) {
  send(startGameMessage(gameId));
}

export type EventType =
  'TAKE_FROM_DECK'
  | 'TAKE_FROM_TABLE'
  | 'SWAP_CARD'
  | 'DISCARD'
  | 'UNCOVER';

export interface EventMessage extends Message {
  eventType: EventType;
  gameId: number;
  playerId: number;
  handIndex?: number;
}

export function sendTakeFromDeck(gameId: number, playerId: number) {
  const message: EventMessage = {
    type: 'EVENT',
    eventType: 'TAKE_FROM_DECK',
    gameId,
    playerId,
  }

  send(message);
}

export function sendTakeFromTable(gameId: number, playerId: number) {
  const message: EventMessage = {
    type: 'EVENT',
    eventType: 'TAKE_FROM_TABLE',
    gameId,
    playerId,
  }

  send(message);
}

export function sendDiscard(gameId: number, playerId: number) {
  const message: EventMessage = {
    type: 'EVENT',
    eventType: 'DISCARD',
    gameId,
    playerId,
  }

  send(message);
}

export function sendSwapCard(gameId: number, playerId: number, handIndex: number) {
  const message: EventMessage = {
    type: 'EVENT',
    eventType: 'SWAP_CARD',
    gameId,
    playerId,
    handIndex,
  }

  send(message);
}

export function sendUncover(gameId: number, playerId: number, handIndex: number) {
  const message: EventMessage = {
    type: 'EVENT',
    eventType: 'UNCOVER',
    gameId,
    playerId,
    handIndex,
  }

  send(message);
}

import { Action, takeFromDeck, takeFromTable } from '../game/logic';
import { send } from './websocket';

type MessageType =
  'LOGIN' | 'CREATE_GAME' | 'START_GAME' | 'TAKE_FROM_DECK' | 'TAKE_FROM_TABLE' | 'SWAP_CARD' | 'DISCARD';

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

export interface TakeFromDeckMessage extends Message {
  type: 'TAKE_FROM_DECK';
  gameId: number;
  playerId: number;
}

export function takeFromDeckMessage(gameId: number, playerId: number): TakeFromDeckMessage {
  return {
    type: 'TAKE_FROM_DECK',
    gameId,
    playerId,
  }
}

export function sendTakeFromDeck(gameId: number, playerId: number) {
  send(takeFromDeckMessage(gameId, playerId));
}

export interface TakeFromTableMessage extends Message {
  type: 'TAKE_FROM_TABLE';
  gameId: number;
  playerId: number;
}

export function takeFromTableMessage(gameId: number, playerId: number): TakeFromTableMessage {
  return {
    type: 'TAKE_FROM_TABLE',
    gameId,
    playerId,
  }
}

export function sendTakeFromTable(gameId: number, playerId: number) {
  send(takeFromTableMessage(gameId, playerId));
}

// export function sendPlayerAction(gameId: number, action: Action) {
//   send(playerActionMessage(gameId, action));
// }

// export function sendTakeFromDeck(gameId: number, playerId: number) {
//   const action = takeFromDeck(playerId);
//   const message = playerActionMessage(gameId, action);
//   send(message);
// }

// export function sendTakeFromTable(gameId: number, playerId: number) {
//   const action = takeFromTable(playerId);
//   const message = playerActionMessage(gameId, action);
//   send(message);
// }

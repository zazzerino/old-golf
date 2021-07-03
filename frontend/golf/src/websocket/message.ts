import { send } from './websocket';

type MessageType = 'LOGIN' | 'CREATE_GAME' | 'START_GAME';

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

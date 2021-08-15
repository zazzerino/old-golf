import { send } from './websocket';

type MessageType =
  'LOGIN' | 'CREATE_GAME' | 'START_GAME' | 'EVENT';
  // 'LOGIN' | 'CREATE_GAME' | 'START_GAME' | 'TAKE_FROM_DECK' | 'TAKE_FROM_TABLE' | 'SWAP_CARD' | 'DISCARD' | 'UNCOVER' | 'EVENT';

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

// export interface TakeFromDeckMessage extends Message {
//   type: 'TAKE_FROM_DECK';
//   gameId: number;
//   playerId: number;
// }

// export function takeFromDeckMessage(gameId: number, playerId: number): TakeFromDeckMessage {
//   return {
//     type: 'TAKE_FROM_DECK',
//     gameId,
//     playerId,
//   }
// }

// export function sendTakeFromDeck(gameId: number, playerId: number) {
//   send(takeFromDeckMessage(gameId, playerId));
// }

// export interface TakeFromTableMessage extends Message {
//   type: 'TAKE_FROM_TABLE';
//   gameId: number;
//   playerId: number;
// }

// export function takeFromTableMessage(gameId: number, playerId: number): TakeFromTableMessage {
//   return {
//     type: 'TAKE_FROM_TABLE',
//     gameId,
//     playerId,
//   }
// }

// export function sendTakeFromTable(gameId: number, playerId: number) {
//   send(takeFromTableMessage(gameId, playerId));
// }

// export interface DiscardMessage extends Message {
//   type: 'DISCARD';
//   gameId: number;
//   playerId: number;
// }

// export function discardMessage(gameId: number, playerId: number): DiscardMessage {
//   return {
//     type: 'DISCARD',
//     gameId,
//     playerId,
//   }
// }

// export function sendDiscard(gameId: number, playerId: number) {
//   send(discardMessage(gameId, playerId));
// }

// export interface SwapCardMessage extends Message {
//   type: 'SWAP_CARD';
//   gameId: number;
//   playerId: number;
//   handIndex: number;
// }

// export function swapCardMessage(gameId: number, playerId: number, index: number): SwapCardMessage {
//   return {
//     type: 'SWAP_CARD',
//     gameId,
//     playerId,
//     handIndex: index,
//   }
// }

// export function sendSwapCard(gameId: number, playerId: number, handIndex: number) {
//   send(swapCardMessage(gameId, playerId, handIndex));
// }

// export interface UncoverMessage extends Message {
//   type: 'UNCOVER';
//   gameId: number;
//   playerId: number;
//   handIndex: number;
// }

// export function uncoverMessage(gameId: number, playerId: number, handIndex: number): UncoverMessage {
//   return {
//     type: 'UNCOVER',
//     gameId,
//     playerId,
//     handIndex,
//   }
// }

// export function sendUncover(gameId: number, playerId: number, handIndex: number) {
//   send(uncoverMessage(gameId, playerId, handIndex));
// }



// export interface TakeFromDeckMessage extends Message {
//   type: 'TAKE_FROM_DECK';
//   gameId: number;
//   playerId: number;
// }

// export function takeFromDeckMessage(gameId: number, playerId: number): TakeFromDeckMessage {
//   return {
//     type: 'TAKE_FROM_DECK',
//     gameId,
//     playerId,
//   }
// }

// export function sendTakeFromDeck(gameId: number, playerId: number) {
//   send(takeFromDeckMessage(gameId, playerId));
// }

// export interface TakeFromTableMessage extends Message {
//   type: 'TAKE_FROM_TABLE';
//   gameId: number;
//   playerId: number;
// }

// export function takeFromTableMessage(gameId: number, playerId: number): TakeFromTableMessage {
//   return {
//     type: 'TAKE_FROM_TABLE',
//     gameId,
//     playerId,
//   }
// }

// export function sendTakeFromTable(gameId: number, playerId: number) {
//   send(takeFromTableMessage(gameId, playerId));
// }

// export interface DiscardMessage extends Message {
//   type: 'DISCARD';
//   gameId: number;
//   playerId: number;
// }

// export function discardMessage(gameId: number, playerId: number): DiscardMessage {
//   return {
//     type: 'DISCARD',
//     gameId,
//     playerId,
//   }
// }

// export function sendDiscard(gameId: number, playerId: number) {
//   send(discardMessage(gameId, playerId));
// }

// export interface SwapCardMessage extends Message {
//   type: 'SWAP_CARD';
//   gameId: number;
//   playerId: number;
//   handIndex: number;
// }

// export function swapCardMessage(gameId: number, playerId: number, index: number): SwapCardMessage {
//   return {
//     type: 'SWAP_CARD',
//     gameId,
//     playerId,
//     handIndex: index,
//   }
// }

// export function sendSwapCard(gameId: number, playerId: number, handIndex: number) {
//   send(swapCardMessage(gameId, playerId, handIndex));
// }

// export interface UncoverMessage extends Message {
//   type: 'UNCOVER';
//   gameId: number;
//   playerId: number;
//   handIndex: number;
// }

// export function uncoverMessage(gameId: number, playerId: number, handIndex: number): UncoverMessage {
//   return {
//     type: 'UNCOVER',
//     gameId,
//     playerId,
//     handIndex,
//   }
// }

// export function sendUncover(gameId: number, playerId: number, handIndex: number) {
//   send(uncoverMessage(gameId, playerId, handIndex));
// }

import { Game } from './game';
import { User } from './user';
import { store } from './store';

const WS_URL = 'ws://localhost:8080/ws';

let socket: WebSocket;

export function initWebSocket() {
  socket = new WebSocket(WS_URL);
  socket.onopen = onOpen;
  socket.onclose = onClose;
  socket.onclose = onClose;
  socket.onerror = onError;
  socket.onmessage = onMessage;
}

export function send(message: Message) {
  socket.send(JSON.stringify(message));
}

function onOpen() {
  console.log('websocket connection established');
}

function onClose() {
  console.log('websocket connection closed');
}

function onError(event: Event) {
  console.error('WEBSOCKET ERROR: ' + JSON.stringify(event));
}

function onMessage(event: MessageEvent) {
  const response = JSON.parse(event.data) as Response;
  console.log('message received ↓')
  console.log(response);

  switch (response.type) {
    case 'LOGIN': return handleLogin(response as LoginResponse);
    case 'GAME': return handleGame(response as GameResponse);
    case 'GAMES': return handleGames(response as GamesResponse);
  }
}

// send messages

export type MessageType = 'LOGIN' | 'CREATE_GAME' | 'START_GAME' | 'EVENT' | 'JOIN_GAME';

export interface Message {
  type: MessageType;
}

export interface CreateGameMessage extends Message {
  type: 'CREATE_GAME';
  userId: number;
}

export function createGameMessage(userId: number): CreateGameMessage {
  return { 
    type: 'CREATE_GAME',
    userId,
  };
}

export function sendCreateGame(userId: number) {
  send(createGameMessage(userId));
}

export interface StartGameMessage extends Message {
  type: 'START_GAME';
  gameId: number;
  playerId: number;
}

export function startGameMessage(gameId: number, playerId: number): StartGameMessage {
  return { 
    type: 'START_GAME',
    gameId,
    playerId,
 };
}

export function sendStartGame(gameId: number, playerId: number) {
  send(startGameMessage(gameId, playerId));
}

export interface JoinGameMessage extends Message {
  type: 'JOIN_GAME';
  gameId: number;
  userId: number;
}

export function sendJoinGame(gameId: number, userId: number) {
  const message: JoinGameMessage = {
    type: 'JOIN_GAME',
    gameId,
    userId,
  }

  send(message);
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

// handle responses

export type ResponseType = 'LOGIN' | 'GAME' | 'GAMES';

export interface Response {
  type: ResponseType;
}

export interface LoginResponse extends Response {
  type: 'LOGIN';
  user: User;
}

export function handleLogin(response: LoginResponse) {
  console.log('logging in ' + JSON.stringify(response.user));
  store.publish('LOGIN', response.user);
}

export interface GameResponse extends Response {
  type: 'GAME';
  game: Game;
}

export function handleGame(response: GameResponse) {
  store.publish('SET_GAME', response.game);
}

export interface GamesResponse extends Response {
  type: 'GAMES';
  games: Game[];
}

export function handleGames(response: GamesResponse) {
  store.publish('SET_GAMES', response.games);
}

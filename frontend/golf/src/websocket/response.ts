import { store } from '../app/store';
import { setGame, setGames } from '../game/gameSlice';
import { Game } from '../game/logic';
import { setUser, User } from "../user";

type ResponseType = 'LOGIN' | 'GAME' | 'GAMES';

export interface Response {
  type: ResponseType;
}

export interface LoginResponse extends Response {
  type: 'LOGIN';
  user: User;
}

export function handleLogin(response: LoginResponse) {
  const user = response.user;
  store.dispatch(setUser(user));
}

export interface GameResponse extends Response {
  type: 'GAME';
  game: Game;
}

export function handleGame(response: GameResponse) {
  const game = response.game;
  store.dispatch(setGame(game));
}

export interface GamesResponse extends Response {
  type: 'GAMES';
  games: Game[];
}

export function handleGames(response: GamesResponse) {
  const games = response.games;
  store.dispatch(setGames(games));
}

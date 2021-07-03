import { store } from '../app/store';
import { Game, setGame } from '../game/game';
import { setUser, User } from "../user";

type ResponseType = 'LOGIN' | 'GAME';

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

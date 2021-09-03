import { Game, User } from "./types";

export interface AppState {
  user: User;
  games: Game[];
  game?: Game;
}

const DEFAULT_USER: User = { id: -1, name: '' };

export const initialState: AppState = {
  user: DEFAULT_USER,
  games: [],
};

export type Action =
  | { type: 'SET_USER', user: User }
  | { type: 'SET_GAMES', games: Game[] }
  | { type: 'SET_GAME', game: Game }
  ;

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.user };
    case 'SET_GAMES':
      return { ...state, games: action.games };
    case 'SET_GAME':
      return { ...state, game: action.game };
    default:
      return state;
  }
}

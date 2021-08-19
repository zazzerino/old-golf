import { Game, Player } from "./game";
import { User } from "./user";

export interface State {
  user?: User;   // the logged in user
  game?: Game;   // the user's current game
  games: Game[]; // a list of all games
}

export type Reducer = (state: State, payload: any) => State;

export type ActionType = 'LOGIN' | 'SET_GAMES' | 'SET_GAME';

export type Actions = Record<ActionType, Reducer>;

export type Callback = (state: State) => any;

export interface StoreProps {
  initialState: any;
  actions: Actions;
}

export class Store {
  state: State;
  actions: Actions;
  callbacks: Callback[];

  constructor(props: StoreProps) {
    this.state = props.initialState;
    this.actions = props.actions;
    this.callbacks = [];
  }

  dispatch = (action: ActionType, payload: any) => {
    const newState = this.actions[action](this.state, payload);
    this.state = { ...this.state, ...newState };
    this.processCallbacks(this.state);
  }

  subscribe = (callback: Callback) => {
    this.callbacks.push(callback);
  }

  processCallbacks = (state: State) => {
    this.callbacks.forEach(callback => callback(state));
  }
}

export function getUser(state: State): User | undefined {
  return state.user;
}

export function getGame(state: State): Game | undefined {
  return state.game;
}

export function getGames(state: State): Game[] {
  return state.games;
}

export function getPlayer(state: State): Player | undefined {
  const user = getUser(state);
  const game = getGame(state);

  if (user && game) {
    return game.players.find(player => player.id === user.id);
  }
}

export function getHand(state: State): string[] | undefined {
  return getPlayer(state)?.hand.cards;
}

export function getHeldCard(state: State): string | undefined {
  return getPlayer(state)?.heldCard;
}

export function getScore(state: State): number | undefined {
  return getPlayer(state)?.hand.visibleScore;
}

const initialState: State = {
  games: [],
};

const actions: Actions = {
  LOGIN: (state: State, payload: User): State => {
    return { ...state, user: payload }
  },
  SET_GAMES: (state: State, payload: Game[]): State => {
    return { ...state, games: payload }
  },
  SET_GAME: (state: State, payload: Game): State => {
    return { ...state, game: payload };
  },
};

export const store = new Store({ initialState, actions });

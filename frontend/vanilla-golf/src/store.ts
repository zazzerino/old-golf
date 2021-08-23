import { Size } from "./draw";
import { CardLocation, Game } from "./game";
import { Route } from "./route";

export class Store<State, ActionType extends string | symbol> {
  state: State;
  actions: Record<ActionType, (state: State, payload: any) => State>;
  callbacks: Array<(state: State) => any>;

  constructor(state: State, actions: Record<ActionType, (s: State, payload: any) => State>) {
    this.state = state;
    this.actions = actions;
    this.callbacks = [];
  }

  publish = (actionType: ActionType, payload: any) => {
    const newState = this.actions[actionType](this.state, payload);
    this.state = newState; 
    this.callbacks.forEach(callback => callback(this.state));
  }

  subscribe = (callback: (state: State) => any) => {
    this.callbacks.push(callback);
  }
}

export interface User {
  id: number;
  name: string;
}

export interface State {
  route: Route;
  user?: User; // the current user
  games: Game[]; // a list of all games
  game?: Game; // the user's current game
  size: Size;
  hoverCard: CardLocation | null; // the card being hovered over
}

export type ActionType = 'SET_USER' | 'SET_GAMES' | 'SET_GAME' | 'SET_HOVER' | 'NAVIGATE';

const initialState: State = {
  route: '/',
  games: [],
  size: { width: 600, height: 500 },
  hoverCard: null,
};

const actions: Record<ActionType, (s: State, payload: any) => State> = {
  SET_USER: (state: State, payload: User): State => {
    return { ...state, user: payload }
  },
  SET_GAMES: (state: State, payload: Game[]): State => {
    return { ...state, games: payload }
  },
  SET_GAME: (state: State, payload: Game): State => {
    return { ...state, game: payload };
  },
  SET_HOVER: (state: State, payload: CardLocation | null): State => {
    return { ...state, hoverCard: payload };
  },
  NAVIGATE: (state: State, payload: Route): State => {
    return { ...state, route: payload };
  }
};

export const store = new Store(initialState, actions);

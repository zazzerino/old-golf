import { Size } from "./draw";
import { CardLocation, Game } from "./game";
import { Route } from "./ui";

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
    this.state = this.actions[actionType](this.state, payload); // update state
    this.callbacks.forEach(callback => callback(this.state)); // call callbacks with new state
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
  user?: User; // the current user
  game?: Game; // the user's current game
  games: Game[]; // a list of all games
  hoverCard?: CardLocation; // the card being hovered over
  route: Route;
  size: Size;
}

export type ActionType = 'SET_USER' | 'SET_GAMES' | 'SET_GAME' | 'SET_HOVER' | 'UNSET_HOVER' | 'NAVIGATE';

const initialState: State = {
  route: '/',
  size: { width: 600, height: 500 },
  games: [],
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
  SET_HOVER: (state: State, payload: CardLocation): State => {
    return { ...state, hoverCard: payload };
  },
  UNSET_HOVER: (state: State, _payload: any): State => {
    const copy = { ...state };
    delete copy.hoverCard;
    return copy;
  },
  NAVIGATE: (state: State, payload: Route): State => {
    return { ...state, route: payload };
  }
};

export const store = new Store(initialState, actions);

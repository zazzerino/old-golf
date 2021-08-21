import { CardLocation, Game } from "./game";
import { User } from "./user";

export class Store<State, ActionType extends string> {
  state: State;
  callbacks: Array<(state: State) => any>;
  actions: Record<ActionType, (state: State, payload: any) => State>;

  constructor(state: State, actions: Record<ActionType, (s: State, payload: any) => State>) {
    this.state = state;
    this.callbacks = [];
    this.actions = actions;
  }

  publish = (actionType: ActionType, payload: any) => {
    this.state = this.actions[actionType](this.state, payload);
    this.callbacks.forEach(callback => callback(this.state));
  }

  subscribe = (callback: (state: State) => any) => {
    this.callbacks.push(callback);
  }
}

export interface State {
  user?: User; // the current user
  game?: Game; // the user's current game
  games: Game[]; // a list of all games
  hoverCard?: CardLocation; // the card being hovered over
}

export type ActionType = 'LOGIN' | 'SET_GAMES' | 'SET_GAME' | 'SET_HOVER' | 'UNSET_HOVER';

const initialState: State = {
  games: [],
};

const actions: Record<ActionType, (s: State, payload: any) => State> = {
  LOGIN: (state: State, payload: User): State => {
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
  }
};

export const store = new Store(initialState, actions);

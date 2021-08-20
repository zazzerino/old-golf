import { CardLocation, Game } from "./game";
import { User } from "./user";

export interface State {
  user?: User; // the current user
  game?: Game; // the user's current game
  games: Game[]; // a list of all games
  hoverCard?: CardLocation; // the card being hovered over
}

export type StateReducer = (state: State, payload: any) => State;

export type ActionType = 'LOGIN' | 'SET_GAMES' | 'SET_GAME' | 'SET_HOVER' | 'UNSET_HOVER';

export type Actions = Record<ActionType, StateReducer>;

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
    this.state = this.actions[action](this.state, payload);;
    this.processCallbacks(this.state);
  }

  subscribe = (callback: Callback) => {
    this.callbacks.push(callback);
  }

  processCallbacks = (state: State) => {
    this.callbacks.forEach(callback => callback(state));
  }
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
  SET_HOVER: (state: State, payload: CardLocation): State => {
    return { ...state, hoverCard: payload };
  },
  UNSET_HOVER: (state: State, _payload: any): State => {
    const copy = { ...state };
    delete copy.hoverCard;
    return copy;
  }
};

export const store = new Store({ initialState, actions });

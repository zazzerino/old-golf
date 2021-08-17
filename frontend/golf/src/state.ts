import { Game } from "./game";
import { User } from "./user";

export interface AppState {
  user?: User;
  game?: Game;
  games?: Game[];
}

const appState: AppState = {};

const handler = {
  set: (obj, prop, value) => {
    const valStr = JSON.stringify(value);

    switch (prop) {
      case 'user':
        console.log('updating user: ' + valStr);
        break;
      case 'game':
        console.log('updating game: ' + valStr);
        break;
      case 'games':
        console.log('updating games');
        break;
    }
    
    obj[prop] = value;
    return true;
  }
}
const proxy: AppState = new Proxy(appState, handler);

export function getUser(): User | undefined {
  return proxy.user;
}

export function setUser(user: User): AppState {
  proxy.user = user;
  return proxy;
}

export function getGame(): Game | undefined {
  return proxy.game;
}

export function setGame(game: Game): AppState {
  proxy.game = game;
  return proxy;
}

export function getGames(): Game[] | undefined {
  return proxy.games;
}

export function setGames(games: Game[]): AppState {
  proxy.games = games;
  return proxy;
}

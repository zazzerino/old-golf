import { Game } from "./game";
import { User } from "./user";

export interface AppState {
  user?: User;
  game?: Game;
}

const appState: AppState = {};

const handler = {
  set: (obj, prop, value) => {
    console.log(`changing app state: ${JSON.stringify(prop)}, ${JSON.stringify(value)}`);
    obj[prop] = value;
    return true;
  }
}
const proxy = new Proxy(appState, handler);

export function getUser(): User {
  return proxy.user;
}

export function setUser(user: User): AppState {
  proxy.user = user;
  return proxy;
}

import { svgElem } from "./index";
import { drawGame } from "./draw";
import { CardLocation, Game, Player } from "./game";

export interface User {
  id: number;
  name: string;
}

export interface AppState {
  user: User | null;
  game: Game | null;
  games: Game[] | [];
}

const appState: AppState = {
  user: null,
  game: null,
  games: [],
};

const handler: ProxyHandler<any> = {
  set: (obj, prop, value) => {
    const valStr = JSON.stringify(value);

    switch (prop) {
      case 'user':
        console.log('updating user: ' + valStr);
        break;
      case 'game':
        console.log('updating game: ' + valStr);
        drawGame(svgElem, value);
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

export function getUser(): User {
  return proxy.user;
}

export function setUser(user: User): AppState {
  proxy.user = user;
  return proxy;
}

export function getGame(): Game {
  return proxy.game;
}

export function setGame(game: Game): AppState {
  proxy.game = game;
  return proxy;
}

export function getGames(): Game[] {
  return proxy.games;
}

export function setGames(games: Game[]): AppState {
  proxy.games = games;
  return proxy;
}

export function getPlayer(): Player {
  const user = getUser();
  const game = getGame();

  if (user && game) {
    return game.players.find(p => user.id === p.id);
  }
}

export function getPlayerId(): number {
  return getPlayer().id;
}

export function getHandCards(): string[] {
  return getPlayer().hand.cards;
}

export function getHeldCard(): string {
  return getPlayer().heldCard;
}

export function getUncoveredCards(): number[] {
  return getPlayer().hand.uncoveredCards;
}

export function getScore(): number {
  return getPlayer().hand.visibleScore;
}

export function getPlayerTurn(): number {
  return getGame().playerTurn;
}

function isPlayersTurn(): boolean {
  return getPlayerId() == getPlayerTurn();
}

export function getPlayableCards(): CardLocation[] {
  const game = getGame();
  console.log('g: ' + JSON.stringify(game));
  // return isPlayersTurn() ? game.playableCards : [];
  return [];
}

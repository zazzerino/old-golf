import { State, store } from "./store";
import { getGameId, getGames, getUserId } from "./select";
import { sendCreateGame, sendJoinGame, sendStartGame } from "./websocket";
import { createSvgElement, drawGame } from "./draw";
import { Game } from "./game";
import { emptyElement } from "./util";

function createButton(text: string): HTMLButtonElement {
  const button = document.createElement('button');
  button.innerHTML = text;
  return button;
}

function createCreateGameButton(userId: number): HTMLButtonElement {
  const button = createButton('Create Game');
  button.className += 'create-game-button';
  button.onclick = () => sendCreateGame(userId);
  return button;
}

function createStartGameButton(gameId: number, userId: number): HTMLButtonElement {
  const button = createButton('Start Game');
  button.className += 'start-game-button';
  button.onclick = () => sendStartGame(gameId, userId);
  return button;
}

function createJoinGameButton(gameId: number, userId: number): HTMLButtonElement {
  const button = createButton('Join Game');
  button.className += 'join-game-button';
  button.onclick = () => sendJoinGame(gameId, userId);
  return button;
}

function createGamesTable(games: Game[], userId: number): HTMLTableElement {
  const table = document.createElement('table');
  table.className += 'games-table';
  table.caption = table.createCaption();
  table.caption.innerHTML = 'Games';

  const head = table.createTHead();
  const headRow = head.insertRow();

  const headId = headRow.insertCell();
  headId.appendChild(document.createTextNode('Id'));

  const headJoin = headRow.insertCell();
  headJoin.appendChild(document.createTextNode('Join'));

  for (const game of games) {
    const body = table.createTBody();
    const bodyRow = body.insertRow();

    const bodyId = bodyRow.insertCell();
    bodyId.appendChild(document.createTextNode(game.id.toString()));

    const bodyJoin = bodyRow.insertCell();
    bodyJoin.appendChild(createJoinGameButton(game.id, userId));
  }

  return table;
}

export type Route = '/' | '/game';

interface Link {
  route: Route;
  text: string;
}

const links: Link[] = [
  { route: '/', text: 'Home' },
  { route: '/game', text: 'Game' }
];

export function navigate(route: Route) {
  window.history.pushState({}, route, window.location.origin + route)
  store.publish('NAVIGATE', route);
}

function createNavbar(links: Link[]) {
  const div = document.createElement('div');
  div.className += 'navbar';

  const list = document.createElement('ul');

  links.forEach(link => {
    const item = document.createElement('li');
    const a = document.createElement('a');
    a.text = link.text;
    a.href = '#';

    a.onclick = () => {
      navigate(link.route);
      return false;
    };

    item.appendChild(a);
    list.appendChild(item);
  });

  div.appendChild(list);
  return div;
}

function homePage(state: State) {
  const games = getGames(state);
  const userId = getUserId(state);

  const div = document.createElement('div');
  div.className += 'home-page';

  const navbar = createNavbar(links);
  div.appendChild(navbar);

  const heading = document.createElement('h2');
  heading.innerText = 'Home';
  div.appendChild(heading);


  if (userId != null) {
    const gamesTable = createGamesTable(games, userId);
    div.appendChild(gamesTable);
  }

  return div;
};

function gamePage(state: State) {
  const { size } = state;
  const userId = getUserId(state);
  const gameId = getGameId(state);

  const div = document.createElement('div');
  div.className += 'game-page';

  const navbar = createNavbar(links);
  div.appendChild(navbar);

  const h2 = document.createElement('h2');
  h2.innerText = 'Game';
  div.appendChild(h2);

  const svg = createSvgElement(size);
  div.appendChild(svg);

  drawGame({ svg, size, state });

  if (userId != null) {
    const createGameButton = createCreateGameButton(userId);
    div.appendChild(createGameButton);

    if (gameId != null) {
      const startGameButton = createStartGameButton(gameId, userId);
      div.appendChild(startGameButton);
    }
  }

  return div;
}

const routes: Record<Route, (state: State) => HTMLElement> = {
  '/': homePage,
  '/game': gamePage,
}

function createPage(state: State): HTMLElement {
  return routes['/game'](state);
  // return routes[state.route](state);
}

export function render(root: HTMLElement, state: State) {
  emptyElement(root);
  const page = createPage(state);
  root.appendChild(page);
}
